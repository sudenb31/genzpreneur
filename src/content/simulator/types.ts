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

/** Divisi/area bisnis yang diuji oleh keputusan. */
export type SimArea = 'sales' | 'operasional' | 'tim' | 'keuangan' | 'krisis' | 'strategi';

export const SIM_AREAS: Record<SimArea, { label: string; emoji: string }> = {
  sales: { label: 'Sales & prospek', emoji: '🎯' },
  operasional: { label: 'Operasional & gudang', emoji: '⚙️' },
  tim: { label: 'Tim & manajer', emoji: '👥' },
  keuangan: { label: 'Keuangan & kas', emoji: '💰' },
  krisis: { label: 'Krisis', emoji: '🚨' },
  strategi: { label: 'Strategi naik level', emoji: '🚀' },
};

/** 90 hari = 10 keputusan: Bulan 1 (3), Bulan 2 (3), Bulan 3 (4). `to` inklusif. */
export const SIM_DECISION_COUNT = 10;
export const SIM_PHASES = [
  { no: 1, name: 'Bulan 1', label: 'Bereskan fondasi', from: 0, to: 2 },
  { no: 2, name: 'Bulan 2', label: 'Gerakkan tim & cari traksi', from: 3, to: 5 },
  { no: 3, name: 'Bulan 3', label: 'Uji ketahanan & naik level', from: 6, to: 9 },
] as const;

export function phaseOf(decisionIndex: number) {
  return SIM_PHASES.find((p) => decisionIndex >= p.from && decisionIndex <= p.to) ?? SIM_PHASES[SIM_PHASES.length - 1];
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

/** Konten dasar skenario (cerita + keputusan + blueprint). Operasional ditambahkan di ops/. */
export interface SimScenarioContent {
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

/** Laporan bisnis saat skenario dimulai. Semua uang dalam JUTA rupiah, periode eksplisit. */
export interface SimSnapshot {
  /** Omzet (penjualan kotor) rata-rata PER BULAN. */
  omzetBulan: number;
  /** Laba bersih rata-rata PER BULAN (setelah HPP, gaji, sewa, iklan). Boleh negatif. */
  labaBulan: number;
  /** Margin kotor dalam persen: (omzet − HPP) ÷ omzet. */
  marginKotor: number;
  /** Biaya tetap PER BULAN (gaji, sewa, langganan, utilitas). */
  biayaTetapBulan: number;
  /** Uang di rekening usaha HARI INI. */
  kas: number;
  /** Tagihan ke pelanggan yang belum dibayar (posisi hari ini). */
  piutang?: number;
  /** Nilai stok/bahan di gudang (posisi hari ini). */
  stok?: number;
  /** Siapa & berapa pelanggan aktif. */
  pelanggan: string;
  /** Penjelasan singkat angka (opsional), mis. "omzet dari 2 order pertama". */
  catatan?: string;
}

export interface SimRole {
  role: string;
  /** Jumlah orang, mis. "1", "10", "kamu sendiri". */
  jumlah: string;
  atasan?: string;
  /** Tanggung jawab utama dalam 1 kalimat. */
  misi: string;
  harian: string[];
  mingguan: string[];
  /** KPI lengkap dengan target. */
  kpi: string[];
  /** Untuk peran sales/marketing: ke mana mencari prospek. */
  prospek?: string[];
  tools?: string[];
}

export interface SimRhythm { kapan: string; agenda: string; siapa: string }

export interface SimFunnel { periode: string; steps: { tahap: string; angka: number }[] }

export interface SimOps {
  snapshot: SimSnapshot;
  roles: SimRole[];
  ritme: SimRhythm[];
  funnel: SimFunnel;
}

/** Siapa di tim mengerjakan apa untuk menjalankan keputusan terbaik. */
export type SimExecution = { siapa: string; tugas: string }[];

export interface SimDecisionFull extends SimDecision { area: SimArea; execution: SimExecution }

export interface SimScenario extends Omit<SimScenarioContent, 'decisions'> {
  /** 10 keputusan berurutan selama 90 hari (lihat SIM_PHASES). */
  decisions: SimDecisionFull[];
  /** Target/fokus tiap bulan: [Bulan 1, Bulan 2, Bulan 3]. */
  fase: [string, string, string];
  ops: SimOps;
}

/**
 * Perjalanan 90 hari per level.
 * - areas: area untuk 3 keputusan dasar (di file konten).
 * - extra: 7 keputusan tambahan, lengkap dengan area & eksekusi.
 * - order: urutan 10 keputusan; 'b0'–'b2' = keputusan dasar, 'e0'–'e6' = tambahan.
 */
export interface SimJourneyLevel {
  fase: [string, string, string];
  areas: [SimArea, SimArea, SimArea];
  extra: SimDecisionFull[];
  order: string[];
}
export type SimIndustryJourney = Record<SimLevelKey, SimJourneyLevel>;

export interface SimIndustryOps {
  ops: Record<SimLevelKey, SimOps>;
  exec: Record<SimLevelKey, [SimExecution, SimExecution, SimExecution]>;
}

export const SIM_LEVELS: Record<SimLevelKey, { no: number; name: string; modal: string; team: string; desc: string; tile: string }> = {
  rintis: { no: 1, name: 'Rintis', modal: 'Rp1–10 juta', team: 'Kamu sendiri + freelance', desc: 'Sumber daya terbatas. Tugasmu: dapat pelanggan yang bayar, jaga kas, buat cara kerja yang bisa diulang.', tile: 'bg-lime' },
  tumbuh: { no: 2, name: 'Tumbuh', modal: 'Rp10–100 juta', team: '3–8 orang', desc: 'Pesanan mulai stabil. Tugasmu: lepas pekerjaan ke tim, bangun sistem, dan jangan sampai kas jebol karena tumbuh.', tile: 'bg-sky' },
  skala: { no: 3, name: 'Skala', modal: 'Rp100 juta–1 miliar', team: '10–40 orang, ada kepala divisi', desc: 'Modal cukup kuat. Tugasmu: memimpin lewat orang, angka, dan keputusan besar — bukan lagi mengerjakan semuanya sendiri.', tile: 'bg-pink' },
};

export const SIM_LEVEL_ORDER: SimLevelKey[] = ['rintis', 'tumbuh', 'skala'];
