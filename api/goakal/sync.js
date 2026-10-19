import { fetchPaidTransactions, fulfillPaidTransaction } from '../_lib/goakal-server.js';
import { normalizeApiTransaction, safeEqual } from '../_lib/goakal-core.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const bearer = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!safeEqual(bearer, process.env.GOAKAL_SYNC_SECRET || '')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const serviceIds = String(process.env.GOAKAL_SERVICE_IDS || '').split(',').map((v) => v.trim()).filter(Boolean);
    if (!serviceIds.length) throw new Error('GOAKAL_SERVICE_IDS belum diatur.');
    const summary = { scanned: 0, sent: 0, alreadySent: 0, ignored: 0, failed: 0 };
    for (const serviceId of serviceIds) {
      const transactions = await fetchPaidTransactions(serviceId);
      for (const item of transactions) {
        summary.scanned += 1;
        try {
          const result = await fulfillPaidTransaction(normalizeApiTransaction(item));
          if (result.status === 'sent') summary.sent += 1;
          else if (result.status === 'already_sent') summary.alreadySent += 1;
          else summary.ignored += 1;
        } catch (error) {
          summary.failed += 1;
          console.error('GoAkal sync item failed', item?.paymentId || '(unknown)', error instanceof Error ? error.message : error);
        }
      }
    }
    return res.status(summary.failed ? 207 : 200).json({ ok: summary.failed === 0, ...summary });
  } catch (error) {
    console.error('GoAkal sync failed', error instanceof Error ? error.message : error);
    return res.status(500).json({ error: 'Sync failed' });
  }
}

