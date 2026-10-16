import { describe, expect, it } from 'vitest';
import { calculateHpp, emptyHppInput, HPP_EXAMPLES, roundPriceUp } from './hpp';

describe('calculateHpp — contoh es kopi susu', () => {
  const r = calculateHpp(HPP_EXAMPLES.product.input);
  it('bahan baku per batch & per unit', () => {
    // 43.200 + 57.000 + 22.500 + 8.000
    expect(r.materialPerBatch).toBe(130700);
    expect(r.materialPerUnit).toBe(6535);
    expect(r.materialLines[0]).toEqual({ name: 'Biji kopi', perBatch: 43200, perUnit: 2160 });
  });
  it('HPP variabel, overhead, biaya penuh', () => {
    expect(r.packagingPerUnit).toBe(1300);
    expect(r.laborPerUnit).toBe(1000);
    expect(r.variableCost).toBe(8835);
    expect(r.fixedPerMonth).toBe(850000);
    expect(r.overheadPerUnit).toBe(1417);
    expect(r.fullCost).toBe(10252);
    expect(r.slices.reduce((a, s) => a + s.pct, 0)).toBeCloseTo(100, 0);
  });
  it('harga rekomendasi = biaya penuh ÷ (1 − target laba), dibulatkan ke atas', () => {
    expect(r.recommendedPrice).toBe(14000);
    expect(r.recommended.profitPerUnit).toBeGreaterThan(0);
  });
  it('cek harga Rp15.000: laba, BEP, proyeksi', () => {
    const c = r.check!;
    expect(c.netReceived).toBe(15000);
    expect(c.profitPerUnit).toBe(4748);
    expect(c.contribution).toBe(6165);
    expect(c.bepUnits).toBe(138);
    expect(c.bepPerDay).toBe(5);
    expect(c.monthlyProfit).toBe(2849000);
    expect(c.status).toBe('healthy');
  });
});

describe('calculateHpp — jasa & potongan platform', () => {
  it('contoh jasa desain: harga Rp250rb ternyata margin tipis', () => {
    const r = calculateHpp(HPP_EXAMPLES.service.input);
    expect(r.variableCost).toBe(199000);
    expect(r.fullCost).toBe(239833);
    expect(r.recommendedPrice).toBe(343000);
    expect(r.check!.status).toBe('thin');
  });
  it('potongan platform 20% menurunkan uang diterima dan menaikkan harga rekomendasi', () => {
    const base = HPP_EXAMPLES.product.input;
    const r = calculateHpp({ ...base, platformFeePct: 20, perTransactionCost: 1000 });
    expect(r.check!.netReceived).toBe(15000 * 0.8 - 1000);
    expect(r.recommendedPrice).toBe(roundPriceUp((10251.67 + 1000) / 0.55));
  });
  it('harga di bawah HPP variabel → rugi, BEP tidak ada', () => {
    const r = calculateHpp({ ...HPP_EXAMPLES.product.input, checkPrice: 8000 });
    expect(r.check!.status).toBe('loss');
    expect(r.check!.bepUnits).toBeNull();
  });
  it('validasi: isi kemasan 0 dan potongan + laba ≥ 95% ditolak', () => {
    const e = emptyHppInput('product');
    expect(() => calculateHpp({ ...e, materials: [{ name: 'x', buyPrice: 1000, buyQty: 0, unit: 'g', useQty: 1 }] })).toThrow();
    expect(() => calculateHpp({ ...e, platformFeePct: 50, targetMarginPct: 50 })).toThrow();
  });
  it('pembulatan harga', () => {
    expect(roundPriceUp(8312)).toBe(8400);
    expect(roundPriceUp(13669)).toBe(14000);
    expect(roundPriceUp(342619)).toBe(343000);
  });
});
