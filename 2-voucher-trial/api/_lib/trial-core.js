// =====================================================================
//  Trial mandiri + pengingat H-1 — logika murni (tanpa Firebase/Resend) supaya bisa dites.
//  Aturan HARUS sama dengan src/lib/membership.ts (TRIAL_OFFER & availableTrial).
// =====================================================================
import { escapeHtml, PLAN_LABEL } from './goakal-core.js';

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Spark → coba Boost 3 hari · Boost → coba Impact 7 hari. Sekali per akun. */
export const TRIAL_OFFER = { spark: { plan: 'boost', days: 3 }, boost: { plan: 'impact', days: 7 } };

/** Link checkout GoAkal & harga untuk paket yang sedang dicoba (sama dengan src/config/site.ts). */
export const CHECKOUT_URL = {
  spark: 'https://goakal.com/genzpreneur/webinar-b1/z7x0w/apply',
  boost: 'https://goakal.com/genzpreneur/webinar-b1/tzu72/apply',
  impact: 'https://goakal.com/genzpreneur/webinar-b1/2md0s/apply',
};
export const PRICE_LABEL = { spark: 'Rp79.000', boost: 'Rp149.000', impact: 'Rp299.000' };

export const PLAN_RANK = { none: 0, spark: 1, boost: 2, impact: 3 };
export const TRIAL_PLANS = ['spark', 'boost', 'impact'];
export const VOUCHER_TRIAL_DAYS_MAX = 30;

/** Firestore Timestamp / Date / angka → milidetik (null bila tidak terbaca). */
export function toMs(v) {
  if (v == null) return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (v instanceof Date) return v.getTime();
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (typeof v.toDate === 'function') return v.toDate().getTime();
  return null;
}

/**
 * Trial apa yang boleh dimulai peserta sendiri sekarang.
 * Mengembalikan { offer } atau { reason } bila tidak boleh.
 */
export function pickSelfTrial(m, nowMs) {
  if (!m) return { reason: 'no-membership' };
  const offer = TRIAL_OFFER[m.plan];
  if (!offer) return { reason: m.plan === 'impact' ? 'top-plan' : 'no-plan' };
  if (m.trialsUsed && m.trialsUsed[offer.plan] === true) return { reason: 'already-used' };
  const endsAt = toMs(m.trial?.endsAt);
  if (endsAt && endsAt > nowMs) return { reason: 'trial-active' };
  return { offer };
}

export function formatDateTime(ms) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(ms)) + ' WIB';
}

/** Paket yang berlaku sekarang (paket berbayar atau trial yang masih jalan, mana yang lebih tinggi). */
export function effectivePlanAt(m, nowMs) {
  const plan = m && PLAN_RANK[m.plan] !== undefined ? m.plan : 'none';
  const endsAt = toMs(m?.trial?.endsAt);
  const t = m?.trial?.plan;
  if (endsAt && endsAt > nowMs && PLAN_RANK[t] > PLAN_RANK[plan]) return t;
  return plan;
}

/**
 * Boleh tidak voucher trial ini ditukar? Harus sama dengan voucherProblem() di src/lib/voucher.ts.
 * Mengembalikan { ok: true } atau { reason }.
 */
export function checkVoucherTrial({ voucher, membership, email, nowMs, alreadyRedeemedTrial }) {
  if (!voucher) return { reason: 'not_found' };
  if (voucher.kind !== 'trial') return { reason: 'not_trial' };
  const days = Number(voucher.trialDays);
  if (!TRIAL_PLANS.includes(voucher.plan) || !Number.isInteger(days) || days < 1 || days > VOUCHER_TRIAL_DAYS_MAX) return { reason: 'invalid' };
  if (voucher.active !== true) return { reason: 'inactive' };
  const exp = toMs(voucher.expiresAt);
  if (exp && nowMs >= exp) return { reason: 'expired' };
  if (Number(voucher.uses || 0) >= Number(voucher.maxUses || 0)) return { reason: 'used_up' };
  if (voucher.assignedEmail && String(voucher.assignedEmail).toLowerCase() !== String(email).toLowerCase()) return { reason: 'wrong_email' };
  if (PLAN_RANK[voucher.plan] <= PLAN_RANK[effectivePlanAt(membership, nowMs)]) return { reason: 'trial_not_higher' };
  if (alreadyRedeemedTrial || membership?.trialsUsed?.voucher === true) return { reason: 'trial_used' };
  const endsAt = toMs(membership?.trial?.endsAt);
  if (endsAt && endsAt > nowMs) return { reason: 'trial_active' };
  return { ok: true, plan: voucher.plan, days };
}

/** Email pengingat H-1 sebelum trial berakhir. */
export function buildTrialReminderEmail({ name, trialPlan, endsAtMs }, appUrl) {
  const planName = PLAN_LABEL[trialPlan] || trialPlan;
  const checkout = CHECKOUT_URL[trialPlan];
  const when = formatDateTime(endsAtMs);
  const hi = name ? `Hai ${name},` : 'Hai Founder,';
  const price = PRICE_LABEL[trialPlan] || '';
  const keep = {
    spark: 'Misi Pertama 9 tahap, Business 101 & Season 1, dan Dream Pact',
    boost: 'Alat Bisnis (HPP & harga, proposal), Cari Pelanggan, dan Season 2–3',
    impact: 'Simulasi Founder lengkap (30 skenario), Season 4, dan playbook tim',
  }[trialPlan] || 'fitur paket ini';
  const subject = `Trial ${planName} kamu berakhir besok — GenZ Preneur`;
  const html = `<!doctype html><html><body style="margin:0;background:#fbf8f2;padding:24px 12px">
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#111;background:#fff;border:2px solid #111;border-radius:20px;padding:28px">
<p style="display:inline-block;margin:0 0 12px;background:#d7ff3f;border:2px solid #111;border-radius:999px;padding:4px 12px;font-size:12px;font-weight:700">⏰ Trial ${escapeHtml(planName)}</p>
<h1 style="margin:0 0 12px;font-size:24px">Trial kamu berakhir besok</h1>
<p>${escapeHtml(hi)} trial <strong>${escapeHtml(planName)}</strong> kamu berakhir <strong>${escapeHtml(when)}</strong>.</p>
<p>Setelah itu ${escapeHtml(keep)} terkunci lagi. Progres dan draf kamu <strong>tetap aman</strong>, tidak ada yang dihapus.</p>
<p style="text-align:center;margin:24px 0"><a href="${escapeHtml(checkout)}" style="display:inline-block;background:#ff7a1a;color:#111;padding:14px 22px;border:2px solid #111;border-radius:14px;text-decoration:none;font-weight:700">Lanjut pakai ${escapeHtml(planName)}${price ? ` — ${escapeHtml(price)}` : ''}</a></p>
<p style="font-size:13px;color:#444;text-align:center;margin-top:-12px">Sekali bayar, bukan langganan.</p>
<p style="font-size:13px;color:#444">Setelah bayar di GoAkal, kode voucher dikirim ke emailmu. Tukarkan di ${escapeHtml(appUrl)}/voucher dengan email yang sama.</p>
<p style="font-size:12px;color:#777;margin-top:24px">Tidak ada tagihan otomatis. Kalau belum mau lanjut, abaikan saja email ini.</p>
</div></body></html>`;
  const text = [
    `${hi} trial ${planName} kamu berakhir ${when}.`,
    `Setelah itu ${keep} terkunci lagi. Progres dan draf kamu tetap aman.`,
    '',
    `Lanjut pakai ${planName}${price ? ` (${price}, sekali bayar)` : ''}: ${checkout}`,
    `Setelah bayar, tukarkan kode voucher di ${appUrl}/voucher dengan email yang sama.`,
    '',
    'Tidak ada tagihan otomatis. Kalau belum mau lanjut, abaikan saja email ini.',
  ].join('\n');
  return { subject, html, text };
}

/** ID dokumen penanda pengingat: satu per (email, waktu berakhir trial). */
export const reminderId = (email, endsAtMs) => `${String(email).toLowerCase()}_${endsAtMs}`.replace(/\//g, '_');
