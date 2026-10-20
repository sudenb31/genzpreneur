import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INDUSTRIES, INDUSTRY_KEYS, type IndustryKey } from '../content/industries';
import { SIM_LEVELS, SIM_LEVEL_ORDER, findScenario, type SimExecution, type SimLevelKey, type SimOps, type SimRole, type SimScenario, type SimStats } from '../content/simulator';
import { blueprintText, displayOrder, evaluate, formatDelta, formatJuta, playThrough, runwayBulan } from '../lib/simulator';
import { CopyButton, PageHeader } from '../components/ui';

const isIndustry = (v: string | null): v is IndustryKey => !!v && (INDUSTRY_KEYS as readonly string[]).includes(v);
const isLevel = (v: string | null): v is SimLevelKey => !!v && (SIM_LEVEL_ORDER as string[]).includes(v);

export default function SimulatorPage() {
  const [params, setParams] = useSearchParams();
  const industry = isIndustry(params.get('industri')) ? (params.get('industri') as IndustryKey) : null;
  const level = isLevel(params.get('level')) ? (params.get('level') as SimLevelKey) : null;
  const scenario = industry && level ? findScenario(industry, level) ?? null : null;

  function choose(next: { industri?: IndustryKey | null; level?: SimLevelKey | null }) {
    const p = new URLSearchParams(params);
    if (next.industri !== undefined) { if (next.industri) p.set('industri', next.industri); else p.delete('industri'); }
    if (next.level !== undefined) { if (next.level) p.set('level', next.level); else p.delete('level'); }
    setParams(p);
  }

  if (scenario) return <ScenarioPlayer key={`${scenario.industry}-${scenario.level}`} scenario={scenario} onExit={() => choose({ level: null })} onSwitchLevel={(l) => choose({ level: l })} />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Simulasi Founder · 30 skenario" title={<>Bayangkan bisnismu <span className="headline-marker">naik level.</span></>}
        desc="Pilih industri dan level modal. Kamu masuk ke bisnis yang sedang berjalan: lihat laporan keuangan per bulan, kenali timmu dan job desk masing-masing (sales cari prospek ke mana, gudang ngapain, manager ngapain), lalu ambil 3 keputusan sulit. Setiap keputusan dilengkapi rencana eksekusi: siapa mengerjakan apa. Di akhir kamu dapat playbook tim lengkap."
        right={<span aria-hidden className="brand-sticker">ROLEPLAY ✦</span>} />

      <section aria-labelledby="pick-industry" className="space-y-3">
        <h2 id="pick-industry" className="font-display text-xl font-extrabold">1. Pilih industri</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {INDUSTRY_KEYS.map((k) => {
            const ind = INDUSTRIES[k];
            const active = industry === k;
            return (
              <button key={k} type="button" aria-pressed={active} onClick={() => choose({ industri: k })}
                className={`card-pop flex flex-col items-start gap-2 p-4 text-left transition hover:-translate-y-0.5 ${active ? 'bg-lime' : 'bg-white'}`}>
                <span className="text-2xl" aria-hidden>{ind.emoji}</span>
                <span className="font-bold leading-tight">{ind.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="pick-level" className="space-y-3">
        <h2 id="pick-level" className="font-display text-xl font-extrabold">2. Pilih level modal</h2>
        {!industry && <p className="text-sm text-muted">Pilih industri dulu, lalu tentukan level yang ingin kamu mainkan.</p>}
        <div className="grid gap-3 md:grid-cols-3">
          {SIM_LEVEL_ORDER.map((l) => {
            const info = SIM_LEVELS[l];
            const sc = industry ? findScenario(industry, l) : undefined;
            return (
              <button key={l} type="button" disabled={!industry} onClick={() => choose({ level: l })}
                className={`card-pop flex flex-col items-start gap-2 p-5 text-left transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${info.tile}`}>
                <span className="chip bg-white">Level {info.no} · {info.name}</span>
                <span className="font-display text-lg font-extrabold">{info.modal}</span>
                <span className="text-sm font-semibold">{info.team}</span>
                <span className="text-sm">{sc ? sc.title : info.desc}</span>
                {industry && <span className="mt-1 text-sm font-bold underline">Mulai skenario →</span>}
              </button>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-muted">Angka uang, gaji, dan target adalah estimasi edukatif untuk Jabodetabek (2026), bukan jaminan hasil. Cek aturan, harga, dan kondisi terbaru di lapanganmu.</p>
    </div>
  );
}

function StatsBar({ stats, start, compact = false }: { stats: SimStats; start: SimStats; compact?: boolean }) {
  const meter = (label: string, value: number, cls: string) => (
    <div>
      <div className="flex justify-between text-xs font-bold"><span>{label}</span><span>{value}/100</span></div>
      <div className="mt-1 h-2.5 overflow-hidden rounded-full border border-ink bg-white" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <div className={`h-full ${cls}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
  const kasDown = stats.kas < start.kas;
  return (
    <div className={`card grid gap-4 p-4 ${compact ? 'sm:grid-cols-3' : 'sm:grid-cols-3'}`} aria-label="Kondisi bisnis saat ini">
      <div>
        <p className="text-xs font-bold">💰 Kas</p>
        <p className={`font-display text-xl font-extrabold ${stats.kas < 0 ? 'text-danger' : ''}`}>{formatJuta(stats.kas)}</p>
        <p className="text-xs text-muted">Modal awal {formatJuta(start.kas)}{kasDown && stats.kas >= 0 ? ' · turun' : ''}</p>
      </div>
      {meter('⭐ Reputasi', stats.reputasi, 'bg-lilac')}
      {meter('⚡ Energi tim', stats.tim, stats.tim < 40 ? 'bg-pink' : 'bg-lime')}
    </div>
  );
}

function Delta({ label, value, unit }: { label: string; value: number; unit: 'kas' | 'poin' }) {
  const cls = value > 0 ? 'bg-lime' : value < 0 ? 'bg-pink' : 'bg-paper-2';
  return <span className={`chip ${cls}`}>{label} {formatDelta(value, unit)}</span>;
}

function ScenarioPlayer({ scenario, onExit, onSwitchLevel }: { scenario: SimScenario; onExit: () => void; onSwitchLevel: (l: SimLevelKey) => void }) {
  const [started, setStarted] = useState(false);
  const [choices, setChoices] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ind = INDUSTRIES[scenario.industry];
  const lvl = SIM_LEVELS[scenario.level];
  const history = useMemo(() => playThrough(scenario, choices), [scenario, choices]);
  const current = history[history.length - 1];
  const step = revealed ? choices.length - 1 : choices.length;
  const done = choices.length === 3 && !revealed;

  useEffect(() => { headingRef.current?.focus(); }, [started, step, done]);

  function pick(optionIndex: number) {
    setChoices((c) => [...c, optionIndex]);
    setRevealed(true);
  }

  function restart() { setChoices([]); setRevealed(false); setStarted(true); }

  const header = (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className="btn-ghost py-1.5 text-sm" onClick={onExit}>← Pilih skenario lain</button>
      <span className="chip bg-white">{ind.emoji} {ind.name}</span>
      <span className={`chip ${lvl.tile}`}>Level {lvl.no} · {lvl.name} · {lvl.modal}</span>
    </div>
  );

  if (!started) {
    return (
      <div className="space-y-5">
        {header}
        <section className={`card-pop p-6 ${lvl.tile}`}>
          <p className="eyebrow">Peranmu</p>
          <h1 ref={headingRef} tabIndex={-1} className="h-page mt-1 outline-none">{scenario.title}</h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed">{scenario.persona}</p>
        </section>
        <BriefTabs scenario={scenario} />
        <section className="card bg-paper p-5 text-sm">
          <h2 className="font-bold">Cara main</h2>
          <p className="mt-1">Pelajari dulu laporan bisnis dan timmu di atas. Lalu ada 3 situasi nyata. Pilih keputusan yang menurutmu paling tepat (tidak ada tombol kembali, sama seperti di dunia nyata). Setiap pilihan mengubah <strong>kas</strong>, <strong>reputasi</strong>, dan <strong>energi tim</strong>, dan kamu akan melihat <strong>siapa di tim mengerjakan apa</strong> untuk menjalankannya.</p>
        </section>
        <button type="button" className="btn-accent" onClick={() => setStarted(true)}>Mulai sebagai founder →</button>
      </div>
    );
  }

  if (done) {
    const result = evaluate(scenario, choices);
    const b = scenario.blueprint;
    const nextLevel = SIM_LEVEL_ORDER[SIM_LEVEL_ORDER.indexOf(scenario.level) + 1];
    return (
      <div className="space-y-5">
        {header}
        <section className={`card-pop p-6 ${result.verdict.key === 'founder' ? 'bg-lime' : result.verdict.key === 'almost' ? 'bg-sky' : 'bg-pink'}`} aria-live="polite">
          <p className="eyebrow">Hasil simulasi</p>
          <h1 ref={headingRef} tabIndex={-1} className="h-page mt-1 outline-none">{result.verdict.title}</h1>
          <p className="mt-2 max-w-2xl">{result.verdict.desc}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="chip bg-white text-base">Skor {result.score}/100</span>
            <span className="chip bg-white">{result.bestCount}/3 keputusan terbaik</span>
          </div>
        </section>
        <StatsBar stats={result.final} start={scenario.start} />
        {result.warnings.length > 0 && (
          <section className="card border-2 border-danger/30 bg-danger-soft p-5">
            <h2 className="font-bold text-danger">Perhatikan</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{result.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
          </section>
        )}

        <section aria-labelledby="debrief" className="space-y-3">
          <h2 id="debrief" className="font-display text-2xl font-extrabold">Pembahasan keputusan</h2>
          {scenario.decisions.map((d, i) => {
            const mine = d.options[choices[i]];
            const best = d.options.find((x) => x.best)!;
            return (
              <article key={d.title} className="card p-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Keputusan {i + 1}</p>
                <h3 className="font-display text-lg font-extrabold">{d.title}</h3>
                <p className="mt-2 text-sm"><strong>Pilihanmu:</strong> {mine.label} {mine.best ? '✅' : ''}</p>
                {!mine.best && <p className="mt-1 text-sm"><strong>Pilihan terbaik:</strong> {best.label}</p>}
                <p className="mt-3 rounded-2xl bg-lilac/50 p-3 text-sm"><strong>Pelajaran:</strong> {d.lesson}</p>
                <div className="mt-3"><ExecutionPlan steps={d.execution} title="Rencana eksekusi tim" compact /></div>
              </article>
            );
          })}
        </section>

        <section aria-labelledby="playbook" className="card-pop space-y-5 bg-white p-6">
          <div>
            <p className="eyebrow">Playbook tim</p>
            <h2 id="playbook" className="font-display text-2xl font-extrabold">Siapa ngapain di bisnis ini</h2>
            <p className="text-sm text-muted">Job desk harian & mingguan, KPI, ke mana mencari prospek, ritme rapat, dan funnel penjualan. Ikut tersalin di tombol &quot;Salin blueprint&quot;.</p>
          </div>
          <BusinessReport scenario={scenario} />
          <TeamBoard roles={scenario.ops.roles} openAll />
          <div className="grid gap-4 lg:grid-cols-2">
            <RhythmTable ops={scenario.ops} />
            <FunnelChart ops={scenario.ops} />
          </div>
        </section>

        <section aria-labelledby="blueprint" className="card-pop space-y-5 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Blueprint bisnis</p>
              <h2 id="blueprint" className="font-display text-2xl font-extrabold">{ind.name} · Level {lvl.no} {lvl.name}</h2>
              <p className="text-sm text-muted">Peta kerja untuk bisnis di level ini, terlepas dari skormu.</p>
            </div>
            <CopyButton text={blueprintText(scenario)} label="Salin blueprint" className="btn-ghost" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <BlueprintList title="🎯 Prioritas 90 hari" items={b.prioritas} tile="bg-lime" />
            <div className="card bg-sky p-4">
              <h3 className="font-bold">👥 Siapa yang direkrut</h3>
              <p className="mt-2 text-xs font-extrabold uppercase">Sekarang</p>
              <ul className="list-disc space-y-1 pl-5 text-sm">{b.rekrutSekarang.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="mt-3 text-xs font-extrabold uppercase">Nanti (belum sekarang)</p>
              <ul className="list-disc space-y-1 pl-5 text-sm">{b.rekrutNanti.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <BlueprintList title="⚙️ Operasional rutin" items={b.operasional} tile="bg-paper" />
            <div className="card bg-amber-soft p-4">
              <h3 className="font-bold">💰 Alokasi modal</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {b.modal.map((m) => (
                  <li key={m.pos}>
                    <div className="flex justify-between gap-3"><span>{m.pos}</span><strong>{m.pct}%</strong></div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full border border-ink bg-white"><div className="h-full bg-ink" style={{ width: `${m.pct}%` }} /></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card bg-lilac p-4">
              <h3 className="font-bold">📊 KPI yang dipantau</h3>
              <table className="mt-2 w-full text-sm">
                <tbody>{b.kpi.map((k) => <tr key={k.name} className="border-b border-ink/10 last:border-0"><td className="py-1.5 pr-3">{k.name}</td><td className="py-1.5 text-right font-bold">{k.target}</td></tr>)}</tbody>
              </table>
            </div>
            <BlueprintList title="⚠️ Risiko terbesar" items={b.risiko} tile="bg-pink" />
          </div>
          <BlueprintList title="🚀 Syarat naik ke level berikutnya" items={b.naikLevel} tile="bg-paper" />
          <p className="text-xs text-muted">Angka adalah estimasi edukatif (Jabodetabek, 2026), bukan jaminan. Sesuaikan dengan kondisi usahamu.</p>
        </section>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={restart}>Ulangi skenario ini</button>
          {nextLevel && <button type="button" className="btn-accent" onClick={() => onSwitchLevel(nextLevel)}>Coba Level {SIM_LEVELS[nextLevel].no} · {SIM_LEVELS[nextLevel].name} →</button>}
          <button type="button" className="btn-ghost" onClick={onExit}>Pilih industri lain</button>
        </div>
      </div>
    );
  }

  const decision = scenario.decisions[step];
  const order = displayOrder(scenario, step);
  const picked = revealed ? decision.options[choices[step]] : null;

  return (
    <div className="space-y-5">
      {header}
      <StatsBar stats={current} start={scenario.start} compact />
      <details className="card group p-4">
        <summary className="cursor-pointer list-none font-bold">
          <span className="group-open:hidden">👥 Lihat laporan bisnis & timmu (contekan sebelum memutuskan) ▾</span>
          <span className="hidden group-open:inline">👥 Tutup contekan ▴</span>
        </summary>
        <div className="mt-4 space-y-4">
          <BusinessReport scenario={scenario} />
          <TeamBoard roles={scenario.ops.roles} />
        </div>
      </details>
      <section className="card-pop space-y-4 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">Keputusan {step + 1} dari 3</p>
          <div className="flex gap-1.5" aria-hidden>{[0, 1, 2].map((i) => <span key={i} className={`h-2.5 w-8 rounded-full border border-ink ${i < choices.length ? 'bg-ink' : 'bg-white'}`} />)}</div>
        </div>
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-extrabold outline-none">{decision.title}</h1>
        <p className="text-[15px] leading-relaxed">{decision.situation}</p>

        {!picked && (
          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-bold">Apa keputusanmu?</legend>
            {order.map((idx, pos) => (
              <button key={idx} type="button" onClick={() => pick(idx)}
                className="card flex w-full items-start gap-3 border-2 border-ink/15 p-4 text-left transition hover:-translate-y-0.5 hover:border-ink">
                <span className="chip shrink-0 bg-paper">{String.fromCharCode(65 + pos)}</span>
                <span className="font-semibold">{decision.options[idx].label}</span>
              </button>
            ))}
          </fieldset>
        )}

        {picked && (
          <div className="space-y-3" aria-live="polite">
            <div className={`rounded-3xl border-2 border-ink p-4 ${picked.best ? 'bg-lime' : 'bg-amber-soft'}`}>
              <p className="text-xs font-extrabold uppercase tracking-wider">Yang terjadi</p>
              <p className="mt-1 font-semibold">{picked.result}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Delta label="Kas" value={picked.effect.kas} unit="kas" />
                <Delta label="Reputasi" value={picked.effect.reputasi} unit="poin" />
                <Delta label="Energi tim" value={picked.effect.tim} unit="poin" />
              </div>
            </div>
            {!picked.best && <p className="text-sm"><strong>Pilihan yang lebih tepat:</strong> {decision.options.find((x) => x.best)!.label}</p>}
            <ExecutionPlan steps={decision.execution} title={picked.best ? '🛠️ Begini timmu menjalankannya' : '🛠️ Cara yang lebih tepat — dan siapa mengerjakan apa'} />
            <button type="button" className="btn-accent" onClick={() => setRevealed(false)}>
              {choices.length === 3 ? 'Lihat hasil & blueprint →' : 'Lanjut ke keputusan berikutnya →'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function BlueprintList({ title, items, tile }: { title: string; items: string[]; tile: string }) {
  return (
    <div className={`card p-4 ${tile}`}>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{items.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  );
}

/* ───────────────────────── v2: laporan bisnis, tim, ritme, funnel, eksekusi ───────────────────────── */

const BRIEF_TABS = [
  { key: 'laporan', label: '📊 Laporan bisnis' },
  { key: 'tim', label: '👥 Tim & job desk' },
  { key: 'ritme', label: '🗓️ Ritme & funnel' },
] as const;

function BriefTabs({ scenario }: { scenario: SimScenario }) {
  const [tab, setTab] = useState<(typeof BRIEF_TABS)[number]['key']>('laporan');
  return (
    <section className="space-y-4" aria-label="Kenali bisnismu">
      <div role="tablist" aria-label="Kenali bisnismu" className="flex flex-wrap gap-2">
        {BRIEF_TABS.map((t) => (
          <button key={t.key} type="button" role="tab" id={`tab-${t.key}`} aria-selected={tab === t.key} aria-controls={`panel-${t.key}`}
            onClick={() => setTab(t.key)}
            className={`rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition ${tab === t.key ? 'bg-ink text-white' : 'bg-white hover:-translate-y-0.5'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'laporan' && (
          <div className="space-y-4">
            <BusinessReport scenario={scenario} />
            <section className="card p-5">
              <h2 className="font-display text-lg font-extrabold">💼 Modal & kondisi awal simulasi</h2>
              <p className="mt-1 text-sm">{scenario.modal}</p>
            </section>
            <StatsBar stats={scenario.start} start={scenario.start} />
          </div>
        )}
        {tab === 'tim' && <TeamBoard roles={scenario.ops.roles} />}
        {tab === 'ritme' && (
          <div className="grid gap-4 lg:grid-cols-2">
            <RhythmTable ops={scenario.ops} />
            <FunnelChart ops={scenario.ops} />
          </div>
        )}
      </div>
    </section>
  );
}

function BusinessReport({ scenario }: { scenario: SimScenario }) {
  const n = scenario.ops.snapshot;
  const runway = runwayBulan(scenario);
  const labaKotor = Math.round(n.omzetBulan * n.marginKotor) / 100;
  const rows: { label: string; value: string; hint: string; tone?: string }[] = [
    { label: 'Omzet', value: formatJuta(n.omzetBulan), hint: 'per bulan · total penjualan kotor' },
    { label: 'Laba kotor', value: formatJuta(labaKotor), hint: `per bulan · margin ${n.marginKotor}%` },
    { label: 'Biaya tetap', value: formatJuta(n.biayaTetapBulan), hint: 'per bulan · gaji, sewa, langganan' },
    { label: n.labaBulan < 0 ? 'Rugi bersih (burn)' : 'Laba bersih', value: formatJuta(n.labaBulan), hint: 'per bulan · yang benar-benar tersisa', tone: n.labaBulan < 0 ? 'bg-pink' : 'bg-lime' },
  ];
  const posisi: { label: string; value: string }[] = [{ label: 'Kas di rekening', value: formatJuta(n.kas) }];
  if (n.piutang !== undefined) posisi.push({ label: 'Piutang (belum dibayar pelanggan)', value: formatJuta(n.piutang) });
  if (n.stok !== undefined) posisi.push({ label: 'Nilai stok di gudang', value: formatJuta(n.stok) });
  return (
    <section className="card p-5" aria-labelledby="laporan-bisnis">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="laporan-bisnis" className="font-display text-lg font-extrabold">📊 Laporan bisnis — rata-rata PER BULAN</h2>
        <span className="chip bg-paper text-xs">Semua angka estimasi, rupiah</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label} className={`rounded-2xl border-2 border-ink p-3 ${r.tone ?? 'bg-white'}`}>
            <p className="text-xs font-bold">{r.label}</p>
            <p className="font-display text-xl font-extrabold">{r.value}</p>
            <p className="text-xs text-muted">{r.hint}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-paper p-3">
        <p className="text-xs font-extrabold uppercase tracking-wider">Posisi hari ini (bukan per bulan)</p>
        <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
          {posisi.map((p) => (<div key={p.label}><dt className="text-muted">{p.label}</dt><dd className="font-bold">{p.value}</dd></div>))}
        </dl>
        {runway !== null && <p className="mt-2 text-sm font-bold text-danger">⏳ Runway ±{runway.toLocaleString('id-ID')} bulan: kas habis dalam waktu itu jika rugi tidak berubah.</p>}
      </div>
      <p className="mt-3 text-sm"><strong>Pelanggan:</strong> {n.pelanggan}</p>
      {n.catatan && <p className="mt-1 text-sm text-muted">{n.catatan}</p>}
    </section>
  );
}

function TeamBoard({ roles, openAll = false }: { roles: SimRole[]; openAll?: boolean }) {
  return (
    <section aria-label="Struktur tim & job desk" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-extrabold">👥 Struktur tim & job desk</h2>
        {!openAll && <span className="text-xs text-muted">Klik tiap peran untuk melihat tugas harian, mingguan, KPI, dan sumber prospek.</span>}
      </div>
      <div className="grid items-start gap-3 md:grid-cols-2">
        {roles.map((r) => <RoleCard key={r.role} role={r} open={openAll} />)}
      </div>
    </section>
  );
}

function RoleCard({ role: r, open }: { role: SimRole; open: boolean }) {
  const list = (title: string, items: string[] | undefined, cls = '') => (items && items.length > 0 ? (
    <div className={cls}>
      <p className="text-xs font-extrabold uppercase tracking-wider">{title}</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm">{items.map((x) => <li key={x}>{x}</li>)}</ul>
    </div>
  ) : null);
  return (
    <details className="card group border-2 border-ink/15 p-4 open:border-ink" open={open || undefined}>
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
        <span>
          <span className="block font-bold leading-tight">{r.role}</span>
          <span className="mt-0.5 block text-xs text-muted">{/^\d+$/.test(r.jumlah) ? `${r.jumlah} orang` : r.jumlah}{r.atasan ? ` · lapor ke ${r.atasan}` : ''}</span>
          <span className="mt-1 block text-sm">{r.misi}</span>
        </span>
        <span aria-hidden className="chip shrink-0 bg-paper group-open:rotate-180">▾</span>
      </summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {list('Harian', r.harian)}
        {list('Mingguan', r.mingguan)}
        {list('🎯 KPI', r.kpi, 'rounded-2xl bg-lilac/50 p-2.5')}
        {list('🧭 Cari prospek di', r.prospek, 'rounded-2xl bg-lime/60 p-2.5')}
        {r.tools && r.tools.length > 0 && <p className="text-sm sm:col-span-2"><strong>Tools:</strong> {r.tools.join(' · ')}</p>}
      </div>
    </details>
  );
}

function RhythmTable({ ops }: { ops: SimOps }) {
  return (
    <section className="card p-5" aria-labelledby="ritme">
      <h2 id="ritme" className="font-display text-lg font-extrabold">🗓️ Ritme kerja</h2>
      <p className="text-xs text-muted">Kapan rapat, kapan eksekusi, siapa yang terlibat.</p>
      <table className="mt-3 w-full text-left text-sm">
        <thead><tr className="border-b-2 border-ink text-xs uppercase"><th className="py-1.5 pr-2">Kapan</th><th className="py-1.5 pr-2">Agenda</th><th className="py-1.5">Siapa</th></tr></thead>
        <tbody>
          {ops.ritme.map((x) => (
            <tr key={x.kapan + x.agenda} className="border-b border-ink/10 align-top last:border-0">
              <td className="py-2 pr-2 font-bold">{x.kapan}</td><td className="py-2 pr-2">{x.agenda}</td><td className="py-2 text-muted">{x.siapa}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function FunnelChart({ ops }: { ops: SimOps }) {
  const { steps, periode } = ops.funnel;
  const top = Math.log10(Math.max(steps[0].angka, 10));
  return (
    <section className="card p-5" aria-labelledby="funnel">
      <h2 id="funnel" className="font-display text-lg font-extrabold">🔻 Funnel penjualan <span className="text-sm font-bold text-muted">({periode})</span></h2>
      <p className="text-xs text-muted">Dari banyak orang yang dijangkau, hanya sebagian kecil yang membayar. Ini angka yang harus dikejar tim sales/marketing.</p>
      <ol className="mt-3 space-y-2.5">
        {steps.map((st, i) => {
          const width = Math.max(14, (Math.log10(Math.max(st.angka, 1)) / top) * 100);
          const conv = i > 0 && steps[i - 1].angka > 0 ? Math.round((st.angka / steps[i - 1].angka) * 1000) / 10 : null;
          return (
            <li key={st.tahap}>
              <div className="flex justify-between gap-2 text-sm"><span>{st.tahap}</span><strong>{st.angka.toLocaleString('id-ID')}</strong></div>
              <div className="mt-1 h-3 overflow-hidden rounded-full border border-ink bg-white"><div className="h-full bg-sky" style={{ width: `${width}%` }} /></div>
              {conv !== null && <p className="mt-0.5 text-xs text-muted">{conv.toLocaleString('id-ID')}% dari tahap sebelumnya</p>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function ExecutionPlan({ steps, title, compact = false }: { steps: SimExecution; title: string; compact?: boolean }) {
  return (
    <div className={`rounded-3xl border-2 border-ink ${compact ? 'bg-paper p-3' : 'bg-sky p-4'}`}>
      <p className="text-xs font-extrabold uppercase tracking-wider">{title}</p>
      <ol className="mt-2 space-y-2">
        {steps.map((e, i) => (
          <li key={e.siapa + e.tugas} className="flex gap-3 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink bg-white text-xs font-bold">{i + 1}</span>
            <span><span className="chip mr-1.5 bg-white py-0 text-xs">{e.siapa}</span>{e.tugas}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
