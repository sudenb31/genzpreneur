// @vitest-environment node
// Tes alur lengkap webhook/sync GoAkal memakai Firestore palsu, Resend palsu, dan GoAkal API palsu.
// Tidak ada jaringan, tidak ada data produksi. Semua "secret" di bawah adalah nilai uji yang jelas palsu.
import { beforeEach, describe, expect, it } from 'vitest';
import { createWebhookHandler } from '../goakal/webhook.js';
import { createSyncHandler } from '../goakal/sync.js';
import { FakeDb, FakeFieldValue, FakeTimestamp } from './fake-firestore.test-helper.js';
import { orderIdFor } from './goakal-core.js';

const SERVICE = 'cmtestservice0000000000001';
const PS = { webinar: 'cmtestpricewebinar00000001', spark: 'cmtestpricespark000000001', boost: 'cmtestpriceboost000000001', impact: 'cmtestpriceimpact00000001', unmapped: 'cmtestpricenew00000000001' };
const ENV = {
  GOAKAL_WEBHOOK_TOKEN: 'TEST-ONLY-webhook-token-not-real-0001',
  GOAKAL_SYNC_SECRET: 'TEST-ONLY-sync-secret-not-real-00002',
  GOAKAL_API_KEY: 'TEST-ONLY-api-key',
  GOAKAL_SERVICE_IDS: SERVICE,
  GOAKAL_PRICE_MAP: JSON.stringify({ [PS.webinar]: 'ignore', [PS.spark]: 'spark', [PS.boost]: 'boost', [PS.impact]: 'impact' }),
  VOUCHER_CODE_SECRET: 'TEST-ONLY-voucher-secret-not-real-000000003',
  FIREBASE_SERVICE_ACCOUNT_JSON: '{"test":"tidak dipakai karena db disuntik"}',
  RESEND_API_KEY: 'TEST-ONLY-resend',
  EMAIL_FROM: 'GenZ Preneur <akses@contoh-uji.id>',
  APP_URL: 'https://contoh-uji.vercel.app',
  VOUCHER_VALID_DAYS: '30',
};
const T0 = Date.UTC(2026, 9, 19, 3, 0, 0);

let db; let emails; let logs; let clock; let resendFails; let goakalRows;

function makeLog() {
  const push = (level) => (...args) => logs.push({ level, text: args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ') });
  return { info: push('info'), warn: push('warn'), error: push('error') };
}

function fakeResend(url, init) {
  if (resendFails > 0) { resendFails -= 1; return Promise.resolve(new Response(JSON.stringify({ name: 'application_error' }), { status: 500 })); }
  const body = JSON.parse(init.body);
  const key = init.headers['Idempotency-Key'];
  const prior = emails.find((e) => e.key === key);
  if (!prior) emails.push({ key, ...body });
  return Promise.resolve(new Response(JSON.stringify({ id: prior ? prior.id : `email_${emails.length}` }), { status: 200 }));
}

function fakeGoakal(url) {
  const u = new URL(url);
  if (u.pathname.endsWith('/price-schemes')) {
    return Promise.resolve(new Response(JSON.stringify({ success: true, data: Object.entries(PS).map(([k, cuid]) => ({ cuid, title: k, mainAmount: 1, isShow: true })) })));
  }
  if (u.pathname.endsWith('/transactions')) {
    const status = u.searchParams.get('status');
    const page = Number(u.searchParams.get('page'));
    const size = Number(u.searchParams.get('pageSize'));
    const rows = goakalRows.filter((r) => r.status === status);
    return Promise.resolve(new Response(JSON.stringify({ success: true, data: rows.slice((page - 1) * size, page * size), meta: { page, pageSize: size, total: rows.length } })));
  }
  return Promise.resolve(new Response(JSON.stringify({ success: true, data: { cuid: SERVICE, title: 'Webinar B1', visibility: 'public' } })));
}

function deps(env = ENV) {
  return {
    env,
    log: makeLog(),
    fetch: fakeGoakal,
    now: () => clock,
    budgetMs: 45_000,
    fulfillDeps: { db, firestore: { FieldValue: FakeFieldValue, Timestamp: FakeTimestamp }, now: () => clock, fetch: fakeResend },
    db,
  };
}

function res() {
  return {
    statusCode: 0, headers: {}, body: '',
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
    end(b) { this.body = b; },
    get json() { return JSON.parse(this.body || '{}'); },
  };
}

function payload(over = {}, data = {}) {
  return {
    event: 'transaction.updated',
    token: ENV.GOAKAL_WEBHOOK_TOKEN,
    idempotencyKey: 'idem-1',
    data: {
      id: 'cmtesttransaction00000001', paymentId: 'AKL-TEST1', status: 'PAID', amount: 99000, schoolId: 'genzpreneur',
      user: { name: 'Rani Uji', email: 'Rani.Uji@Contoh-Uji.id', phone: '6280000000000' },
      service: { id: SERVICE, name: 'Webinar B1' },
      priceScheme: { id: PS.boost, name: 'GENZ BOOST', price: 99000 },
      crossSales: [], createdAt: '2026-10-19T02:00:00.000Z', paidAt: '2026-10-19T02:05:00.000Z',
      ...data,
    },
    ...over,
  };
}

async function webhook(body, env = ENV) {
  const r = res();
  await createWebhookHandler(deps(env))({ method: 'POST', headers: {}, body }, r);
  return r;
}
async function sync(body = {}, env = ENV, auth = `Bearer ${ENV.GOAKAL_SYNC_SECRET}`) {
  const r = res();
  await createSyncHandler(deps(env))({ method: 'POST', headers: { authorization: auth }, body }, r);
  return r;
}
const vouchers = () => db.all('vouchers');
const orders = () => db.all('goakalOrders');

beforeEach(() => {
  db = new FakeDb(); clock = T0; db.now = () => clock;
  emails = []; logs = []; resendFails = 0; goakalRows = [];
});

describe('Skenario 1 & 3 — satu transaksi PAID, email Resend berhasil', () => {
  it('membuat tepat satu order, satu voucher sekali-pakai terikat email, dan satu email lengkap', async () => {
    const r = await webhook(payload());
    expect(r.statusCode).toBe(200);
    expect(r.json).toEqual({ ok: true, status: 'sent' });
    expect(vouchers()).toHaveLength(1);
    const v = vouchers()[0];
    expect(v).toMatchObject({ plan: 'boost', maxUses: 1, uses: 0, active: true, assignedEmail: 'rani.uji@contoh-uji.id', source: 'goakal', sourcePaymentId: 'AKL-TEST1', batch: 'goakal-auto' });
    expect(v.code).toMatch(/^BOOST-[A-HJ-KM-NP-Z2-9]{10}$/);
    expect(v.expiresAt.toMillis()).toBe(T0 + 30 * 86_400_000);
    expect(orders()).toHaveLength(1);
    expect(orders()[0]).toMatchObject({ state: 'issued', emailStatus: 'sent', plan: 'boost', voucherCode: v.code, transactionId: 'cmtesttransaction00000001' });
    expect(emails).toHaveLength(1);
    const mail = emails[0];
    expect(mail.to).toEqual(['rani.uji@contoh-uji.id']);
    expect(mail.subject).toContain('GenZ Boost');
    expect(mail.html).toContain(v.code);
    expect(mail.html).toContain(`https://contoh-uji.vercel.app/voucher?code=${v.code}`);
    expect(mail.html).toContain('Masuk memakai email <strong>rani.uji@contoh-uji.id</strong>');
    expect(mail.text).toContain(v.code);
    expect(mail.key).toBe(`goakal-voucher/${orderIdFor('AKL-TEST1')}`);
  });

  it('respons & log tidak membocorkan kode voucher, email lengkap, atau token', async () => {
    const r = await webhook(payload());
    const code = vouchers()[0].code;
    const everything = r.body + logs.map((l) => l.text).join('\n');
    expect(everything).not.toContain(code);
    expect(everything).not.toContain('rani.uji@contoh-uji.id');
    expect(everything).not.toContain(ENV.GOAKAL_WEBHOOK_TOKEN);
    expect(everything).not.toContain(ENV.RESEND_API_KEY);
  });

  it('price scheme Spark & Impact dipetakan ke paket yang benar', async () => {
    await webhook(payload({}, { paymentId: 'AKL-S', priceScheme: { id: PS.spark, name: 'GenZ Spark' } }));
    await webhook(payload({}, { paymentId: 'AKL-I', priceScheme: { id: PS.impact, name: 'GENZ IMPACT' } }));
    expect(vouchers().map((v) => v.plan).sort()).toEqual(['impact', 'spark']);
  });

  it('webinar only (ignore) dan service lain tidak membuat voucher, email, atau dokumen', async () => {
    expect((await webhook(payload({}, { paymentId: 'AKL-W', priceScheme: { id: PS.webinar, name: 'Webinar Only' } }))).json.status).toBe('ignored');
    expect((await webhook(payload({}, { paymentId: 'AKL-O', service: { id: 'cmotherservice00000000001', name: 'Lain' } }))).json.status).toBe('ignored');
    expect((await webhook(payload({}, { paymentId: 'AKL-P', status: 'PENDING' }))).json.status).toBe('ignored');
    expect(db.docs.size).toBe(0);
    expect(emails).toHaveLength(0);
  });
});

describe('Skenario 2 — webhook duplikat', () => {
  it('kiriman ulang berurutan tidak membuat voucher atau email kedua', async () => {
    await webhook(payload());
    const second = await webhook(payload({ idempotencyKey: 'idem-2' }));
    expect(second.statusCode).toBe(200);
    expect(second.json.status).toBe('already_sent');
    expect(vouchers()).toHaveLength(1);
    expect(emails).toHaveLength(1);
  });

  it('kiriman bersamaan (race) tetap satu voucher dan satu email', async () => {
    const results = await Promise.all([webhook(payload()), webhook(payload()), webhook(payload())]);
    expect(results.every((r) => r.statusCode === 200)).toBe(true);
    expect(vouchers()).toHaveLength(1);
    expect(orders()).toHaveLength(1);
    expect(emails).toHaveLength(1);
  });
});

describe('Skenario 4 — Resend gagal lalu retry', () => {
  it('gagal → 500 (GoAkal mengulang) tanpa voucher ganda; retry memakai data order tersimpan walau mapping berubah', async () => {
    resendFails = 1;
    const first = await webhook(payload());
    expect(first.statusCode).toBe(500);
    expect(first.body).not.toContain('Resend');
    expect(orders()[0]).toMatchObject({ emailStatus: 'failed', state: 'issued' });
    expect(orders()[0].lastEmailError).toContain('Resend gagal (500');
    const code = vouchers()[0].code;

    // Admin mengubah mapping setelah order terbit: Boost kini dianggap Impact, bahkan dihapus dari map.
    const changed = { ...ENV, GOAKAL_PRICE_MAP: JSON.stringify({ [PS.boost]: 'impact', [PS.spark]: 'spark' }) };
    const retry = await webhook(payload(), changed);
    expect(retry.json.status).toBe('sent');
    expect(vouchers()).toHaveLength(1);
    expect(emails).toHaveLength(1);
    expect(emails[0].subject).toContain('GenZ Boost');
    expect(emails[0].html).toContain(code);

    const removed = { ...ENV, GOAKAL_PRICE_MAP: JSON.stringify({ [PS.spark]: 'spark' }) };
    expect((await webhook(payload(), removed)).json.status).toBe('already_sent');
  });

  it('retry email lewat sync juga berjalan, dan lease mencegah dua pengiriman bersamaan', async () => {
    resendFails = 1;
    await webhook(payload());
    goakalRows = [{ paymentId: 'AKL-TEST1', status: 'PAID', payerEmail: 'rani.uji@contoh-uji.id', payerName: 'Rani Uji', serviceCuid: SERVICE, priceSchemeCuid: PS.boost, priceSchemeTitle: 'GENZ BOOST', incomingAmount: 99000 }];
    const r = await sync();
    expect(r.json.summary.sent).toBe(1);
    expect(emails).toHaveLength(1);
  });

  it('lease yang masih aktif membuat kiriman lain menunggu; lease kedaluwarsa boleh diambil alih', async () => {
    resendFails = 1;
    await webhook(payload());
    await db.ref(`goakalOrders/${orderIdFor('AKL-TEST1')}`).update({ emailStatus: 'sending', emailLeaseUntilMs: T0 + 60_000 });
    expect((await webhook(payload())).json.status).toBe('email_in_progress');
    clock = T0 + 120_000;
    expect((await webhook(payload())).json.status).toBe('sent');
    expect(emails).toHaveLength(1);
  });
});

describe('Skenario 5 — Price Scheme ID belum dipetakan', () => {
  it('dicatat sebagai blocked (200, tidak retry tanpa akhir), lalu terbit setelah mapping diperbaiki', async () => {
    const r = await webhook(payload({}, { paymentId: 'AKL-NEW', priceScheme: { id: PS.unmapped, name: 'Paket Baru' } }));
    expect(r.statusCode).toBe(200);
    expect(r.json.status).toBe('blocked');
    expect(vouchers()).toHaveLength(0);
    expect(orders()[0]).toMatchObject({ state: 'blocked', blockReason: 'price_scheme_belum_dipetakan' });
    expect(logs.some((l) => l.level === 'warn' && l.text.includes('price_scheme_belum_dipetakan'))).toBe(true);

    const fixed = { ...ENV, GOAKAL_PRICE_MAP: JSON.stringify({ ...JSON.parse(ENV.GOAKAL_PRICE_MAP), [PS.unmapped]: 'spark' }) };
    goakalRows = [{ paymentId: 'AKL-NEW', status: 'PAID', payerEmail: 'rani.uji@contoh-uji.id', serviceCuid: SERVICE, priceSchemeCuid: PS.unmapped, priceSchemeTitle: 'Paket Baru' }];
    const s = await sync({}, fixed);
    expect(s.json.summary.sent).toBe(1);
    expect(vouchers()).toHaveLength(1);
    expect(orders()[0].state).toBe('issued');
    expect(orders()[0].blockReason).toBeUndefined();
  });
});

describe('Skenario 6 — email pembeli kosong / tidak valid', () => {
  it.each([[''], ['bukan-email'], ['a@b']])('email %j → blocked, tanpa voucher & email', async (email) => {
    const r = await webhook(payload({}, { user: { name: 'X', email } }));
    expect(r.statusCode).toBe(200);
    expect(r.json.status).toBe('blocked');
    expect(orders()[0].blockReason).toBe('email_pembeli_tidak_valid');
    expect(vouchers()).toHaveLength(0);
    expect(emails).toHaveLength(0);
  });

  it('payload tanpa paymentId ditolak 400 dan TIDAK memakai data.id sebagai pengganti', async () => {
    const r = await webhook(payload({}, { paymentId: '' }));
    expect(r.statusCode).toBe(400);
    expect(db.docs.size).toBe(0);
  });
});

describe('Skenario 7 — paymentId sama, payload berbeda', () => {
  it('data tersimpan dipertahankan, konflik dicatat, tidak ada voucher/email ke alamat baru', async () => {
    await webhook(payload());
    const r = await webhook(payload({}, { user: { name: 'Penyusup', email: 'lain@contoh-uji.id' }, priceScheme: { id: PS.impact, name: 'GENZ IMPACT' } }));
    expect(r.statusCode).toBe(200);
    expect(r.json.status).toBe('already_sent');
    expect(vouchers()).toHaveLength(1);
    expect(vouchers()[0]).toMatchObject({ plan: 'boost', assignedEmail: 'rani.uji@contoh-uji.id' });
    expect(emails).toHaveLength(1);
    expect(orders()[0]).toMatchObject({ payerEmail: 'rani.uji@contoh-uji.id', conflictCount: 1, lastConflictFields: ['payerEmail', 'priceSchemeId'] });
    expect(logs.map((l) => l.text).join('\n')).not.toContain('lain@contoh-uji.id');
  });
});

describe('Skenario 9 & 10 — endpoint sync', () => {
  const row = (paymentId, status = 'PAID', ps = PS.spark) => ({ paymentId, status, payerEmail: `${paymentId.toLowerCase()}@contoh-uji.id`, payerName: 'Uji', serviceCuid: SERVICE, serviceTitle: 'Webinar B1', priceSchemeCuid: ps, priceSchemeTitle: 'GenZ Spark', incomingAmount: 49000, paidAt: '2026-10-19T02:00:00.000Z' });

  it('menemukan transaksi PAID & SETTLED yang webhook-nya terlewat', async () => {
    goakalRows = [row('AKL-A'), row('AKL-B', 'SETTLED'), row('AKL-W', 'PAID', PS.webinar), row('AKL-X', 'PENDING')];
    const r = await sync();
    expect(r.statusCode).toBe(200);
    expect(r.json.complete).toBe(true);
    expect(r.json.summary).toMatchObject({ sent: 2, ignored: 1, failed: 0 });
    expect(vouchers()).toHaveLength(2);
    expect(emails).toHaveLength(2);
    expect(r.body).not.toContain('@contoh-uji.id');
  });

  it('dipanggil dua kali → panggilan kedua tidak membuat voucher atau email baru', async () => {
    goakalRows = [row('AKL-A'), row('AKL-B', 'SETTLED')];
    await sync();
    const second = await sync();
    expect(second.json.summary).toMatchObject({ sent: 0, skippedComplete: 2 });
    expect(vouchers()).toHaveLength(2);
    expect(emails).toHaveLength(2);
  });

  it('webhook lalu sync untuk transaksi yang sama → tetap satu', async () => {
    await webhook(payload({}, { paymentId: 'AKL-A', priceScheme: { id: PS.spark, name: 'GenZ Spark' }, user: { name: 'Uji', email: 'akl-a@contoh-uji.id' } }));
    goakalRows = [row('AKL-A')];
    const r = await sync();
    expect(r.json.summary.skippedComplete).toBe(1);
    expect(vouchers()).toHaveLength(1);
    expect(emails).toHaveLength(1);
  });

  it('paginasi >100 baris dan mode dry-run tidak menulis apa pun', async () => {
    goakalRows = Array.from({ length: 230 }, (_, i) => row(`AKL-${i}`));
    db.readOnly = true;
    const dry = await sync({ mode: 'dry-run' });
    expect(dry.json.summary.wouldProcess).toBe(230);
    expect(dry.json.summary.pages).toBe(4); // 3 halaman PAID + 1 halaman SETTLED kosong
    expect(db.docs.size).toBe(0);
    expect(emails).toHaveLength(0);
    expect(dry.body).not.toContain('akl-1@contoh-uji.id');
    db.readOnly = false;
  });

  it('berhenti sebelum batas waktu dan memberi titik resume yang bisa dilanjutkan', async () => {
    goakalRows = Array.from({ length: 150 }, (_, i) => row(`AKL-${i}`));
    let ticks = 0;
    const d = deps();
    d.now = () => T0 + (ticks++ > 120 ? 60_000 : 0);
    const r1 = res();
    await createSyncHandler(d)({ method: 'POST', headers: { authorization: `Bearer ${ENV.GOAKAL_SYNC_SECRET}` }, body: {} }, r1);
    expect(r1.json.complete).toBe(false);
    expect(r1.json.resume).toMatchObject({ serviceId: SERVICE, status: 'PAID' });
    const r2 = await sync({ resume: r1.json.resume });
    expect(r2.json.complete).toBe(true);
    expect(vouchers()).toHaveLength(150);
    expect(emails).toHaveLength(150);
  });

  it('check-config melaporkan price scheme yang belum dipetakan & ID map yang salah ketik', async () => {
    const env = { ...ENV, GOAKAL_PRICE_MAP: JSON.stringify({ [PS.spark]: 'spark', cmsalahketik0000000000001: 'boost' }) };
    const r = await sync({ mode: 'check-config' }, env);
    expect(r.statusCode).toBe(200);
    expect(r.json.ok).toBe(false);
    expect(r.json.unknownMapKeys).toEqual(['cmsalahketik0000000000001']);
    expect(r.json.unmapped).toContain(PS.boost);
    expect(r.json.firebase.error).toMatch(/project_id/);
    expect(db.docs.size).toBe(0);
  });

  it('menolak tanpa Bearer secret yang benar', async () => {
    expect((await sync({}, ENV, '')).statusCode).toBe(401);
    expect((await sync({}, ENV, 'Bearer salah')).statusCode).toBe(401);
    expect(db.docs.size).toBe(0);
  });
});

describe('Keamanan & konfigurasi', () => {
  it('token webhook salah → 401 tanpa menulis apa pun', async () => {
    const r = await webhook(payload({ token: 'salah' }));
    expect(r.statusCode).toBe(401);
    expect(db.docs.size).toBe(0);
  });

  it('environment kurang → 500 dengan pesan umum; log hanya berisi NAMA variabel', async () => {
    const env = { ...ENV, RESEND_API_KEY: '', GOAKAL_PRICE_MAP: '{bukan json' };
    const r = await webhook(payload(), env);
    expect(r.statusCode).toBe(500);
    expect(r.json).toEqual({ error: 'Server belum dikonfigurasi' });
    const logText = logs.map((l) => l.text).join('\n');
    expect(logText).toContain('RESEND_API_KEY kosong');
    expect(logText).toContain('GOAKAL_PRICE_MAP bukan JSON');
    expect(logText).not.toContain(ENV.VOUCHER_CODE_SECRET);
  });

  it('method selain POST ditolak', async () => {
    const r = res();
    await createWebhookHandler(deps())({ method: 'GET', headers: {} }, r);
    expect(r.statusCode).toBe(405);
  });

  it('body string/Buffer dari Vercel tetap terbaca', async () => {
    expect((await webhook(JSON.stringify(payload()))).json.status).toBe('sent');
    expect((await webhook(Buffer.from(JSON.stringify(payload())))).json.status).toBe('already_sent');
    expect((await webhook('{rusak')).statusCode).toBe(400);
  });
});
