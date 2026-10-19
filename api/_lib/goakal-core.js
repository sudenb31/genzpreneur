import { createHmac, timingSafeEqual } from 'node:crypto';

export const PLANS = new Set(['spark', 'boost', 'impact']);
const PRICE_ACTIONS = new Set([...PLANS, 'ignore']);
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function safeEqual(received, expected) {
  if (typeof received !== 'string' || typeof expected !== 'string' || !expected) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function parsePriceMap(raw) {
  let value;
  try { value = JSON.parse(raw || '{}'); } catch { throw new Error('GOAKAL_PRICE_MAP bukan JSON yang valid.'); }
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('GOAKAL_PRICE_MAP harus berupa object JSON.');
  const entries = Object.entries(value);
  if (!entries.length) throw new Error('GOAKAL_PRICE_MAP belum diisi.');
  const result = {};
  for (const [priceSchemeId, action] of entries) {
    if (!priceSchemeId.trim() || !PRICE_ACTIONS.has(action)) throw new Error(`Mapping price scheme ${priceSchemeId || '(kosong)'} tidak valid.`);
    result[priceSchemeId.trim()] = action;
  }
  return result;
}

export function voucherCode(plan, paymentId, secret) {
  if (!PLANS.has(plan) || !paymentId || !secret || secret.length < 24) throw new Error('Konfigurasi kode voucher tidak valid.');
  const digest = createHmac('sha256', secret).update(paymentId).digest();
  let suffix = '';
  for (let i = 0; i < 10; i += 1) suffix += CODE_ALPHABET[digest[i] % CODE_ALPHABET.length];
  return `${plan.toUpperCase()}-${suffix}`;
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function normalizeWebhook(body) {
  if (!body || typeof body !== 'object') throw new Error('Payload webhook bukan object.');
  const data = body.data;
  if (!data || typeof data !== 'object') throw new Error('Payload webhook tidak memiliki data transaksi.');
  return {
    event: String(body.event || ''),
    token: String(body.token || ''),
    idempotencyKey: String(body.idempotencyKey || ''),
    paymentId: String(data.paymentId || data.id || '').trim(),
    status: String(data.status || '').toUpperCase(),
    amount: Number(data.amount || 0),
    payerName: String(data.user?.name || '').trim(),
    payerEmail: normalizeEmail(data.user?.email),
    serviceId: String(data.service?.id || '').trim(),
    serviceTitle: String(data.service?.name || '').trim(),
    priceSchemeId: String(data.priceScheme?.id || '').trim(),
    priceSchemeTitle: String(data.priceScheme?.name || '').trim(),
    paidAt: data.paidAt ? String(data.paidAt) : null,
  };
}

export function normalizeApiTransaction(item) {
  return {
    event: 'transaction.updated',
    token: '',
    idempotencyKey: String(item.paymentId || ''),
    paymentId: String(item.paymentId || '').trim(),
    status: String(item.status || '').toUpperCase(),
    amount: Number(item.incomingAmount || 0),
    payerName: String(item.payerName || '').trim(),
    payerEmail: normalizeEmail(item.payerEmail),
    serviceId: String(item.serviceCuid || '').trim(),
    serviceTitle: String(item.serviceTitle || '').trim(),
    priceSchemeId: String(item.priceSchemeCuid || '').trim(),
    priceSchemeTitle: String(item.priceSchemeTitle || '').trim(),
    paidAt: item.paidAt ? String(item.paidAt) : null,
  };
}

export function validatePaidTransaction(tx, priceMap) {
  if (tx.event !== 'transaction.updated' || tx.status !== 'PAID') return { ignored: true };
  if (!tx.paymentId || !tx.payerEmail || !tx.priceSchemeId) throw new Error('Transaksi PAID tidak memiliki paymentId, email, atau price scheme.');
  const plan = priceMap[tx.priceSchemeId];
  if (!plan) throw new Error(`Price scheme ${tx.priceSchemeId} belum dipetakan ke paket.`);
  if (plan === 'ignore') return { ignored: true };
  return { ignored: false, plan };
}

