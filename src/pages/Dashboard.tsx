import { ENTRY_KEY, ENTRY_PATH, entryMissionStage, readEntry } from '../lib/entry';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useAccess } from '../auth/AccessProvider';
import { getAssessment, getProgress } from '../lib/data';
import { missionSummary } from '../lib/mission';
import { MISSION_STEPS } from '../content/mission';
import { useAsync } from '../lib/useAsync';

import { nextLearningLesson, lessonUrl } from '../lib/learning';
import { MODULES } from '../content/modules';

import { INDUSTRIES } from '../content/industries';
import { TRACKS } from '../content/assessment';
import { ErrorState, PageSkeleton, ProgressBar } from '../components/ui';

const QUICK_TOOLS = [
  { to: '/app/toolkit?tab=hpp', icon: '🧾', label: 'Hitung harga jual', desc: 'HPP, biaya & margin', feature: 'toolkit' as const },
  { to: '/app/toolkit?tab=calculator', icon: '🧮', label: 'Simulasi komisi', desc: 'Hitung hasil per penjualan', feature: 'toolkit' as const },
  { to: '/app/toolkit?tab=proposal', icon: '📄', label: 'Susun proposal', desc: 'Buat penawaran yang jelas', feature: 'toolkit' as const },
  { to: '/app/outreach', icon: '💬', label: 'Cari pelanggan', desc: 'Siapkan pesan personal', feature: 'outreach' as const },
];

export default function Dashboard() {
  const { profile, firebaseUser } = useAuth();
  const access = useAccess();
  const { data, loading, error, reload } = useAsync(async () => {
    const [assessment, progress] = await Promise.all([getAssessment(profile!.uid), getProgress(profile!.uid)]);
    return { assessment, progress };
  }, [profile?.uid]);
  if (loading || access.loading) return <PageSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const { assessment, progress } = data;
  const allLessons = MODULES.flatMap((m) => m.lessons);
  const doneLessons = allLessons.filter((l) => progress.lessons[l.id]?.done).length;
  const work = missionSummary(progress.notes);
  const entry = readEntry(progress.notes[ENTRY_KEY]);
  const entryStep = MISSION_STEPS.find(s => s.id === entryMissionStage(progress.notes))!;
  const learning = nextLearningLesson(progress.lessons, access.can);
  const firstName = (profile?.displayName || 'Entrepreneur').split(' ')[0];
  const next = access.can('actionPlan')
    ? { to: `/app/action-plan?tahap=${entryStep.id}`, label: entryStep.title, desc: entryStep.outcome, cta: 'Lanjut Misi Pertama' }    : learning
    ? { to: lessonUrl(learning.mod.slug, learning.lesson.id), label: learning.lesson.title, desc: `${learning.lesson.minutes} menit membaca, lalu praktik lewat latihan yang bisa kamu simpan.`, cta: 'Buka pelajaran' }
    : access.can('outreach')
    ? { to: '/app/outreach', label: 'Siapkan percakapan dengan calon pelanggan.', desc: 'Susun pesan yang relevan untuk satu bisnis yang ingin kamu bantu.', cta: 'Siapkan pesan' }
    : { to: '/app/tersimpan', label: 'Tinjau kembali hasil kerjamu.', desc: 'Buka catatan dan hasil yang sudah kamu simpan, lalu pilih yang ingin dikembangkan.', cta: 'Buka hasil tersimpan' };

  return (
    <div className="dashboard-space space-y-6 sm:space-y-8">
      <header className="dashboard-greeting flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">Ruang bertumbuhmu</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Halo, {firstName}<span className="text-amber">.</span></h1><p className="mt-2 text-sm text-muted">Satu bantuan kecil untuk satu jenis bisnis. Siapkan, coba, lalu perbaiki.</p></div>
        <Link to="/app/tersimpan" className="text-sm font-semibold underline underline-offset-4">Lihat hasil tersimpan ↗</Link>
      </header>

      <section aria-labelledby="today-title" className="dashboard-focus">
        <div className="relative z-10 max-w-2xl">
          <p className="focus-label"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber" />Fokus hari ini</p>
          <h2 id="today-title" className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">{next.label}</h2>
          <p className="focus-description mt-4 max-w-lg text-sm leading-relaxed">{next.desc}</p>
          <Link to={next.to} className="btn-accent mt-6">{next.cta} →</Link>
          <p className="focus-footnote mt-4 text-xs">Mulai dari satu langkah. Nggak harus beres semuanya hari ini.</p>
        </div>
        <span aria-hidden className="dashboard-focus-mark">↗</span>
      </section>

      <section className="card border-2 bg-lilac/30 p-5"><h2 className="font-bold">Kondisi awal, minat, dan progres itu berbeda.</h2><p className="mt-2 text-sm">{entry ? 'Kondisi awalmu sudah tersimpan. Saran berdasarkan jawaban sendiri; pekerjaan yang sudah ada tetap bisa dilanjutkan.' : 'Mau memilih titik masuk yang lebih sesuai? Petakan bekal dan kendalamu secara singkat. Ini opsional; pekerjaan lama tetap tersedia.'}</p><Link to={ENTRY_PATH} className="btn-ghost mt-3">{entry ? 'Tinjau kondisi awal & titik masuk →' : 'Petakan kondisi awal (opsional) →'}</Link></section>
      {firebaseUser && !firebaseUser.emailVerified && <div role="note" className="rounded-2xl border border-amber/40 bg-amber-soft p-4 text-sm text-amber-ink">Email belum terverifikasi. Cek inbox atau spam <strong className="break-all">{firebaseUser.email}</strong> untuk melanjutkan verifikasi akun.</div>}

      <section className="dashboard-stats grid grid-cols-2 gap-3 sm:gap-4" aria-label="Catatan hasil kerja">
        <div className="card p-4 sm:p-5"><p className="text-xs font-semibold text-muted">Draf hasil kerja tersimpan</p><p className="mt-2 font-display text-3xl font-extrabold">{work.written}<span className="ml-1 text-sm font-medium text-muted">/ {MISSION_STEPS.length}</span></p><p className="mt-1 text-xs text-muted">Buka Misi Pertama untuk melihat atau mengunduh.</p></div>
        <div className="card p-4 sm:p-5"><p className="text-xs font-semibold text-muted">Tahap dinilai sendiri</p><p className="mt-2 font-display text-3xl font-extrabold">{work.reviewed}<span className="ml-1 text-sm font-medium text-muted">/ {MISSION_STEPS.length}</span></p><p className="mt-1 text-xs text-muted">Centang kriteria, bukan verifikasi mentor atau keberhasilan bisnis.</p></div>
      </section>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="continue-title" className="dashboard-continue card flex flex-col p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3"><h2 id="continue-title" className="section-title">Materi saat dibutuhkan</h2><Link to="/app/kurikulum" className="text-xs font-bold text-muted underline">Semua materi</Link></div>
          {learning ? <>
            <p className="text-xs font-semibold text-muted">Season {learning.mod.season} · {learning.mod.title}</p>
            <h3 className="mt-2 font-display text-xl font-extrabold leading-snug">{learning.lesson.title}</h3>
            <p className="mt-2 text-sm text-muted">{learning.lesson.minutes} menit · {progress.lessons[learning.lesson.id]?.reflection.trim() ? 'Ada latihan tersimpan untuk dilanjutkan' : 'Baca, praktik, lalu simpan latihanmu'}</p>
            <div className="my-5"><ProgressBar value={Math.round(doneLessons / allLessons.length * 100)} label={`${doneLessons} dari ${allLessons.length} pelajaran selesai`} /></div>
            <Link to={lessonUrl(learning.mod.slug, learning.lesson.id)} className="btn-primary mt-auto self-start">Lanjutkan pelajaran →</Link>
          </> : <><p className="text-sm text-muted">{doneLessons === allLessons.length ? 'Semua pelajaran sudah kamu tandai selesai. Buka kembali materi untuk mengulang atau memperbarui latihan.' : 'Belum ada pelajaran berikutnya yang tersedia pada aksesmu. Kamu bisa meninjau materi yang sudah selesai atau melihat paket.'}</p><Link to="/app/kurikulum" className="btn-ghost mt-5 self-start">Buka ruang belajar →</Link></>}
        </section>
        <section aria-labelledby="direction-title" className="dashboard-direction card p-5 sm:p-6">
          <h2 id="direction-title" className="section-title">Arah & bekalmu</h2>
          <p className="mt-2 text-sm text-muted">Kenali diri sambil jalan. Profil dan assessment bersifat opsional; keputusanmu tetap perlu diuji lewat pengamatan.</p>
          <div className="mt-5 divide-y divide-line">
            <Link to="/app/assessment" className="dashboard-row"><span><strong className="block text-sm">Temukan Jalurmu</strong><span className="mt-1 block text-xs text-muted">{assessment ? `${INDUSTRIES[assessment.topIndustries[0]].name} · ${TRACKS[assessment.track].name}` : 'Assessment industri & Profil Cuan'}</span></span><span aria-hidden>↗</span></Link>
            <Link to="/app/passport" className="dashboard-row"><span><strong className="block text-sm">Passport · Profil Usaha</strong><span className="mt-1 block text-xs text-muted">Minat, skill & kondisimu · opsional</span></span><span aria-hidden>↗</span></Link>
            <Link to="/app/dream-pact" className="dashboard-row"><span><strong className="block text-sm">Kontrak Mimpi</strong><span className="mt-1 block text-xs text-muted">{access.can('dreamPact') ? 'Komitmen opsional yang bisa dicetak' : '🔒 Lihat akses Dream Pact'}</span></span><span aria-hidden>↗</span></Link>
          </div>
        </section>
      </div>

      <section aria-labelledby="tools-title">
        <div className="mb-4 flex items-center justify-between gap-3"><div><p className="eyebrow">Dari ide ke hasil kerja</p><h2 id="tools-title" className="section-title mt-1">Mau mengerjakan apa?</h2></div><Link to="/app/toolkit" className="text-sm font-semibold underline">Semua alat →</Link></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{QUICK_TOOLS.map((tool) => <Link key={tool.to} to={tool.to} className="quick-tool"><span aria-hidden className="mb-5 grid h-10 w-10 place-items-center rounded-xl bg-amber-soft text-lg font-bold">{tool.icon}</span><h3 className="text-sm font-bold">{tool.label}</h3><p className="mt-1 text-xs leading-relaxed text-muted">{tool.desc}</p><p className="mt-4 text-xs font-bold">{access.can(tool.feature) ? 'Buka alat →' : '🔒 Lihat akses'}</p></Link>)}</div>
      </section>
    </div>
  );
}