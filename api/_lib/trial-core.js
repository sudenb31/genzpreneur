// =====================================================================
//  Trial mandiri + pengingat H-1 — logika murni (tanpa Firebase/Resend) supaya bisa dites.
//  Aturan HARUS sama dengan src/lib/membership.ts (TRIAL_OFFER & availableTrial).
// =====================================================================
import { escapeHtml, PLAN_LABEL } from './goakal-core.js';

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Spark → coba Boost 3 hari · Boost → coba Impact 7 hari. Sekali per akun. */
export const TRIAL_OFFER = { spark: { plan: 'boost', days: 3 }, boost: { plan: 'impact', days: 7 } };

/** Link checkout GoAkal untuk paket yang sedang dicoba (sama dengan src/config/site.ts). */
export const CHECKOUT_URL = {
  boost: 'https://goakal.com/genzpreneur/webinar-b1/tzu72/apply',
  impact: 'https://goakal.com/genzpreneur/webinar-b1/2md0s/apply',
};

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

/** Email pengingat H-1 sebelum trial berakhir. */
export function buildTrialReminderEmail({ name, trialPlan, endsAtMs }, appUrl) {
  const planName = PLAN_LABEL[trialPlan] || trialPlan;
  const checkout = CHECKOUT_URL[trialPlan];
  const when = formatDateTime(endsAtMs);
  const hi = name ? `Hai ${name},` : 'Hai Founder,';
  const keep = trialPlan === 'impact'
    ? 'Simulasi Founder lengkap (30 skenario), Season 4, dan playbook tim'
    : 'Alat Bisnis (HPP & harga, proposal), Cari Pelanggan, dan Season 2–3';
  const subject = `Trial ${planName} kamu berakhir besok — GenZ Preneur`;
  const html = `<!doctype html><html><body style="margin:0;background:#fbf8f2;padding:24px 12px">
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#111;background:#fff;border:2px solid #111;border-radius:20px;padding:28px">
<p style="display:inline-block;margin:0 0 12px;background:#d7ff3f;border:2px solid #111;border-radius:999px;padding:4px 12px;font-size:12px;font-weight:700">⏰ Trial ${escapeHtml(planName)}</p>
<h1 style="margin:0 0 12px;font-size:24px">Trial kamu berakhir besok</h1>
<p>${escapeHtml(hi)} trial <strong>${escapeHtml(planName)}</strong> kamu berakhir <strong>${escapeHtml(when)}</strong>.</p>
<p>Setelah itu ${escapeHtml(keep)} terkunci lagi. Progres dan draf kamu <strong>tetap aman</strong>, tidak ada yang dihapus.</p>
<p style="text-align:center;margin:24px 0"><a href="${escapeHtml(checkout)}" style="display:inline-block;background:#ff7a1a;color:#111;padding:14px 22px;border:2px solid #111;border-radius:14px;text-decoration:none;font-weight:700">Lanjut pakai ${escapeHtml(planName)}</a></p>
<p style="font-size:13px;color:#444">Setelah bayar di GoAkal, kode voucher dikirim ke emailmu. Tukarkan di ${escapeHtml(appUrl)}/voucher dengan email yang sama.</p>
<p style="font-size:12px;color:#777;margin-top:24px">Tidak ada tagihan otomatis. Kalau belum mau lanjut, abaikan saja email ini.</p>
</div></body></html>`;
  const text = [
    `${hi} trial ${planName} kamu berakhir ${when}.`,
    `Setelah itu ${keep} terkunci lagi. Progres dan draf kamu tetap aman.`,
    '',
    `Lanjut pakai ${planName}: ${checkout}`,
    `Setelah bayar, tukarkan kode voucher di ${appUrl}/voucher dengan email yang sama.`,
    '',
    'Tidak ada tagihan otomatis. Kalau belum mau lanjut, abaikan saja email ini.',
  ].join('\n');
  return { subject, html, text };
}

/** ID dokumen penanda pengingat: satu per (email, waktu berakhir trial). */
export const reminderId = (email, endsAtMs) => `${String(email).toLowerCase()}_${endsAtMs}`.replace(/\//g, '_');
