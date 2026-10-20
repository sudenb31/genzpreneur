/**
 * Founder Simulator — tipe data skenario roleplay.
 * 10 industri (key sama dengan Assessment) × 3 level modal = 30 skenario.
 * Semua angka uang dalam JUTA rupiah dan bersifat ESTIMASI (Jabodetabek, 2026).
 */
import type { IndustryKey } from '../industries';

export type SimLevelKey = 'rintis' | 'tumbuh' | 'skala';

/** kas: juta rupiah · reputasi & tim: 0–100. */
export interface SimStats { kas: number; reputasi: number; tim: number }

export interface SimOption {
  label: string;
  effect: SimStats;
  /** Apa yang terjadi setelah memilih ini — ditulis seperti cerita, 1–2 kalimat. */
  result: string;
  best?: true;
}

export interface SimDecision {
  title: string;
  situation: string;
  options: [SimOption, SimOption, SimOption];
  /** Pelajaran inti setelah keputusan ini (ditampilkan di debrief). */
  lesson: string;
}

export interface SimBlueprint {
  prioritas: string[];
  rekrutSekarang: string[];
  rekrutNanti: string[];
  operasional: string[];
  modal: { pos: string; pct: number }[];
  kpi: { name: string; target: string }[];
  risiko: string[];
  naikLevel: string[];
}

export interface SimScenario {
  industry: IndustryKey;
  level: SimLevelKey;
  title: string;
  /** Siapa kamu & kondisi bisnis saat ini. */
  persona: string;
  modal: string;
  team: string[];
  start: SimStats;
  decisions: [SimDecision, SimDecision, SimDecision];
  blueprint: SimBlueprint;
}

export const SIM_LEVELS: Record<SimLevelKey, { no: number; name: string; modal: string; team: string; desc: string; tile: string }> = {
  rintis: { no: 1, name: 'Rintis', modal: 'Rp1–10 juta', team: 'Kamu sendiri + freelance', desc: 'Sumber daya terbatas. Tugasmu: dapat pelanggan yang bayar, jaga kas, buat cara kerja yang bisa diulang.', tile: 'bg-lime' },
  tumbuh: { no: 2, name: 'Tumbuh', modal: 'Rp10–100 juta', team: '3–8 orang', desc: 'Pesanan mulai stabil. Tugasmu: lepas pekerjaan ke tim, bangun sistem, dan jangan sampai kas jebol karena tumbuh.', tile: 'bg-sky' },
  skala: { no: 3, name: 'Skala', modal: 'Rp100 juta–1 miliar', team: '10–40 orang, ada kepala divisi', desc: 'Modal cukup kuat. Tugasmu: memimpin lewat orang, angka, dan keputusan besar — bukan lagi mengerjakan semuanya sendiri.', tile: 'bg-pink' },
};

export const SIM_LEVEL_ORDER: SimLevelKey[] = ['rintis', 'tumbuh', 'skala'];
