// =====================================================================
//  GoAkal → voucher: logika murni (tanpa Firebase/jaringan) agar mudah dites.
//  Dokumentasi resmi: https://goakal.com/docs/developer/webhook
//                     https://goakal.com/docs/developer/api
// =====================================================================
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const PLANS = new Set(['spark', 'boost', 'impact']);
const PRICE_ACTIONS = new Set([...PLANS, 'ignore']);
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const PLAN_LABEL = { spark: 'GenZ Spark', boost: 'GenZ Boost', impact: 'GenZ Impact' };

/** Status transaksi GoAkal yang berarti "sudah dibayar". SETTLED = PAID yang dananya sudah dicairkan. */
export const PAID_STATUSES = new Set(['PAID', 'SETTLED']);
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const CUID_RE = /^[a-z0-9]{20,40}$/;

export class ConfigError extends Error {
  constructor(missing, invalid = []) {
    super(`Konfigurasi server belum lengkap: ${[...missing.map((n) => `${n} kosong`), ...invalid].join('; ')}`);
    this.name = 'ConfigError';
    this.missing = missing;
    this.invalid = invalid;
  }
}

export class PayloadError extends Error {
  constructor(message) { super(message); this.name = 'PayloadError'; }
}

export function safeEqual(received, expected) {
  if (typeof received !== 'string' || typeof expected !== 'string' || !expected) return false;
  // Bandingkan hash berukuran tetap agar panjang token tidak bocor lewat waktu respons.
  const a = createHash('sha256').update(received).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b) && received.length === expected.length;
}

export function parsePriceMap(raw) {
  let value;
  try { value = JSON.parse(raw || '{}'); } catch { throw new Error('GOAKAL_PRICE_MAP bukan JSON yang valid.'); }
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('GOAKAL_PRICE_MAP harus berupa object JSON.');
  const entries = Object.entries(value);
  if (!entries.length) throw new Error('GOAKAL_PRICE_MAP belum diisi.');
  const result = {};
  for (const [rawId, action] of entries) {
    const priceSchemeId = rawId.trim();
    if (!priceSchemeId || !PRICE_ACTIONS.has(action)) throw new Error(`Mapping price scheme ${priceSchemeId || '(kosong)'} tidak valid (harus spark/boost/impact/ignore).`);
    result[priceSchemeId] = action;
  }
  return result;
}

export function parseServiceIds(raw) {
  return String(raw || '').split(',').map((v) => v.trim()).filter(Boolean);
}

/**
 * Validasi environment variables. `need` menentukan kelompok yang wajib:
 *  webhook → token + mapping + voucher + firebase + email
 *  sync    → webhook + API key + sync secret + service ids
 *  check   → sync secret + API key + service ids + mapping
 * Pesan error hanya menyebut NAMA variabel, tidak pernah nilainya.
 */
export function loadConfig(env = process.env, need = 'webhook') {
  const v = (name) => String(env[name] ?? '').trim();
  const groups = {
    webhook: ['GOAKAL_WEBHOOK_TOKEN', 'GOAKAL_PRICE_MAP', 'VOUCHER_CODE_SECRET', 'FIREBASE_SERVICE_ACCOUNT_JSON', 'RESEND_API_KEY', 'EMAIL_FROM', 'APP_URL'],
    sync: ['GOAKAL_SYNC_SECRET', 'GOAKAL_API_KEY', 'GOAKAL_SERVICE_IDS', 'GOAKAL_PRICE_MAP', 'VOUCHER_CODE_SECRET', 'FIREBASE_SERVICE_ACCOUNT_JSON', 'RESEND_API_KEY', 'EMAIL_FROM', 'APP_URL'],
    check: ['GOAKAL_SYNC_SECRET', 'GOAKAL_API_KEY', 'GOAKAL_SERVICE_IDS', 'GOAKAL_PRICE_MAP'],
  };
  const required = groups[need];
  if (!required) throw new Error(`Grup konfigurasi tidak dikenal: ${need}`);
  const missing = required.filter((name) => !v(name));
  const invalid = [];

  let priceMap = {};
  if (v('GOAKAL_PRICE_MAP')) {
    try { priceMap = parsePriceMap(v('GOAKAL_PRICE_MAP')); } catch (e) { invalid.push(e.message); }
  }
  if (v('VOUCHER_CODE_SECRET') && v('VOUCHER_CODE_SECRET').length < 32) invalid.push('VOUCHER_CODE_SECRET minimal 32 karakter');
  for (const name of ['GOAKAL_WEBHOOK_TOKEN', 'GOAKAL_SYNC_SECRET']) {
    if (v(name) && v(name).length < 24) invalid.push(`${name} minimal 24 karakter`);
  }
  if (v('GOAKAL_WEBHOOK_TOKEN') && v('GOAKAL_WEBHOOK_TOKEN') === v('GOAKAL_SYNC_SECRET')) invalid.push('GOAKAL_SYNC_SECRET harus berbeda dari GOAKAL_WEBHOOK_TOKEN');
  if (v('VOUCHER_CODE_SECRET') && (v('VOUCHER_CODE_SECRET') === v('GOAKAL_WEBHOOK_TOKEN') || v('VOUCHER_CODE_SECRET') === v('GOAKAL_SYNC_SECRET'))) invalid.push('VOUCHER_CODE_SECRET harus berbeda dari token/secret lain');

  const appUrl = v('APP_URL').replace(/\/+$/, '');
  if (appUrl && !/^https:\/\/[^\s/]+/.test(appUrl) && !/^http:\/\/localhost(:\d+)?$/.test(appUrl)) invalid.push('APP_URL harus diawali https://');
  const emailFrom = v('EMAIL_FROM');
  if (emailFrom && !/[^@\s<]+@[^@\s>]+\.[^@\s>]+/.test(emailFrom)) invalid.push('EMAIL_FROM harus berisi alamat email, mis. GenZ Preneur <akses@domain.id>');
  if (/@gmail\.com/i.test(emailFrom)) invalid.push('EMAIL_FROM tidak boleh @gmail.com (pakai domain yang diverifikasi di Resend)');

  const daysRaw = v('VOUCHER_VALID_DAYS') || '30';
  const validDays = Number(daysRaw);
  if (!Number.isInteger(validDays) || validDays < 1 || validDays > 365) invalid.push('VOUCHER_VALID_DAYS harus bilangan bulat 1–365');

  const serviceIds = parseServiceIds(v('GOAKAL_SERVICE_IDS'));
  for (const id of serviceIds) if (!CUID_RE.test(id)) invalid.push(`GOAKAL_SERVICE_IDS berisi ID yang formatnya tidak seperti cuid: ${id.slice(0, 40)}`);
  for (const id of Object.keys(priceMap)) if (!CUID_RE.test(id)) invalid.push(`GOAKAL_PRICE_MAP berisi ID yang formatnya tidak seperti cuid: ${id.slice(0, 40)}`);

  if (missing.length || invalid.length) throw new ConfigError(missing, invalid);
  return {
    webhookToken: v('GOAKAL_WEBHOOK_TOKEN'),
    syncSecret: v('GOAKAL_SYNC_SECRET'),
    apiKey: v('GOAKAL_API_KEY'),
    priceMap,
    serviceIds,
    voucherSecret: v('VOUCHER_CODE_SECRET'),
    serviceAccountJson: v('FIREBASE_SERVICE_ACCOUNT_JSON'),
    resendApiKey: v('RESEND_API_KEY'),
    emailFrom,
    appUrl,
    validDays,
  };
}

export function voucherCode(plan, paymentId, secret) {
  if (!PLANS.has(plan) || !paymentId || !secret || secret.length < 24) throw new Error('Konfigurasi kode voucher tidak valid.');
  const digest = createHmac('sha256', secret).update(paymentId).digest();
  let suffix = '';
  for (let i = 0; i < 10; i += 1) suffix += CODE_ALPHABET[digest[i] % CODE_ALPHABET.length];
  return `${plan.toUpperCase()}-${suffix}`;
}

/** ID dokumen goakalOrders: hash paymentId (paymentId bisa berisi karakter yang tidak aman untuk ID). */
export function orderIdFor(paymentId) {
  return createHash('sha256').update(String(paymentId)).digest('hex');
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function isValidEmail(value) {
  return typeof value === 'string' && value.length <= 120 && EMAIL_RE.test(value);
}

/** b***r@g***.com — dipakai di log & respons agar email lengkap tidak bocor. */
export function maskEmail(value) {
  const email = normalizeEmail(value);
  const [user, domain] = email.split('@');
  if (!user || !domain) return '(email tidak valid)';
  const mask = (s) => (s.length <= 2 ? `${s[0] || ''}*` : `${s[0]}***${s[s.length - 1]}`);
  const dot = domain.lastIndexOf('.');
  return `${mask(user)}@${dot > 0 ? `${mask(domain.slice(0, dot))}${domain.slice(dot)}` : mask(domain)}`;
}

/** Potong teks pembayar (nama, judul) ke ukuran aman tanpa karakter kontrol. */
function clean(value, max) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

/**
 * Payload resmi webhook (ringkas):
 * { event:"transaction.updated", data:{ id, paymentId, status:"PAID", amount, schoolId,
 *   user:{name,email,phone}, service:{id,name}, priceScheme:{id,name,price}, crossSales:[...],
 *   createdAt, paidAt }, idempotencyKey, token }
 */
export function normalizeWebhook(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new PayloadError('Payload webhook bukan object.');
  const data = body.data;
  if (!data || typeof data !== 'object') throw new PayloadError('Payload webhook tidak memiliki data transaksi.');
  return {
    source: 'webhook',
    event: String(body.event || ''),
    idempotencyKey: clean(body.idempotencyKey, 200),
    // SENGAJA tidak fallback ke data.id: API transaksi hanya mengenal paymentId,
    // jadi kunci idempotensi webhook & sync harus sama-sama paymentId.
    paymentId: clean(data.paymentId, 120),
    transactionId: clean(data.id, 120),
    status: String(data.status || '').toUpperCase(),
    amount: Number.isFinite(Number(data.amount)) ? Number(data.amount) : 0,
    // Payload nyata GoAkal (Okt 2026) memakai `payer` {name,email,phoneNumber}, sedangkan
    // dokumentasi menulis `user`. Keduanya didukung, `payer` diutamakan.
    payerName: clean(data.payer?.name ?? data.user?.name, 80),
    payerEmail: normalizeEmail(data.payer?.email ?? data.user?.email ?? data.payerEmail),
    serviceId: clean(data.service?.id ?? data.service?.cuid ?? data.serviceCuid ?? data.serviceId, 60),
    serviceTitle: clean(data.service?.name ?? data.service?.title ?? data.serviceTitle, 200),
    priceSchemeId: clean(data.priceScheme?.id ?? data.priceScheme?.cuid ?? data.priceSchemeCuid ?? data.priceSchemeId, 60),
    priceSchemeTitle: clean(data.priceScheme?.name ?? data.priceScheme?.title ?? data.priceSchemeTitle, 200),
    paidAt: data.paidAt ? clean(data.paidAt, 40) : null,
  };
}

/** Baris GET /services/:cuid/transactions. */
export function normalizeApiTransaction(item) {
  const row = item && typeof item === 'object' ? item : {};
  return {
    source: 'sync',
    event: 'transaction.updated',
    idempotencyKey: '',
    paymentId: clean(row.paymentId, 120),
    transactionId: '',
    status: String(row.status || '').toUpperCase(),
    amount: Number.isFinite(Number(row.incomingAmount)) ? Number(row.incomingAmount) : 0,
    payerName: clean(row.payerName, 80),
    payerEmail: normalizeEmail(row.payerEmail),
    serviceId: clean(row.serviceCuid, 60),
    serviceTitle: clean(row.serviceTitle, 200),
    priceSchemeId: clean(row.priceSchemeCuid, 60),
    priceSchemeTitle: clean(row.priceSchemeTitle, 200),
    paidAt: row.paidAt ? clean(row.paidAt, 40) : null,
  };
}

/**
 * Keputusan untuk transaksi BARU (belum ada di goakalOrders).
 *  ignore → bukan pembayaran lunas / service lain / price scheme "ignore": tidak ditulis apa pun
 *  block  → lunas tetapi tidak bisa dipenuhi otomatis (mapping/email); dicatat agar admin bisa menindaklanjuti
 *  issue  → buat voucher
 */
export function decide(tx, { priceMap, serviceIds = [] }) {
  if (tx.event !== 'transaction.updated') return { action: 'ignore', reason: 'event_lain' };
  if (!PAID_STATUSES.has(tx.status)) return { action: 'ignore', reason: 'belum_lunas' };
  if (!tx.paymentId) throw new PayloadError('Transaksi lunas tanpa paymentId.');
  if (serviceIds.length && tx.serviceId && !serviceIds.includes(tx.serviceId)) return { action: 'ignore', reason: 'service_lain' };
  if (!tx.priceSchemeId) return { action: 'block', reason: 'price_scheme_kosong' };
  const plan = priceMap[tx.priceSchemeId];
  if (!plan) return { action: 'block', reason: 'price_scheme_belum_dipetakan' };
  if (plan === 'ignore') return { action: 'ignore', reason: 'price_scheme_ignore' };
  if (!isValidEmail(tx.payerEmail)) return { action: 'block', reason: 'email_pembeli_tidak_valid' };
  return { action: 'issue', plan };
}

/** Field yang tidak boleh berubah untuk paymentId yang sama. */
export function payloadMismatch(order, tx) {
  const fields = [];
  if (tx.payerEmail && order.payerEmail && tx.payerEmail !== order.payerEmail) fields.push('payerEmail');
  if (tx.priceSchemeId && order.priceSchemeId && tx.priceSchemeId !== order.priceSchemeId) fields.push('priceSchemeId');
  if (tx.serviceId && order.serviceId && tx.serviceId !== order.serviceId) fields.push('serviceId');
  return fields;
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(date);
  } catch { return date.toISOString().slice(0, 10); }
}

/**
 * Email voucher. Dibangun HANYA dari data order yang tersimpan (bukan payload/mapping terbaru),
 * sehingga retry selalu menghasilkan isi yang sama — aman untuk Idempotency-Key Resend.
 */
export function buildVoucherEmail(order, appUrl) {
  const planName = PLAN_LABEL[order.plan] || String(order.plan || '').toUpperCase();
  const code = order.voucherCode;
  const redeemUrl = `${appUrl}/voucher?code=${encodeURIComponent(code)}`;
  const expires = order.voucherExpiresAtMs ? formatDate(new Date(order.voucherExpiresAtMs)) : null;
  const name = order.payerName || 'Founder';
  const subject = `Kode voucher ${planName} kamu — GenZ Preneur`;
  const html = `<!doctype html><html><body style="margin:0;background:#fbf8f2;padding:24px 12px">
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:auto;color:#111;background:#fff;border:2px solid #111;border-radius:20px;padding:28px">
<p style="display:inline-block;margin:0 0 12px;background:#d7ff3f;border:2px solid #111;border-radius:999px;padding:4px 12px;font-size:12px;font-weight:700">${escapeHtml(planName)}</p>
<h1 style="margin:0 0 12px;font-size:24px">Akses GenZ Preneur kamu sudah siap 🎟️</h1>
<p>Hai ${escapeHtml(name)}, pembayaran paket <strong>${escapeHtml(planName)}</strong> sudah kami terima.</p>
<p style="margin:20px 0 6px">Kode voucher kamu:</p>
<p style="margin:0 0 20px;font-family:'Courier New',monospace;font-size:26px;font-weight:800;letter-spacing:2px;background:#cbbcff;border:2px dashed #111;border-radius:12px;padding:12px;text-align:center">${escapeHtml(code)}</p>
<p style="text-align:center"><a href="${escapeHtml(redeemUrl)}" style="display:inline-block;background:#ff7a1a;color:#111;padding:14px 22px;border:2px solid #111;border-radius:14px;text-decoration:none;font-weight:700">Aktifkan akses sekarang</a></p>
<h2 style="font-size:16px;margin:24px 0 8px">Cara aktivasi</h2>
<ol style="padding-left:20px;line-height:1.6">
<li>Klik tombol di atas (atau buka ${escapeHtml(appUrl)}/voucher).</li>
<li>Masuk memakai email <strong>${escapeHtml(order.payerEmail)}</strong> — email yang sama dengan saat membeli di GoAkal. Kami akan mengirim link masuk ke email itu.</li>
<li>Buka link masuk dari email, lalu tukar kode voucher di atas.</li>
</ol>
<p style="font-size:13px;color:#444">Voucher hanya bisa dipakai <strong>satu kali</strong> dan hanya oleh email pembelian${expires ? `, berlaku sampai <strong>${escapeHtml(expires)}</strong>` : ''}. Jangan bagikan kode ini.</p>
<p style="font-size:12px;color:#777;margin-top:24px">Butuh bantuan? Balas email ini dan sertakan ID pembayaran: ${escapeHtml(order.paymentId)}</p>
</div></body></html>`;
  const text = [
    `Hai ${name}, pembayaran paket ${planName} sudah kami terima.`,
    '',
    `Kode voucher: ${code}`,
    `Aktifkan: ${redeemUrl}`,
    '',
    `Masuk memakai email ${order.payerEmail} (email saat membeli di GoAkal), lalu tukar kode di atas.`,
    `Voucher hanya bisa dipakai satu kali dan hanya oleh email pembelian${expires ? `, berlaku sampai ${expires}` : ''}.`,
    '',
    `ID pembayaran: ${order.paymentId}`,
  ].join('\n');
  return { subject, html, text, redeemUrl };
}

/** Bersihkan pesan error sebelum disimpan/dilog: hapus email, token panjang, dan potong. */
export function redact(message, secrets = []) {
  let out = String(message ?? '');
  for (const s of secrets) if (s && s.length >= 8) out = out.split(s).join('[disembunyikan]');
  out = out.replace(/[^\s@"'<>]+@[^\s@"'<>]+\.[^\s@"'<>]+/g, (m) => maskEmail(m));
  out = out.replace(/\b(re|ak|sk|pk)_[A-Za-z0-9_-]{8,}\b/g, '[disembunyikan]');
  out = out.replace(/-----BEGIN [A-Z ]+-----[\s\S]*?-----END [A-Z ]+-----/g, '[disembunyikan]');
  return out.slice(0, 300);
}
