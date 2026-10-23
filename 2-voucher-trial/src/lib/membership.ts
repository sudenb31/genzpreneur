/**
 * Paket, trial, dan hak akses fitur — logika murni (tanpa Firebase) supaya bisa dites.
 *
 * Paket:   none (diundang, belum punya paket) < spark < boost < impact
 * Trial:   pemilik Spark bisa mencoba Boost 3 hari; pemilik Boost bisa mencoba Impact 7 hari.
 *          Masing-masing sekali per akun. Trial berakhir OTOMATIS karena dihitung dari waktu
 *          (endsAt), tidak perlu ada yang mematikan secara manual.
 */
export const PLAN_KEYS = ['none', 'spark', 'boost', 'impact'] as const;
export type PlanKey = (typeof PLAN_KEYS)[number];
/** Trial mandiri (dari Dashboard) hanya ke Boost/Impact; trial dari voucher webinar bisa juga Spark. */
export type SelfTrialPlan = 'boost' | 'impact';
export type TrialPlan = 'spark' | SelfTrialPlan;

export const PLAN_INFO: Record<PlanKey, { name: string; emoji: string; tile: string }> = {
  none: { name: 'Belum ada paket', emoji: '🔒', tile: 'bg-paper-2' },
  spark: { name: 'GenZ Spark', emoji: '⚡', tile: 'bg-lime' },
  boost: { name: 'GenZ Boost', emoji: '🚀', tile: 'bg-sky' },
  impact: { name: 'GenZ Impact', emoji: '🎯', tile: 'bg-pink' },
};

/** Trial yang bisa diberikan sesuai paket saat ini. */
export const TRIAL_OFFER: Partial<Record<PlanKey, { plan: SelfTrialPlan; days: number }>> = {
  spark: { plan: 'boost', days: 3 },
  boost: { plan: 'impact', days: 7 },
};

export interface Trial { plan: TrialPlan; days: number; startedAt: Date; endsAt: Date }

export interface Membership {
  email: string;
  name: string;
  plan: PlanKey;
  trial: Trial | null;
  /** spark & voucher hanya ada (true) bila pernah dipakai — dokumen lama cukup { boost, impact }. */
  trialsUsed: { boost: boolean; impact: boolean; spark?: boolean; voucher?: boolean };
  note: string;
  updatedAt: Date | null;
}

export const isPlanKey = (v: unknown): v is PlanKey => typeof v === 'string' && (PLAN_KEYS as readonly string[]).includes(v);
export const rank = (p: PlanKey) => PLAN_KEYS.indexOf(p);
export const normalizeEmail = (e: string) => e.trim().toLowerCase();

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export type TrialState = 'none' | 'active' | 'ending' | 'expired';

/** active = lebih dari 24 jam lagi · ending = ≤ 24 jam lagi · expired = sudah lewat. */
export function trialState(m: Pick<Membership, 'trial'> | null, now: Date): TrialState {
  if (!m?.trial) return 'none';
  const left = m.trial.endsAt.getTime() - now.getTime();
  if (left <= 0) return 'expired';
  return left <= DAY ? 'ending' : 'active';
}

export function trialMsLeft(m: Pick<Membership, 'trial'> | null, now: Date): number {
  return m?.trial ? Math.max(0, m.trial.endsAt.getTime() - now.getTime()) : 0;
}

/** Paket yang berlaku sekarang = yang tertinggi antara paket berbayar dan trial yang masih aktif. */
export function effectivePlan(m: Pick<Membership, 'plan' | 'trial'> | null, now: Date): PlanKey {
  if (!m) return 'none';
  const s = trialState(m, now);
  if (m.trial && (s === 'active' || s === 'ending') && rank(m.trial.plan) > rank(m.plan)) return m.trial.plan;
  return m.plan;
}

/** Trial apa yang masih boleh diberikan (null bila tidak ada). */
export function availableTrial(m: Pick<Membership, 'plan' | 'trial' | 'trialsUsed'> | null, now: Date) {
  if (!m) return null;
  const offer = TRIAL_OFFER[m.plan];
  if (!offer) return null;
  if (m.trialsUsed[offer.plan]) return null;
  const s = trialState(m, now);
  if (s === 'active' || s === 'ending') return null;
  return offer;
}

export function buildTrial(plan: TrialPlan, days: number, now: Date): Trial {
  return { plan, days, startedAt: now, endsAt: new Date(now.getTime() + days * DAY) };
}

export function formatRemaining(ms: number): string {
  if (ms <= 0) return 'berakhir';
  const d = Math.floor(ms / DAY);
  const h = Math.floor((ms % DAY) / HOUR);
  const m = Math.floor((ms % HOUR) / 60_000);
  if (d > 0) return `${d} hari ${h} jam`;
  if (h > 0) return `${h} jam ${m} menit`;
  return `${Math.max(1, m)} menit`;
}

/* ------------------------------ Akses fitur ------------------------------ */

export type FeatureKey =
  | 'passport' | 'assessment'
  | 'business101' | 'season1' | 'actionPlan' | 'dreamPact'
  | 'season2' | 'season3' | 'toolkit' | 'outreach'
  | 'season4' | 'simulator' | 'simulatorTeaser';

/** Paket minimum untuk setiap fitur — harus sama dengan isi paket di landing (src/config/site.ts). */
export const FEATURE_MIN: Record<FeatureKey, PlanKey> = {
  passport: 'none',
  assessment: 'none',
  business101: 'spark',
  season1: 'spark',
  actionPlan: 'spark',
  dreamPact: 'spark',
  season2: 'boost',
  season3: 'boost',
  toolkit: 'boost',
  outreach: 'boost',
  season4: 'impact',
  simulator: 'impact',
  /** Simulasi Founder Level 1 Rintis (10 industri) untuk semua paket — alat upsell ke Impact. */
  simulatorTeaser: 'spark',
};

export const FEATURE_LABEL: Record<FeatureKey, string> = {
  passport: 'Entrepreneur Passport',
  assessment: 'Assessment',
  business101: 'Business 101',
  season1: 'Season 1 — Wake Up',
  actionPlan: 'Misi Pertama',
  dreamPact: 'Dream Pact',
  season2: 'Season 2 — Find Your Why & Edge',
  season3: 'Season 3 — Build & Sell',
  toolkit: 'AI Business Toolkit',
  outreach: 'Outreach Studio',
  season4: 'Season 4 — Lead & Last',
  simulator: 'Simulasi Founder',
  simulatorTeaser: 'Simulasi Founder (Level 1 gratis)',
};

export function moduleFeature(mod: { slug: string; season: number }): FeatureKey {
  if (mod.slug === 'business-101') return 'business101';
  return (`season${mod.season}` as FeatureKey);
}

export interface AccessContext {
  /** false = mode "Terbuka" (pra-launch): semua fitur terbuka untuk semua peserta. */
  gatingEnabled: boolean;
  isAdmin: boolean;
  plan: PlanKey; // paket efektif (sudah termasuk trial aktif)
}

export function canUse(feature: FeatureKey, ctx: AccessContext): boolean {
  if (!ctx.gatingEnabled || ctx.isAdmin) return true;
  return rank(ctx.plan) >= rank(FEATURE_MIN[feature]);
}

/* ------------------------------ Admin: status peserta ------------------------------ */

export type MemberStatus = 'trial_active' | 'trial_ending' | 'trial_expired' | 'paid' | 'no_plan';

export function memberStatus(m: Membership, now: Date): MemberStatus {
  const s = trialState(m, now);
  if (s === 'active') return 'trial_active';
  if (s === 'ending') return 'trial_ending';
  if (s === 'expired' && rank(m.plan) < rank(m.trial!.plan)) return 'trial_expired';
  return m.plan === 'none' ? 'no_plan' : 'paid';
}

export const MEMBER_STATUS_INFO: Record<MemberStatus, { label: string; cls: string }> = {
  trial_active: { label: 'Trial aktif', cls: 'bg-sky' },
  trial_ending: { label: 'Trial ≤ 24 jam', cls: 'bg-amber-soft' },
  trial_expired: { label: 'Trial habis — follow up', cls: 'bg-pink' },
  paid: { label: 'Aktif', cls: 'bg-lime' },
  no_plan: { label: 'Belum ada paket', cls: 'bg-paper-2' },
};
