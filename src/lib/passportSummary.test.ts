import { describe, expect, it } from 'vitest';
import { emptyPassport, type Passport } from './passport';
import { nextSteps, summarizePassport } from './passportSummary';

const full = (): Passport => {
  const p = emptyPassport('Suden Bahaudin');
  p.personal.businessExperience = 'running';
  p.resources.hoursPerWeek = 25;
  p.resources.devices = ['smartphone', 'laptop', 'stable_internet'];
  p.resources.customerExperience = 'regular';
  p.resources.startBudget = 'above_2m';
  p.skills.levels = { sales: 3, marketing: 3, communication: 3, design: 3, contentCreation: 3, writing: 3, dataAnalytics: 3, aiTools: 3, projectManagement: 3 };
  return p;
};

describe('summarizePassport', () => {
  it('Passport kosong → skor 0, level Starter, semua skill jadi area latihan', () => {
    const s = summarizePassport(emptyPassport('A'));
    expect(s.readiness).toBe(0);
    expect(s.level).toBe('starter');
    expect(s.gaps).toHaveLength(9);
    expect(s.strengths).toHaveLength(0);
  });
  it('Passport maksimal → 100, Runner', () => {
    const s = summarizePassport(full());
    expect(s.readiness).toBe(100);
    expect(s.level).toBe('runner');
    expect(s.parts.reduce((a, x) => a + x.max, 0)).toBe(100);
  });
  it('ambang level: 40 → Builder', () => {
    const p = emptyPassport('A');
    p.resources.hoursPerWeek = 20; // 25
    p.resources.devices = ['smartphone', 'laptop', 'stable_internet']; // 15
    const s = summarizePassport(p);
    expect(s.readiness).toBe(40);
    expect(s.level).toBe('builder');
  });
  it('deterministik', () => {
    expect(summarizePassport(full())).toEqual(summarizePassport(full()));
  });
});

describe('nextSteps', () => {
  it('belum assessment → langkah pertama assessment; maksimal 4; tanpa duplikat', () => {
    const p = emptyPassport('A');
    p.resources.startBudget = 'zero';
    const st = nextSteps(p, summarizePassport(p), false);
    expect(st[0].to).toBe('/app/assessment');
    expect(st.length).toBeLessThanOrEqual(4);
    expect(new Set(st.map((x) => x.to)).size).toBe(st.length);
  });
  it('sudah assessment & siap → tidak menyarankan assessment', () => {
    const p = full();
    const st = nextSteps(p, summarizePassport(p), true);
    expect(st.some((x) => x.to === '/app/assessment')).toBe(false);
    expect(st.some((x) => x.to === '/app/dream-pact')).toBe(true);
  });
});
