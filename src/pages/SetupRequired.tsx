import { Link } from 'react-router-dom';
import { missingFirebaseKeys } from '../lib/firebase';
import { Logo } from '../components/ui';

/** Ditampilkan bila kredensial Firebase belum diisi — tidak ada asumsi kredensial. */
export default function SetupRequired() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16">
      <Link to="/"><Logo /></Link>
      <div className="card mt-8 p-6">
        <span className="rounded-full bg-amber-soft px-2.5 py-1 text-xs font-semibold text-amber-ink">Perlu konfigurasi</span>
        <h1 className="mt-3 text-xl font-semibold">Firebase belum terhubung</h1>
        <p className="mt-2 text-sm text-muted">
          Fitur akun dan penyimpanan data membutuhkan proyek Firebase. Salin <code className="rounded bg-paper-2 px-1">.env.example</code> menjadi{' '}
          <code className="rounded bg-paper-2 px-1">.env.local</code>, isi nilainya dari Firebase Console, lalu jalankan ulang aplikasi.
          Panduan lengkap ada di <code className="rounded bg-paper-2 px-1">docs/DEPLOYMENT.md</code>.
        </p>
        <p className="mt-4 text-sm font-medium">Variabel yang belum diisi:</p>
        <ul className="mt-2 space-y-1 text-sm">
          {missingFirebaseKeys.map((k) => (
            <li key={k}><code className="rounded bg-paper-2 px-1.5 py-0.5">VITE_FIREBASE_{k.replace(/([A-Z])/g, '_$1').toUpperCase()}</code></li>
          ))}
        </ul>
      </div>
    </main>
  );
}
