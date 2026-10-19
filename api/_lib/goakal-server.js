import { createHash } from 'node:crypto';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { FieldValue, Timestamp, getFirestore } from 'firebase-admin/firestore';
import { parsePriceMap, validatePaidTransaction, voucherCode } from './goakal-core.js';

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} belum diatur.`);
  return value;
}

function db() {
  if (!getApps().length) {
    let serviceAccount;
    try { serviceAccount = JSON.parse(required('FIREBASE_SERVICE_ACCOUNT_JSON')); }
    catch { throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON bukan JSON yang valid.'); }
    if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    initializeApp({ credential: cert(serviceAccount) });
  }
  return getFirestore();
}

function orderId(paymentId) {
  return createHash('sha256').update(paymentId).digest('hex');
}

function voucherExpiry() {
  const days = Number(process.env.VOUCHER_VALID_DAYS || 30);
  if (!Number.isInteger(days) || days < 1 || days > 365) throw new Error('VOUCHER_VALID_DAYS harus 1–365.');
  return Timestamp.fromMillis(Date.now() + days * 86_400_000);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

async function sendVoucherEmail({ paymentId, email, name, plan, code, priceSchemeTitle }) {
  const appUrl = required('APP_URL').replace(/\/$/, '');
  const redeemUrl = `${appUrl}/voucher?code=${encodeURIComponent(code)}`;
  const body = {
    from: required('EMAIL_FROM'),
    to: [email],
    subject: `Voucher ${plan.toUpperCase()} GenZ Preneur kamu`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#111"><h1>Akses GenZ Preneur sudah siap 🎟️</h1><p>Hai ${escapeHtml(name || 'Bos')}, pembayaran untuk <strong>${escapeHtml(priceSchemeTitle || plan.toUpperCase())}</strong> sudah kami terima.</p><p>Kode voucher kamu:</p><p style="font-size:24px;font-weight:800;letter-spacing:1px">${escapeHtml(code)}</p><p><a href="${redeemUrl}" style="display:inline-block;background:#ff5a2a;color:#111;padding:14px 20px;border:2px solid #111;border-radius:12px;text-decoration:none;font-weight:700">Aktifkan akses</a></p><p>Masuk memakai email <strong>${escapeHtml(email)}</strong>. Voucher ini hanya berlaku untuk email tersebut dan satu kali penukaran.</p><p style="color:#666;font-size:12px">ID pembayaran: ${escapeHtml(paymentId)}</p></div>`,
  };
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${required('RESEND_API_KEY')}`, 'Content-Type': 'application/json', 'Idempotency-Key': `goakal-voucher/${paymentId}` },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.id) throw new Error(`Resend gagal (${response.status}).`);
  return result.id;
}

export async function fulfillPaidTransaction(tx) {
  const priceMap = parsePriceMap(required('GOAKAL_PRICE_MAP'));
  const decision = validatePaidTransaction(tx, priceMap);
  if (decision.ignored) return { status: 'ignored' };

  const plan = decision.plan;
  const code = voucherCode(plan, tx.paymentId, required('VOUCHER_CODE_SECRET'));
  const database = db();
  const orderRef = database.collection('goakalOrders').doc(orderId(tx.paymentId));
  const voucherRef = database.collection('vouchers').doc(code);

  const order = await database.runTransaction(async (transaction) => {
    const [existingOrder, existingVoucher] = await Promise.all([transaction.get(orderRef), transaction.get(voucherRef)]);
    if (existingOrder.exists) return existingOrder.data();
    if (existingVoucher.exists && existingVoucher.data()?.sourcePaymentId !== tx.paymentId) throw new Error('Terjadi benturan kode voucher.');
    const now = FieldValue.serverTimestamp();
    transaction.create(voucherRef, {
      code, plan, maxUses: 1, uses: 0, active: true, expiresAt: voucherExpiry(),
      batch: 'goakal-auto', note: `Pembelian GoAkal ${tx.priceSchemeTitle || plan}`.slice(0, 300),
      assignedEmail: tx.payerEmail, source: 'goakal', sourcePaymentId: tx.paymentId,
      createdBy: 'system:goakal', createdAt: now, updatedAt: now,
    });
    const value = {
      paymentId: tx.paymentId, status: tx.status, amount: tx.amount, payerEmail: tx.payerEmail,
      payerName: tx.payerName, serviceId: tx.serviceId, serviceTitle: tx.serviceTitle,
      priceSchemeId: tx.priceSchemeId, priceSchemeTitle: tx.priceSchemeTitle, plan, voucherCode: code,
      paidAt: tx.paidAt, emailStatus: 'pending', createdAt: now, updatedAt: now,
    };
    transaction.create(orderRef, value);
    return value;
  });

  const delivery = {
    paymentId: order.paymentId || tx.paymentId,
    email: order.payerEmail || tx.payerEmail,
    name: order.payerName || tx.payerName,
    plan: order.plan || plan,
    code: order.voucherCode || code,
    priceSchemeTitle: order.priceSchemeTitle || tx.priceSchemeTitle,
  };
  if (order.emailStatus === 'sent') return { status: 'already_sent', code: delivery.code };
  try {
    const emailId = await sendVoucherEmail(delivery);
    await orderRef.update({ emailStatus: 'sent', emailId, emailSentAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), lastEmailError: FieldValue.delete() });
    return { status: 'sent', code: delivery.code };
  } catch (error) {
    await orderRef.update({ emailStatus: 'failed', lastEmailError: String(error instanceof Error ? error.message : error).slice(0, 300), updatedAt: FieldValue.serverTimestamp() });
    throw error;
  }
}

export async function fetchPaidTransactions(serviceId) {
  const rows = [];
  for (let page = 1; page <= 20; page += 1) {
    const url = new URL(`https://goakal.com/service/api/v1/services/${encodeURIComponent(serviceId)}/transactions`);
    url.searchParams.set('status', 'PAID'); url.searchParams.set('page', String(page)); url.searchParams.set('pageSize', '100');
    const response = await fetch(url, { headers: { 'X-Api-Key': required('GOAKAL_API_KEY') } });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.success !== true || !Array.isArray(body.data)) throw new Error(`GoAkal API gagal untuk service ${serviceId} (${response.status}).`);
    rows.push(...body.data);
    if (rows.length >= Number(body.meta?.total || 0) || body.data.length < 100) break;
  }
  return rows;
}

