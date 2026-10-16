import { describe, expect, it } from 'vitest';
import { calculatePricing, roundNice, type PricingInput } from './pricing';

const base: PricingInput = { price: 5000, variableCost: 2000, fixedCost: 900000, hoursPerUnit: 0, targetIncome: 0, hoursPerMonth: 0, discountPct: 0 };

describe('calculatePricing', () => {
  it('contoh es teh di Business 101: BEP 300 gelas/bulan = 10/hari', () => {
    const r = calculatePricing(base);
    expect(r.margin).toBe(3000);
    expect(r.marginPct).toBe(60);
    expect(r.bepUnits).toBe(300);
    expect(r.bepPerDay).toBe(10);
  });
  it('margin ≤ 0 → BEP tidak ada', () => {
    const r = calculatePricing({ ...base, variableCost: 6000 });
    expect(r.bepUnits).toBeNull();
    expect(r.margin).toBe(-1000);
  });
  it('harga per jam & harga lantai (contoh desain feed)', () => {
    const r = calculatePricing({ ...base, price: 250000, variableCost: 20000, hoursPerUnit: 4, targetIncome: 2000000, hoursPerMonth: 40 });
    expect(r.hourlyRate).toBe(50000);
    expect(r.floorPrice).toBe(220000);
    expect(r.belowFloor).toBe(false);
    expect(calculatePricing({ ...base, price: 75000, variableCost: 0, hoursPerUnit: 3, targetIncome: 2000000, hoursPerMonth: 40 }).belowFloor).toBe(true);
  });
  it('diskon 20% pada margin 40% → harus jual 2x lipat', () => {
    const r = calculatePricing({ ...base, price: 100000, variableCost: 60000, discountPct: 20 });
    expect(r.discountedPrice).toBe(80000);
    expect(r.discountedMargin).toBe(20000);
    expect(r.discountVolumeMultiplier).toBe(2);
  });
  it('diskon yang menghabiskan margin → multiplier null', () => {
    expect(calculatePricing({ ...base, discountPct: 70 }).discountVolumeMultiplier).toBeNull();
  });
  it('3 paket dibulatkan rapi', () => {
    const r = calculatePricing({ ...base, price: 400000, variableCost: 0 });
    expect(r.packages.map((p) => p.price)).toEqual([260000, 400000, 640000]);
    expect(roundNice(12345)).toBe(12000);
    expect(roundNice(123456)).toBe(125000);
  });
  it('menolak input tidak valid', () => {
    expect(() => calculatePricing({ ...base, price: 0 })).toThrow();
    expect(() => calculatePricing({ ...base, discountPct: 120 })).toThrow();
  });
});
