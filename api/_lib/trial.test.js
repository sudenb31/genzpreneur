import { describe, expect, it, vi } from 'vitest';
import { FakeDb, FakeFieldValue, FakeTimestamp } from './fake-firestore.test-helper.js';
import { buildTrialReminderEmail, DAY_MS, pickSelfTrial } from './trial-core.js';
import { runTrialReminders, startSelfTrial } from './trial-server.js';
import { createStartHandler } from '../trial/start.js';
import { createReminderHandler } from '../cron/trial-reminder.js';

const NOW = Date.UTC(2026, 9, 21, 1, 0, 0);

function setup(membership) {
  const db = new FakeDb();
  db.now = () => NOW;
  db.write('users/u1', 'set', { email: 'a@x.id', role: 'user' });
  if (membership) db.write('memberships/a@x.id', 'set', { email: 'a@x.id', name: 'Ana', trial: null, trialsUsed: { boost: false, impact: false }, note: '', ...membership });
  let n = 0;
  return { db, deps: { db, FieldValue: FakeFieldValue, Timestamp: FakeTimestamp, now: () => NOW, newId: () => `audit${(n += 1)}` } };
}

function fakeRes() {
  const r = { statusCode: 0, headers: {}, body: null };
  r.setHeader = (k, v) => { r.headers[k] = v; };
  r.end = (s) => { r.body = JSON.parse(s); };
  return r;
}

describe('pickSelfTrial', () => {
  it('Spark → Boost 3 hari, Boost → Impact 7 hari, Impact/none tidak dapat', () => {
    expect(pickSelfTrial({ plan: 'spark', trialsUsed: {} }, NOW).offer).toEqual({ plan: 'boost', days: 3 });
    expect(pickSelfTrial({ plan: 'boost', trialsUsed: {} }, NOW).offer).toEqual({ plan: 'impact', days: 7 });
    expect(pickSelfTrial({ plan: 'impact', trialsUsed: {} }, NOW).reason).toBe('top-plan');
    expect(pickSelfTrial({ plan: 'none', trialsUsed: {} }, NOW).reason).toBe('no-plan');
    expect(pickSelfTrial({ plan: 'spark', trialsUsed: { boost: true } }, NOW).reason).toBe('already-used');
  });
});

describe('startSelfTrial', () => {
  it('memulai trial sekali + audit log, klik kedua ditolak', async () => {
    const { db, deps } = setup({ plan: 'spark' });
    const r = await startSelfTrial({ uid: 'u1', email: 'A@x.id' }, deps);
    expect(r).toMatchObject({ ok: true, plan: 'boost', days: 3, endsAtMs: NOW + 3 * DAY_MS });
    const m = db.snap('memberships/a@x.id').data();
    expect(m.trial.plan).toBe('boost');
    expect(m.trial.endsAt.toMillis()).toBe(NOW + 3 * DAY_MS);
    expect(m.trialsUsed).toEqual({ boost: true, impact: false });
    expect(m.plan).toBe('spark');
    expect(db.snap(`auditLogs/${m.lastAuditId}`).data().action).toBe('membership.trial_self_start');
    expect(Object.keys(m).every((k) => ['email', 'name', 'plan', 'trial', 'trialsUsed', 'note', 'updatedAt', 'updatedBy', 'lastAuditId', 'lastRedemptionId'].includes(k))).toBe(true);
    expect(await startSelfTrial({ uid: 'u1', email: 'a@x.id' }, deps)).toEqual({ ok: false, reason: 'already-used' });
  });

  it('akun tanpa dokumen users ditolak', async () => {
    const { db, deps } = setup({ plan: 'spark' });
    db.docs.delete('users/u1');
    expect(await startSelfTrial({ uid: 'u1', email: 'a@x.id' }, deps)).toEqual({ ok: false, reason: 'not-member' });
  });
});

describe('POST /api/trial/start', () => {
  it('tanpa token → 401; email belum verifikasi → 403; sukses → 200', async () => {
    const { deps } = setup({ plan: 'boost' });
    const server = { ...deps, verifyIdToken: async (t) => (t === 'ok' ? { uid: 'u1', email: 'a@x.id', email_verified: true } : { uid: 'u1', email: 'a@x.id', email_verified: false }) };
    const h = createStartHandler({ server, log: { info() {}, error() {} } });
    let res = fakeRes(); await h({ method: 'POST', headers: {} }, res); expect(res.statusCode).toBe(401);
    res = fakeRes(); await h({ method: 'POST', headers: { authorization: 'Bearer nope' } }, res); expect(res.statusCode).toBe(403);
    res = fakeRes(); await h({ method: 'POST', headers: { authorization: 'Bearer ok' } }, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ ok: true, plan: 'impact', days: 7 });
    res = fakeRes(); await h({ method: 'POST', headers: { authorization: 'Bearer ok' } }, res);
    expect(res.statusCode).toBe(409);
  });
});

describe('pengingat H-1', () => {
  const config = { resendApiKey: 're_test', emailFrom: 'GenZ Preneur <akses@genzpreneur.id>', appUrl: 'https://genzpreneur.id' };
  const rows = (endsAtMs, plan = 'spark') => [{ id: 'a@x.id', email: 'a@x.id', name: 'Ana', plan, trial: { plan: 'boost', endsAt: FakeTimestamp.fromMillis(endsAtMs) } }];

  it('mengirim sekali, lalu tidak mengirim ulang', async () => {
    const { deps } = setup();
    const sendEmail = vi.fn(async () => 'msg1');
    const d = { ...deps, sendEmail, listEndingTrials: async () => rows(NOW + 20 * 3_600_000) };
    expect(await runTrialReminders(config, d)).toMatchObject({ sent: 1, failed: 0 });
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ to: 'a@x.id', trialPlan: 'boost' }));
    expect(await runTrialReminders(config, d)).toMatchObject({ sent: 0, skipped: 1 });
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it('tidak mengingatkan yang sudah upgrade; dry-run tidak mengirim/menulis', async () => {
    const { db, deps } = setup();
    const sendEmail = vi.fn(async () => 'm');
    expect(await runTrialReminders(config, { ...deps, sendEmail, listEndingTrials: async () => rows(NOW + DAY_MS, 'boost') })).toMatchObject({ sent: 0, skipped: 1 });
    const before = db.writeLog.length;
    const r = await runTrialReminders(config, { ...deps, sendEmail, dryRun: true, listEndingTrials: async () => rows(NOW + DAY_MS) });
    expect(r.items[0].status).toBe('would-send');
    expect(sendEmail).not.toHaveBeenCalled();
    expect(db.writeLog.length).toBe(before);
  });

  it('cron wajib CRON_SECRET', async () => {
    const { deps } = setup();
    const env = { CRON_SECRET: 'x'.repeat(32) };
    const h = createReminderHandler({ env, server: { ...deps, listEndingTrials: async () => [] }, log: { info() {}, error() {} } });
    let res = fakeRes(); await h({ method: 'GET', headers: {}, url: '/api/cron/trial-reminder' }, res); expect(res.statusCode).toBe(401);
    res = fakeRes(); await h({ method: 'GET', headers: { authorization: `Bearer ${env.CRON_SECRET}` }, url: '/api/cron/trial-reminder' }, res);
    expect(res.statusCode).toBe(200);
  });

  it('isi email: tanggal WIB, link checkout, progres aman', () => {
    const e = buildTrialReminderEmail({ name: 'Ana', trialPlan: 'impact', endsAtMs: NOW }, 'https://genzpreneur.id');
    expect(e.subject).toMatch(/berakhir besok/);
    expect(e.html).toContain('https://goakal.com/genzpreneur/webinar-b1/2md0s/apply');
    expect(e.text).toMatch(/WIB/);
    expect(e.text).toMatch(/tetap aman/);
  });
});
