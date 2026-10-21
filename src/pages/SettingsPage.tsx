import { PROGRAM_STATUS } from '../config/site';
import { Link } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { sendEmailVerification, updateProfile } from 'firebase/auth';
import { z } from 'zod';
import { useAuth } from '../auth/AuthProvider';
import { updateDisplayName } from '../lib/data';
import { ROLE_LABEL } from '../lib/roles';
import { useToast } from '../components/ui';
import { TrialOffer } from '../components/TrialOffer';
import { useAccess } from '../auth/AccessProvider';
import { formatRemaining, PLAN_INFO } from '../lib/membership';

const nameSchema = z.string().trim().min(2, 'Nama minimal 2 karakter').max(80, 'Maksimal 80 karakter');

export default function SettingsPage() {
  const { profile, firebaseUser, refreshProfile } = useAuth();
  const access = useAccess();
  const toast = useToast();
  const [name, setName] = useState(profile?.displayName ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);

  async function saveName(e: FormEvent) {
    e.preventDefault();
    const parsed = nameSchema.safeParse(name);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    if (!profile || !firebaseUser) return;
    setError('');
    setBusy(true);
    try {
      await updateDisplayName(profile.uid, parsed.data);
      await updateProfile(firebaseUser, { displayName: parsed.data });
      await refreshProfile();
      toast('success', 'Nama berhasil diperbarui.');
    } catch (err) {
      console.error(err);
      toast('error', 'Gagal menyimpan nama. Coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  async function resendVerification() {
    if (!firebaseUser) return;
    setSending(true);
    try {
      await sendEmailVerification(firebaseUser);
      toast('success', 'Email verifikasi dikirim ulang.');
    } catch {
      toast('error', 'Gagal mengirim. Tunggu beberapa menit lalu coba lagi.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="workspace-page-header">
        <p className="text-sm font-medium text-amber-ink">Akun</p>
        <h1 className="h-page">Akun & Paket</h1>
      </header>

<div className="flex flex-wrap gap-2"><Link to="/voucher" className="btn-accent">Tukar voucher</Link><Link to="/#harga" className="btn-ghost">Lihat pilihan paket ↗</Link><Link to="/app/tersimpan" className="btn-ghost">Hasil tersimpan</Link></div>
      <form onSubmit={saveName} noValidate className="card space-y-4 p-6">
        <h2 className="font-semibold">Nama tampilan</h2>
        <div>
          <label htmlFor="displayName" className="label">Nama</label>
          <input id="displayName" className="input sm:max-w-sm" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!error} />
          {error && <p className="err">{error}</p>}
        </div>
        <button type="submit" className="btn-primary" disabled={busy || name.trim() === profile?.displayName}>{busy ? 'Menyimpan…' : 'Simpan nama'}</button>
      </form>

      <section className="card p-6">
        <h2 className="font-semibold">Paket & akses aplikasi</h2><p className="mt-2 text-xs text-muted">Trial dan paket di sini mengatur fungsi aplikasi. Sesi live, review mentor, dan AI Coach eksternal hanya berlaku jika ada penawaran serta panduan terpisah yang sudah dikonfirmasi tim.</p>
        {access.loading ? <p className="mt-2 text-sm text-muted">Memuat…</p> : access.isAdmin ? (
          <p className="mt-3 text-sm">♾️ <strong>Akses penuh.</strong> Sebagai Admin/Super Admin kamu bisa membuka semua fitur tanpa paket, supaya bisa mengecek dan mendampingi peserta.</p>
        ) : (
          <div className="mt-3 space-y-2 text-sm">
            <p>Paket: <strong>{PLAN_INFO[access.membership?.plan ?? 'none'].emoji} {PLAN_INFO[access.membership?.plan ?? 'none'].name}</strong></p>
            {access.membership?.trial && (access.trial === 'active' || access.trial === 'ending') && (
              <p>Trial: <strong>{PLAN_INFO[access.membership.trial.plan].name}</strong> — sisa {formatRemaining(access.trialLeftMs)} (berakhir {access.membership.trial.endsAt.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })})</p>
            )}
            {access.membership?.trial && access.trial === 'expired' && <p className="text-muted">Trial {PLAN_INFO[access.membership.trial.plan].name} sudah berakhir.</p>}
            <p className="text-xs text-muted">{access.gatingEnabled ? 'Fitur dibuka sesuai paket.' : 'Masa pra-launch: semua fitur sedang dibuka untuk semua peserta.'} Untuk upgrade, pilih paket di halaman harga lalu tukarkan kode dari emailmu.</p>
          </div>
        )}
      </section>

      <TrialOffer compact />

      <section className="card space-y-3 p-6">
        <h2 className="font-semibold">AI Coach · Heybinder</h2>
        <p className="text-sm text-muted">Buka undangan yang disediakan tim, lalu ikuti instruksi Heybinder. Layanan ini berjalan di luar GenZ Preneur; akun, ketentuan akses, dan percakapan dikelola di Heybinder. Percakapan tidak otomatis masuk ke Misi Pertama.</p>
        <a href={PROGRAM_STATUS.coachAccessUrl} target="_blank" rel="noopener noreferrer" className="btn-accent">Buka undangan AI Coach ↗</a>
        <p className="text-xs text-muted">Hindari data pribadi pelanggan. Periksa jawaban AI sebelum digunakan. Jika undangan tidak dapat diakses, hubungi tim melalui jalur undanganmu.</p>
      </section>
      <section className="card p-6">
        <h2 className="font-semibold">Informasi akun</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div><dt className="text-muted">Email</dt><dd className="mt-0.5 font-medium break-all">{profile?.email}</dd></div>
          <div><dt className="text-muted">Peran</dt><dd className="mt-0.5 font-medium">{profile ? ROLE_LABEL[profile.role] : '-'}</dd></div>
          <div>
            <dt className="text-muted">Verifikasi email</dt>
            <dd className="mt-0.5 font-medium">{firebaseUser?.emailVerified ? 'Terverifikasi' : 'Belum terverifikasi'}</dd>
          </div>
        </dl>
        {!firebaseUser?.emailVerified && (
          <button type="button" className="btn-ghost mt-4" onClick={resendVerification} disabled={sending}>{sending ? 'Mengirim…' : 'Kirim ulang email verifikasi'}</button>
        )}
      </section>

      <section className="card p-6">
        <h2 className="font-semibold">Penghapusan akun</h2>
        <p className="mt-1 text-sm text-muted">
          Data Passport bisa kamu hapus sendiri di halaman Entrepreneur Passport. Penghapusan akun secara penuh diproses melalui permintaan ke admin
          agar seluruh data terkait (termasuk transaksi) ditangani sesuai kebijakan privasi.
        </p>
      </section>
    </div>
  );
}
