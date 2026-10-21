// POST /api/trial/start — peserta memulai trial paket berikutnya sendiri (sekali per akun).
// Wajib header: Authorization: Bearer <Firebase ID token peserta yang login>
// Env: FIREBASE_SERVICE_ACCOUNT_JSON
import { startSelfTrial, realDeps } from '../_lib/trial-server.js';
import { bearer, send } from '../_lib/http.js';

const REASON_MSG = {
  'not-member': 'Akun belum terdaftar sebagai peserta.',
  'no-membership': 'Akun belum punya paket.',
  'no-plan': 'Trial tersedia untuk pemilik paket Spark atau Boost.',
  'top-plan': 'Kamu sudah di paket tertinggi.',
  'already-used': 'Trial ini sudah pernah kamu pakai.',
  'trial-active': 'Trial kamu masih berjalan.',
};

export function createStartHandler(deps = {}) {
  const env = deps.env || process.env;
  const log = deps.log || console;
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(res, 405, { error: 'Method not allowed' });
    }
    const token = bearer(req);
    if (!token) return send(res, 401, { error: 'Unauthorized' });
    const saJson = String(env.FIREBASE_SERVICE_ACCOUNT_JSON || '').trim();
    if (!saJson && !deps.server) {
      log.error('[trial-start] FIREBASE_SERVICE_ACCOUNT_JSON kosong');
      return send(res, 500, { error: 'Server belum dikonfigurasi' });
    }
    let server;
    try { server = deps.server || (await realDeps(saJson)); } catch (e) {
      log.error('[trial-start] init gagal', e instanceof Error ? e.message.slice(0, 120) : 'unknown');
      return send(res, 500, { error: 'Server belum dikonfigurasi' });
    }
    let user;
    try { user = await server.verifyIdToken(token); } catch { return send(res, 401, { error: 'Sesi tidak valid, silakan masuk ulang.' }); }
    if (!user?.uid || !user.email || user.email_verified !== true) return send(res, 403, { error: 'Email belum terverifikasi.' });
    try {
      const result = await startSelfTrial({ uid: user.uid, email: user.email }, server);
      if (!result.ok) return send(res, 409, { error: REASON_MSG[result.reason] || 'Trial tidak tersedia.', reason: result.reason });
      log.info('[trial-start]', { plan: result.plan, days: result.days });
      return send(res, 200, { ok: true, plan: result.plan, days: result.days, endsAt: new Date(result.endsAtMs).toISOString() });
    } catch (e) {
      log.error('[trial-start] gagal', e instanceof Error ? e.message.slice(0, 160) : 'unknown');
      return send(res, 500, { error: 'Gagal memulai trial. Coba lagi sebentar.' });
    }
  };
}

export default createStartHandler();
