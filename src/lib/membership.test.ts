import { describe, expect, it } from 'vitest';
import {
  availableTrial, buildTrial, canUse, effectivePlan, FEATURE_MIN, formatRemaining, memberStatus, moduleFeature,
  trialState, type Membership,
} from './membership';
import { SITE } from '../config/site';

const now = new Date('2026-10-16T10:00:00Z');
const H = 3_600_000;
const base: Membership = { email: 'a@b.c', name: 'A', plan: 'spark', trial: null, trialsUsed: { boost: false, impact: false }, note: '', updatedAt: null };

describe('trial', () => {
  it('Spark → trial Boost 3 hari; Boost → trial Impact 7 hari; Impact tidak ada trial', () => {
    expect(availableTrial(base, now)).toEqual({ plan: 'boost', days: 3 });
    expect(availableTrial({ ...base, plan: 'boost' }, now)).toEqual({ plan: 'impact', days: 7 });
    expect(availableTrial({ ...base, plan: 'impact' }, now)).toBeNull();
    expect(availableTrial({ ...base, plan: 'none' }, now)).toBeNull();
  });
  it('trial hanya sekali per akun', () => {
    expect(availableTrial({ ...base, trialsUsed: { boost: true, impact: false } }, now)).toBeNull();
  });
  it('status: aktif → ≤24 jam → habis, dan paket efektif ikut berubah', () => {
    const t = buildTrial('boost', 3, now);
    const m = { ...base, trial: t };
    expect(t.endsAt.getTime() - now.getTime()).toBe(72 * H);
    expect(trialState(m, now)).toBe('active');
    expect(effectivePlan(m, now)).toBe('boost');
    const later = new Date(now.getTime() + 60 * H);
    expect(trialState(m, later)).toBe('ending');
    expect(memberStatus(m, later)).toBe('trial_ending');
    const after = new Date(now.getTime() + 73 * H);
    expect(trialState(m, after)).toBe('expired');
    expect(effectivePlan(m, after)).toBe('spark');
    expect(memberStatus(m, after)).toBe('trial_expired');
  });
  it('trial habis tapi sudah upgrade → status Aktif, bukan follow-up', () => {
    const m = { ...base, plan: 'boost' as const, trial: buildTrial('boost', 3, new Date(now.getTime() - 100 * H)) };
    expect(memberStatus(m, now)).toBe('paid');
  });
  it('format sisa waktu', () => {
    expect(formatRemaining(2 * 24 * H + 4 * H)).toBe('2 hari 4 jam');
    expect(formatRemaining(5 * H + 12 * 60_000)).toBe('5 jam 12 menit');
    expect(formatRemaining(0)).toBe('berakhir');
  });
});

describe('akses fitur', () => {
  it('mode Terbuka: semua fitur terbuka', () => {
    expect(canUse('season4', { gatingEnabled: false, isAdmin: false, plan: 'none' })).toBe(true);
  });
  it('mode Sesuai paket', () => {
    const c = (plan: Membership['plan']) => ({ gatingEnabled: true, isAdmin: false, plan });
    expect(canUse('passport', c('none'))).toBe(true);
    expect(canUse('business101', c('none'))).toBe(false);
    expect(canUse('business101', c('spark'))).toBe(true);
    expect(canUse('toolkit', c('spark'))).toBe(false);
    expect(canUse('toolkit', c('boost'))).toBe(true);
    expect(canUse('season4', c('boost'))).toBe(false);
    expect(canUse('season4', c('impact'))).toBe(true);
    expect(canUse('season4', { gatingEnabled: true, isAdmin: true, plan: 'none' })).toBe(true);
  });
  it('modul dipetakan ke fitur yang benar', () => {
    expect(moduleFeature({ slug: 'business-101', season: 1 })).toBe('business101');
    expect(moduleFeature({ slug: 'lead-the-squad', season: 4 })).toBe('season4');
  });
  it('isi paket di landing konsisten dengan pembatasan fitur', () => {
    const plans = SITE.plans.map((p) => p.key);
    expect(plans).toEqual(['spark', 'boost', 'impact']);
    expect(FEATURE_MIN.toolkit).toBe('boost');
    expect(SITE.plans[1].features.join(' ')).toMatch(/Toolkit/);
    expect(SITE.plans[2].features.join(' ')).toMatch(/Season 4/);
  });
});
