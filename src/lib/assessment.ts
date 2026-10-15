import { INDUSTRY_KEYS, type IndustryKey } from '../content/industries';
import { QUESTIONS, type TrackKey } from '../content/assessment';

export const TRACK_KEYS: TrackKey[] = ['sales_partner', 'marketing_partner', 'business_builder'];

export type Answers = Record<string, string>; // questionId -> optionId

export interface AssessmentResult {
  answers: Answers;
  /** Skor 0–100 per industri (dinormalisasi terhadap skor maksimum yang mungkin). */
  industryScores: Record<IndustryKey, number>;
  trackScores: Record<TrackKey, number>;
  topIndustries: IndustryKey[];
  track: TrackKey;
}

const zero = <K extends string>(keys: readonly K[]) => Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;

/** Skor maksimum yang mungkin per industri/jalur (ambil opsi dengan bobot tertinggi di tiap soal). */
function maxPossible() {
  const ind = zero(INDUSTRY_KEYS);
  const tr = zero(TRACK_KEYS);
  for (const q of QUESTIONS) {
    for (const k of INDUSTRY_KEYS) ind[k] += Math.max(0, ...q.options.map((o) => o.weight.industries?.[k] ?? 0));
    for (const k of TRACK_KEYS) tr[k] += Math.max(0, ...q.options.map((o) => o.weight.tracks?.[k] ?? 0));
  }
  return { ind, tr };
}

const MAX = maxPossible();

export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((q) => q.options.some((o) => o.id === answers[q.id]));
}

/** Perhitungan deterministik: jawaban yang sama SELALU menghasilkan rekomendasi yang sama. */
export function scoreAssessment(answers: Answers): AssessmentResult {
  if (!isComplete(answers)) throw new Error('Semua pertanyaan wajib dijawab.');
  const ind = zero(INDUSTRY_KEYS);
  const tr = zero(TRACK_KEYS);
  for (const q of QUESTIONS) {
    const opt = q.options.find((o) => o.id === answers[q.id])!;
    for (const [k, v] of Object.entries(opt.weight.industries ?? {})) ind[k as IndustryKey] += v ?? 0;
    for (const [k, v] of Object.entries(opt.weight.tracks ?? {})) tr[k as TrackKey] += v ?? 0;
  }
  const pct = (v: number, m: number) => (m === 0 ? 0 : Math.round((v / m) * 100));
  const industryScores = Object.fromEntries(INDUSTRY_KEYS.map((k) => [k, pct(ind[k], MAX.ind[k])])) as Record<IndustryKey, number>;
  const trackScores = Object.fromEntries(TRACK_KEYS.map((k) => [k, pct(tr[k], MAX.tr[k])])) as Record<TrackKey, number>;

  // Urutan stabil: skor tertinggi dulu, seri → urutan daftar industri.
  const topIndustries = [...INDUSTRY_KEYS]
    .sort((a, b) => industryScores[b] - industryScores[a] || INDUSTRY_KEYS.indexOf(a) - INDUSTRY_KEYS.indexOf(b))
    .slice(0, 3);
  const track = [...TRACK_KEYS].sort((a, b) => trackScores[b] - trackScores[a] || TRACK_KEYS.indexOf(a) - TRACK_KEYS.indexOf(b))[0];

  return { answers, industryScores, trackScores, topIndustries, track };
}

export function isIndustryKey(v: unknown): v is IndustryKey {
  return typeof v === 'string' && (INDUSTRY_KEYS as readonly string[]).includes(v);
}
export function isTrackKey(v: unknown): v is TrackKey {
  return typeof v === 'string' && (TRACK_KEYS as string[]).includes(v);
}
