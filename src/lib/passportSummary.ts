import {
  AGE_RANGES, BUDGETS, BUSINESS_EXPERIENCE, CUSTOMER_EXPERIENCE, DEVICES, INTERESTS, SKILLS, SKILL_LEVELS,
  STATUSES, WORK_MODES, type Passport,
} from './passport';

/**
 * Ringkasan Passport — dihitung deterministik dari isian (bukan AI).
 * Skor kesiapan 0–100 = waktu (25) + perangkat (15) + pengalaman melayani
 * pelanggan (15) + pengalaman bisnis (20) + rata-rata skill (25).
 * Indeks ini merupakan heuristik produk yang belum divalidasi sebagai ukuran kesiapan.
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
  const hours = p.resources.hoursPerWeek;
  const steps: NextStep[] = [{ title: 'Siapkan satu bantuan kecil', why: hours && hours > 0 ? `Pilih cakupan sesuai waktu yang kamu tulis: ${hours} jam per minggu. Buat contoh sebelum menawarkan.` : 'Mulai dari waktu dan skill yang benar-benar tersedia. Profil tidak harus lengkap.', to: '/app/action-plan', cta: 'Buka Misi Pertama' }];
  if (!hasAssessment) steps.push({ title: 'Assessment sebagai refleksi (opsional)', why: 'Gunakan jawaban untuk mencari alternatif, lalu cek kebutuhan melalui pengamatan dan percakapan nyata.', to: '/app/assessment', cta: 'Lihat assessment opsional' });
  if (s.gaps.some((g) => g.key === 'sales' || g.key === 'communication')) steps.push({ title: 'Latih percakapan penawaran', why: 'Pelajari cara bertanya dan menjelaskan bantuan, sesuai kebutuhan pekerjaanmu saat ini.', to: '/app/belajar/business-101?pelajaran=b101-5', cta: 'Baca contoh percakapan' });
  steps.push({ title: 'Dream Pact untuk arah jangka panjang (opsional)', why: 'Boleh dikerjakan setelah percobaan kecil; bukan syarat mengirim penawaran.', to: '/app/dream-pact', cta: 'Buka Dream Pact' });
  return steps.slice(0, 4);
}
/* Label helper untuk tampilan ringkasan. */
type Opt = readonly { value: string | number; label: string }[];
export const labelOf = (opts: Opt, v: string | number | null | undefined) => opts.find((o) => o.value === v)?.label ?? '—';
export const LABELS = { AGE_RANGES, STATUSES, BUSINESS_EXPERIENCE, DEVICES, BUDGETS, WORK_MODES, CUSTOMER_EXPERIENCE, INTERESTS, SKILL_LEVELS };
