import { describe, expect, it } from 'vitest';
import { buildProposal, calculateCommission } from './commission';

describe('calculateCommission', () => {
  it('komisi dari harga jual', () => {
    const r = calculateCommission({ price: 150_000, cost: 90_000, commissionPct: 10, basis: 'price', units: 20, target: 500_000 });
    expect(r.revenue).toBe(3_000_000);
    expect(r.grossProfit).toBe(1_200_000);
    expect(r.commissionPerUnit).toBe(15_000);
    expect(r.totalCommission).toBe(300_000);
    expect(r.ownerProfitAfterCommission).toBe(900_000);
    expect(r.unitsForTarget).toBe(34); // 500.000 / 15.000 = 33,3 → 34
  });
  it('komisi dari laba', () => {
    const r = calculateCommission({ price: 150_000, cost: 90_000, commissionPct: 30, basis: 'profit', units: 10, target: 180_000 });
    expect(r.commissionPerUnit).toBe(18_000);
    expect(r.totalCommission).toBe(180_000);
    expect(r.unitsForTarget).toBe(10); // tepat, tidak dibulatkan ke 11
  });
  it('target 0 atau komisi 0 → unitsForTarget null', () => {
    expect(calculateCommission({ price: 100, cost: 0, commissionPct: 10, basis: 'price', units: 1, target: 0 }).unitsForTarget).toBeNull();
    expect(calculateCommission({ price: 100, cost: 0, commissionPct: 0, basis: 'price', units: 1, target: 50 }).unitsForTarget).toBeNull();
  });
  it('mendeteksi skema yang merugikan pemilik', () => {
    const r = calculateCommission({ price: 100_000, cost: 95_000, commissionPct: 20, basis: 'price', units: 1, target: 0 });
    expect(r.ownerProfitAfterCommission).toBe(-15_000);
  });
  it('validasi input', () => {
    expect(() => calculateCommission({ price: 0, cost: 0, commissionPct: 10, basis: 'price', units: 1, target: 0 })).toThrow();
    expect(() => calculateCommission({ price: 100, cost: 0, commissionPct: 101, basis: 'price', units: 1, target: 0 })).toThrow();
    expect(() => calculateCommission({ price: 100, cost: 200, commissionPct: 10, basis: 'profit', units: 1, target: 0 })).toThrow();
    expect(() => calculateCommission({ price: 100, cost: 0, commissionPct: 10, basis: 'price', units: 1.5, target: 0 })).toThrow();
  });
});

describe('buildProposal', () => {
  it('menyusun rincian & tidak menjanjikan hasil', () => {
    const t = buildProposal({ myName: 'Rani', myContact: '', client: 'Kopi Senja', problem: 'x', service: 'y', deliverables: 'A\n\nB', duration: '1 bulan', price: 'Rp500.000', scheme: 'fee', revisions: '2' });
    expect(t).toContain('1. A');
    expect(t).toContain('2. B');
    expect(t).toContain('tidak menjanjikan');
  });
});
