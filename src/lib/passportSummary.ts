import {
  AGE_RANGES, BUDGETS, BUSINESS_EXPERIENCE, CUSTOMER_EXPERIENCE, DEVICES, INTERESTS, SKILLS, SKILL_LEVELS,
  STATUSES, WORK_MODES, type Passport,
} from './passport';

/**
 * Ringkasan Passport — dihitung deterministik dari isian (bukan AI).
 * Skor kesiapan 0–100 = waktu (25) + perangkat (15) + pengalaman melayani
 * pelanggan (15) + pengalaman bisnis (20) + rata-rata skill (25).
 * Ini mengukur KESIAPAN MULAI (modal waktu, alat, jam terbang), bukan bakat.
 */

export type ReadinessKey = 'starter' | 'builder' | 'runner';

export const READINESS: Record<ReadinessKey, { name: string; emoji: string; tile: string; desc: string }> = {
  starter: {
    name: 'Starter', emoji: '🌱', tile: 'bg-lime',
    desc: 'Fase pemanasan. Fokus: bangun jam terbang kecil dulu — 1 penawaran, 1 calon klien, 1 pelajaran per hari.',
  },
  builder: {
    name: 'Builder', emoji: '🔧', tile: 'bg-sky',
    desc: 'Fondasi sudah ada. Fokus: pilih 1 industri, buat penawaran yang jelas, dan mulai outreach rutin.',
  },
  runner: {
    name: 'Runner', emoji: '🚀', tile: 'bg-pink',
    desc: 'Siap gas. Fokus: sistem — target mingguan, follow-up disiplin, dan mulai pikirkan tim/partner.',
  },
};

export interface ReadinessPart { key: string; label: string; score: number; max: number }

export interface PassportSummary {
  readiness: number;
  level: ReadinessKey;
  parts: ReadinessPart[];
  strengths: { key: string; label: string; level: number }[];
  gaps: { key: string; label: string; level: number }[];
}

const hoursScore = (h: number | null) => (h == null || h <= 0 ? 0 : h < 5 ? 5 : h < 10 ? 12 : h < 20 ? 20 : 25);
const BIZ_SCORE: Record<string, number> = { none: 0, tried: 8, side: 15, running: 20 };
const CUST_SCORE: Record<string, number> = { none: 0, some: 8, regular: 15 };

export function summarizePassport(p: Passport): PassportSummary {
  const levels = SKILLS.map((s) => ({ key: s.key, label: s.label, level: p.skills.levels[s.key] ?? 0 }));
  const avg = levels.reduce((a, s) => a + s.level, 0) / levels.length;

  const parts: ReadinessPart[] = [
    { key: 'time', label: 'Waktu per minggu', score: hoursScore(p.resources.hoursPerWeek), max: 25 },
    { key: 'devices', label: 'Perangkat', score: p.resources.devices.length * 5, max: 15 },
    { key: 'customer', label: 'Jam terbang melayani pelanggan', score: CUST_SCORE[p.resources.customerExperience] ?? 0, max: 15 },
    { key: 'business', label: 'Pengalaman bisnis', score: BIZ_SCORE[p.personal.businessExperience] ?? 0, max: 20 },
    { key: 'skills', label: 'Rata-rata skill', score: Math.round((avg / 3) * 25), max: 25 },
  ];
  const readiness = Math.min(100, parts.reduce((a, x) => a + x.score, 0));
  const level: ReadinessKey = readiness >= 70 ? 'runner' : readiness >= 40 ? 'builder' : 'starter';

  // Urutan stabil: level tertinggi dulu, seri → urutan daftar SKILLS.
  const strengths = levels.filter((s) => s.level >= 2).sort((a, b) => b.level - a.level);
  const gaps = levels.filter((s) => s.level <= 1).sort((a, b) => a.level - b.level);

  return { readiness, level, parts, strengths, gaps };
}

export interface NextStep { title: string; why: string; to: string; cta: string }

/** Langkah berikutnya, maksimal 4, urut prioritas. */
export function nextSteps(p: Passport, s: PassportSummary, hasAssessment: boolean): NextStep[] {
  const steps: NextStep[] = [];
  if (!hasAssessment) {
    steps.push({ title: 'Kerjakan Assessment + Profil Cuan', why: 'Tahu industri, jalur, dan cara alamimu menciptakan nilai sebelum memilih bisnis.', to: '/app/assessment', cta: 'Mulai assessment' });
  }
  if ((p.resources.hoursPerWeek ?? 0) < 5) {
    steps.push({ title: 'Kunci minimal 5 jam per minggu', why: 'Waktumu masih di bawah 5 jam. Blok jadwal tetap di kalender — konsistensi lebih penting dari durasi.', to: '/app/action-plan', cta: 'Lihat Action Plan' });
  }
  const gapKeys = new Set(s.gaps.map((g) => g.key));
  if (gapKeys.has('sales') || gapKeys.has('communication') || p.resources.customerExperience === 'none') {
    steps.push({ title: 'Latih skill jualan & komunikasi', why: 'Ini skill yang paling cepat menghasilkan cuan pertama — dan bisa dilatih.', to: '/app/belajar/sales-marketing', cta: 'Buka modul Sales' });
  }
  if (p.resources.startBudget === 'zero' || p.resources.startBudget === 'under_500k') {
    steps.push({ title: 'Mulai dari jalur modal Rp0', why: 'Jadi sales/marketing partner bisnis orang atau tawarkan jasa — tanpa stok, tanpa modal besar.', to: '/app/outreach', cta: 'Buka Outreach Studio' });
  }
  steps.push({ title: 'Ikuti Action Plan 7 Hari', why: 'Ubah profil ini jadi aksi: 3 misi kecil per hari.', to: '/app/action-plan', cta: 'Mulai hari 1' });
  steps.push({ title: 'Tulis Dream Pact-mu', why: 'Komitmen tertulis + milestone sampai Dream Unlocked, bisa dicetak.', to: '/app/dream-pact', cta: 'Buka Dream Pact' });
  // Hapus duplikat tujuan, ambil 4 teratas.
  const seen = new Set<string>();
  return steps.filter((x) => (seen.has(x.to) ? false : (seen.add(x.to), true))).slice(0, 4);
}

/* Label helper untuk tampilan ringkasan. */
type Opt = readonly { value: string | number; label: string }[];
export const labelOf = (opts: Opt, v: string | number | null | undefined) => opts.find((o) => o.value === v)?.label ?? '—';
export const LABELS = { AGE_RANGES, STATUSES, BUSINESS_EXPERIENCE, DEVICES, BUDGETS, WORK_MODES, CUSTOMER_EXPERIENCE, INTERESTS, SKILL_LEVELS };
