/** Problem Map → Peluang: dari keresahan menjadi langkah bisnis pertama. */
export const IMPACT_ZONES = [
  { key: 'values', emoji: '🧭', name: 'Nilai & Makna' },
  { key: 'health', emoji: '❤️', name: 'Jiwa & Kesehatan' },
  { key: 'mind', emoji: '🧠', name: 'Akal & Pendidikan' },
  { key: 'family', emoji: '👨‍👩‍👧', name: 'Keluarga & Generasi' },
  { key: 'economy', emoji: '💰', name: 'Ekonomi & Harta' },
  { key: 'nature', emoji: '🌱', name: 'Alam & Lingkungan' },
] as const;
export type ImpactZone = (typeof IMPACT_ZONES)[number]['key'];

export interface ProblemMapInput {
  title: string;
  phenomenon: string;
  coreProblem: string;
  rootCause: string;
  impact: string;
  affected: string;
  firstStep: string;
  zone: ImpactZone;
  validation: string;
}

export const PROBLEM_STEPS: { key: keyof Omit<ProblemMapInput, 'title' | 'zone'>; label: string; q: string; ph: string }[] = [
  { key: 'phenomenon', label: 'Fenomena', q: 'Apa yang terlihat di permukaan?', ph: 'Warung di sekitar kos sepi di aplikasi ojol' },
  { key: 'coreProblem', label: 'Masalah inti', q: 'Apa yang sebenarnya rusak?', ph: 'Menu tidak menarik dan jarang ada promo' },
  { key: 'rootCause', label: 'Akar masalah', q: 'Kenapa itu terus terjadi?', ph: 'Owner sibuk melayani dan tidak paham fitur aplikasi' },
  { key: 'impact', label: 'Dampak', q: 'Siapa rugi dan seberapa besar?', ph: 'Omzet turun, kalah dari brand besar' },
  { key: 'affected', label: 'Siapa terdampak', q: 'Orang/bisnis yang paling merasakan', ph: 'Warung keluarga & pekerjanya' },
  { key: 'firstStep', label: 'Langkah awal (calon bisnis)', q: 'Bantuan kecil yang bisa kamu tawarkan sekarang', ph: 'Jasa rapikan menu + foto HP + atur promo mingguan' },
  { key: 'validation', label: 'Cara validasi', q: 'Bagaimana kamu menguji dugaan ini minggu ini?', ph: 'Tanya 5 pemilik warung: apa kendala terbesar di aplikasi?' },
];

export function buildProblemMap(p: ProblemMapInput): string {
  const z = IMPACT_ZONES.find((x) => x.key === p.zone)!;
  const v = (s: string) => s.trim() || '—';
  return [
    `PROBLEM MAP${p.title.trim() ? ` · ${p.title.trim()}` : ''}`,
    `Zona dampak: ${z.emoji} ${z.name}`,
    '',
    ...PROBLEM_STEPS.map((s, i) => `${i + 1}. ${s.label}: ${v(p[s.key])}`),
    '',
    'Catatan: pisahkan fakta dari dugaan, lalu validasi dengan bertanya langsung ke orang yang terdampak.',
  ].join('\n');
}
