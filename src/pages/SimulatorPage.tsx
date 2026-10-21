import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { INDUSTRIES, INDUSTRY_KEYS, type IndustryKey } from '../content/industries';
import { SIM_AREAS, SIM_LEVELS, SIM_LEVEL_ORDER, SIM_PHASES, findScenario, phaseOf, type SimDecisionFull, type SimExecution, type SimLevelKey, type SimOps, type SimRole, type SimScenario, type SimStats } from '../content/simulator';
import { SIM_TEASER_LEVEL, isTeaserScenario, blueprintText, displayOrder, evaluate, formatDelta, formatJuta, playThrough, runwayBulan } from '../lib/simulator';
import { CopyButton, PageHeader } from '../components/ui';
import { useMaybeAccess } from '../auth/AccessProvider';
import { SITE } from '../config/site';

const isIndustry = (v: string | null): v is IndustryKey => !!v && (INDUSTRY_KEYS as readonly string[]).includes(v);
const isLevel = (v: string | null): v is SimLevelKey => !!v && (SIM_LEVEL_ORDER as string[]).includes(v);

/**
 * `fullAccess` hanya untuk tes. Di aplikasi, akses penuh = boleh fitur `simulator` (GenZ Impact/admin);
 * selain itu peserta hanya bisa memainkan Level 1 Rintis (gratis) di semua industri.
 */
export default function SimulatorPage({ fullAccess }: { fullAccess?: boolean } = {}) {
  const access = useMaybeAccess();
  const full = fullAccess ?? (access ? access.can('simulator') : true);
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

  if (scenario && !full && !isTeaserScenario(scenario)) {
    return <UpsellCard locked={scenario} onTry={() => choose({ level: SIM_TEASER_LEVEL })} onBack={() => choose({ level: null })} />;
  }
  if (scenario) return <ScenarioPlayer teaser={!full} key={`${scenario.industry}-${scenario.level}`} scenario={scenario} onExit={() => choose({ level: null })} onSwitchLevel={(l) => choose({ level: l })} />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Simulasi Founder · 30 skenario" title={<>Bayangkan bisnismu <span className="headline-marker">naik level.</span></>}
        desc="Pilih industri dan level modal. Kamu masuk ke bisnis yang sedang berjalan: lihat laporan keuangan per bulan, kenali timmu dan job desk masing-masing (sales cari prospek ke mana, gudang ngapain, manager ngapain), lalu jalankan bisnis selama 90 hari lewat 10 keputusan sulit: sales & prospek, gudang & operasional, tim, keuangan, krisis, sampai strategi naik level. Setiap akhir bulan ada laporan, dan setiap keputusan dilengkapi rencana eksekusi: siapa mengerjakan apa. Di akhir kamu dapat playbook tim lengkap."
        right={<span aria-hidden className="brand-sticker">ROLEPLAY ✦</span>} />

      {!full && (
        <section className="card-pop flex flex-wrap items-center justify-between gap-4 bg-amber-soft p-5" aria-label="Akses gratis">
          <div className="max-w-2xl">
            <p className="eyebrow">✨ Gratis untuk paketmu</p>
            <p className="font-display text-lg font-extrabold">Level 1 Rintis bisa kamu mainkan GRATIS di 10 industri.</p>
            <p className="text-sm">Level 2 Tumbuh & Level 3 Skala (20 skenario saat bisnis sudah punya tim & modal besar) ada di 🎯 GenZ Impact.</p>
          </div>
          <button type="button" className="btn-accent" onClick={() => document.getElementById('pick-industry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Pilih industri ↓</button>
        </section>
      )}

      <section aria-labelledby="pick-industry" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="pick-industry" className="font-display text-xl font-extrabold">1. Pilih industri</h2>
          {!full && <span className="chip bg-lime">✨ Level 1 gratis di semua industri</span>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {INDUSTRY_KEYS.map((k) => {
            const ind = INDUSTRIES[k];
            const active = industry === k;
            return (
              <button key={k} type="button" aria-pressed={active} onClick={() => choose({ industri: k })}
                className={`card-pop flex flex-col items-start gap-2 p-4 text-left transition hover:-translate-y-0.5 ${active ? 'bg-lime' : 'bg-white'}`}>
                <span className="text-2xl" aria-hidden>{ind.emoji}</span>
                <span className="font-bold leading-tight">{ind.name}</span>
                {!full && <span className="chip mt-auto bg-amber-soft text-xs">✨ Level 1 gratis</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="pick-level" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="pick-level" className="font-display text-xl font-extrabold">2. Pilih level modal</h2>
          {!full && <span className="text-sm font-semibold">✨ Level 1 = gratis · 🔒 Level 2–3 = GenZ Impact</span>}
        </div>
        {!industry && <p className="text-sm text-muted">Pilih industri dulu, lalu tentukan level yang ingin kamu mainkan.</p>}
        <div className="grid gap-3 md:grid-cols-3">
          {SIM_LEVEL_ORDER.map((l) => {
            const info = SIM_LEVELS[l];
            const sc = industry ? findScenario(industry, l) : undefined;
            const locked = !full && !!sc && !isTeaserScenario(sc);
            return (
              <button key={l} type="button" disabled={!industry} onClick={() => choose({ level: l })}
                className={`card-pop relative flex flex-col items-start gap-2 p-5 text-left transition enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${info.tile}`}>
                {!full && l === SIM_TEASER_LEVEL && <span aria-hidden className="brand-sticker absolute -top-3 right-4">GRATIS ✦</span>}
                <span className="chip bg-white">Level {info.no} · {info.name}{!full ? (l === SIM_TEASER_LEVEL ? ' · ✨ Gratis' : ' · 🔒 Impact') : ''}</span>
                <span className="font-display text-lg font-extrabold">{info.modal}</span>
                <span className="text-sm font-semibold">{info.team}</span>
                <span className="text-sm">{sc ? sc.title : info.desc}</span>
                {industry && <span className="mt-1 text-sm font-bold underline">{locked ? 'Lihat isi di GenZ Impact →' : !full ? 'Main gratis →' : 'Mulai skenario →'}</span>}
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

function ScenarioPlayer({ scenario, onExit, onSwitchLevel, teaser = false }: { scenario: SimScenario; onExit: () => void; onSwitchLevel: (l: SimLevelKey) => void; teaser?: boolean }) {
  const total = scenario.decisions.length;
  const storeKey = `gzp-sim:${scenario.industry}:${scenario.level}`;
  const saved = useMemo(() => loadProgress(storeKey, total), [storeKey, total]);
  const [started, setStarted] = useState(saved.started);
  const [choices, setChoices] = useState<number[]>(saved.choices);
  const [revealed, setRevealed] = useState(false);
  /** Indeks fase yang baru selesai → tampilkan laporan akhir bulan. */
  const [checkpoint, setCheckpoint] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ind = INDUSTRIES[scenario.industry];
  const lvl = SIM_LEVELS[scenario.level];
  const history = useMemo(() => playThrough(scenario, choices), [scenario, choices]);
  const current = history[history.length - 1];
  const step = revealed ? choices.length - 1 : choices.length;
  const done = choices.length === total && !revealed;

  useEffect(() => { headingRef.current?.focus(); }, [started, step, done, checkpoint]);
  useEffect(() => { saveProgress(storeKey, { started, choices }); }, [storeKey, started, choices]);

  function pick(optionIndex: number) {
    setChoices((c) => [...c, optionIndex]);
    setRevealed(true);
  }

  function next() {
    const i = choices.length - 1;
    setRevealed(false);
    const ph = phaseOf(i);
    if (i < total - 1 && ph.to === i) setCheckpoint(ph.no - 1);
  }

  function restart() { setChoices([]); setRevealed(false); setCheckpoint(null); setStarted(true); }

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
        <Roadmap scenario={scenario} />
        <section className="card bg-paper p-5 text-sm">
          <h2 className="font-bold">Cara main</h2>
          <p className="mt-1">Pelajari dulu laporan bisnis dan timmu di atas. Lalu jalankan bisnis selama <strong>90 hari: 10 keputusan nyata</strong>, dengan laporan di setiap akhir bulan. Pilih keputusan yang menurutmu paling tepat (tidak ada tombol kembali, sama seperti di dunia nyata). Setiap pilihan mengubah <strong>kas</strong>, <strong>reputasi</strong>, dan <strong>energi tim</strong>, dan kamu akan melihat <strong>siapa di tim mengerjakan apa</strong> untuk menjalankannya.</p>
        </section>
        <p className="text-sm text-muted">Waktu main ±15–20 menit. Progresmu tersimpan otomatis di perangkat ini.</p>
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
            <span className="chip bg-white">{result.bestCount}/{total} keputusan terbaik</span>
          </div>
        </section>
        <StatsBar stats={result.final} start={scenario.start} />
        {teaser && <ImpactUpsell next={nextLevel ? findScenario(scenario.industry, nextLevel) : undefined} />}
        {result.warnings.length > 0 && (
          <section className="card border-2 border-danger/30 bg-danger-soft p-5">
            <h2 className="font-bold text-danger">Perhatikan</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{result.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
          </section>
        )}

        <AreaScore scenario={scenario} choices={choices} />

        <section aria-labelledby="debrief" className="space-y-4">
          <div>
            <h2 id="debrief" className="font-display text-2xl font-extrabold">Pembahasan 90 hari</h2>
            <p className="text-sm text-muted">Klik tiap keputusan untuk melihat pelajaran dan rencana eksekusi timnya.</p>
          </div>
          {SIM_PHASES.map((p, pi) => (
            <div key={p.no} className="space-y-2">
              <h3 className="font-display text-lg font-extrabold">{p.name} · {p.label}</h3>
              <p className="text-sm text-muted">Target: {scenario.fase[pi]}</p>
              {scenario.decisions.slice(p.from, p.to + 1).map((d, k) => <DebriefItem key={d.title} no={p.from + k + 1} d={d} choice={choices[p.from + k]} />)}
            </div>
          ))}
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
          {nextLevel && !teaser && <button type="button" className="btn-accent" onClick={() => onSwitchLevel(nextLevel)}>Coba Level {SIM_LEVELS[nextLevel].no} · {SIM_LEVELS[nextLevel].name} →</button>}
          <button type="button" className="btn-ghost" onClick={onExit}>Pilih industri lain</button>
        </div>
      </div>
    );
  }

  if (checkpoint !== null) {
    const ph = SIM_PHASES[checkpoint];
    const nextPh = SIM_PHASES[checkpoint + 1];
    const before = history[ph.from];
    const after = history[ph.to + 1];
    const monthBest = choices.slice(ph.from, ph.to + 1).filter((c, k) => scenario.decisions[ph.from + k].options[c]?.best).length;
    const count = ph.to - ph.from + 1;
    return (
      <div className="space-y-5">
        {header}
        <section className="card-pop space-y-4 bg-amber-soft p-6" aria-live="polite">
          <p className="eyebrow">Laporan akhir {ph.name}</p>
          <h1 ref={headingRef} tabIndex={-1} className="h-page outline-none">{ph.name} selesai: {ph.label}</h1>
          <p className="text-sm"><strong>Target bulan ini:</strong> {scenario.fase[checkpoint]}</p>
          <div className="flex flex-wrap gap-2">
            <span className="chip bg-white">{monthBest}/{count} keputusan tepat</span>
            <Delta label="Kas" value={Math.round((after.kas - before.kas) * 10) / 10} unit="kas" />
            <Delta label="Reputasi" value={after.reputasi - before.reputasi} unit="poin" />
            <Delta label="Energi tim" value={after.tim - before.tim} unit="poin" />
          </div>
          <p className="text-sm">{monthBest === count ? 'Bulan yang solid. Fondasi ini membuat bulan berikutnya lebih ringan.' : monthBest >= count - 1 ? 'Cukup baik, tapi ada satu keputusan yang mahal. Lihat lagi di pembahasan akhir.' : 'Bulan yang berat. Di dunia nyata, kesalahan seperti ini biasanya terasa di kas dan tim pada bulan berikutnya.'}</p>
        </section>
        <StatsBar stats={after} start={scenario.start} />
        {nextPh && (
          <section className="card p-5">
            <p className="eyebrow">Berikutnya · {nextPh.name}</p>
            <h2 className="font-display text-lg font-extrabold">{nextPh.label}</h2>
            <p className="mt-1 text-sm"><strong>Target:</strong> {scenario.fase[checkpoint + 1]}</p>
            <p className="mt-1 text-sm text-muted">{nextPh.to - nextPh.from + 1} keputusan menunggu.</p>
          </section>
        )}
        <button type="button" className="btn-accent" onClick={() => setCheckpoint(null)}>Mulai {nextPh?.name ?? 'bulan berikutnya'} →</button>
      </div>
    );
  }

  const decision = scenario.decisions[step];
  const order = displayOrder(scenario, step);
  const phase = phaseOf(step);
  const area = SIM_AREAS[decision.area];
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow">{phase.name} · Keputusan {step + 1} dari {total}</p>
          <div className="flex gap-1" aria-hidden>
            {scenario.decisions.map((_, i) => (
              <span key={i} className={`h-2.5 w-4 rounded-full border border-ink sm:w-6 ${i < choices.length ? 'bg-ink' : 'bg-white'} ${SIM_PHASES.some((p) => p.from === i && i > 0) ? 'ml-1.5' : ''}`} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="chip bg-sky">{area.emoji} {area.label}</span>
          <span className="chip bg-paper">Target {phase.name}: {scenario.fase[phase.no - 1]}</span>
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
            <button type="button" className="btn-accent" onClick={next}>
              {choices.length === total ? 'Lihat hasil & blueprint →' : phaseOf(step).to === step ? `Lihat laporan akhir ${phaseOf(step).name} →` : 'Lanjut ke keputusan berikutnya →'}
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

/* ───────────────────────── v3: perjalanan 90 hari ───────────────────────── */

function loadProgress(key: string, total: number): { started: boolean; choices: number[] } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { started: false, choices: [] };
    const v = JSON.parse(raw) as { started?: unknown; choices?: unknown };
    const choices = Array.isArray(v.choices) ? v.choices.filter((c): c is number => Number.isInteger(c) && c >= 0 && c <= 2).slice(0, total) : [];
    return { started: v.started === true, choices };
  } catch { return { started: false, choices: [] }; }
}

function saveProgress(key: string, v: { started: boolean; choices: number[] }) {
  try {
    if (!v.started && v.choices.length === 0) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(v));
  } catch { /* penyimpanan tidak tersedia — abaikan */ }
}

function Roadmap({ scenario }: { scenario: SimScenario }) {
  return (
    <section className="card p-5" aria-labelledby="roadmap">
      <h2 id="roadmap" className="font-display text-lg font-extrabold">🗺️ Perjalanan 90 hari · {scenario.decisions.length} keputusan</h2>
      <ol className="mt-3 grid gap-3 md:grid-cols-3">
        {SIM_PHASES.map((p, pi) => {
          const ds = scenario.decisions.slice(p.from, p.to + 1);
          return (
            <li key={p.no} className="rounded-2xl border-2 border-ink bg-white p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider">{p.name} · {ds.length} keputusan</p>
              <p className="font-bold">{p.label}</p>
              <p className="mt-1 text-sm"><strong>Target:</strong> {scenario.fase[pi]}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ds.map((d, k) => <span key={k} className="chip bg-paper text-xs">{SIM_AREAS[d.area].emoji} {SIM_AREAS[d.area].label}</span>)}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function AreaScore({ scenario, choices }: { scenario: SimScenario; choices: number[] }) {
  const rows = (Object.keys(SIM_AREAS) as (keyof typeof SIM_AREAS)[]).map((a) => {
    const idx = scenario.decisions.map((d, i) => (d.area === a ? i : -1)).filter((i) => i >= 0);
    const ok = idx.filter((i) => scenario.decisions[i].options[choices[i]]?.best).length;
    return { a, n: idx.length, ok };
  }).filter((r) => r.n > 0);
  return (
    <section className="card p-5" aria-labelledby="area-score">
      <h2 id="area-score" className="font-display text-lg font-extrabold">📈 Rapor per area bisnis</h2>
      <p className="text-xs text-muted">Area dengan skor terendah adalah titik buta yang perlu kamu latih atau delegasikan ke orang yang lebih kuat.</p>
      <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {rows.map((r) => (
          <li key={r.a} className={`rounded-2xl border-2 border-ink p-3 ${r.ok === r.n ? 'bg-lime' : r.ok === 0 ? 'bg-pink' : 'bg-white'}`}>
            <p className="text-sm font-bold">{SIM_AREAS[r.a].emoji} {SIM_AREAS[r.a].label}</p>
            <p className="font-display text-xl font-extrabold">{r.ok}/{r.n}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DebriefItem({ no, d, choice }: { no: number; d: SimDecisionFull; choice: number }) {
  const mine = d.options[choice];
  const best = d.options.find((x) => x.best)!;
  return (
    <details className="card group border-2 border-ink/15 p-4 open:border-ink">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
        <span>
          <span className="block text-xs font-extrabold uppercase tracking-wider text-muted">Keputusan {no} · {SIM_AREAS[d.area].emoji} {SIM_AREAS[d.area].label}</span>
          <span className="block font-bold">{mine?.best ? '✅' : '❌'} {d.title}</span>
        </span>
        <span aria-hidden className="chip shrink-0 bg-paper group-open:rotate-180">▾</span>
      </summary>
      <div className="mt-3 space-y-2">
        <p className="text-sm"><strong>Pilihanmu:</strong> {mine?.label ?? '—'}</p>
        {!mine?.best && <p className="text-sm"><strong>Pilihan terbaik:</strong> {best.label}</p>}
        <p className="rounded-2xl bg-lilac/50 p-3 text-sm"><strong>Pelajaran:</strong> {d.lesson}</p>
        <ExecutionPlan steps={d.execution} title="Rencana eksekusi tim" compact />
      </div>
    </details>
  );
}

/* ───────────────────────── Teaser & upsell ke GenZ Impact ───────────────────────── */

/** Ikuti status landing: selama Impact belum dijual, arahkan ke daftar tunggu. */
const IMPACT_CHECKOUT = SITE.plans.find((p) => p.key === 'impact')?.checkoutUrl ?? '/#harga';
const IMPACT_OPEN = Boolean((SITE.plans.find((p) => p.key === 'impact') as { saleReady?: boolean } | undefined)?.saleReady);

function ImpactCta() {
  const open = IMPACT_OPEN;
  return (
    <div className="flex flex-wrap gap-2">
      {open
        ? <a href={IMPACT_CHECKOUT} target="_blank" rel="noopener noreferrer" className="btn-accent">Beli GenZ Impact →</a>
        : <Link to="/daftar?minat=impact" className="btn-accent">Masuk daftar tunggu GenZ Impact →</Link>}
      <Link to="/voucher" className="btn-ghost">🎟️ Punya voucher Impact?</Link>
    </div>
  );
}

const IMPACT_GETS = [
  '20 skenario Level 2 Tumbuh & Level 3 Skala di 10 industri: saat bisnis sudah punya tim, gudang, dan modal puluhan juta sampai miliaran',
  'Laporan bisnis, struktur tim & job desk tiap divisi untuk setiap skenario',
  '300 keputusan dengan rencana eksekusi siapa-ngapain',
  'Blueprint & playbook tim lengkap yang bisa disalin',
];

function ImpactUpsell({ next }: { next?: SimScenario }) {
  const open = IMPACT_OPEN;
  return (
    <section className="card-pop space-y-3 bg-lilac p-6" aria-labelledby="upsell">
      <p className="eyebrow">Level 1 gratis · Level 2–3 di GenZ Impact</p>
      <h2 id="upsell" className="font-display text-2xl font-extrabold">Siap naik level? 20 skenario lanjutan + playbook lengkap ada di 🎯 GenZ Impact</h2>
      {next && <p className="rounded-2xl bg-white p-3 text-sm"><strong>Lanjutan ceritamu — Level {SIM_LEVELS[next.level].no} {SIM_LEVELS[next.level].name}:</strong> {next.title}. {next.persona}</p>}
      <ul className="list-disc space-y-1 pl-5 text-sm">{IMPACT_GETS.map((x) => <li key={x}>{x}</li>)}</ul>
      {!open && <p className="text-sm">Pendaftaran GenZ Impact belum dibuka. Masuk daftar tunggu supaya kamu dikabari lebih dulu. Pemilik GenZ Boost juga bisa meminta trial Impact 7 hari ke tim GenZ Preneur.</p>}
      <ImpactCta />
    </section>
  );
}

function UpsellCard({ locked, onTry, onBack }: { locked: SimScenario; onTry: () => void; onBack: () => void }) {
  const ind = INDUSTRIES[locked.industry];
  const lvl = SIM_LEVELS[locked.level];
  return (
    <div className="space-y-5">
      <button type="button" className="btn-ghost py-1.5 text-sm" onClick={onBack}>← Pilih skenario lain</button>
      <section className={`card-pop space-y-3 p-6 ${lvl.tile}`}>
        <p className="eyebrow">🔒 Skenario GenZ Impact · {ind.emoji} {ind.name} · Level {lvl.no} {lvl.name}</p>
        <h1 className="h-page">{locked.title}</h1>
        <p className="max-w-3xl text-[15px] leading-relaxed">{locked.persona}</p>
        <p className="text-sm"><strong>Di dalamnya:</strong> {locked.decisions.length} keputusan selama 90 hari, laporan bisnis per bulan, {locked.ops.roles.length} peran tim dengan job desk, dan blueprint siap salin.</p>
      </section>
      <ImpactUpsell />
      <section className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <p className="text-sm">Belum yakin? Mainkan dulu Level 1 Rintis di industri ini, gratis dan lengkap 10 keputusan.</p>
        <button type="button" className="btn-primary" onClick={onTry}>Main {ind.name} · Level 1 gratis →</button>
      </section>
    </div>
  );
}
