// POST /api/goakal/sync — pemulihan transaksi lunas yang webhook-nya terlewat.
// Wajib header: Authorization: Bearer <GOAKAL_SYNC_SECRET>
// Body JSON opsional:
//   {}                                 → sinkronisasi normal
//   {"mode":"dry-run"}                 → hanya laporan, TIDAK menulis Firestore & TIDAK mengirim email
//   {"mode":"check-config"}            → cocokkan GOAKAL_PRICE_MAP dengan price scheme di GoAkal (read-only)
//   {"resume":{...}}                   → lanjutkan dari nilai `resume` respons sebelumnya
import { ConfigError, loadConfig, parseServiceIds, redact, safeEqual } from '../_lib/goakal-core.js';
import { checkConfig, runSync } from '../_lib/goakal-server.js';
import { bearer, readJson, send } from '../_lib/http.js';

export function createSyncHandler(deps = {}) {
  const env = deps.env || process.env;
  const log = deps.log || console;
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(res, 405, { error: 'Method not allowed' });
    }
    const secret = String(env.GOAKAL_SYNC_SECRET || '').trim();
    if (!secret) {
      log.error('[goakal-sync] GOAKAL_SYNC_SECRET kosong');
      return send(res, 500, { error: 'Server belum dikonfigurasi' });
    }
    if (!safeEqual(bearer(req), secret)) return send(res, 401, { error: 'Unauthorized' });

    let body;
    try { body = await readJson(req); } catch (error) { return send(res, error.statusCode || 400, { error: 'Invalid body' }); }
    const mode = body?.mode === 'check-config' ? 'check' : body?.mode === 'dry-run' ? 'dry-run' : 'sync';

    let config;
    try {
      config = loadConfig(env, mode === 'check' ? 'check' : 'sync');
    } catch (error) {
      const detail = error instanceof ConfigError ? error.message : 'Konfigurasi tidak valid';
      log.error('[goakal-sync] konfigurasi', detail);
      // Endpoint ini dilindungi secret, jadi nama variabel yang kurang boleh ditampilkan (bukan nilainya).
      return send(res, 500, { error: 'Server belum dikonfigurasi', detail });
    }

    try {
      if (mode === 'check') {
        const report = await checkConfig(config, deps);
        return send(res, 200, { mode: 'check-config', ...report });
      }
      let resume = null;
      if (body?.resume && typeof body.resume === 'object') {
        const { serviceId, status, page } = body.resume;
        if (parseServiceIds(serviceId).length === 1 && config.serviceIds.includes(serviceId) && ['PAID', 'SETTLED'].includes(status) && Number.isInteger(page) && page >= 1 && page <= 1000) {
          resume = { serviceId, status, page };
        } else {
          return send(res, 400, { error: 'resume tidak valid' });
        }
      }
      const result = await runSync(config, { ...deps, resume, dryRun: mode === 'dry-run', budgetMs: deps.budgetMs ?? 45_000 });
      const ok = result.summary.failed === 0;
      log.info('[goakal-sync]', { mode, complete: result.complete, ...result.summary });
      return send(res, ok ? 200 : 207, { ok, mode, ...result });
    } catch (error) {
      log.error('[goakal-sync] gagal', redact(error instanceof Error ? error.message : error, [config.apiKey, config.resendApiKey]));
      return send(res, 502, { error: 'Sync failed', detail: redact(error instanceof Error ? error.message : error, [config.apiKey, config.resendApiKey]) });
    }
  };
}

export default createSyncHandler();
