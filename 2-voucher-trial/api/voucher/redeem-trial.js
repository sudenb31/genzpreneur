// POST /api/voucher/redeem-trial — peserta menukar voucher TRIAL (mis. peserta webinar, gratis).
// Paket tidak berubah; peserta mendapat trial paket voucher selama N hari. Sekali per akun.
// Wajib header: Authorization: Bearer <Firebase ID token peserta yang login>
// Body: { code: "WEBINARSPARK", name: "Nama Lengkap" }
// Env: FIREBASE_SERVICE_ACCOUNT_JSON
import { realDeps, redeemTrialVoucher } from '../_lib/trial-server.js';
import { bearer, readJson, send } from '../_lib/http.js';

const CODE_RE = /^[A-Z0-9-]{4,32}$/;

const REASON_MSG = {
  not_found: 'Kode voucher tidak ditemukan. Cek lagi penulisannya.',
  not_trial: 'Kode ini bukan voucher trial.',
  invalid: 'Voucher ini belum diatur dengan benar. Hubungi tim GenZ Preneur.',
  inactive: 'Kode voucher ini sudah dinonaktifkan. Hubungi tim GenZ Preneur.',
  expired: 'Kode voucher ini sudah kedaluwarsa.',
  used_up: 'Kuota pemakaian kode voucher ini sudah habis.',
  wrong_email: 'Voucher ini terkunci ke email lain.',
  trial_not_higher: 'Paketmu sekarang sudah mencakup isi trial ini, jadi tidak perlu ditukar.',
  trial_used: 'Akunmu sudah pernah memakai voucher trial. Voucher trial hanya berlaku sekali per akun.',
  trial_active: 'Trial-mu yang sekarang masih berjalan. Tukar kode ini setelah trial itu selesai.',
};

export function createRedeemTrialHandler(deps = {}) {
  const env = deps.env || process.env;
  const log = deps.log || console;
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(res, 405, { error: 'Method not allowed' });
    }
    const token = bearer(req);
    if (!token) return send(res, 401, { error: 'Unauthorized' });
    let body;
    try { body = await readJson(req); } catch (e) { return send(res, e.statusCode || 400, { error: 'Permintaan tidak valid.' }); }
    const code = String(body?.code || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!CODE_RE.test(code)) return send(res, 400, { error: 'Format kode tidak valid (4–32 huruf/angka).' });
    const saJson = String(env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
    if (!saJson && !deps.server) {
      log.error('[redeem-trial] FIREBASE_SERVICE_ACCOUNT_JSON kosong');
      return send(res, 500, { error: 'Server belum dikonfigurasi' });
    }
    let server;
    try { server = deps.server || (await realDeps(saJson)); } catch (e) {
      log.error('[redeem-trial] init gagal', e instanceof Error ? e.message.slice(0, 120) : 'unknown');
      return send(res, 500, { error: 'Server belum dikonfigurasi' });
    }
    let user;
    try { user = await server.verifyIdToken(token); } catch { return send(res, 401, { error: 'Sesi tidak valid, silakan masuk ulang.' }); }
    if (!user?.uid || !user.email || user.email_verified !== true) return send(res, 403, { error: 'Email belum terverifikasi. Masuk lewat link yang dikirim ke emailmu.' });
    try {
      const result = await redeemTrialVoucher({ uid: user.uid, email: user.email, name: body?.name }, code, server);
      if (!result.ok) return send(res, 409, { error: REASON_MSG[result.reason] || 'Voucher tidak bisa ditukar.', reason: result.reason });
      log.info('[redeem-trial]', { plan: result.plan, days: result.days, newUser: result.newUser });
      return send(res, 200, { ok: true, plan: result.plan, days: result.days, endsAt: new Date(result.endsAtMs).toISOString() });
    } catch (e) {
      log.error('[redeem-trial] gagal', e instanceof Error ? e.message.slice(0, 160) : 'unknown');
      return send(res, 500, { error: 'Gagal menukar voucher. Coba lagi sebentar.' });
    }
  };
}

export default createRedeemTrialHandler();
