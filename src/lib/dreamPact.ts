import { z } from 'zod';

/**
 * DREAM PACT — Pakta Mimpi GenZ Preneur.
 * Komitmen tertulis peserta: WHY, Edge, Dream Statement, 6 level milestone,
 * Skill Tree, rencana 12 bulan, dan janji harian/mingguan. Bisa dicetak.
 */

export const LEVELS = [
  { key: 'launch', emoji: '🚀', name: 'Launch Pad', hint: 'Titik mulai: apa yang kamu kerjakan mulai minggu ini?' },
  { key: 'firstWin', emoji: '💸', name: 'First Win', hint: 'Klien, penjualan, atau penghasilan pertama.' },
  { key: 'repeat', emoji: '🔁', name: 'Repeat Mode', hint: 'Pemasukan rutin & sistem kerja yang sudah jalan.' },
  { key: 'squad', emoji: '🫂', name: 'Squad Up', hint: 'Punya tim, partner, atau mitra tetap.' },
  { key: 'legacy', emoji: '🏛️', name: 'Brand Legacy', hint: 'Bisnismu jadi rujukan di industrinya.' },
  { key: 'unlocked', emoji: '🌟', name: 'Dream Unlocked', hint: 'Dream Statement-mu tercapai.' },
] as const;
export type LevelKey = (typeof LEVELS)[number]['key'];

export const SKILL_BRANCHES = [
  { key: 'brain', emoji: '🧠', name: 'Brain', desc: 'Pengetahuan & skill', ph: 'Digital marketing\nBahasa Inggris\nKeuangan dasar' },
  { key: 'heart', emoji: '❤️', name: 'Heart', desc: 'Emosi & komunikasi', ph: 'Sabar menghadapi klien\nBerani presentasi\nPendengar yang baik' },
  { key: 'soul', emoji: '✨', name: 'Soul', desc: 'Nilai & spiritual', ph: 'Refleksi/ibadah rutin\nJujur dalam transaksi\nBersyukur' },
  { key: 'body', emoji: '💪', name: 'Body', desc: 'Fisik & energi', ph: 'Lari 2x seminggu\nTidur 7 jam\nKurangi gorengan' },
] as const;
export type BranchKey = (typeof SKILL_BRANCHES)[number]['key'];

export const PLAN_CATS = [
  { key: 'levelup', emoji: '📈', name: 'Level Up', desc: 'Membangun kapasitas' },
  { key: 'cuan', emoji: '💸', name: 'Cuan', desc: 'Karier & bisnis' },
  { key: 'impact', emoji: '🌍', name: 'Impact', desc: 'Kontribusi untuk orang lain' },
] as const;
export type PlanCat = (typeof PLAN_CATS)[number]['key'];

export const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'] as const;

const t = (max: number) => z.string().trim().max(max, `Maksimal ${max} karakter`).default('');

export const planRowSchema = z.object({
  cat: z.enum(['levelup', 'cuan', 'impact']),
  program: t(100),
  target: t(100),
  month: t(40),
});
export type PlanRow = z.infer<typeof planRowSchema>;

export const dreamPactSchema = z
  .object({
    why: z.object({ concern: t(300), belief: t(300), people: t(150), action: t(200), impact: t(200) }),
    edge: z.object({ strength: t(150), mastery: t(150), role: t(100), problem: t(200) }),
    dream: z.object({
      currentAge: z.number({ error: 'Isi usiamu sekarang' }).int().min(13, 'Minimal 13').max(80, 'Maksimal 80').nullable().default(null),
      dreamAge: z.number({ error: 'Isi usia target' }).int().min(14).max(100, 'Maksimal 100').nullable().default(null),
      build: t(200),
      who: t(150),
      feel: t(200),
      rememberedAs: t(150),
    }),
    milestones: z.object({
      launch: t(200), firstWin: t(200), repeat: t(200), squad: t(200), legacy: t(200), unlocked: t(200),
    }),
    skillTree: z.object({ brain: t(600), heart: t(600), soul: t(600), body: t(600) }),
    plan: z.array(planRowSchema).max(15, 'Maksimal 15 agenda'),
    commit: z.object({ daily: t(200), weekly: t(200), buddy: t(80), signName: t(80), signDate: t(20) }),
  })
  .refine((d) => d.dream.currentAge === null || d.dream.dreamAge === null || d.dream.dreamAge > d.dream.currentAge, {
    path: ['dream', 'dreamAge'],
    message: 'Usia target harus lebih besar dari usiamu sekarang',
  });

export type DreamPact = z.infer<typeof dreamPactSchema>;

export function emptyDreamPact(name = ''): DreamPact {
  return {
    why: { concern: '', belief: '', people: '', action: '', impact: '' },
    edge: { strength: '', mastery: '', role: '', problem: '' },
    dream: { currentAge: null, dreamAge: null, build: '', who: '', feel: '', rememberedAs: '' },
    milestones: { launch: '', firstWin: '', repeat: '', squad: '', legacy: '', unlocked: '' },
    skillTree: { brain: '', heart: '', soul: '', body: '' },
    plan: [
      { cat: 'levelup', program: '', target: '', month: '' },
      { cat: 'cuan', program: '', target: '', month: '' },
      { cat: 'impact', program: '', target: '', month: '' },
    ],
    commit: { daily: '', weekly: '', buddy: '', signName: name, signDate: '' },
  };
}

/** Menormalkan data Firestore (termasuk versi lama/rusak) menjadi DreamPact valid. */
export function normalizeDreamPact(raw: unknown, name = ''): DreamPact {
  const base = emptyDreamPact(name);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const merged = {
    why: { ...base.why, ...(r.why as object) },
    edge: { ...base.edge, ...(r.edge as object) },
    dream: { ...base.dream, ...(r.dream as object) },
    milestones: { ...base.milestones, ...(r.milestones as object) },
    skillTree: { ...base.skillTree, ...(r.skillTree as object) },
    plan: Array.isArray(r.plan) ? r.plan : base.plan,
    commit: { ...base.commit, ...(r.commit as object) },
  };
  const parsed = dreamPactSchema.safeParse(merged);
  return parsed.success ? parsed.data : base;
}

/* ------------------------------ Statements ------------------------------ */

const v = (s: string, ph: string) => s.trim() || ph;

export function whyStatement(p: DreamPact): string {
  return `UNTUK ${v(p.why.action, '[kontribusi yang kujalankan]')} bagi ${v(p.why.people, '[siapa yang kulayani]')}, SUPAYA ${v(p.why.impact, '[dampak yang ingin kuhadirkan]')}.`;
}

export function edgeStatement(p: DreamPact): string {
  return `Dengan kekuatan ${v(p.edge.strength, '[kekuatanku]')} yang kuasah lewat ${v(p.edge.mastery, '[keahlian]')}, aku mengambil peran sebagai ${v(p.edge.role, '[peranku]')} untuk membantu ${v(p.why.people, '[siapa yang kulayani]')} menyelesaikan ${v(p.edge.problem, '[masalah mereka]')}.`;
}

export function dreamStatement(p: DreamPact): string {
  return `Di usia ${p.dream.dreamAge ?? '[usia]'}, aku membangun ${v(p.dream.build, '[apa yang kubangun]')} supaya ${v(p.dream.who, '[siapa]')} bisa merasakan ${v(p.dream.feel, '[manfaat yang dirasakan]')}.`;
}

/* ------------------------------ Milestones ------------------------------ */

export interface MilestoneTime { key: LevelKey; age: number; year: number }

/**
 * Hitung usia & tahun tiap level secara deterministik (backcasting dari mimpi).
 * Rentang ≥ 7 tahun: Launch +0, First Win +1, Repeat +3, Squad +5,
 * Legacy di tengah antara Squad dan mimpi, Unlocked = usia target.
 * Rentang < 7 tahun: dibagi rata.
 */
export function milestoneTimeline(currentAge: number, dreamAge: number, startYear: number): MilestoneTime[] {
  if (!Number.isInteger(currentAge) || !Number.isInteger(dreamAge) || dreamAge <= currentAge) {
    throw new Error('Usia target harus lebih besar dari usia sekarang.');
  }
  const span = dreamAge - currentAge;
  const offsets = span >= 7
    ? [0, 1, 3, 5, 5 + Math.round((span - 5) / 2), span]
    : [0, 1, 2, 3, 4, 5].map((i) => Math.round((span * i) / 5));
  return LEVELS.map((l, i) => ({ key: l.key, age: currentAge + offsets[i], year: startYear + offsets[i] }));
}

/* ------------------------------ Completion ------------------------------ */

export function dreamPactProgress(p: DreamPact) {
  const parts = {
    why: !!(p.why.people.trim() && p.why.action.trim() && p.why.impact.trim()),
    edge: !!(p.edge.strength.trim() && p.edge.role.trim()),
    dream: !!(p.dream.currentAge && p.dream.dreamAge && p.dream.build.trim() && p.dream.who.trim()),
    milestones: Object.values(p.milestones).filter((x) => x.trim()).length >= 4,
    skillTree: Object.values(p.skillTree).every((x) => x.trim().length > 0),
    plan: p.plan.filter((r) => r.program.trim() && r.month.trim()).length >= 3,
    commit: !!(p.commit.daily.trim() && p.commit.signName.trim() && p.commit.signDate.trim()),
  };
  const done = Object.values(parts).filter(Boolean).length;
  return { parts, pct: Math.round((done / 7) * 100) };
}

export const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
