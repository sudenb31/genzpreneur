import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { LockedFeature, useAccess } from '../auth/AccessProvider';
import { moduleFeature } from '../lib/membership';
import { findModule, MODULES, SEASONS } from '../content/modules';
import { getProgress, saveLesson } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import { ConfirmDialog, EmptyState, ErrorState, PageSkeleton, ProgressBar, useToast } from '../components/ui';

export default function ModulePage() {
  const { slug = '' } = useParams();
  const mod = findModule(slug);
  const { profile } = useAuth();
  const access = useAccess();
  const toast = useToast();
  const [params] = useSearchParams();
  const { data: progress, setData: setProgress, loading, error, reload } = useAsync(() => getProgress(profile!.uid), [profile?.uid]);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingTo, setPendingTo] = useState<string | null>(null);
  const [outlineOpen, setOutlineOpen] = useState(() => window.matchMedia?.('(min-width: 1024px)').matches ?? true);
  const navigate = useNavigate();

  const lessonId = params.get('pelajaran') ?? mod?.lessons[0]?.id;
  const lessonIdx = mod ? Math.max(0, mod.lessons.findIndex((l) => l.id === lessonId)) : 0;
  const lesson = mod?.lessons[lessonIdx];
  const lp = lesson && progress ? progress.lessons[lesson.id] : undefined;
  const dirty = reflection !== (lp?.reflection ?? '');

  useEffect(() => { setReflection(lp?.reflection ?? ''); }, [lesson?.id, lp?.reflection]);

  useEffect(() => {
    const media = window.matchMedia?.('(min-width: 1024px)');
    if (!media) return;
    const sync = () => setOutlineOpen(media.matches);
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    const protectLink = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = e.target instanceof Element ? e.target.closest('a') : null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const target = new URL(anchor.href);
      if (target.origin !== window.location.origin || target.hash && target.pathname === window.location.pathname && target.search === window.location.search) return;
      e.preventDefault();
      e.stopPropagation();
      if (!saving) setPendingTo(`${target.pathname}${target.search}${target.hash}`);
    };
    window.addEventListener('beforeunload', warn);
    document.addEventListener('click', protectLink, true);
    return () => { window.removeEventListener('beforeunload', warn); document.removeEventListener('click', protectLink, true); };
  }, [dirty, saving]);

  if (!mod) return <EmptyState title="Modul tidak ditemukan" description="Periksa kembali tautannya." action={<Link to="/app" className="btn-primary">Ke Dashboard</Link>} />;
  if (!access.loading && !access.can(moduleFeature(mod))) return <LockedFeature feature={moduleFeature(mod)} />;
  if (loading || access.loading) return <PageSkeleton />;
  if (error || !progress || !lesson) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const doneCount = mod.lessons.filter((l) => progress.lessons[l.id]?.done).length;
  const pct = Math.round((doneCount / mod.lessons.length) * 100);
  const moveTo = (to: string) => {
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const requestMove = (to: string) => { if (saving) return; if (dirty) setPendingTo(to); else moveTo(to); };
  const open = (id: string) => requestMove(`/app/belajar/${mod.slug}?pelajaran=${encodeURIComponent(id)}`);

  async function persist(done: boolean) {
    if (!profile || !lesson) return false;
    setSaving(true);
    try {
      await saveLesson(profile.uid, lesson.id, { done, reflection });
      setProgress((p) => p && { ...p, lessons: { ...p.lessons, [lesson.id]: { done, reflection: reflection.slice(0, 2000) } } });
      toast('success', done ? 'Pelajaran dan latihan tersimpan.' : 'Draf latihan tersimpan.');
      return true;
    } catch (e) {
      console.error(e);
      toast('error', 'Gagal menyimpan. Jawabanmu masih ada di halaman ini. Coba lagi.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  const next = mod.lessons[lessonIdx + 1];
  const nextModule = MODULES[MODULES.findIndex((m) => m.slug === mod.slug) + 1];

  return (
    <div className="space-y-6">
      <header className="lesson-module-header card flex flex-wrap items-center gap-4 p-5">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-soft text-2xl" aria-hidden>{mod.emoji}</span>
        <div className="flex-1">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em]"><button type="button" className="underline" disabled={saving} onClick={() => requestMove('/app/kurikulum')}>Belajar</button> · Season {mod.season} · {SEASONS[mod.season - 1].name}</p>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">{mod.title}</h1>
          <p className="text-ink/75">{mod.tagline}</p>
        </div>
        <div className="w-full sm:w-56"><ProgressBar value={pct} label={`${doneCount}/${mod.lessons.length} selesai`} /></div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <details className="lg:sticky lg:top-24 lg:self-start" open={outlineOpen} onToggle={(e) => setOutlineOpen(e.currentTarget.open)}><summary className="mb-3 cursor-pointer text-sm font-bold">Daftar pelajaran · {lessonIdx + 1}/{mod.lessons.length}</summary><nav aria-label="Daftar pelajaran" className="lesson-outline space-y-1">
          {mod.lessons.map((l, i) => {
            const on = l.id === lesson.id;
            const done = progress.lessons[l.id]?.done;
            return (
              <button key={l.id} type="button" disabled={saving} onClick={() => open(l.id)} aria-current={on ? 'step' : undefined}
                className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left text-sm transition ${on ? 'border-amber/30 bg-amber-soft' : 'border-transparent hover:bg-paper-2'}`}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold ${done ? 'border-ink bg-ok text-white' : 'border-line text-muted'}`}>{done ? '✓' : i + 1}</span>
                <span><span className="block font-bold leading-snug">{l.title}</span><span className="text-xs text-muted">{l.minutes} menit</span></span>
              </button>
            );
          })}
        </nav></details>

        <article className="lesson-reader card space-y-7 p-5 sm:p-8">
          <div>
            <p className="eyebrow">Pelajaran {lessonIdx + 1} · {lesson.minutes} menit</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight sm:text-3xl">{lesson.title}</h2>
          </div>
          <div className="prose-lesson">{lesson.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>

          <div className="lesson-notes">
            <h3 className="font-extrabold">📝 Poin penting</h3>
            <ul className="mt-2 space-y-1.5 text-sm">{lesson.keyPoints.map((k) => <li key={k}>✦ {k}</li>)}</ul>
          </div>

          {lesson.mythFact && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-paper p-5">
                <h3 className="text-xs font-extrabold uppercase tracking-wider">🙅 Mitos</h3>
                <p className="mt-2 text-sm font-semibold">{lesson.mythFact.myth}</p>
              </div>
              <div className="rounded-2xl border border-ok/20 bg-ok-soft p-5">
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
            <textarea id="reflection" rows={5} maxLength={2000} className="input mt-3" disabled={saving} placeholder={lesson.exercise.placeholder}
              value={reflection} onChange={(e) => setReflection(e.target.value)} />
            <p className="hint" aria-live="polite">{reflection.length}/2000 · {dirty ? 'Ada perubahan belum disimpan.' : lp ? 'Jawaban tersimpan di akunmu.' : 'Simpan draf untuk melanjutkan nanti.'}</p>
          </div>

          <div className="space-y-4 border-t border-line pt-5">
            <p className="text-xs leading-relaxed text-muted">Jawaban disimpan saat kamu menekan tombol simpan. Kamu bisa menyimpan draf dulu atau menandai pelajaran selesai.</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-accent" disabled={saving} onClick={() => void persist(true)}>{saving ? 'Menyimpan…' : lp?.done ? 'Simpan jawaban' : 'Simpan & tandai selesai'}</button>
              <button type="button" className="btn-ghost" disabled={saving || !dirty} onClick={() => void persist(lp?.done ?? false)}>Simpan draf</button>
              {lp?.done && <button type="button" className="btn-ghost" disabled={saving} onClick={() => void persist(false)}>Tandai belum selesai</button>}
            </div>
            <button type="button" className="btn-ghost" disabled={saving} onClick={() => requestMove('/app/action-plan')}>Terapkan di Misi Pertama →</button>
            {lesson.tool && <button type="button" className="btn-ghost" disabled={saving} onClick={() => requestMove(lesson.tool!.to)}>{lesson.tool.label} →</button>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <button type="button" className="text-sm font-semibold underline" disabled={saving} onClick={() => requestMove('/app/kurikulum')}>← Semua materi</button>
              <button type="button" className="btn-primary" disabled={saving} onClick={() => {
                if (next) open(next.id);
                else requestMove(nextModule ? `/app/belajar/${nextModule.slug}` : '/app/dream-pact');
              }}>{next ? 'Pelajaran berikutnya →' : nextModule ? 'Modul berikutnya →' : 'Buka Misi Pertama →'}</button>
            </div>
          </div>
        </article>
      </div>
      <ConfirmDialog open={pendingTo !== null} title="Latihan belum disimpan" description="Kembali ke latihan untuk menyimpan jawaban terlebih dahulu. Jika tetap pindah, perubahan terakhir akan dibuang." confirmLabel="Pindah tanpa menyimpan" cancelLabel="Kembali ke latihan" onCancel={() => setPendingTo(null)} onConfirm={() => { if (pendingTo) moveTo(pendingTo); setPendingTo(null); }} />
    </div>
  );
}
