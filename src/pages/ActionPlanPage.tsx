import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { ACTION_PLAN, ALL_TASK_IDS } from '../content/actionPlan';
import { getProgress, setDayNote, setTask } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import { ErrorState, PageHeader, PageSkeleton, ProgressBar, useToast } from '../components/ui';

export default function ActionPlanPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const { data: progress, setData: setProgress, loading, error, reload } = useAsync(() => getProgress(profile!.uid), [profile?.uid]);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const firstOpenDay = progress ? ACTION_PLAN.find((d) => d.tasks.some((t) => !progress.tasks[t.id]))?.day ?? 7 : 1;
  const day = ACTION_PLAN.find((d) => d.day === (activeDay ?? firstOpenDay))!;

  useEffect(() => { if (progress) setNote(progress.notes[`d${day.day}`] ?? ''); }, [day.day, progress]);

  if (loading) return <PageSkeleton />;
  if (error || !progress) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const done = ALL_TASK_IDS.filter((id) => progress.tasks[id]).length;
  const pct = Math.round((done / ALL_TASK_IDS.length) * 100);

  async function toggle(id: string) {
    if (!profile || !progress) return;
    const next = !progress.tasks[id];
    setBusy(id);
    setProgress({ ...progress, tasks: { ...progress.tasks, [id]: next } }); // optimistic
    try {
      await setTask(profile.uid, id, next);
    } catch {
      setProgress({ ...progress, tasks: { ...progress.tasks, [id]: !next } });
      toast('error', 'Gagal menyimpan. Coba lagi.');
    } finally {
      setBusy(null);
    }
  }

  async function saveNote() {
    if (!profile || !progress) return;
    setBusy('note');
    try {
      await setDayNote(profile.uid, day.day, note);
      setProgress({ ...progress, notes: { ...progress.notes, [`d${day.day}`]: note } });
      toast('success', 'Catatan tersimpan.');
    } catch {
      toast('error', 'Gagal menyimpan catatan.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Arsip catatan lama" title="Checklist tujuh hari versi lama"
        desc="Catatan dan centang lamamu tetap ada. Untuk latihan baru yang berfokus pada hasil kerja, buka Misi Pertama."
        right={<div className="w-full sm:w-60"><ProgressBar value={pct} label={`${done}/${ALL_TASK_IDS.length} misi`} /></div>} />

      <Link to="/app/action-plan" className="btn-accent">Buka Misi Pertama →</Link>
      <ol className="grid grid-cols-7 gap-1.5 sm:gap-2" aria-label="Hari">
        {ACTION_PLAN.map((d) => {
          const all = d.tasks.every((t) => progress.tasks[t.id]);
          const some = d.tasks.some((t) => progress.tasks[t.id]);
          const on = d.day === day.day;
          return (
            <li key={d.day}>
              <button type="button" onClick={() => setActiveDay(d.day)} aria-current={on ? 'step' : undefined}
                className={`flex w-full flex-col items-center rounded-2xl border-2 py-2.5 text-xs font-bold transition ${
                  on ? 'border-ink bg-ink text-paper' : all ? 'border-ink bg-lime' : some ? 'border-ink/40 bg-amber-soft' : 'border-line bg-white'}`}>
                <span className="hidden sm:block">Hari</span>
                <span className="font-display text-lg leading-none sm:text-2xl">{d.day}</span>
                <span aria-hidden className="mt-0.5 h-4">{all ? '✓' : ''}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="card-pop p-6">
        <p className="eyebrow">Hari {day.day}</p>
        <h2 className="font-display text-2xl font-extrabold">{day.title}</h2>
        <p className="text-sm text-ink/75">🎯 {day.goal}</p>
        <ul className="mt-5 space-y-2.5">
          {day.tasks.map((t) => {
            const checked = !!progress.tasks[t.id];
            return (
              <li key={t.id} className={`flex flex-wrap items-center gap-3 rounded-2xl border-2 p-3 ${checked ? 'border-ink bg-lime/50' : 'border-line'}`}>
                <label className="flex flex-1 cursor-pointer items-center gap-3 text-sm font-semibold">
                  <input type="checkbox" className="h-5 w-5 accent-ink" checked={checked} disabled={busy === t.id} onChange={() => void toggle(t.id)} />
                  <span className={checked ? 'line-through decoration-2 opacity-70' : ''}>{t.label}</span>
                </label>
                {t.link && <Link to={t.link.to} className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-paper">{t.link.label} →</Link>}
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <label htmlFor="day-note" className="label">Catatan & refleksi hari ini</label>
          <textarea id="day-note" rows={4} maxLength={2000} className="input" value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="Apa yang berhasil? Apa yang bikin susah? Apa yang mau dicoba besok?" />
          <button type="button" className="btn-primary mt-3" disabled={busy === 'note' || note === (progress.notes[`d${day.day}`] ?? '')} onClick={() => void saveNote()}>
            {busy === 'note' ? 'Menyimpan…' : 'Simpan catatan'}
          </button>
        </div>
      </section>
      <p className="text-xs text-muted">Status di halaman ini dilaporkan sendiri oleh peserta (self-reported), belum diverifikasi admin.</p>
    </div>
  );
}
