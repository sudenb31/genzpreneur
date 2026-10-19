// =====================================================================
//  GoAkal → voucher: bagian yang menyentuh Firestore, Resend, dan GoAkal API.
//  Semua dependensi (db, fetch, waktu) bisa disuntik agar bisa dites tanpa produksi.
// =====================================================================
import {
  PLANS, buildVoucherEmail, decide, maskEmail, normalizeApiTransaction, orderIdFor, payloadMismatch, redact, voucherCode,
} from './goakal-core.js';

export const EMAIL_LEASE_MS = 90_000;
const API_BASE = 'https://goakal.com/service/api/v1';
const PAGE_SIZE = 100; // maksimum resmi GET /services/:cuid/transactions

export class EmailDeliveryError extends Error {
  constructor(message) { super(message); this.name = 'EmailDeliveryError'; }
}

// ---------------------------------------------------------------------
//  Firebase Admin — inisialisasi malas & sekali per instance Vercel.
// ---------------------------------------------------------------------
let cachedDb = null;

export function parseServiceAccount(raw) {
  let sa;
  try { sa = JSON.parse(raw); } catch { throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON bukan JSON yang valid (tempel isi file JSON utuh dalam satu nilai).'); }
  if (!sa || typeof sa !== 'object') throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON harus berupa object JSON.');
  for (const key of ['project_id', 'client_email', 'private_key']) {
    if (typeof sa[key] !== 'string' || !sa[key].trim()) throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON tidak memiliki field ${key}.`);
  }
  // Vercel kadang menyimpan baris baru sebagai teks "\n".
  sa.private_key = sa.private_key.replace(/\\n/g, '\n');
  if (!sa.private_key.includes('BEGIN PRIVATE KEY')) throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON: private_key tidak terbaca.');
  return sa;
}

export async function getDb(config) {
  if (cachedDb) return cachedDb;
  const { cert, getApps, initializeApp } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const sa = parseServiceAccount(config.serviceAccountJson);
  const app = getApps().find((a) => a.name === 'goakal') || initializeApp({ credential: cert(sa), projectId: sa.project_id }, 'goakal');
  cachedDb = getFirestore(app);
  return cachedDb;
}

async function firestoreHelpers() {
  const { FieldValue, Timestamp } = await import('firebase-admin/firestore');
  return { FieldValue, Timestamp };
}

// ---------------------------------------------------------------------
//  Email (Resend REST API, tanpa SDK).
// ---------------------------------------------------------------------
export async function sendVoucherEmail(order, config, fetchImpl = fetch) {
  const { subject, html, text } = buildVoucherEmail(order, config.appUrl);
  let response;
  try {
    response = await fetchImpl('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
        // Resend menyimpan kunci ini 24 jam: kiriman ulang dengan kunci sama tidak membuat email kedua.
        'Idempotency-Key': `goakal-voucher/${orderIdFor(order.paymentId)}`,
      },
      body: JSON.stringify({ from: config.emailFrom, to: [order.payerEmail], subject, html, text }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    throw new EmailDeliveryError(`Resend tidak terjangkau (${error?.name || 'network'}).`);
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result?.id) {
    const name = typeof result?.name === 'string' ? result.name.slice(0, 60) : 'unknown';
    throw new EmailDeliveryError(`Resend gagal (${response.status} ${name}).`);
  }
  return String(result.id);
}

// ---------------------------------------------------------------------
//  Pemenuhan satu transaksi lunas.
// ---------------------------------------------------------------------
/**
 * Hasil `status`:
 *  ignored        — bukan untuk aplikasi (belum lunas, service lain, webinar only)
 *  blocked        — lunas tapi butuh tindakan admin (mapping/email); dicatat di goakalOrders
 *  sent           — voucher ada & email baru saja terkirim
 *  already_sent   — sudah pernah diproses lengkap; tidak ada voucher/email baru
 *  email_in_progress — proses lain sedang mengirim email untuk order ini
 *  dry_run        — mode uji: tidak menulis apa pun
 * `conflict: [...]` diisi bila payload untuk paymentId yang sama berbeda dari yang tersimpan.
 */
export async function fulfillPaidTransaction(tx, config, deps = {}) {
  const decisionForNew = decide(tx, config); // juga memvalidasi paymentId
  if (decisionForNew.action === 'ignore' && (decisionForNew.reason === 'event_lain' || decisionForNew.reason === 'belum_lunas')) {
    // Bukan pembayaran lunas: tidak perlu menyentuh database.
    return { status: 'ignored', reason: decisionForNew.reason };
  }
  // Selain itu order tetap dibaca: order yang SUDAH terbit harus diselesaikan dari data tersimpan
  // walaupun mapping/service di environment sudah berubah.

  const db = deps.db || await getDb(config);
  const { FieldValue, Timestamp } = deps.firestore || await firestoreHelpers();
  const now = deps.now || (() => Date.now());
  const send = deps.sendEmail || ((order) => sendVoucherEmail(order, config, deps.fetch));
  const orderRef = db.collection('goakalOrders').doc(orderIdFor(tx.paymentId));

  if (deps.dryRun) {
    const snap = await orderRef.get();
    const order = snap.exists ? snap.data() : null;
    if (order?.state === 'issued' && order.emailStatus === 'sent') return { status: 'already_sent', dryRun: true };
    return { status: 'dry_run', wouldDo: order?.state === 'issued' ? 'retry_email' : decisionForNew.action, reason: decisionForNew.reason || null };
  }

  const outcome = await db.runTransaction(async (t) => {
    const snap = await t.get(orderRef);
    const existing = snap.exists ? snap.data() : null;
    const nowMs = now();
    const stamp = FieldValue.serverTimestamp();

    // --- Order sudah pernah dipenuhi: pakai data TERSIMPAN, abaikan mapping/payload terbaru. ---
    if (existing?.state === 'issued') {
      const conflict = payloadMismatch(existing, tx);
      const patch = {};
      if (conflict.length) {
        Object.assign(patch, { conflictCount: FieldValue.increment(1), lastConflictFields: conflict, lastConflictAt: stamp, lastConflictSource: tx.source });
      }
      if (existing.emailStatus === 'sent') {
        if (conflict.length) t.update(orderRef, { ...patch, updatedAt: stamp });
        return { status: 'already_sent', order: existing, conflict };
      }
      const leaseActive = existing.emailStatus === 'sending' && Number(existing.emailLeaseUntilMs || 0) > nowMs;
      if (leaseActive) {
        if (conflict.length) t.update(orderRef, { ...patch, updatedAt: stamp });
        return { status: 'email_in_progress', order: existing, conflict };
      }
      t.update(orderRef, {
        ...patch, emailStatus: 'sending', emailLeaseUntilMs: nowMs + EMAIL_LEASE_MS,
        emailAttempts: FieldValue.increment(1), updatedAt: stamp,
      });
      return { status: 'claim', order: existing, conflict };
    }

    // --- Order baru, atau sebelumnya "blocked": evaluasi ulang dengan konfigurasi sekarang. ---
    const decision = decisionForNew;
    const base = {
      paymentId: tx.paymentId,
      transactionId: tx.transactionId || existing?.transactionId || '',
      goakalStatus: tx.status,
      amount: tx.amount,
      payerEmail: tx.payerEmail,
      payerName: tx.payerName,
      serviceId: tx.serviceId,
      serviceTitle: tx.serviceTitle,
      priceSchemeId: tx.priceSchemeId,
      priceSchemeTitle: tx.priceSchemeTitle,
      paidAt: tx.paidAt,
      lastSource: tx.source,
      updatedAt: stamp,
    };

    if (decision.action === 'ignore') {
      // Contoh: dulu belum dipetakan, sekarang dipetakan "ignore".
      if (existing) t.update(orderRef, { ...base, state: 'ignored', blockReason: FieldValue.delete() });
      return { status: 'ignored', reason: decision.reason };
    }

    if (decision.action === 'block') {
      if (existing) t.update(orderRef, { ...base, state: 'blocked', blockReason: decision.reason, blockCount: FieldValue.increment(1) });
      else t.create(orderRef, { ...base, state: 'blocked', blockReason: decision.reason, blockCount: 1, firstSource: tx.source, createdAt: stamp });
      return { status: 'blocked', reason: decision.reason };
    }

    const plan = decision.plan;
    if (!PLANS.has(plan)) throw new Error('Paket hasil mapping tidak valid.');
    const code = voucherCode(plan, tx.paymentId, config.voucherSecret);
    const voucherRef = db.collection('vouchers').doc(code);
    const voucherSnap = await t.get(voucherRef);
    if (voucherSnap.exists && voucherSnap.data()?.sourcePaymentId !== tx.paymentId) {
      throw new Error('Benturan kode voucher dengan voucher lain. Ganti VOUCHER_CODE_SECRET hanya bila belum ada voucher GoAkal terbit.');
    }
    const existingExpiry = voucherSnap.exists ? voucherSnap.data()?.expiresAt?.toMillis?.() : null;
    const expiresAtMs = existingExpiry || nowMs + config.validDays * 86_400_000;
    if (!voucherSnap.exists) {
      t.create(voucherRef, {
        code, plan, maxUses: 1, uses: 0, active: true, expiresAt: Timestamp.fromMillis(expiresAtMs),
        batch: 'goakal-auto', note: `Pembelian GoAkal ${tx.priceSchemeTitle || plan}`.slice(0, 300),
        assignedEmail: tx.payerEmail, source: 'goakal', sourcePaymentId: tx.paymentId,
        createdBy: 'system:goakal', createdAt: stamp, updatedAt: stamp,
      });
    }
    const order = {
      ...base, state: 'issued', plan, voucherCode: code, voucherExpiresAtMs: expiresAtMs,
      emailStatus: 'sending', emailLeaseUntilMs: nowMs + EMAIL_LEASE_MS, emailAttempts: 1,
      issuedAt: stamp,
    };
    if (existing) t.update(orderRef, { ...order, blockReason: FieldValue.delete() });
    else t.create(orderRef, { ...order, firstSource: tx.source, createdAt: stamp });
    return { status: 'claim', order: { ...existing, ...order }, conflict: [] };
  });

  if (outcome.status !== 'claim') {
    return { status: outcome.status, reason: outcome.reason, conflict: outcome.conflict?.length ? outcome.conflict : undefined };
  }

  // --- Kirim email dari data order TERSIMPAN. ---
  const stored = outcome.order;
  const delivery = {
    paymentId: stored.paymentId, payerEmail: stored.payerEmail, payerName: stored.payerName,
    plan: stored.plan, voucherCode: stored.voucherCode, voucherExpiresAtMs: stored.voucherExpiresAtMs,
  };
  try {
    const emailId = await send(delivery);
    await orderRef.update({
      emailStatus: 'sent', emailId, emailSentAt: FieldValue.serverTimestamp(),
      emailLeaseUntilMs: FieldValue.delete(), lastEmailError: FieldValue.delete(), updatedAt: FieldValue.serverTimestamp(),
    });
    return { status: 'sent', conflict: outcome.conflict?.length ? outcome.conflict : undefined };
  } catch (error) {
    const message = redact(error instanceof Error ? error.message : error, [config.resendApiKey]);
    await orderRef.update({
      emailStatus: 'failed', emailLeaseUntilMs: FieldValue.delete(), lastEmailError: message,
      lastEmailErrorAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(),
    }).catch(() => {});
    throw error instanceof EmailDeliveryError ? error : new EmailDeliveryError(message);
  }
}

// ---------------------------------------------------------------------
//  GoAkal External API
// ---------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function goakalGet(path, config, { fetchImpl = fetch, deadlineMs = Infinity, now = Date.now } = {}) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response;
    try {
      response = await fetchImpl(`${API_BASE}${path}`, {
        headers: { 'X-Api-Key': config.apiKey, Accept: 'application/json' },
        signal: AbortSignal.timeout(15_000),
      });
    } catch (error) {
      if (attempt === 2) throw new Error(`GoAkal API tidak terjangkau (${error?.name || 'network'}).`);
      await sleep(500 * (attempt + 1));
      continue;
    }
    if (response.status === 429 || response.status >= 500) {
      const retryAfter = Math.min(Number(response.headers?.get?.('retry-after')) || 5, 30) * 1000;
      if (attempt === 2 || now() + retryAfter > deadlineMs) {
        const err = new Error(`GoAkal API ${response.status === 429 ? 'membatasi laju (429)' : `error ${response.status}`}.`);
        err.retryable = true;
        throw err;
      }
      await sleep(retryAfter);
      continue;
    }
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body?.success !== true) {
      const code = typeof body?.error?.code === 'string' ? body.error.code.slice(0, 40) : 'unknown';
      throw new Error(`GoAkal API gagal (${response.status} ${code}).`);
    }
    return body;
  }
  throw new Error('GoAkal API gagal.');
}

/** Satu halaman transaksi. Status PAID dan SETTLED sama-sama berarti lunas. */
export async function fetchTransactionsPage(serviceId, status, page, config, opts) {
  const qs = new URLSearchParams({ status, page: String(page), pageSize: String(PAGE_SIZE) });
  const body = await goakalGet(`/services/${encodeURIComponent(serviceId)}/transactions?${qs}`, config, opts);
  const rows = Array.isArray(body.data) ? body.data : [];
  const total = Number(body.meta?.total);
  const hasMore = rows.length === PAGE_SIZE && (!Number.isFinite(total) || page * PAGE_SIZE < total);
  return { rows, hasMore, total: Number.isFinite(total) ? total : null };
}

/**
 * Sinkronisasi transaksi lunas yang terlewat.
 * - Membaca status PAID dan SETTLED (transaksi yang sudah cair berpindah ke SETTLED).
 * - Order yang sudah lengkap (voucher + email terkirim) dilewati tanpa transaksi Firestore.
 * - Berhenti sebelum batas waktu function; respons memberi `resume` untuk panggilan berikutnya.
 */
export async function runSync(config, deps = {}) {
  const now = deps.now || Date.now;
  const deadlineMs = now() + (deps.budgetMs ?? 45_000);
  const db = deps.db || await getDb(config);
  const opts = { fetchImpl: deps.fetch || fetch, deadlineMs, now };
  const statuses = ['PAID', 'SETTLED'];
  const maxPages = deps.maxPages ?? 30;
  const summary = { scanned: 0, skippedComplete: 0, sent: 0, alreadySent: 0, ignored: 0, blocked: 0, inProgress: 0, conflicts: 0, failed: 0, wouldProcess: 0, pages: 0 };
  const failures = [];
  const blocked = [];

  const start = deps.resume || null;
  let started = !start;
  for (const serviceId of config.serviceIds) {
    for (const status of statuses) {
      let page = 1;
      if (!started) {
        if (start.serviceId !== serviceId || start.status !== status) continue;
        started = true;
        page = Math.max(1, Number(start.page) || 1);
      }
      for (;;) {
        if (summary.pages >= maxPages || now() > deadlineMs - 5_000) {
          return { complete: false, resume: { serviceId, status, page }, summary, failures, blocked };
        }
        let result;
        try {
          result = await fetchTransactionsPage(serviceId, status, page, config, opts);
        } catch (error) {
          if (error.retryable) return { complete: false, resume: { serviceId, status, page }, summary, failures, blocked, note: redact(error.message) };
          throw error;
        }
        summary.pages += 1;
        const txs = result.rows.map((row) => normalizeApiTransaction(row));
        // Satu kali baca untuk 100 order sekaligus → hemat waktu & kuota Firestore.
        const valid = txs.filter((tx) => tx.paymentId);
        const refs = valid.map((tx) => db.collection('goakalOrders').doc(orderIdFor(tx.paymentId)));
        const snaps = refs.length ? await db.getAll(...refs) : [];
        const done = new Set(snaps.filter((s) => s.exists && s.data()?.state === 'issued' && s.data()?.emailStatus === 'sent').map((s) => s.id));

        for (const tx of txs) {
          summary.scanned += 1;
          if (tx.paymentId && done.has(orderIdFor(tx.paymentId))) { summary.skippedComplete += 1; continue; }
          if (now() > deadlineMs - 5_000) return { complete: false, resume: { serviceId, status, page }, summary, failures, blocked };
          try {
            const r = await fulfillPaidTransaction(tx, config, { ...deps.fulfillDeps, db, dryRun: deps.dryRun });
            if (r.conflict?.length) summary.conflicts += 1;
            if (r.status === 'sent') summary.sent += 1;
            else if (r.status === 'already_sent') summary.alreadySent += 1;
            else if (r.status === 'email_in_progress') summary.inProgress += 1;
            else if (r.status === 'blocked') { summary.blocked += 1; blocked.push({ paymentId: tx.paymentId, reason: r.reason }); }
            else if (r.status === 'dry_run') { if (r.wouldDo !== 'ignore') { summary.wouldProcess += 1; blocked.push({ paymentId: tx.paymentId, wouldDo: r.wouldDo, reason: r.reason, email: maskEmail(tx.payerEmail) }); } else summary.ignored += 1; }
            else summary.ignored += 1;
          } catch (error) {
            summary.failed += 1;
            failures.push({ paymentId: tx.paymentId || '(kosong)', error: redact(error instanceof Error ? error.message : error, [config.resendApiKey, config.apiKey]) });
          }
        }
        if (!result.hasMore) break;
        page += 1;
      }
    }
  }
  return { complete: true, resume: null, summary, failures: failures.slice(0, 50), blocked: blocked.slice(0, 50) };
}

/** Bandingkan GOAKAL_PRICE_MAP dengan price scheme yang benar-benar ada di GoAkal (read-only). */
export async function checkConfig(config, deps = {}) {
  const opts = { fetchImpl: deps.fetch || fetch };
  const services = [];
  const seen = new Set();
  for (const serviceId of config.serviceIds) {
    try {
      const svc = await goakalGet(`/services/${encodeURIComponent(serviceId)}`, config, opts);
      const ps = await goakalGet(`/services/${encodeURIComponent(serviceId)}/price-schemes`, config, opts);
      const priceSchemes = (Array.isArray(ps.data) ? ps.data : []).map((p) => {
        seen.add(p.cuid);
        return { cuid: p.cuid, title: p.title, mainAmount: p.mainAmount, isShow: p.isShow, mapping: config.priceMap[p.cuid] || 'BELUM_DIPETAKAN' };
      });
      services.push({ serviceId, title: svc.data?.title ?? null, visibility: svc.data?.visibility ?? null, priceSchemes });
    } catch (error) {
      services.push({ serviceId, error: redact(error.message, [config.apiKey]) });
    }
  }
  const unknownMapKeys = Object.keys(config.priceMap).filter((id) => !seen.has(id));
  const unmapped = services.flatMap((s) => (s.priceSchemes || []).filter((p) => p.mapping === 'BELUM_DIPETAKAN').map((p) => p.cuid));
  // project_id service account bukan rahasia; dipakai untuk memastikan server menulis ke project Firebase yang sama dengan aplikasi.
  let firebase;
  try {
    const sa = parseServiceAccount(config.serviceAccountJson);
    const expected = String(deps.env?.EXPECTED_FIREBASE_PROJECT_ID || process.env.EXPECTED_FIREBASE_PROJECT_ID || 'genzpreneur');
    firebase = { projectId: sa.project_id, expectedProjectId: expected, match: sa.project_id === expected };
  } catch (error) {
    firebase = { error: redact(error.message) };
  }
  return { ok: !unknownMapKeys.length && !unmapped.length && services.every((s) => !s.error) && firebase.match === true, services, unknownMapKeys, unmapped, firebase };
}

export function _resetForTests() { cachedDb = null; }
