/**
 * Founder Simulator — logika murni (tanpa React/Firebase) supaya mudah dites.
 * Kas dalam JUTA rupiah; reputasi & energi tim 0–100.
 */
import { SIM_AREAS, SIM_LEVELS, SIM_PHASES, type SimScenario, type SimStats } from '../content/simulator';
import { INDUSTRIES } from '../content/industries';

const clamp = (n: number) => Math.max(0, Math.min(100, n));
const round1 = (n: number) => Math.round(n * 10) / 10;

export function applyEffect(stats: SimStats, effect: SimStats): SimStats {
  return { kas: round1(stats.kas + effect.kas), reputasi: clamp(stats.reputasi + effect.reputasi), tim: clamp(stats.tim + effect.tim) };
}

/** Level percobaan gratis untuk semua paket: Level 1 Rintis di 10 industri. Level 2–3 khusus GenZ Impact. */
export const SIM_TEASER_LEVEL = 'rintis' as const;
export const isTeaserScenario = (s: { level: string }) => s.level === SIM_TEASER_LEVEL;

/** Riwayat stat setelah setiap pilihan (indeks 0 = kondisi awal). */
export function playThrough(scenario: SimScenario, choices: number[]): SimStats[] {
  const history: SimStats[] = [scenario.start];
  choices.forEach((choice, i) => {
    const option = scenario.decisions[i]?.options[choice];
    if (option) history.push(applyEffect(history[history.length - 1], option.effect));
  });
  return history;
}

export type VerdictKey = 'founder' | 'almost' | 'learning';

export interface SimResult {
  final: SimStats;
  bestCount: number;
  score: number;
  verdict: { key: VerdictKey; title: string; desc: string };
  warnings: string[];
}

/**
 * Skor 0–100: 60 poin dari proporsi keputusan terbaik (6/keputusan untuk 10 keputusan) + 40 poin kesehatan bisnis
 * (kas tidak minus, reputasi tidak turun, energi tim ≥40, kas tidak lebih kecil dari separuh modal awal).
 */
export function evaluate(scenario: SimScenario, choices: number[]): SimResult {
  const history = playThrough(scenario, choices);
  const final = history[history.length - 1];
  const bestCount = choices.filter((c, i) => scenario.decisions[i]?.options[c]?.best).length;
  const warnings: string[] = [];
  let health = 0;
  if (history.every((s) => s.kas >= 0)) health += 10; else warnings.push('Kas sempat minus. Di dunia nyata, ini berarti telat bayar gaji, supplier, atau harus berutang mendadak.');
  if (final.kas >= scenario.start.kas / 2) health += 10; else warnings.push('Kas tinggal kurang dari separuh modal awal. Hati-hati dengan keputusan yang mengunci uang.');
  if (final.reputasi >= scenario.start.reputasi) health += 10; else warnings.push('Reputasi turun. Pelanggan dan mitra mulai ragu, dan biaya mendapatkan pelanggan baru akan naik.');
  if (final.tim >= 40) health += 10; else warnings.push('Energi tim/founder di bawah 40. Risiko burnout dan orang terbaik resign.');
  const total = scenario.decisions.length || 1;
  const score = Math.min(100, Math.round((bestCount / total) * 60) + health);
  const verdict = score >= 85
    ? { key: 'founder' as const, title: 'Founder Mode 🔥', desc: 'Keputusanmu menjaga kas, kepercayaan, dan tim sekaligus. Ini cara berpikir yang membuat bisnis bisa naik level.' }
    : score >= 60
      ? { key: 'almost' as const, title: 'Hampir tepat 💪', desc: 'Sebagian besar keputusanmu sehat. Pelajari debrief di bawah untuk melihat keputusan mana yang paling mahal akibatnya.' }
      : { key: 'learning' as const, title: 'Mahal di simulasi, murah di dunia nyata 📚', desc: 'Lebih baik salah di sini daripada dengan uang sungguhan. Baca debrief, lalu coba ulang skenarionya.' };
  return { final, bestCount, score, verdict, warnings };
}

/**
 * Urutan tampilan opsi yang diacak secara deterministik per skenario & kartu,
 * supaya posisi jawaban terbaik tidak bisa ditebak dari pola. Mengembalikan indeks opsi asli.
 */
export function displayOrder(scenario: SimScenario, decisionIndex: number): number[] {
  const key = `${scenario.industry}:${scenario.level}:${decisionIndex}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  return perms[(h >>> 0) % perms.length];
}

/** Format nilai dalam juta rupiah → "Rp1,5 juta", "Rp450 ribu", "Rp1,2 miliar". */
export function formatJuta(juta: number): string {
  const sign = juta < 0 ? '−' : '';
  const abs = Math.abs(juta);
  const fmt = (n: number) => n.toLocaleString('id-ID', { maximumFractionDigits: 1 });
  if (abs >= 1000) return `${sign}Rp${fmt(abs / 1000)} miliar`;
  if (abs > 0 && abs < 1) return `${sign}Rp${fmt(abs * 1000)} ribu`;
  return `${sign}Rp${fmt(abs)} juta`;
}

export function formatDelta(n: number, unit: 'kas' | 'poin'): string {
  if (n === 0) return '±0';
  if (unit === 'kas') return `${n > 0 ? '+' : ''}${formatJuta(n)}`;
  return `${n > 0 ? '+' : '−'}${Math.abs(n)}`;
}

/** Teks blueprint untuk disalin (WhatsApp/Notion/Docs). */
export function blueprintText(s: SimScenario): string {
  const b = s.blueprint;
  const lvl = SIM_LEVELS[s.level];
  const lines = [
    `BLUEPRINT BISNIS — ${INDUSTRIES[s.industry].name} · Level ${lvl.no} ${lvl.name} (${lvl.modal})`,
    s.title,
    '',
    ...snapshotLines(s),
    '',
    'PRIORITAS 90 HARI', ...b.prioritas.map((x) => `• ${x}`),
    '',
    'REKRUT SEKARANG', ...b.rekrutSekarang.map((x) => `• ${x}`),
    'REKRUT NANTI', ...b.rekrutNanti.map((x) => `• ${x}`),
    '',
    'OPERASIONAL RUTIN', ...b.operasional.map((x) => `• ${x}`),
    '',
    'ALOKASI MODAL', ...b.modal.map((m) => `• ${m.pos}: ${m.pct}%`),
    '',
    'KPI', ...b.kpi.map((k) => `• ${k.name}: ${k.target}`),
    '',
    'RISIKO TERBESAR', ...b.risiko.map((x) => `• ${x}`),
    '',
    'SYARAT NAIK LEVEL', ...b.naikLevel.map((x) => `• ${x}`),
    '',
    ...playbookText(s),
    '',
    'Catatan: angka adalah estimasi edukatif (Jabodetabek, 2026). Sesuaikan dengan kondisi usahamu. — GenZ Preneur',
  ];
  return lines.join('\n');
}


/** Baris laporan bisnis dengan periode eksplisit (PER BULAN vs posisi HARI INI). */
export function snapshotLines(s: SimScenario): string[] {
  const n = s.ops.snapshot;
  const lines = [
    'LAPORAN BISNIS SAAT INI',
    `• Omzet: ${formatJuta(n.omzetBulan)} PER BULAN`,
    `• Margin kotor: ${n.marginKotor}%`,
    `• Biaya tetap: ${formatJuta(n.biayaTetapBulan)} PER BULAN`,
    `• Laba bersih: ${formatJuta(n.labaBulan)} PER BULAN`,
    `• Kas di rekening hari ini: ${formatJuta(n.kas)}`,
  ];
  if (n.piutang !== undefined) lines.push(`• Piutang (belum dibayar pelanggan): ${formatJuta(n.piutang)}`);
  if (n.stok !== undefined) lines.push(`• Nilai stok di gudang: ${formatJuta(n.stok)}`);
  lines.push(`• Pelanggan: ${n.pelanggan}`);
  if (n.catatan) lines.push(`• Catatan: ${n.catatan}`);
  return lines;
}

/** Berapa bulan kas bertahan jika rugi terus (null jika tidak rugi). */
export function runwayBulan(s: SimScenario): number | null {
  const { labaBulan, kas } = s.ops.snapshot;
  if (labaBulan >= 0) return null;
  return Math.round((kas / -labaBulan) * 10) / 10;
}

/** Playbook tim: job desk, ritme mingguan, funnel, dan rencana eksekusi tiap keputusan. */
export function playbookText(s: SimScenario): string[] {
  const { roles, ritme, funnel } = s.ops;
  const out: string[] = ['PLAYBOOK TIM — SIAPA NGAPAIN'];
  roles.forEach((r) => {
    out.push('', `▸ ${r.role} (${r.jumlah})${r.atasan ? ` — lapor ke ${r.atasan}` : ''}`, `  Misi: ${r.misi}`);
    if (r.harian.length) out.push('  Harian:', ...r.harian.map((x) => `   - ${x}`));
    if (r.mingguan.length) out.push('  Mingguan:', ...r.mingguan.map((x) => `   - ${x}`));
    out.push('  KPI:', ...r.kpi.map((x) => `   - ${x}`));
    if (r.prospek?.length) out.push('  Cari prospek di:', ...r.prospek.map((x) => `   - ${x}`));
    if (r.tools?.length) out.push(`  Tools: ${r.tools.join(', ')}`);
  });
  out.push('', 'RITME KERJA', ...ritme.map((x) => `• ${x.kapan}: ${x.agenda} (${x.siapa})`));
  out.push('', `FUNNEL PENJUALAN (${funnel.periode})`, funnel.steps.map((x) => `${x.tahap} ${x.angka.toLocaleString('id-ID')}`).join(' → '));
  out.push('', 'RENCANA EKSEKUSI 90 HARI');
  SIM_PHASES.forEach((p, pi) => {
    out.push('', `${p.name.toUpperCase()} — ${p.label} · Target: ${s.fase[pi]}`);
    s.decisions.slice(p.from, p.to + 1).forEach((d, k) => {
      const i = p.from + k;
      out.push(`${i + 1}. [${SIM_AREAS[d.area].label}] ${d.title}`, ...d.execution.map((e) => `   - ${e.siapa}: ${e.tugas}`));
    });
  });
  return out;
}
