// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  ConfigError, buildVoucherEmail, decide, isValidEmail, loadConfig, maskEmail, normalizeApiTransaction, normalizeWebhook,
  parsePriceMap, payloadMismatch, redact, safeEqual, voucherCode,
} from './goakal-core.js';

const GOOD_ENV = {
  GOAKAL_WEBHOOK_TOKEN: 'TEST-ONLY-webhook-token-not-real-0001',
  GOAKAL_SYNC_SECRET: 'TEST-ONLY-sync-secret-not-real-00002',
  GOAKAL_API_KEY: 'TEST-ONLY-api-key',
  GOAKAL_SERVICE_IDS: 'cmvaf1zib0000l006kjpdm8x4',
  GOAKAL_PRICE_MAP: '{"cmvanoylm000vlb0665cgbtq8":"ignore","cmvanoynx000zlb06tcftyfdw":"boost"}',
  VOUCHER_CODE_SECRET: 'TEST-ONLY-voucher-secret-not-real-000000003',
  FIREBASE_SERVICE_ACCOUNT_JSON: '{}',
  RESEND_API_KEY: 'TEST-ONLY-resend',
  EMAIL_FROM: 'GenZ Preneur <akses@contoh-uji.id>',
  APP_URL: 'https://contoh-uji.vercel.app/',
};

describe('GoAkal core', () => {
  it('memetakan price scheme hanya ke paket yang dikenal', () => {
    expect(parsePriceMap('{"ps1":"boost","webinar":"ignore"}')).toEqual({ ps1: 'boost', webinar: 'ignore' });
    expect(() => parsePriceMap('{"ps1":"vip"}')).toThrow(/tidak valid/);
    expect(() => parsePriceMap('[]')).toThrow(/object/);
    expect(() => parsePriceMap('{}')).toThrow(/belum diisi/);
  });

  it('menghasilkan kode stabil per transaksi tanpa karakter ambigu', () => {
    const secret = 'TEST-ONLY-voucher-secret-not-real-000000003';
    const first = voucherCode('boost', 'AKL-123', secret);
    expect(first).toBe(voucherCode('boost', 'AKL-123', secret));
    expect(first).toMatch(/^BOOST-[A-HJ-KM-NP-Z2-9]{10}$/);
    expect(voucherCode('boost', 'AKL-124', secret)).not.toBe(first);
    expect(() => voucherCode('vip', 'AKL-1', secret)).toThrow();
  });

  it('normalisasi webhook sesuai payload resmi & tidak fallback ke data.id', () => {
    const tx = normalizeWebhook({ event: 'transaction.updated', token: 'x', data: { id: 'cuidtrx', paymentId: ' AKL-1 ', status: 'paid', user: { email: ' Buyer@Mail.com ' }, priceScheme: { id: 'ps1' }, service: { id: 'svc' } } });
    expect(tx).toMatchObject({ paymentId: 'AKL-1', transactionId: 'cuidtrx', status: 'PAID', payerEmail: 'buyer@mail.com', priceSchemeId: 'ps1', serviceId: 'svc', source: 'webhook' });
    expect(normalizeWebhook({ data: { id: 'cuidtrx' } }).paymentId).toBe('');
    expect(() => normalizeWebhook(null)).toThrow();
    expect(() => normalizeWebhook({ event: 'x' })).toThrow();
  });

  it('normalisasi baris API transaksi untuk sync', () => {
    const tx = normalizeApiTransaction({ paymentId: 'AKL-2', status: 'SETTLED', payerEmail: 'A@B.id', priceSchemeCuid: 'ps2', serviceCuid: 'svc', incomingAmount: 5 });
    expect(tx).toMatchObject({ paymentId: 'AKL-2', status: 'SETTLED', payerEmail: 'a@b.id', priceSchemeId: 'ps2', serviceId: 'svc', amount: 5, source: 'sync' });
  });

  it('decide: PAID & SETTLED lunas; ignore; block untuk mapping/email', () => {
    const cfg = { priceMap: { ps1: 'spark', web: 'ignore' }, serviceIds: ['svc'] };
    const base = { event: 'transaction.updated', status: 'PAID', paymentId: 'P', payerEmail: 'a@b.id', priceSchemeId: 'ps1', serviceId: 'svc' };
    expect(decide(base, cfg)).toEqual({ action: 'issue', plan: 'spark' });
    expect(decide({ ...base, status: 'SETTLED' }, cfg)).toEqual({ action: 'issue', plan: 'spark' });
    expect(decide({ ...base, status: 'PENDING' }, cfg).action).toBe('ignore');
    expect(decide({ ...base, priceSchemeId: 'web' }, cfg)).toEqual({ action: 'ignore', reason: 'price_scheme_ignore' });
    expect(decide({ ...base, serviceId: 'lain' }, cfg)).toEqual({ action: 'ignore', reason: 'service_lain' });
    expect(decide({ ...base, priceSchemeId: 'baru' }, cfg)).toEqual({ action: 'block', reason: 'price_scheme_belum_dipetakan' });
    expect(decide({ ...base, payerEmail: '' }, cfg)).toEqual({ action: 'block', reason: 'email_pembeli_tidak_valid' });
    expect(() => decide({ ...base, paymentId: '' }, cfg)).toThrow(/paymentId/);
  });

  it('payloadMismatch hanya membandingkan field yang terisi', () => {
    const order = { payerEmail: 'a@b.id', priceSchemeId: 'ps1', serviceId: 'svc' };
    expect(payloadMismatch(order, { payerEmail: 'a@b.id', priceSchemeId: 'ps1', serviceId: '' })).toEqual([]);
    expect(payloadMismatch(order, { payerEmail: 'x@b.id', priceSchemeId: 'ps2', serviceId: 'svc' })).toEqual(['payerEmail', 'priceSchemeId']);
  });

  it('membandingkan token tanpa menerima nilai kosong', () => {
    expect(safeEqual('abc', 'abc')).toBe(true);
    expect(safeEqual('abc', 'abd')).toBe(false);
    expect(safeEqual('abc', 'abcd')).toBe(false);
    expect(safeEqual('', '')).toBe(false);
  });

  it('validasi email, masking, dan redaksi pesan error', () => {
    expect(isValidEmail('a@b.id')).toBe(true);
    expect(isValidEmail('a@b')).toBe(false);
    expect(maskEmail('Rani.Uji@Contoh.id')).toBe('r***i@c***h.id');
    const out = redact('gagal untuk rani@contoh.id key re_ABCDEFGHIJKLMN rahasia-panjang-sekali', ['rahasia-panjang-sekali']);
    expect(out).not.toContain('rani@contoh.id');
    expect(out).not.toContain('re_ABCDEFGHIJKLMN');
    expect(out).not.toContain('rahasia-panjang-sekali');
  });

  it('email voucher memuat paket, kode, tombol /voucher?code=, dan instruksi email pembelian', () => {
    const mail = buildVoucherEmail({ paymentId: 'AKL-1', payerEmail: 'a@b.id', payerName: '<script>', plan: 'impact', voucherCode: 'IMPACT-ABCDEFGHJK', voucherExpiresAtMs: Date.UTC(2026, 10, 18) }, 'https://contoh-uji.vercel.app');
    expect(mail.subject).toContain('GenZ Impact');
    expect(mail.html).toContain('IMPACT-ABCDEFGHJK');
    expect(mail.html).toContain('https://contoh-uji.vercel.app/voucher?code=IMPACT-ABCDEFGHJK');
    expect(mail.html).toContain('a@b.id');
    expect(mail.html).not.toContain('<script>');
    expect(mail.text).toContain('satu kali');
  });
});

describe('loadConfig', () => {
  it('menerima konfigurasi lengkap & merapikan APP_URL', () => {
    const cfg = loadConfig(GOOD_ENV, 'sync');
    expect(cfg.appUrl).toBe('https://contoh-uji.vercel.app');
    expect(cfg.serviceIds).toEqual(['cmvaf1zib0000l006kjpdm8x4']);
    expect(cfg.validDays).toBe(30);
  });

  it('menyebut nama variabel yang kurang/salah tanpa menampilkan nilai rahasia', () => {
    const env = { ...GOOD_ENV, RESEND_API_KEY: '', VOUCHER_CODE_SECRET: 'pendek', GOAKAL_SYNC_SECRET: GOOD_ENV.GOAKAL_WEBHOOK_TOKEN, VOUCHER_VALID_DAYS: '0', EMAIL_FROM: 'x@gmail.com', APP_URL: 'http://contoh.id' };
    let err;
    try { loadConfig(env, 'sync'); } catch (e) { err = e; }
    expect(err).toBeInstanceOf(ConfigError);
    expect(err.missing).toEqual(['RESEND_API_KEY']);
    expect(err.message).toMatch(/VOUCHER_CODE_SECRET minimal 32/);
    expect(err.message).toMatch(/harus berbeda/);
    expect(err.message).toMatch(/VOUCHER_VALID_DAYS/);
    expect(err.message).toMatch(/gmail/);
    expect(err.message).toMatch(/APP_URL/);
    expect(err.message).not.toContain(GOOD_ENV.GOAKAL_WEBHOOK_TOKEN);
  });

  it('mendeteksi ID yang bukan format cuid (mis. tertempel judul atau spasi)', () => {
    expect(() => loadConfig({ ...GOOD_ENV, GOAKAL_PRICE_MAP: '{"GenZ Boost":"boost"}' }, 'webhook')).toThrow(/cuid/);
    expect(() => loadConfig({ ...GOOD_ENV, GOAKAL_SERVICE_IDS: 'webinar-b1' }, 'sync')).toThrow(/cuid/);
  });

  it('grup webhook tidak mewajibkan API key / sync secret', () => {
    const env = { ...GOOD_ENV, GOAKAL_API_KEY: '', GOAKAL_SYNC_SECRET: '', GOAKAL_SERVICE_IDS: '' };
    expect(() => loadConfig(env, 'webhook')).not.toThrow();
    expect(() => loadConfig(env, 'sync')).toThrow(/GOAKAL_API_KEY kosong/);
  });
});
