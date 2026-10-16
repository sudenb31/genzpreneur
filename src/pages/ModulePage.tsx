import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { findModule, MODULES, SEASONS } from '../content/modules';
import { getProgress, saveLesson } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import { EmptyState, ErrorState, PageSkeleton, ProgressBar, TILE_BG, useToast } from '../components/ui';

export default function ModulePage() {
  const { slug = '' } = useParams();
  const mod = findModule(slug);
  const { profile } = useAuth();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const { data: progress, setData: setProgress, loading, error, reload } = useAsync(() => getProgress(profile!.uid), [profile?.uid]);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);

  const lessonId = params.get('pelajaran') ?? mod?.lessons[0]?.id;
  const lessonIdx = mod ? Math.max(0, mod.lessons.findIndex((l) => l.id === lessonId)) : 0;
  const lesson = mod?.lessons[lessonIdx];
  const lp = lesson && progress ? progress.lessons[lesson.id] : undefined;

  useEffect(() => { setReflection(lp?.reflection ?? ''); }, [lesson?.id, lp?.reflection]);

  if (!mod) return <EmptyState title="Modul tidak ditemukan" description="Periksa kembali tautannya." action={<Link to="/app" className="btn-primary">Ke Dashboard</Link>} />;
  if (loading) return <PageSkeleton />;
  if (error || !progress || !lesson) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const doneCount = mod.lessons.filter((l) => progress.lessons[l.id]?.done).length;
  const pct = Math.round((doneCount / mod.lessons.length) * 100);
  const open = (id: string) => { setParams({ pelajaran: id }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  async function persist(done: boolean) {
    if (!profile || !lesson) return;
    setSaving(true);
    try {
      await saveLesson(profile.uid, lesson.id, { done, reflection });
      setProgress((p) => p && { ...p, lessons: { ...p.lessons, [lesson.id]: { done, reflection: reflection.slice(0, 2000) } } });
      toast('success', done ? 'Pelajaran ditandai selesai 🎉' : 'Catatan tersimpan.');
    } catch (e) {
      console.error(e);
      toast('error', 'Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  const next = mod.lessons[lessonIdx + 1];
  const nextModule = MODULES[MODULES.findIndex((m) => m.slug === mod.slug) + 1];

  return (
    <div className="space-y-6">
      <header className={`card-pop flex flex-wrap items-center gap-5 p-6 ${TILE_BG[mod.color]}`}>
        <span className="grid h-16 w-16 rotate-[-4deg] place-items-center rounded-2xl border-2 border-ink bg-white text-4xl" aria-hidden>{mod.emoji}</span>
        <div className="flex-1">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em]"><Link to="/app/kurikulum" className="underline">Kurikulum</Link> · Season {mod.season} · {SEASONS[mod.season - 1].name}</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{mod.title}</h1>
          <p className="text-ink/75">{mod.tagline}</p>
        </div>
        <div className="w-full sm:w-56"><ProgressBar value={pct} label={`${doneCount}/${mod.lessons.length} selesai`} /></div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav aria-label="Daftar pelajaran" className="space-y-2 lg:sticky lg:top-6 lg:self-start">
          {mod.lessons.map((l, i) => {
            const on = l.id === lesson.id;
            const done = progress.lessons[l.id]?.done;
            return (
              <button key={l.id} type="button" onClick={() => open(l.id)} aria-current={on ? 'step' : undefined}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left text-sm transition ${on ? 'border-ink bg-white shadow-[3px_3px_0_0_#111112]' : 'border-transparent hover:bg-paper-2'}`}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold ${done ? 'border-ink bg-ok text-white' : 'border-line text-muted'}`}>{done ? '✓' : i + 1}</span>
                <span><span className="block font-bold leading-snug">{l.title}</span><span className="text-xs text-muted">{l.minutes} menit</span></span>
              </button>
            );
          })}
        </nav>

        <article className="card space-y-6 p-6 sm:p-8">
          <div>
            <p className="eyebrow">Pelajaran {lessonIdx + 1} · {lesson.minutes} menit</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">{lesson.title}</h2>
          </div>
          <div className="prose-lesson">{lesson.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>

          <div className="rounded-3xl border-2 border-ink bg-lime/60 p-5">
            <h3 className="font-extrabold">📝 Poin penting</h3>
            <ul className="mt-2 space-y-1.5 text-sm">{lesson.keyPoints.map((k) => <li key={k}>✦ {k}</li>)}</ul>
          </div>

          {lesson.mythFact && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border-2 border-ink bg-pink/50 p-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider">🙅 Mitos</h3>
                <p className="mt-2 text-sm font-semibold">{lesson.mythFact.myth}</p>
              </div>
              <div className="rounded-3xl border-2 border-ink bg-sky/50 p-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider">✅ Fakta</h3>
                <p className="mt-2 text-sm font-semibold">{lesson.mythFact.fact}</p>
              </div>
            </div>
          )}

          {lesson.glossary && lesson.glossary.length > 0 && (
            <div className="rounded-3xl border-2 border-dashed border-ink p-5">
              <h3 className="font-extrabold">📖 Kamus kilat</h3>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                {lesson.glossary.map((g) => (
                  <div key={g.term}>
                    <dt className="text-sm font-extrabold">{g.term}</dt>
                    <dd className="text-sm text-ink/75">{g.meaning}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {lesson.example && (
            <div className="rounded-3xl bg-paper p-5">
              <h3 className="font-extrabold">💡 {lesson.example.title}</h3>
              <p className="mt-2 text-sm text-ink/80">{lesson.example.text}</p>
            </div>
          )}

          <div>
            <label htmlFor="reflection" className="font-display text-lg font-extrabold">✍️ Latihan</label>
            <p className="mt-1 text-sm text-ink/80">{lesson.exercise.prompt}</p>
            <textarea id="reflection" rows={5} maxLength={2000} className="input mt-3" placeholder={lesson.exercise.placeholder}
              value={reflection} onChange={(e) => setReflection(e.target.value)} />
            <p className="hint">{reflection.length}/2000 · Hanya kamu yang bisa melihat jawaban ini.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-line pt-5">
            <button type="button" className="btn-accent" disabled={saving} onClick={() => void persist(true)}>
              {saving ? 'Menyimpan…' : lp?.done ? 'Simpan jawaban' : 'Simpan & tandai selesai'}
            </button>
            {lp?.done && <button type="button" className="btn-ghost" disabled={saving} onClick={() => void persist(false)}>Tandai belum selesai</button>}
            {lesson.tool && <Link to={lesson.tool.to} className="btn-ghost">{lesson.tool.label} →</Link>}
            {next && <button type="button" className="btn-primary ml-auto" onClick={() => open(next.id)}>Pelajaran berikutnya →</button>}
            {!next && nextModule && <Link to={`/app/belajar/${nextModule.slug}`} className="btn-primary ml-auto">Modul berikutnya: {nextModule.title} →</Link>}
            {!next && !nextModule && <Link to="/app/dream-pact" className="btn-primary ml-auto">Lanjut ke Dream Pact 🌟</Link>}
          </div>
        </article>
      </div>
    </div>
  );
}
