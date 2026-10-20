import { describe, expect, it } from 'vitest';
import { SIM_AREAS, SIM_DECISION_COUNT, SIM_LEVEL_ORDER, SIM_PHASES, SIM_SCENARIOS, findScenario } from '../content/simulator';
import { INDUSTRY_KEYS } from '../content/industries';
import { applyEffect, blueprintText, evaluate, formatDelta, formatJuta, playThrough, runwayBulan } from './simulator';

describe('Founder Simulator — konten', () => {
  it('tepat 30 skenario: 10 industri × 3 level, tanpa duplikat', () => {
    expect(SIM_SCENARIOS).toHaveLength(30);
    for (const ind of INDUSTRY_KEYS) for (const lvl of SIM_LEVEL_ORDER) expect(findScenario(ind, lvl), `${ind}/${lvl}`).toBeDefined();
    expect(new Set(SIM_SCENARIOS.map((s) => `${s.industry}-${s.level}`)).size).toBe(30);
  });

  it.each(SIM_SCENARIOS.map((s) => [`${s.industry}/${s.level}`, s] as const))('%s: struktur lengkap & konsisten', (_, s) => {
    expect(s.title.length).toBeGreaterThan(5);
    expect(s.persona.length).toBeGreaterThan(60);
    expect(s.team.length).toBeGreaterThan(0);
    expect(s.decisions).toHaveLength(SIM_DECISION_COUNT);
    expect(new Set(s.decisions.map((d) => d.title)).size).toBe(SIM_DECISION_COUNT);
    // 90 hari harus menyentuh minimal 5 dari 6 area bisnis.
    expect(new Set(s.decisions.map((d) => d.area)).size).toBeGreaterThanOrEqual(5);
    for (const d of s.decisions) expect(SIM_AREAS[d.area]).toBeDefined();
    expect(s.fase).toHaveLength(3);
    for (const d of s.decisions) {
      expect(d.options).toHaveLength(3);
      expect(d.options.filter((x) => x.best)).toHaveLength(1);
      expect(d.lesson.length).toBeGreaterThan(40);
      for (const opt of d.options) expect(opt.result.length).toBeGreaterThan(30);
      // Opsi terbaik tidak boleh merusak reputasi DAN energi tim sekaligus.
      const best = d.options.find((x) => x.best)!;
      expect(best.effect.reputasi + best.effect.tim).toBeGreaterThanOrEqual(0);
    }
    const b = s.blueprint;
    expect(b.modal.reduce((n, m) => n + m.pct, 0)).toBe(100);
    for (const key of ['prioritas', 'rekrutSekarang', 'rekrutNanti', 'operasional', 'kpi', 'risiko', 'naikLevel'] as const) expect(b[key].length).toBeGreaterThan(0);
    expect(b.modal.some((m) => /darurat|runway/i.test(m.pos))).toBe(true);
  });

  it.each(SIM_SCENARIOS.map((s) => [`${s.industry}/${s.level}`, s] as const))('%s: jalur keputusan terbaik = bisnis sehat (kas tak pernah minus, skor ≥85)', (_, s) => {
    const bestChoices = s.decisions.map((d) => d.options.findIndex((x) => x.best));
    expect(playThrough(s, bestChoices).every((st) => st.kas >= 0)).toBe(true);
    const r = evaluate(s, bestChoices);
    expect(r.bestCount).toBe(SIM_DECISION_COUNT);
    expect(r.score).toBeGreaterThanOrEqual(85);
    expect(r.verdict.key).toBe('founder');
  });

  it('level skala selalu bermodal lebih besar dari tumbuh, dan tumbuh dari rintis', () => {
    for (const ind of INDUSTRY_KEYS) {
      const [a, b, c] = SIM_LEVEL_ORDER.map((l) => findScenario(ind, l)!.start.kas);
      expect(a).toBeLessThan(b);
      expect(b).toBeLessThan(c);
    }
  });
});

describe('Founder Simulator — engine', () => {
  it('membatasi reputasi & tim 0–100, kas boleh minus', () => {
    expect(applyEffect({ kas: 1, reputasi: 95, tim: 3 }, { kas: -3, reputasi: 10, tim: -10 })).toEqual({ kas: -2, reputasi: 100, tim: 0 });
  });

  it('pilihan terburuk menghasilkan skor rendah & peringatan', () => {
    const s = findScenario('fashion', 'tumbuh')!;
    const worst = s.decisions.map((d) => {
      let idx = 0; let min = Infinity;
      d.options.forEach((x, i) => { const v = x.effect.reputasi + x.effect.tim + (x.best ? 100 : 0); if (v < min) { min = v; idx = i; } });
      return idx;
    });
    const r = evaluate(s, worst);
    expect(r.bestCount).toBe(0);
    expect(r.score).toBeLessThan(60);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it('format rupiah', () => {
    expect(formatJuta(1.5)).toBe('Rp1,5 juta');
    expect(formatJuta(0.4)).toBe('Rp400 ribu');
    expect(formatJuta(1200)).toBe('Rp1,2 miliar');
    expect(formatJuta(-3.6)).toBe('−Rp3,6 juta');
    expect(formatDelta(2.5, 'kas')).toBe('+Rp2,5 juta');
    expect(formatDelta(-4, 'poin')).toBe('−4');
    expect(formatDelta(0, 'poin')).toBe('±0');
  });

  it('blueprint bisa disalin sebagai teks', () => {
    const text = blueprintText(findScenario('fnb', 'rintis')!);
    expect(text).toContain('BLUEPRINT BISNIS');
    expect(text).toContain('ALOKASI MODAL');
    expect(text).toContain('Catatan: angka adalah estimasi');
  });
});

describe('Founder Simulator — urutan opsi', () => {
  it('posisi jawaban terbaik di layar tersebar (tidak selalu di tempat yang sama)', async () => {
    const { displayOrder } = await import('./simulator');
    const positions = [0, 0, 0];
    for (const s of SIM_SCENARIOS) s.decisions.forEach((d, i) => {
      const order = displayOrder(s, i);
      expect([...order].sort()).toEqual([0, 1, 2]);
      positions[order.indexOf(d.options.findIndex((x) => x.best))] += 1;
    });
    // Setiap posisi (A/B/C) minimal 20% dari total kartu.
    const total = positions[0] + positions[1] + positions[2];
    for (const p of positions) expect(p).toBeGreaterThanOrEqual(Math.floor(total * 0.2));
  });
});

describe('Founder Simulator — jawaban tidak bisa ditebak dari panjang teks', () => {
  it('opsi terbaik tidak selalu paling panjang/pendek, dan panjangnya seimbang', () => {
    let longest = 0; let shortest = 0;
    for (const s of SIM_SCENARIOS) for (const d of s.decisions) {
      const lens = d.options.map((x) => x.label.length);
      const bi = d.options.findIndex((x) => x.best);
      if (lens[bi] === Math.max(...lens)) longest += 1;
      if (lens[bi] === Math.min(...lens)) shortest += 1;
      const others = lens.filter((_, j) => j !== bi);
      expect(lens[bi] / ((others[0] + others[1]) / 2), `${s.industry}/${s.level}: ${d.title}`).toBeLessThanOrEqual(1.4);
    }
    const total = SIM_SCENARIOS.reduce((n, s) => n + s.decisions.length, 0);
    expect(longest).toBeLessThanOrEqual(Math.floor(total * 0.4));
    expect(shortest).toBeLessThanOrEqual(Math.floor(total * 0.5));
  });
});

describe('Founder Simulator — operasional tim (v2)', () => {
  it.each(SIM_SCENARIOS.map((s) => [`${s.industry}/${s.level}`, s] as const))('%s: laporan bisnis per bulan konsisten', (_, s) => {
    const n = s.ops.snapshot;
    // Kas di laporan = kas awal simulasi.
    expect(n.kas).toBe(s.start.kas);
    expect(n.omzetBulan).toBeGreaterThanOrEqual(0);
    expect(n.marginKotor).toBeGreaterThan(0);
    expect(n.marginKotor).toBeLessThanOrEqual(100);
    expect(n.biayaTetapBulan).toBeGreaterThan(0);
    // Laba bersih tidak boleh melebihi laba kotor dikurangi biaya tetap (toleransi pembulatan).
    expect(n.labaBulan).toBeLessThanOrEqual(n.omzetBulan * n.marginKotor / 100 - n.biayaTetapBulan + 0.05);
    expect(n.pelanggan.length).toBeGreaterThan(5);
  });

  it.each(SIM_SCENARIOS.map((s) => [`${s.industry}/${s.level}`, s] as const))('%s: job desk, ritme, funnel, eksekusi lengkap', (_, s) => {
    const { roles, ritme, funnel } = s.ops;
    expect(roles.length).toBeGreaterThanOrEqual(3);
    for (const r of roles) {
      expect(r.misi.length).toBeGreaterThan(15);
      expect(r.harian.length + r.mingguan.length).toBeGreaterThanOrEqual(2);
      expect(r.kpi.length).toBeGreaterThan(0);
    }
    // Minimal satu peran tahu ke mana mencari prospek.
    expect(roles.some((r) => (r.prospek?.length ?? 0) >= 3)).toBe(true);
    expect(ritme.length).toBeGreaterThanOrEqual(4);
    expect(funnel.steps.length).toBeGreaterThanOrEqual(3);
    for (let i = 1; i < funnel.steps.length; i += 1) expect(funnel.steps[i].angka).toBeLessThanOrEqual(funnel.steps[i - 1].angka);
    for (const d of s.decisions) {
      expect(d.execution.length).toBeGreaterThanOrEqual(2);
      for (const e of d.execution) { expect(e.siapa.length).toBeGreaterThan(2); expect(e.tugas.length).toBeGreaterThan(20); }
    }
  });

  it('level lebih tinggi punya omzet bulanan & tim lebih besar', () => {
    for (const ind of INDUSTRY_KEYS) {
      const [a, b, c] = SIM_LEVEL_ORDER.map((l) => findScenario(ind, l)!.ops);
      expect(a.snapshot.omzetBulan).toBeLessThan(b.snapshot.omzetBulan);
      expect(b.snapshot.omzetBulan).toBeLessThan(c.snapshot.omzetBulan);
      expect(c.roles.length).toBeGreaterThanOrEqual(a.roles.length);
    }
  });

  it('runway dihitung untuk bisnis yang masih rugi (startup)', () => {
    expect(runwayBulan(findScenario('tech', 'skala')!)).toBeCloseTo(6.2, 1);
    expect(runwayBulan(findScenario('fnb', 'tumbuh')!)).toBeNull();
  });

  it('teks salin memuat periode eksplisit & playbook tim', () => {
    const text = blueprintText(findScenario('b2b_sales', 'tumbuh')!);
    expect(text).toContain('PER BULAN');
    expect(text).toContain('PLAYBOOK TIM');
    expect(text).toContain('Cari prospek di:');
    expect(text).toContain('RENCANA EKSEKUSI 90 HARI');
    for (const p of SIM_PHASES) expect(text).toContain(p.name.toUpperCase());
  });
});
