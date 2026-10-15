import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getAssessment, getPassport, getProgress } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import { completionPercent } from '../lib/passport';
import { MODULES } from '../content/modules';
import { ACTION_PLAN, ALL_TASK_IDS } from '../content/actionPlan';
import { INDUSTRIES } from '../content/industries';
import { TRACKS } from '../content/assessment';
import { ErrorState, PageSkeleton, ProgressBar, TILE_BG } from '../components/ui';

export default function Dashboard() {
  const { profile, firebaseUser } = useAuth();
  const { data, loading, error, reload } = useAsync(async () => {
    const [passport, assessment, progress] = await Promise.all([
      getPassport(profile!.uid, profile!.displayName),
      getAssessment(profile!.uid),
      getProgress(profile!.uid),
    ]);
    return { passport, assessment, progress };
  }, [profile?.uid]);

  if (loading) return <PageSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const { passport, assessment, progress } = data;
  const passportPct = completionPercent(passport.data);
  const moduleStats = MODULES.map((m) => {
    const done = m.lessons.filter((l) => progress.lessons[l.id]?.done).length;
    return { m, done, pct: Math.round((done / m.lessons.length) * 100) };
  });
  const tasksDone = ALL_TASK_IDS.filter((id) => progress.tasks[id]).length;
  const planPct = Math.round((tasksDone / ALL_TASK_IDS.length) * 100);
  const currentDay = ACTION_PLAN.find((d) => d.tasks.some((t) => !progress.tasks[t.id]));
  const firstName = (profile?.displayName || 'Entrepreneur').split(' ')[0];

  // Langkah berikutnya — urutan deterministik.
  const next =
    passportPct < 100 ? { to: '/app/passport', label: 'Lengkapi Passport', why: `Baru ${passportPct}% — dipakai untuk personalisasi semua tools.` }
    : !assessment ? { to: '/app/assessment', label: 'Ikuti Assessment Industri', why: '±3 menit untuk tahu industri dan jalur yang paling cocok.' }
    : currentDay ? { to: '/app/action-plan', label: `Lanjut Action Plan · Hari ${currentDay.day}`, why: currentDay.goal }
    : { to: '/app/outreach', label: 'Kirim outreach berikutnya', why: 'Action Plan selesai 🎉 Pertahankan ritme minggu ini.' };

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-[2rem] border-2 border-ink bg-ink p-6 text-paper shadow-[5px_5px_0_0_#ff5a1f] sm:p-8">
        <span aria-hidden className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-amber/30 blur-2xl" />
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-lime">Dashboard</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Yo, {firstName}! 👋</h1>
        <p className="mt-2 max-w-xl text-paper/75">Satu langkah kecil yang jelas lebih berguna daripada rencana besar yang nggak dijalankan.</p>
        <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-paper/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-paper/60">Langkah berikutnya</p>
            <p className="font-display text-xl font-extrabold">{next.label}</p>
            <p className="text-sm text-paper/70">{next.why}</p>
          </div>
          <Link to={next.to} className="btn-accent shrink-0">Gas →</Link>
        </div>
      </header>

      {firebaseUser && !firebaseUser.emailVerified && (
        <div role="note" className="rounded-2xl border-2 border-amber bg-amber-soft px-4 py-3 text-sm font-semibold text-amber-ink">
          Email kamu belum terverifikasi. Cek inbox/spam {firebaseUser.email}. Verifikasi akan diwajibkan sebelum pembelian program.
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <Link to="/app/passport" className="card-pop block p-5 transition hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">🪪 Entrepreneur Passport</h2>
            <span className="chip">{passportPct}%</span>
          </div>
          <div className="mt-4"><ProgressBar value={passportPct} label="Kelengkapan" /></div>
        </Link>
        <Link to="/app/assessment" className={`card-pop block p-5 transition hover:-translate-y-0.5 ${assessment ? 'bg-sky' : ''}`}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold">🧭 Assessment Industri</h2>
            <span className="chip bg-white">{assessment ? 'Selesai' : 'Belum'}</span>
          </div>
          {assessment ? (
            <p className="mt-3 text-sm">
              Top: <strong>{INDUSTRIES[assessment.topIndustries[0]].emoji} {INDUSTRIES[assessment.topIndustries[0]].name}</strong><br />
              Jalur: <strong>{TRACKS[assessment.track].name}</strong>
            </p>
          ) : <p className="mt-3 text-sm text-muted">12 pertanyaan · temukan industri yang paling cocok.</p>}
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-2xl font-extrabold">5 Benefit Program</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moduleStats.map(({ m, done, pct }) => (
            <Link key={m.slug} to={`/app/belajar/${m.slug}`} className={`card-pop flex flex-col p-5 transition hover:-translate-y-0.5 ${TILE_BG[m.color]}`}>
              <div className="flex items-start justify-between">
                <span className="text-3xl" aria-hidden>{m.emoji}</span>
                <span className="chip bg-white">#{m.benefitNo}</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-extrabold leading-tight">{m.title}</h3>
              <p className="text-sm text-ink/70">{m.tagline}</p>
              <div className="mt-auto pt-4"><ProgressBar value={pct} label={`${done}/${m.lessons.length} pelajaran`} /></div>
            </Link>
          ))}
          <Link to="/app/toolkit" className="card-pop flex flex-col bg-pink p-5 transition hover:-translate-y-0.5">
            <div className="flex items-start justify-between"><span className="text-3xl" aria-hidden>⚡</span><span className="chip bg-white">#4</span></div>
            <h3 className="mt-3 font-display text-lg font-extrabold leading-tight">AI Business Toolkit</h3>
            <p className="text-sm text-ink/70">Template dan tools untuk mendukung eksekusi.</p>
            <p className="mt-auto pt-4 text-xs font-bold">Prompt library · Kalkulator komisi · Proposal →</p>
          </Link>
          <Link to="/app/action-plan" className="card-pop flex flex-col bg-amber-soft p-5 transition hover:-translate-y-0.5">
            <div className="flex items-start justify-between"><span className="text-3xl" aria-hidden>✅</span><span className="chip bg-white">#5</span></div>
            <h3 className="mt-3 font-display text-lg font-extrabold leading-tight">Practical Action Plan</h3>
            <p className="text-sm text-ink/70">Panduan langkah awal yang terstruktur.</p>
            <div className="mt-auto pt-4"><ProgressBar value={planPct} label={`${tasksDone}/${ALL_TASK_IDS.length} misi`} /></div>
          </Link>
        </div>
      </section>

      <section className={`card-pop flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between ${TILE_BG.lime}`}>
        <div>
          <h2 className="font-display text-xl font-extrabold">💬 Outreach Studio — modal Rp0</h2>
          <p className="text-sm">Pesan siap kirim untuk mentor, jadi sales partner, atau menawarkan jasa ke UMKM.</p>
        </div>
        <Link to="/app/outreach" className="btn-primary shrink-0">Buka studio →</Link>
      </section>
    </div>
  );
}
