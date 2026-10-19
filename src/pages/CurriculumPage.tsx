import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { MODULES, SEASONS } from '../content/modules';
import { useAccess } from '../auth/AccessProvider';
import { FEATURE_MIN, moduleFeature, PLAN_INFO } from '../lib/membership';
import { getDreamPact, getProgress } from '../lib/data';
import { lessonUrl, nextLearningLesson } from '../lib/learning';
import { dreamPactProgress } from '../lib/dreamPact';
import { useAsync } from '../lib/useAsync';
import { ErrorState, PageHeader, PageSkeleton, ProgressBar } from '../components/ui';

export default function CurriculumPage() {
  const access = useAccess();
  const [search, setSearch] = useState('');
  const { profile } = useAuth();
  const { data, loading, error, reload } = useAsync(async () => {
    const [progress, pact] = await Promise.all([getProgress(profile!.uid), getDreamPact(profile!.uid, profile!.displayName)]);
    return { progress, pact };
  }, [profile?.uid]);

  if (loading || access.loading) return <PageSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const { progress, pact } = data;
  const allLessons = MODULES.flatMap((m) => m.lessons);
  const doneAll = allLessons.filter((l) => progress.lessons[l.id]?.done).length;
  const pactPct = dreamPactProgress(pact.data).pct;
  const resume = nextLearningLesson(progress.lessons, access.can);
  const query = search.trim().toLocaleLowerCase('id');
  const visibleModules = MODULES.filter((m) => `${m.title} ${m.tagline} ${m.lessons.map((l) => l.title).join(' ')}`.toLocaleLowerCase('id').includes(query));

  return (
    <div className="learning-space space-y-6">
      <PageHeader eyebrow="Ruang belajar · 4 Season" title={<>Belajar. Coba. <span className="headline-marker">Naik level.</span></>}
        desc="Pilih materi yang membantu pekerjaanmu saat ini. Tidak perlu menamatkan semua modul sebelum mencoba bantuan kecil."
        right={<div className="w-full sm:w-64"><ProgressBar value={Math.round((doneAll / allLessons.length) * 100)} label={`${doneAll}/${allLessons.length} pelajaran`} /></div>} />

      <section className="card bg-lilac p-5"><h2 className="font-display text-xl font-extrabold">Belajar untuk mengerjakan sesuatu.</h2><p className="mt-2 text-sm">Misi Pertama menghubungkan masalah pelanggan, contoh kerja, penawaran, percobaan, dan evaluasi. Materi di bawah bisa dibuka sesuai kebutuhan.</p><Link to="/app/action-plan" className="btn-primary mt-4">Buka Misi Pertama →</Link></section>
      {resume && <section className="learning-resume card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><p className="eyebrow">Pelajaran berikutnya untukmu</p><h2 className="mt-2 font-display text-lg font-extrabold">{resume.lesson.title}</h2><p className="mt-1 text-sm text-muted">{resume.mod.title} · {resume.lesson.minutes} menit · latihan bisa disimpan</p></div><Link to={lessonUrl(resume.mod.slug, resume.lesson.id)} className="btn-primary shrink-0">Lanjut belajar →</Link></section>}
      <div className="learning-search"><label htmlFor="learning-search" className="label">Cari materi yang kamu butuhkan</label><input id="learning-search" type="search" className="input" placeholder="Misalnya: harga, pelanggan, mindset…" value={search} onChange={(e) => setSearch(e.target.value)} /><p role="status" className="hint">{query ? `${visibleModules.length} modul cocok dengan pencarianmu.` : `${MODULES.length} modul · ${allLessons.length} pelajaran. Pilih sesuai kebutuhanmu.`}</p></div>
      {visibleModules.length === 0 && <div className="card p-6"><p className="font-bold">Materi belum ditemukan.</p><p className="mt-1 text-sm text-muted">Coba kata yang lebih singkat atau lihat semua materi.</p><button type="button" className="btn-ghost mt-4" onClick={() => setSearch('')}>Hapus pencarian</button></div>}
      {SEASONS.map((s) => {
        const mods = visibleModules.filter((m) => m.season === s.no);
        if (!mods.length) return null;
        return (
          <section className="season-section" data-season={s.no} key={s.no} aria-labelledby={`season-${s.no}`}>
            <div className="season-heading mb-4 flex flex-wrap items-center gap-3">
              <span className="season-number">Season {s.no}</span>
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
                  <Link key={m.slug} to={`/app/belajar/${m.slug}`} className={`learning-module card-pop flex flex-col p-5 transition hover:-translate-y-0.5 ${locked ? 'bg-paper-2' : 'bg-white'}`}>
                    <div className="flex items-start justify-between">
                      <span className="module-sticker grid h-12 w-12 place-items-center rounded-xl bg-white text-3xl" aria-hidden>{m.emoji}</span>
                      {locked ? <span className="chip bg-white">🔒 {need.name}</span> : pct === 100 && <span className="chip bg-white">✓ Selesai</span>}
                    </div>
                    <h3 className="mt-3 font-display text-xl font-extrabold leading-tight">{m.title}</h3>
                    <p className="text-sm text-ink/70">{m.tagline}</p>
                    <p className="mt-3 text-xs font-extrabold">{locked ? 'Lihat akses modul ↗' : pct === 100 ? 'Buka lagi & praktik ↗' : 'Buka playbook →'}</p><div className="mt-auto pt-4"><ProgressBar value={pct} label={`${done}/${m.lessons.length} pelajaran`} /></div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="card-pop flex flex-col gap-4 bg-ink p-6 text-paper sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-paper/70">Opsional · arah jangka panjang</p>
          <h2 className="font-display text-3xl font-extrabold">Kontrak Mimpi · Dream Pact</h2>
          <p className="mt-1 max-w-lg text-paper/75">Rangkum semua yang kamu pelajari jadi satu komitmen tertulis: WHY, Edge, mimpi, milestone, dan rencana 12 bulan. Bisa dicetak.</p>
          <div className="mt-3 max-w-xs"><ProgressBar value={pactPct} label="Kelengkapan" /></div>
        </div>
        <Link to="/app/dream-pact" className="btn-accent shrink-0">{pactPct === 0 ? 'Mulai Dream Pact' : 'Lanjutkan'} →</Link>
      </section>
    </div>
  );
}
