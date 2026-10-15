import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getAssessment, getDreamPact, getPassport, getProgress } from '../lib/data';
import { dreamPactProgress } from '../lib/dreamPact';
import { useAsync } from '../lib/useAsync';
import { completionPercent } from '../lib/passport';
import { MODULES, SEASONS } from '../content/modules';
import { ACTION_PLAN, ALL_TASK_IDS } from '../content/actionPlan';
import { INDUSTRIES } from '../content/industries';
import { TRACKS } from '../content/assessment';
import { ErrorState, PageSkeleton, ProgressBar, TILE_BG } from '../components/ui';


export default function Dashboard() {
  const { profile, firebaseUser } = useAuth();
  const { data, loading, error, reload } = useAsync(async () => {
    const [passport, assessment, progress, pact] = await Promise.all([
      getPassport(profile!.uid, profile!.displayName),
      getAssessment(profile!.uid),
      getProgress(profile!.uid),
      getDreamPact(profile!.uid, profile!.displayName),
    ]);
    return { passport, assessment, progress, pact };
  }, [profile?.uid]);

  if (loading) return <PageSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const { passport, assessment, progress, pact } = data;
  const pactPct = dreamPactProgress(pact.data).pct;
  const passportPct = completionPercent(passport.data);
  const seasonStats = SEASONS.map((se) => {
    const lessons = MODULES.filter((m) => m.season === se.no).flatMap((m) => m.lessons);
    const done = lessons.filter((l) => progress.lessons[l.id]?.done).length;
    return { se, done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 };
  });
  const SEASON_TILE = ['bg-lime', 'bg-pink', 'bg-sky', 'bg-lilac'];
  const tasksDone = ALL_TASK_IDS.filter((id) => progress.tasks[id]).length;
  const planPct = Math.round((tasksDone / ALL_TASK_IDS.length) * 100);
  const currentDay = ACTION_PLAN.find((d) => d.tasks.some((t) => !progress.tasks[t.id]));
  const firstName = (profile?.displayName || 'Entrepreneur').split(' ')[0];

  // Langkah berikutnya — urutan deterministik.
  const next =
    passportPct < 100 ? { to: '/app/passport', label: 'Lengkapi Passport', why: `Baru ${passportPct}% — dipakai untuk personalisasi semua tools.` }
    : !assessment ? { to: '/app/assessment', label: 'Ikuti Assessment Industri', why: '±3 menit untuk tahu industri dan jalur yang paling cocok.' }
    : currentDay ? { to: '/app/action-plan', label: `Lanjut Action Plan · Hari ${currentDay.day}`, why: currentDay.goal }
    : pactPct < 100 ? { to: '/app/dream-pact', label: 'Selesaikan Dream Pact', why: 'Tulis komitmenmu, cetak, dan tempel di tempat yang sering kamu lihat.' }
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
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold">Kurikulum · 4 Season</h2>
          <Link to="/app/kurikulum" className="text-sm font-bold underline">Lihat semua →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {seasonStats.map(({ se, done, total, pct }, i) => (
            <Link key={se.no} to="/app/kurikulum" className={`card-pop flex flex-col p-5 transition hover:-translate-y-0.5 ${SEASON_TILE[i]}`}>
              <span className="chip w-fit bg-white">Season {se.no}</span>
              <h3 className="mt-3 font-display text-lg font-extrabold leading-tight">{se.name}</h3>
              <p className="text-xs text-ink/70">{se.desc}</p>
              <div className="mt-auto pt-4"><ProgressBar value={pct} label={`${done}/${total} pelajaran`} /></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/app/toolkit" className="card-pop flex flex-col bg-white p-5 transition hover:-translate-y-0.5">
          <span className="text-3xl" aria-hidden>⚡</span>
          <h3 className="mt-2 font-display text-lg font-extrabold">AI Business Toolkit</h3>
          <p className="text-sm text-ink/70">Prompt library · Kalkulator komisi · Proposal · Problem Map</p>
        </Link>
        <Link to="/app/action-plan" className="card-pop flex flex-col bg-amber-soft p-5 transition hover:-translate-y-0.5">
          <span className="text-3xl" aria-hidden>✅</span>
          <h3 className="mt-2 font-display text-lg font-extrabold">Action Plan 7 Hari</h3>
          <div className="mt-auto pt-3"><ProgressBar value={planPct} label={`${tasksDone}/${ALL_TASK_IDS.length} misi`} /></div>
        </Link>
        <Link to="/app/dream-pact" className="card-pop flex flex-col bg-ink p-5 text-paper transition hover:-translate-y-0.5">
          <span className="text-3xl" aria-hidden>🌟</span>
          <h3 className="mt-2 font-display text-lg font-extrabold">Dream Pact</h3>
          <p className="text-sm text-paper/70">Komitmen tertulis untuk mimpi bisnismu — bisa dicetak.</p>
          <p className="mt-auto pt-3 text-sm font-bold text-lime">{pactPct}% lengkap →</p>
        </Link>
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
