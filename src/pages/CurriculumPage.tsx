import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { MODULES, SEASONS } from '../content/modules';
import { useAccess } from '../auth/AccessProvider';
import { FEATURE_MIN, moduleFeature, PLAN_INFO } from '../lib/membership';
import { getDreamPact, getProgress } from '../lib/data';
import { dreamPactProgress } from '../lib/dreamPact';
import { useAsync } from '../lib/useAsync';
import { ErrorState, PageHeader, PageSkeleton, ProgressBar, TILE_BG } from '../components/ui';

export default function CurriculumPage() {
  const access = useAccess();
  const { profile } = useAuth();
  const { data, loading, error, reload } = useAsync(async () => {
    const [progress, pact] = await Promise.all([getProgress(profile!.uid), getDreamPact(profile!.uid, profile!.displayName)]);
    return { progress, pact };
  }, [profile?.uid]);

  if (loading) return <PageSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const { progress, pact } = data;
  const allLessons = MODULES.flatMap((m) => m.lessons);
  const doneAll = allLessons.filter((l) => progress.lessons[l.id]?.done).length;
  const pactPct = dreamPactProgress(pact.data).pct;

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Kurikulum GenZ Preneur" title={<>4 Season menuju <span className="text-amber">Dream Pact</span>.</>}
        desc="Kerjakan berurutan atau loncat ke yang paling kamu butuhkan. Setiap pelajaran punya latihan yang tersimpan di akunmu."
        right={<div className="w-full sm:w-64"><ProgressBar value={Math.round((doneAll / allLessons.length) * 100)} label={`${doneAll}/${allLessons.length} pelajaran`} /></div>} />

      {SEASONS.map((s) => {
        const mods = MODULES.filter((m) => m.season === s.no);
        return (
          <section key={s.no} aria-labelledby={`season-${s.no}`}>
            <div className="mb-4 flex flex-wrap items-end gap-3">
              <span className="chip bg-ink text-paper">Season {s.no}</span>
              <h2 id={`season-${s.no}`} className="font-display text-2xl font-extrabold">{s.name}</h2>
              <p className="w-full text-sm text-muted sm:w-auto">{s.desc}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mods.map((m) => {
                const done = m.lessons.filter((l) => progress.lessons[l.id]?.done).length;
                const pct = Math.round((done / m.lessons.length) * 100);
                const locked = !access.loading && !access.can(moduleFeature(m));
                const need = PLAN_INFO[FEATURE_MIN[moduleFeature(m)]];
                return (
                  <Link key={m.slug} to={`/app/belajar/${m.slug}`} className={`card-pop flex flex-col p-5 transition hover:-translate-y-0.5 ${locked ? 'bg-paper-2 opacity-80' : TILE_BG[m.color]}`}>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl" aria-hidden>{m.emoji}</span>
                      {locked ? <span className="chip bg-white">🔒 {need.name}</span> : pct === 100 && <span className="chip bg-white">✓ Selesai</span>}
                    </div>
                    <h3 className="mt-3 font-display text-xl font-extrabold leading-tight">{m.title}</h3>
                    <p className="text-sm text-ink/70">{m.tagline}</p>
                    <div className="mt-auto pt-4"><ProgressBar value={pct} label={`${done}/${m.lessons.length} pelajaran`} /></div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="card-pop flex flex-col gap-4 bg-ink p-6 text-paper sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-lime">Final Boss</p>
          <h2 className="font-display text-3xl font-extrabold">🌟 Dream Pact</h2>
          <p className="mt-1 max-w-lg text-paper/75">Rangkum semua yang kamu pelajari jadi satu komitmen tertulis: WHY, Edge, mimpi, milestone, dan rencana 12 bulan. Bisa dicetak.</p>
          <div className="mt-3 max-w-xs"><ProgressBar value={pactPct} label="Kelengkapan" /></div>
        </div>
        <Link to="/app/dream-pact" className="btn-accent shrink-0">{pactPct === 0 ? 'Mulai Dream Pact' : 'Lanjutkan'} →</Link>
      </section>
    </div>
  );
}
