import { describe, expect, it } from 'vitest';
import { generateCodes, normalizeCode, randomCode, VOUCHER_RE, voucherProblem, type Voucher } from './voucher';

const now = new Date('2026-10-16T10:00:00Z');
const v: Voucher = { code: 'BOOST-ABCD2345', plan: 'boost', maxUses: 10, uses: 3, active: true, expiresAt: null, batch: '', note: '', createdAt: null };

describe('kode voucher', () => {
  it('format & normalisasi', () => {
    expect(normalizeCode(' boost-ab cd ')).toBe('BOOST-ABCD');
    expect(VOUCHER_RE.test(randomCode('gzp'))).toBe(true);
    expect(randomCode('', 8, () => 0)).toBe('AAAAAAAA');
    expect(randomCode('spark!', 4, () => 0)).toBe('SPARK-AAAA');
  });
  it('kode massal unik & tanpa karakter membingungkan', () => {
    const codes = generateCodes('GZP', 200);
    expect(new Set(codes).size).toBe(200);
    for (const c of codes) expect(c.split('-')[1]).not.toMatch(/[01OIL]/);
  });
});

describe('validasi penukaran', () => {
  it('valid untuk peserta tanpa paket / paket lebih rendah', () => {
    expect(voucherProblem(v, 'none', now)).toBeNull();
    expect(voucherProblem(v, 'spark', now)).toBeNull();
  });
  it('ditolak: tidak ada, nonaktif, kedaluwarsa, kuota habis, tidak menaikkan paket', () => {
    expect(voucherProblem(null, 'none', now)).toBe('not_found');
    expect(voucherProblem({ ...v, active: false }, 'none', now)).toBe('inactive');
    expect(voucherProblem({ ...v, expiresAt: new Date('2026-10-01') }, 'none', now)).toBe('expired');
    expect(voucherProblem({ ...v, uses: 10 }, 'none', now)).toBe('used_up');
    expect(voucherProblem(v, 'boost', now)).toBe('not_higher');
    expect(voucherProblem(v, 'impact', now)).toBe('not_higher');
  });
  it('voucher pembelian hanya berlaku untuk email pembeli', () => {
    const assigned = { ...v, assignedEmail: 'buyer@mail.id' };
    expect(voucherProblem(assigned, 'none', now, 'other@mail.id')).toBe('wrong_email');
    expect(voucherProblem(assigned, 'none', now, ' Buyer@Mail.ID ')).toBeNull();
  });
});
