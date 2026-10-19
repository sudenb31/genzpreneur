// POST /api/goakal/webhook — dipanggil GoAkal saat transaksi berubah (saat ini: PAID).
// Kode respons: 2xx = selesai (GoAkal tidak mengulang); 4xx/5xx = GoAkal akan mengulang.
import { ConfigError, PayloadError, loadConfig, maskEmail, normalizeWebhook, redact, safeEqual } from '../_lib/goakal-core.js';
import { fulfillPaidTransaction } from '../_lib/goakal-server.js';
import { readJson, send } from '../_lib/http.js';

export function createWebhookHandler(deps = {}) {
  const env = deps.env || process.env;
  const log = deps.log || console;
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(res, 405, { error: 'Method not allowed' });
    }

    let config;
    try {
      config = loadConfig(env, 'webhook');
    } catch (error) {
      // Hanya nama variabel yang dicatat; nilai rahasia tidak pernah dilog.
      log.error('[goakal-webhook] konfigurasi', error instanceof ConfigError ? error.message : 'tidak valid');
      return send(res, 500, { error: 'Server belum dikonfigurasi' });
    }

    let payload;
    try {
      payload = await readJson(req);
    } catch (error) {
      return send(res, error.statusCode || 400, { error: 'Invalid body' });
    }

    if (!safeEqual(typeof payload?.token === 'string' ? payload.token : '', config.webhookToken)) {
      log.warn('[goakal-webhook] token tidak cocok');
      return send(res, 401, { error: 'Invalid webhook token' });
    }

    let tx;
    try {
      tx = normalizeWebhook(payload);
    } catch (error) {
      log.error('[goakal-webhook] payload', error instanceof PayloadError ? error.message : 'tidak valid');
      return send(res, 400, { error: 'Invalid payload' });
    }

    try {
      const result = await fulfillPaidTransaction(tx, config, deps.fulfillDeps);
      if (result.status === 'blocked') {
        log.warn('[goakal-webhook] perlu tindakan admin', { paymentId: tx.paymentId, reason: result.reason, priceSchemeId: tx.priceSchemeId, email: maskEmail(tx.payerEmail) });
      }
      if (result.conflict) {
        log.warn('[goakal-webhook] payload berbeda untuk paymentId yang sama; data tersimpan dipertahankan', { paymentId: tx.paymentId, fields: result.conflict });
      }
      if (result.status !== 'ignored') log.info('[goakal-webhook]', { paymentId: tx.paymentId, status: result.status });
      // Respons sengaja minim: tidak ada kode voucher, email, atau data order.
      return send(res, 200, { ok: true, status: result.status });
    } catch (error) {
      if (error instanceof PayloadError) {
        log.error('[goakal-webhook] payload', error.message);
        return send(res, 400, { error: 'Invalid payload' });
      }
      log.error('[goakal-webhook] gagal diproses', { paymentId: tx.paymentId, error: redact(error instanceof Error ? error.message : error, [config.resendApiKey, config.webhookToken]) });
      // 500 → GoAkal mengulang. Order & voucher yang sudah tercatat tidak dibuat ulang.
      return send(res, 500, { error: 'Webhook processing failed' });
    }
  };
}

export default createWebhookHandler();
