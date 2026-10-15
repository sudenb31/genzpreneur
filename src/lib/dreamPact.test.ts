import { describe, expect, it } from 'vitest';
import {
  dreamPactProgress, dreamPactSchema, dreamStatement, edgeStatement, emptyDreamPact, LEVELS, milestoneTimeline,
  normalizeDreamPact, whyStatement,
} from './dreamPact';
import { buildProblemMap, PROBLEM_STEPS } from './problemMap';

describe('milestoneTimeline', () => {
  it('rentang panjang: 0,1,3,5,tengah,mimpi', () => {
    const t = milestoneTimeline(22, 42, 2026);
    expect(t.map((x) => x.age)).toEqual([22, 23, 25, 27, 35, 42]);
    expect(t.map((x) => x.year)).toEqual([2026, 2027, 2029, 2031, 2039, 2046]);
    expect(t.map((x) => x.key)).toEqual(LEVELS.map((l) => l.key));
  });
  it('rentang 7 tahun tetap naik', () => {
    const ages = milestoneTimeline(20, 27, 2026).map((x) => x.age);
    expect(ages).toEqual([20, 21, 23, 25, 26, 27]);
  });
  it('rentang pendek dibagi rata & tidak pernah turun', () => {
    const ages = milestoneTimeline(25, 28, 2026).map((x) => x.age);
    expect(ages[0]).toBe(25);
    expect(ages[5]).toBe(28);
    for (let i = 1; i < ages.length; i++) expect(ages[i]).toBeGreaterThanOrEqual(ages[i - 1]);
  });
  it('menolak usia target ≤ usia sekarang', () => {
    expect(() => milestoneTimeline(25, 25, 2026)).toThrow();
    expect(() => milestoneTimeline(30, 20, 2026)).toThrow();
  });
});

describe('statements', () => {
  it('memakai placeholder bila kosong (tidak mengarang)', () => {
    const p = emptyDreamPact('Rani');
    expect(whyStatement(p)).toContain('[siapa yang kulayani]');
    expect(dreamStatement(p)).toContain('[usia]');
    expect(edgeStatement(p)).toContain('[peranku]');
  });
  it('merangkai isian dengan format UNTUK… SUPAYA…', () => {
    const p = emptyDreamPact('Rani');
    p.why = { concern: '', belief: '', people: 'UMKM keluarga', action: 'membantu jualan online', impact: 'mereka bertahan' };
    expect(whyStatement(p)).toBe('UNTUK membantu jualan online bagi UMKM keluarga, SUPAYA mereka bertahan.');
  });
});

describe('validasi & normalisasi', () => {
  it('usia target harus > usia sekarang', () => {
    const p = emptyDreamPact();
    p.dream.currentAge = 25; p.dream.dreamAge = 20;
    expect(dreamPactSchema.safeParse(p).success).toBe(false);
    p.dream.dreamAge = 40;
    expect(dreamPactSchema.safeParse(p).success).toBe(true);
  });
  it('maksimal 15 agenda', () => {
    const p = emptyDreamPact();
    p.plan = Array.from({ length: 16 }, () => ({ cat: 'cuan' as const, program: 'x', target: '', month: '' }));
    expect(dreamPactSchema.safeParse(p).success).toBe(false);
  });
  it('normalize membuang data rusak', () => {
    expect(normalizeDreamPact(null, 'A').commit.signName).toBe('A');
    expect(normalizeDreamPact({ dream: { currentAge: 'dua puluh' } }, 'A').dream.currentAge).toBeNull();
  });
  it('progress 0% kosong, 100% lengkap', () => {
    const p = emptyDreamPact('Rani');
    expect(dreamPactProgress(p).pct).toBe(0);
    p.why = { concern: 'a', belief: 'b', people: 'c', action: 'd', impact: 'e' };
    p.edge = { strength: 'a', mastery: 'b', role: 'c', problem: 'd' };
    p.dream = { currentAge: 22, dreamAge: 40, build: 'x', who: 'y', feel: 'z', rememberedAs: '' };
    p.milestones = { launch: 'a', firstWin: 'b', repeat: 'c', squad: 'd', legacy: '', unlocked: '' };
    p.skillTree = { brain: 'a', heart: 'b', soul: 'c', body: 'd' };
    p.plan = [1, 2, 3].map(() => ({ cat: 'cuan' as const, program: 'p', target: 't', month: 'Mei' }));
    p.commit = { daily: 'x', weekly: '', buddy: '', signName: 'Rani', signDate: '2026-10-16' };
    expect(dreamPactProgress(p).pct).toBe(100);
  });
});

describe('problem map', () => {
  it('menyusun semua langkah & zona', () => {
    const t = buildProblemMap({ title: 'X', phenomenon: 'a', coreProblem: '', rootCause: '', impact: '', affected: '', firstStep: 'b', zone: 'economy', validation: '' });
    expect(t).toContain('Ekonomi & Harta');
    for (const s of PROBLEM_STEPS) expect(t).toContain(s.label);
    expect(t).toContain('1. Fenomena: a');
  });
});
