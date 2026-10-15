import { describe, expect, it } from 'vitest';
import { QUESTIONS } from '../content/assessment';
import { INDUSTRY_KEYS } from '../content/industries';
import { isComplete, scoreAssessment, TRACK_KEYS, type Answers } from './assessment';

const pick = (fn: (q: (typeof QUESTIONS)[number]) => string): Answers => Object.fromEntries(QUESTIONS.map((q) => [q.id, fn(q)]));

describe('konten assessment', () => {
  it('12 pertanyaan, id unik, tiap pertanyaan ≥3 opsi', () => {
    expect(QUESTIONS).toHaveLength(12);
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(12);
    for (const q of QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(new Set(q.options.map((o) => o.id)).size).toBe(q.options.length);
    }
  });
  it('semua bobot menunjuk ke industri & jalur yang valid', () => {
    for (const q of QUESTIONS) for (const o of q.options) {
      for (const k of Object.keys(o.weight.industries ?? {})) expect(INDUSTRY_KEYS).toContain(k);
      for (const k of Object.keys(o.weight.tracks ?? {})) expect(TRACK_KEYS).toContain(k);
    }
  });
  it('setiap industri bisa dicapai (punya bobot di suatu opsi)', () => {
    for (const k of INDUSTRY_KEYS) expect(QUESTIONS.some((q) => q.options.some((o) => (o.weight.industries?.[k] ?? 0) > 0))).toBe(true);
  });
});

describe('scoreAssessment', () => {
  it('menolak jawaban yang belum lengkap', () => {
    expect(isComplete({ q1: 'a' })).toBe(false);
    expect(() => scoreAssessment({ q1: 'a' })).toThrow();
  });
  it('deterministik: jawaban sama → hasil sama', () => {
    const a = pick((q) => q.options[0].id);
    expect(scoreAssessment(a)).toEqual(scoreAssessment(a));
  });
  it('profil kuliner menghasilkan F&B di peringkat 1', () => {
    const a = pick((q) => {
      const best = [...q.options].sort((x, y) => (y.weight.industries?.fnb ?? 0) - (x.weight.industries?.fnb ?? 0))[0];
      return best.id;
    });
    expect(scoreAssessment(a).topIndustries[0]).toBe('fnb');
  });
  it('profil sales menghasilkan jalur Sales Partner', () => {
    const a = pick((q) => [...q.options].sort((x, y) => (y.weight.tracks?.sales_partner ?? 0) - (x.weight.tracks?.sales_partner ?? 0))[0].id);
    const r = scoreAssessment(a);
    expect(r.track).toBe('sales_partner');
    expect(r.trackScores.sales_partner).toBe(100);
  });
  it('skor 0–100, top 3 unik', () => {
    const r = scoreAssessment(pick((q) => q.options[q.options.length - 1].id));
    for (const v of Object.values(r.industryScores)) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(100); }
    expect(new Set(r.topIndustries).size).toBe(3);
  });
});
