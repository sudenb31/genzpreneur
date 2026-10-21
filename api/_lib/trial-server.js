// =====================================================================
//  Trial mandiri + pengingat H-1 — bagian yang menyentuh Firestore & Resend.
//  Semua dependensi (db, waktu, kirim email) bisa disuntik agar bisa dites tanpa produksi.
// =====================================================================
import { parseServiceAccount } from './goakal-server.js';
import { maskEmail, normalizeEmail, redact } from './goakal-core.js';
import { buildTrialReminderEmail, DAY_MS, pickSelfTrial, reminderId, toMs } from './trial-core.js';

let cachedApp = null;
async function adminApp(serviceAccountJson) {
  if (cachedApp) return cachedApp;
  const { cert, getApps, initializeApp } = await import('firebase-admin/app');
  const sa = parseServiceAccount(serviceAccountJson);
  cachedApp = getApps().find((a) => a.name === 'goakal') || initializeApp({ credential: cert(sa), projectId: sa.project_id }, 'goakal');
  return cachedApp;
}

export async function realDeps(serviceAccountJson) {
  const app = await adminApp(serviceAccountJson);
  const { getFirestore, FieldValue, Timestamp } = await import('firebase-admin/firestore');
  const { getAuth } = await import('firebase-admin/auth');
  const db = getFirestore(app);
  return {
    db,
    FieldValue,
    Timestamp,
    verifyIdToken: (t) => getAuth(app).verifyIdToken(t, true),
    /** Membership dengan trial yang berakhir dalam (fromMs, toMs]. */
    listEndingTrials: async (fromMs, toMs_) => {
      const snap = await db.collection('memberships')
        .where('trial.endsAt', '>', Timestamp.fromMillis(fromMs))
        .where('trial.endsAt', '<=', Timestamp.fromMillis(toMs_))
        .limit(500).get();
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  };
}

/**
 * Peserta memulai trial sendiri. Ditulis dalam transaksi bersama audit log,
 * jadi klik ganda / dua tab tidak bisa memberi trial dua kali.
 */
export async function startSelfTrial({ uid, email }, deps) {
  const { db, FieldValue, Timestamp } = deps;
  const now = deps.now ? deps.now() : Date.now();
  const id = normalizeEmail(email);
  const memRef = db.collection('memberships').doc(id);
  const userRef = db.collection('users').doc(uid);
  const auditRef = db.collection('auditLogs').doc(deps.newId ? deps.newId() : `trial-self-${uid}-${now}`);
  return db.runTransaction(async (t) => {
    const [memSnap, userSnap] = [await t.get(memRef), await t.get(userRef)];
    if (!userSnap.exists) return { ok: false, reason: 'not-member' };
    const m = memSnap.exists ? memSnap.data() : null;
    const pick = pickSelfTrial(m, now);
    if (!pick.offer) return { ok: false, reason: pick.reason };
    const { plan, days } = pick.offer;
    const endsAtMs = now + days * DAY_MS;
    t.set(auditRef, {
      actorUid: uid,
      action: 'membership.trial_self_start',
      targetType: 'membership',
      targetId: id,
      before: { plan: m.plan, trial: null },
      after: { plan: m.plan, trial: `${plan} s.d. ${new Date(endsAtMs).toISOString()}` },
      reason: `Trial mandiri ${plan} ${days} hari`,
      createdAt: FieldValue.serverTimestamp(),
    });
    t.update(memRef, {
      trial: { plan, days, startedAt: Timestamp.fromMillis(now), endsAt: Timestamp.fromMillis(endsAtMs) },
      trialsUsed: { boost: m.trialsUsed?.boost === true || plan === 'boost', impact: m.trialsUsed?.impact === true || plan === 'impact' },
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy: uid,
      lastAuditId: auditRef.id,
    });
    return { ok: true, plan, days, endsAtMs };
  });
}

export async function sendReminderEmail({ to, name, trialPlan, endsAtMs }, config, fetchImpl = fetch) {
  const { subject, html, text } = buildTrialReminderEmail({ name, trialPlan, endsAtMs }, config.appUrl);
  const response = await fetchImpl('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `trial-reminder/${reminderId(to, endsAtMs)}`,
    },
    body: JSON.stringify({ from: config.emailFrom, to: [to], subject, html, text }),
    signal: AbortSignal.timeout(10_000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result?.id) throw new Error(`Resend gagal (${response.status}).`);
  return String(result.id);
}

/**
 * Kirim pengingat ke semua trial yang berakhir dalam 24 jam ke depan (dijalankan cron harian).
 * Penanda di trialReminders/{email_endsAt} mencegah email ganda. dryRun = hanya laporan.
 */
export async function runTrialReminders(config, deps) {
  const { db, FieldValue } = deps;
  const now = deps.now ? deps.now() : Date.now();
  const send = deps.sendEmail || ((p) => sendReminderEmail(p, config, deps.fetchImpl));
  // Jendela 26 jam (bukan 24) supaya jadwal cron yang meleset beberapa menit tidak melewatkan siapa pun;
  // penanda trialReminders mencegah email ganda.
  const rows = await deps.listEndingTrials(now, now + DAY_MS + 2 * 3_600_000);
  const out = { checked: rows.length, sent: 0, skipped: 0, failed: 0, items: [] };
  for (const m of rows) {
    const endsAtMs = toMs(m.trial?.endsAt);
    const email = normalizeEmail(m.email || m.id || '');
    const trialPlan = m.trial?.plan;
    if (!endsAtMs || !email || !['boost', 'impact'].includes(trialPlan)) { out.skipped += 1; continue; }
    // Sudah bayar paket yang dicoba (atau lebih tinggi)? Tidak perlu diingatkan.
    const rank = { none: 0, spark: 1, boost: 2, impact: 3 };
    if ((rank[m.plan] ?? 0) >= rank[trialPlan]) { out.skipped += 1; out.items.push({ to: maskEmail(email), status: 'already-upgraded' }); continue; }
    const ref = db.collection('trialReminders').doc(reminderId(email, endsAtMs));
    if ((await ref.get()).exists) { out.skipped += 1; out.items.push({ to: maskEmail(email), status: 'already-sent' }); continue; }
    if (deps.dryRun) { out.items.push({ to: maskEmail(email), plan: trialPlan, status: 'would-send' }); continue; }
    try {
      const messageId = await send({ to: email, name: m.name || '', trialPlan, endsAtMs });
      await ref.set({ email, trialPlan, endsAtMs, messageId, sentAt: FieldValue.serverTimestamp() });
      out.sent += 1;
      out.items.push({ to: maskEmail(email), plan: trialPlan, status: 'sent' });
    } catch (error) {
      out.failed += 1;
      out.items.push({ to: maskEmail(email), status: 'failed', error: redact(error instanceof Error ? error.message : error, [config.resendApiKey]) });
    }
  }
  return out;
}

export function _resetForTests() { cachedApp = null; }
