// GET /api/cron/trial-reminder — dijalankan Vercel Cron sekali sehari (lihat vercel.json).
// Mengirim email pengingat ke peserta yang trial-nya berakhir dalam 24 jam ke depan.
// Wajib header: Authorization: Bearer <CRON_SECRET>  (Vercel Cron mengirimnya otomatis bila env CRON_SECRET diisi)
// ?dry=1 → hanya laporan, tidak mengirim email & tidak menulis apa pun.
// Env: CRON_SECRET, FIREBASE_SERVICE_ACCOUNT_JSON, RESEND_API_KEY, EMAIL_FROM, APP_URL
import { safeEqual } from '../_lib/goakal-core.js';
import { realDeps, runTrialReminders } from '../_lib/trial-server.js';
import { bearer, send } from '../_lib/http.js';

const REQUIRED = ['CRON_SECRET', 'FIREBASE_SERVICE_ACCOUNT_JSON', 'RESEND_API_KEY', 'EMAIL_FROM', 'APP_URL'];

export function createReminderHandler(deps = {}) {
  const env = deps.env || process.env;
  const log = deps.log || console;
  return async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(res, 405, { error: 'Method not allowed' });
    }
    const v = (n) => String(env[n] ?? '').trim();
    const secret = v('CRON_SECRET');
    if (!secret) { log.error('[trial-reminder] CRON_SECRET kosong'); return send(res, 500, { error: 'Server belum dikonfigurasi' }); }
    if (!safeEqual(bearer(req), secret)) return send(res, 401, { error: 'Unauthorized' });
    const missing = REQUIRED.filter((n) => !v(n));
    if (missing.length && !deps.server) return send(res, 500, { error: 'Server belum dikonfigurasi', missing });

    const config = { resendApiKey: v('RESEND_API_KEY'), emailFrom: v('EMAIL_FROM'), appUrl: v('APP_URL').replace(/\/+$/, '') };
    const dryRun = /[?&]dry=1\b/.test(String(req.url || ''));
    try {
      const server = deps.server || (await realDeps(v('FIREBASE_SERVICE_ACCOUNT_JSON')));
      const result = await runTrialReminders(config, { ...server, dryRun, sendEmail: deps.sendEmail, now: deps.now });
      log.info('[trial-reminder]', { dryRun, checked: result.checked, sent: result.sent, skipped: result.skipped, failed: result.failed });
      return send(res, result.failed ? 207 : 200, { ok: result.failed === 0, dryRun, ...result });
    } catch (e) {
      log.error('[trial-reminder] gagal', e instanceof Error ? e.message.slice(0, 160) : 'unknown');
      return send(res, 502, { error: 'Reminder gagal' });
    }
  };
}

export default createReminderHandler();
