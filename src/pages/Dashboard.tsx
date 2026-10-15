import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { usePassport } from '../lib/usePassport';
import { completionPercent, SECTION_LABEL, sectionCompletion, type PassportSection } from '../lib/passport';
import { ErrorState, PageSkeleton, ProgressBar } from '../components/ui';

const JOURNEY = ['Discover', 'Learn', 'Practice', 'Offer', 'Execute', 'Review', 'Grow'];

export default function Dashboard() {
  const { profile, firebaseUser } = useAuth();
  const { loading, error, record, reload } = usePassport(profile?.uid, profile?.displayName ?? '');

  if (loading) return <PageSkeleton />;
  if (error || !record) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const sections = sectionCompletion(record.data);
  const pct = completionPercent(record.data);
  const missing = (Object.keys(sections) as PassportSection[]).filter((k) => !sections[k]);
  const firstName = (profile?.displayName || 'Entrepreneur').split(' ')[0];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-amber-ink">Dashboard</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Halo, {firstName}.</h1>
        <p className="mt-1 text-muted">Satu langkah kecil yang jelas lebih berguna daripada rencana besar yang tidak dijalankan.</p>
      </header>

      {firebaseUser && !firebaseUser.emailVerified && (
        <div role="note" className="rounded-xl border border-amber/40 bg-amber-soft px-4 py-3 text-sm text-amber-ink">
          Email kamu belum terverifikasi. Buka tautan verifikasi yang kami kirim ke <strong>{firebaseUser.email}</strong>.
          Verifikasi akan diwajibkan sebelum pembelian program.
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold">Entrepreneur Passport</h2>
              <p className="mt-1 text-sm text-muted">Data dasar yang dipakai semua tools — cukup diisi sekali.</p>
            </div>
            <Link to="/app/passport" className={pct === 100 ? 'btn-ghost' : 'btn-accent'}>
              {pct === 0 ? 'Mulai isi' : pct === 100 ? 'Lihat' : 'Lanjutkan'}
            </Link>
          </div>
          <div className="mt-5"><ProgressBar value={pct} label="Kelengkapan" /></div>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {(Object.keys(SECTION_LABEL) as PassportSection[]).map((k) => (
              <li key={k} className="flex items-center gap-2 text-sm">
                <span aria-hidden className={`grid h-5 w-5 place-items-center rounded-full text-xs ${sections[k] ? 'bg-ok text-white' : 'border border-line text-muted'}`}>
                  {sections[k] ? '✓' : ''}
                </span>
                <span className={sections[k] ? '' : 'text-muted'}>{SECTION_LABEL[k]}</span>
                <span className="sr-only">{sections[k] ? '(lengkap)' : '(belum lengkap)'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold">Langkah berikutnya</h2>
          {missing.length > 0 ? (
            <>
              <p className="mt-1 text-sm text-muted">Lengkapi bagian berikut agar rekomendasi jalur belajar bisa dibuat.</p>
              <ol className="mt-4 space-y-2 text-sm">
                {missing.map((k, i) => (
                  <li key={k}>
                    <Link to={`/app/passport?bagian=${k}`} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2 hover:bg-paper-2">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-xs font-semibold text-paper">{i + 1}</span>
                      Isi {SECTION_LABEL[k].toLowerCase()}
                    </Link>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">
              Passport kamu sudah lengkap. Entrepreneur DNA assessment dan rekomendasi jalur belajar akan memakai data ini begitu modulnya dirilis.
            </p>
          )}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold">Perjalananmu</h2>
        <p className="mt-1 text-sm text-muted">Setiap tahap menghasilkan output yang dipakai tahap berikutnya.</p>
        <ol className="mt-5 flex flex-wrap gap-2">
          {JOURNEY.map((step, i) => (
            <li key={step} className={`rounded-full px-3 py-1.5 text-sm font-medium ${i === 0 ? 'bg-ink text-paper' : 'border border-line text-muted'}`}>
              {i + 1}. {step}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted">Tahap aktif: <strong>Discover</strong>. Tahap lainnya terbuka bertahap sesuai program yang kamu ikuti.</p>
      </section>
    </div>
  );
}
