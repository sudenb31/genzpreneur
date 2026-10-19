import { normalizeWebhook, safeEqual } from '../_lib/goakal-core.js';
import { fulfillPaidTransaction } from '../_lib/goakal-server.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!safeEqual(String(payload?.token || ''), process.env.GOAKAL_WEBHOOK_TOKEN || '')) return res.status(401).json({ error: 'Invalid webhook token' });
    const result = await fulfillPaidTransaction(normalizeWebhook(payload));
    return res.status(200).json({ ok: true, status: result.status });
  } catch (error) {
    console.error('GoAkal webhook failed', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

