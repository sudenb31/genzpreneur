import { describe, expect, it } from 'vitest';
import { normalizeApiTransaction, normalizeWebhook, parsePriceMap, safeEqual, validatePaidTransaction, voucherCode } from './goakal-core.js';

describe('GoAkal server integration', () => {
  it('memetakan price scheme hanya ke paket yang dikenal', () => {
    expect(parsePriceMap('{"ps1":"boost"}')).toEqual({ ps1: 'boost' });
    expect(() => parsePriceMap('{"ps1":"vip"}')).toThrow(/tidak valid/);
  });

  it('menghasilkan kode stabil per transaksi tanpa karakter ambigu', () => {
    const first = voucherCode('boost', 'AKL-123', 'rahasia-yang-panjang-sekali-123');
    expect(first).toBe(voucherCode('boost', 'AKL-123', 'rahasia-yang-panjang-sekali-123'));
    expect(first).toMatch(/^BOOST-[A-HJ-KM-NP-Z2-9]{10}$/);
    expect(voucherCode('boost', 'AKL-124', 'rahasia-yang-panjang-sekali-123')).not.toBe(first);
  });

  it('menormalkan webhook dan hanya menerima transaksi PAID yang dipetakan', () => {
    const tx = normalizeWebhook({ event: 'transaction.updated', token: 'x', data: { paymentId: 'AKL-1', status: 'PAID', user: { email: ' Buyer@Mail.com ' }, priceScheme: { id: 'ps1' } } });
    expect(tx.payerEmail).toBe('buyer@mail.com');
    expect(validatePaidTransaction(tx, { ps1: 'spark' })).toEqual({ ignored: false, plan: 'spark' });
    expect(validatePaidTransaction({ ...tx, status: 'PENDING' }, { ps1: 'spark' })).toEqual({ ignored: true });
  });

  it('menormalkan respons API transaksi untuk jalur sinkronisasi', () => {
    const tx = normalizeApiTransaction({ paymentId: 'AKL-2', status: 'SETTLED', payerEmail: 'a@b.id', priceSchemeCuid: 'ps2' });
    expect(tx).toMatchObject({ paymentId: 'AKL-2', status: 'SETTLED', payerEmail: 'a@b.id', priceSchemeId: 'ps2' });
  });

  it('membandingkan token tanpa menerima nilai kosong', () => {
    expect(safeEqual('abc', 'abc')).toBe(true);
    expect(safeEqual('abc', 'abd')).toBe(false);
    expect(safeEqual('', '')).toBe(false);
  });
});

