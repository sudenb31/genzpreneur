import { describe, expect, it, vi } from 'vitest';
import { FakeDb, FakeFieldValue, FakeTimestamp } from './fake-firestore.test-helper.js';
import { buildTrialReminderEmail, checkVoucherTrial, DAY_MS } from './trial-core.js';
import { redeemTrialVoucher, runTrialReminders, startSelfTrial } from './trial-server.js';
import { createRedeemTrialHandler } from '../voucher/redeem-trial.js';

const NOW = Date.UTC(2026, 9, 25, 3, 0, 0);
const WEBINAR = { code: 'WEBINARSPARK', kind: 'trial', trialDays: 3, plan: 'spark', maxUses: 2, uses: 0, active: true, expiresAt: null, batch: 'webinar', note: '' };

function setup({ voucher = WEBINAR, membership = null, user = false } = {}) {
  const db = new FakeDb();
  db.now = () => NOW;
  if (voucher) db.write(`vouchers/${voucher.code}`, 'set', voucher);
  if (user) db.write('users/u1', 'set', { email: 'a@x.id', role: 'user' });
  if (membership) db.write('memberships/a@x.id', 'set', { email: 'a@x.id', name: 'Ana', trial: null, trialsUsed: { boost: false, impact: false }, note: '', ...membership });
  let n = 0;
  const redeemed = new Set();
  const deps = {
    db, FieldValue: FakeFieldValue, Timestamp: FakeTimestamp, now: () => NOW, newId: () => `audit${(n += 1)}`,
    hasTrialRedemption: async (uid) => db.all('redemptions').some((r) => r.uid === uid && r.kind === 'trial') || redeemed.has(uid),
  };
  return { db, deps };
}

const ana = { uid: 'u1', email: 'A@x.id', name: 'Ana Webinar' };

describe('checkVoucherTrial', () => {
  const base = { voucher: WEBINAR, membership: null, email: 'a@x.id', nowMs: NOW, alreadyRedeemedTrial: false };
  it('akun baru boleh; voucher paket biasa bukan urusan endpoint ini', () => {
    expect(checkVoucherTrial(base)).toEqual({ ok: true, plan: 'spark', days: 3 });
    expect(checkVoucherTrial({ ...base, voucher: { ...WEBINAR, kind: undefined } }).reason).toBe('not_trial');
  });
  it('menolak paket ≥ trial, trial kedua, trial yang masih jalan, kedaluwarsa, kuota habis', () => {
    expect(checkVoucherTrial({ ...base, membership: { plan: 'spark' } }).reason).toBe('trial_not_higher');
    expect(checkVoucherTrial({ ...base, membership: { plan: 'impact' } }).reason).toBe('trial_not_higher');
    expect(checkVoucherTrial({ ...base, alreadyRedeemedTrial: true }).reason).toBe('trial_used');
    expect(checkVoucherTrial({ ...base, membership: { plan: 'none', trialsUsed: { voucher: true } } }).reason).toBe('trial_used');
    const boostVoucher = { ...WEBINAR, plan: 'boost' };
    const running = { plan: 'none', trial: { plan: 'spark', endsAt: FakeTimestamp.fromMillis(NOW + 3_600_000) } };
    expect(checkVoucherTrial({ ...base, voucher: boostVoucher, membership: running }).reason).toBe('trial_active');
    expect(checkVoucherTrial({ ...base, voucher: { ...WEBINAR, expiresAt: FakeTimestamp.fromMillis(NOW - 1) } }).reason).toBe('expired');
    expect(checkVoucherTrial({ ...base, voucher: { ...WEBINAR, uses: 2 } }).reason).toBe('used_up');
    expect(checkVoucherTrial({ ...base, voucher: { ...WEBINAR, active: false } }).reason).toBe('inactive');
    expect(checkVoucherTrial({ ...base, voucher: { ...WEBINAR, trialDays: 99 } }).reason).toBe('invalid');
  });
});

describe('redeemTrialVoucher', () => {
  it('peserta webinar baru: akun dibuat, paket tetap none, trial Spark 3 hari, voucher +1', async () => {
    const { db, deps } = setup();
    const r = await redeemTrialVoucher(ana, 'WEBINARSPARK', deps);
    expect(r).toMatchObject({ ok: true, plan: 'spark', days: 3, endsAtMs: NOW + 3 * DAY_MS, newUser: true });
    const m = db.snap('memberships/a@x.id').data();
    expect(m.plan).toBe('none');
    expect(m.trial.plan).toBe('spark');
    expect(m.trial.startedAt.toMillis()).toBe(NOW);
    expect(m.trial.endsAt.toMillis()).toBe(NOW + 3 * DAY_MS);
    expect(m.trialsUsed).toEqual({ boost: false, impact: false, spark: true, voucher: true });
    expect(m.lastRedemptionId).toBe('WEBINARSPARK_u1');
    expect(db.snap('users/u1').data()).toMatchObject({ role: 'user', viaVoucher: 'WEBINARSPARK', displayName: 'Ana Webinar' });
    expect(db.snap('vouchers/WEBINARSPARK').data().uses).toBe(1);
    expect(db.snap('redemptions/WEBINARSPARK_u1').data()).toMatchObject({ kind: 'trial', trialDays: 3, plan: 'spark', email: 'a@x.id' });
    expect(db.snap(`auditLogs/${m.lastAuditId}`).data().action).toBe('membership.trial_voucher');
  });

  it('sekali per akun: kode yang sama atau voucher trial lain ditolak', async () => {
    const { db, deps } = setup();
    db.write('vouchers/WEBINARBOOST', 'set', { ...WEBINAR, code: 'WEBINARBOOST', plan: 'boost' });
    await redeemTrialVoucher(ana, 'WEBINARSPARK', deps);
    expect(await redeemTrialVoucher(ana, 'WEBINARSPARK', deps)).toEqual({ ok: false, reason: 'trial_used' });
    deps.now = () => NOW + 4 * DAY_MS; // trial Spark sudah habis
    expect(await redeemTrialVoucher(ana, 'WEBINARBOOST', deps)).toEqual({ ok: false, reason: 'trial_used' });
  });

  it('pemilik paket ≥ Spark ditolak dan datanya tidak berubah', async () => {
    const { db, deps } = setup({ membership: { plan: 'boost' }, user: true });
    const before = JSON.stringify(db.snap('memberships/a@x.id').data());
    expect(await redeemTrialVoucher(ana, 'WEBINARSPARK', deps)).toEqual({ ok: false, reason: 'trial_not_higher' });
    expect(JSON.stringify(db.snap('memberships/a@x.id').data())).toBe(before);
    expect(db.snap('vouchers/WEBINARSPARK').data().uses).toBe(0);
  });

  it('kuota habis ditolak', async () => {
    const { deps } = setup({ voucher: { ...WEBINAR, uses: 2 } });
    expect(await redeemTrialVoucher(ana, 'WEBINARSPARK', deps)).toEqual({ ok: false, reason: 'used_up' });
  });

  it('trial mandiri setelahnya tidak menghapus penanda voucher', async () => {
    const { db, deps } = setup({ membership: { plan: 'spark', trialsUsed: { boost: false, impact: false, voucher: true } }, user: true });
    await startSelfTrial({ uid: 'u1', email: 'a@x.id' }, deps);
    expect(db.snap('memberships/a@x.id').data().trialsUsed).toEqual({ boost: true, impact: false, voucher: true });
  });
});

describe('POST /api/voucher/redeem-trial', () => {
  const fakeRes = () => {
    const r = { statusCode: 0, headers: {}, body: null };
    r.setHeader = (k, v) => { r.headers[k] = v; };
    r.end = (s) => { r.body = JSON.parse(s); };
    return r;
  };
  it('401 tanpa token, 400 kode salah format, 403 email belum verifikasi, 200 sukses, 409 ulang', async () => {
    const { deps } = setup();
    const server = { ...deps, verifyIdToken: async (t) => ({ uid: 'u1', email: 'a@x.id', email_verified: t === 'ok' }) };
    const h = createRedeemTrialHandler({ server, log: { info() {}, error() {} } });
    const req = (auth, body) => ({ method: 'POST', headers: auth ? { authorization: `Bearer ${auth}` } : {}, body });
    let res = fakeRes(); await h(req(null, { code: 'WEBINARSPARK' }), res); expect(res.statusCode).toBe(401);
    res = fakeRes(); await h(req('ok', { code: 'x' }), res); expect(res.statusCode).toBe(400);
    res = fakeRes(); await h(req('nope', { code: 'WEBINARSPARK' }), res); expect(res.statusCode).toBe(403);
    res = fakeRes(); await h(req('ok', { code: ' webinarspark ', name: 'Ana' }), res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ ok: true, plan: 'spark', days: 3 });
    res = fakeRes(); await h(req('ok', { code: 'WEBINARSPARK' }), res);
    expect(res.statusCode).toBe(409);
    expect(res.body.reason).toBe('trial_used');
  });
});

describe('pengingat H-1 untuk trial Spark', () => {
  const config = { resendApiKey: 're_test', emailFrom: 'GenZ Preneur <akses@genzpreneur.id>', appUrl: 'https://genzpreneur.id' };
  it('peserta webinar (paket none) dengan trial Spark diingatkan', async () => {
    const { deps } = setup();
    const sendEmail = vi.fn(async () => 'msg1');
    const rows = [{ id: 'a@x.id', email: 'a@x.id', name: 'Ana', plan: 'none', trial: { plan: 'spark', endsAt: FakeTimestamp.fromMillis(NOW + 20 * 3_600_000) } }];
    expect(await runTrialReminders(config, { ...deps, sendEmail, listEndingTrials: async () => rows })).toMatchObject({ sent: 1 });
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({ trialPlan: 'spark' }));
  });
  it('isi email Spark: harga Rp79.000 + link GoAkal Spark', () => {
    const e = buildTrialReminderEmail({ name: 'Ana', trialPlan: 'spark', endsAtMs: NOW }, 'https://genzpreneur.id');
    expect(e.subject).toContain('GenZ Spark');
    expect(e.html).toContain('Rp79.000');
    expect(e.html).toContain('https://goakal.com/genzpreneur/webinar-b1/z7x0w/apply');
    expect(e.text).toContain('Rp79.000');
    expect(e.text).toMatch(/Misi Pertama/);
  });
});
