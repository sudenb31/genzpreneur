import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { authErrorMessage, useAuth } from '../auth/AuthProvider';
import { getMembership, getUserRecord, getVoucher, redeemTrialVoucher, redeemVoucher } from '../lib/data';
import { PLAN_INFO } from '../lib/membership';
import { normalizeCode, VOUCHER_PROBLEM_TEXT, VOUCHER_RE, voucherProblem } from '../lib/voucher';
import { isFirebaseConfigured } from '../lib/firebase';
import { AuthShell } from './AuthPages';
import { PageSkeleton } from '../components/ui';

const PENDING_KEY = 'gzp.pendingVoucher';
export const readPendingVoucher = () => { try { return localStorage.getItem(PENDING_KEY) ?? ''; } catch { return ''; } };
const writePendingVoucher = (c: string | null) => {
  try { if (c) localStorage.setItem(PENDING_KEY, c); else localStorage.removeItem(PENDING_KEY); } catch { /* storage tidak tersedia */ }
};

/** Form tukar voucher untuk pengguna yang SUDAH login (peserta lama atau akun baru tanpa undangan). */
export function RedeemVoucherForm({ initialCode = '', onDone }: { initialCode?: string; onDone?: () => void }) {
  const { firebaseUser, profile, refreshProfile } = useAuth();
  const [code, setCode] = useState(initialCode || readPendingVoucher());
  const [name, setName] = useState(profile?.displayName ?? firebaseUser?.displayName ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<{ plan: string; trialDays?: number; endsAt?: string } | null>(null);
  const needName = !profile;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!firebaseUser) return;
    const c = normalizeCode(code);
    if (!VOUCHER_RE.test(c)) return setError('Format kode tidak valid (4–32 huruf/angka).');
    if (needName && name.trim().length < 2) return setError('Isi nama lengkapmu (minimal 2 karakter).');
    setError('');
    setBusy(true);
    try {
      const email = firebaseUser.email ?? '';
      const [found, membership, userRec] = await Promise.all([getVoucher(c), getMembership(email).catch(() => null), getUserRecord(firebaseUser.uid).catch(() => null)]);
      if (found === 'wrong_email') { setError(VOUCHER_PROBLEM_TEXT.wrong_email); return; }
      const voucher = found;
      const problem = voucherProblem(voucher, membership?.plan ?? 'none', new Date(), email, membership);
      if (problem) { setError(VOUCHER_PROBLEM_TEXT[problem]); return; }
      const displayName = name || profile?.displayName || email.split('@')[0];
      if (voucher!.kind === 'trial') {
        // Voucher trial (mis. peserta webinar) diproses server: paket tetap, hanya trial yang diisi.
        const r = await redeemTrialVoucher(voucher!.code, displayName);
        writePendingVoucher(null);
        setSuccess({ plan: PLAN_INFO[voucher!.plan].name, trialDays: r.days, endsAt: r.endsAt });
      } else {
        await redeemVoucher({ uid: firebaseUser.uid, authEmail: email, name: displayName, voucher: voucher!, hasUserDoc: !!userRec, membership });
        writePendingVoucher(null);
        setSuccess({ plan: PLAN_INFO[voucher!.plan].name });
      }
      await refreshProfile();
      onDone?.();
    } catch (err) {
      console.error(err);
      const code = (err as { code?: string }).code;
      setError(code === 'permission-denied'
        ? 'Voucher ditolak server. Kemungkinan kode ini sudah pernah kamu pakai, kuotanya baru saja habis, atau emailmu belum terverifikasi lewat link masuk.'
        : !code && err instanceof Error && err.message && !err.message.includes('fetch') ? err.message
        : 'Gagal menukar voucher. Periksa koneksi lalu coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div role="status" className="space-y-3 rounded-3xl border-2 border-ink bg-lime/60 p-5 text-sm">
        <p className="font-display text-lg font-extrabold">🎉 Voucher berhasil ditukar!</p>
        {success.trialDays ? (
          <p>
            Trial <strong>{success.plan} {success.trialDays} hari</strong> aktif
            {success.endsAt && <> sampai <strong>{new Date(success.endsAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</strong></>}.
            {' '}Mulai dari Misi Pertama — kerjakan tahap 1 hari ini.
          </p>
        ) : (
          <p>Paketmu sekarang: <strong>{success.plan}</strong>. Selamat belajar & eksekusi!</p>
        )}
        <a href={isFirebaseConfigured ? '/app' : '#'} className="btn-primary">Buka dashboard →</a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {needName && (
        <div>
          <label htmlFor="v-name" className="label">Nama lengkap</label>
          <input id="v-name" className="input" autoComplete="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      )}
      <div>
        <label htmlFor="v-code" className="label">Kode voucher</label>
        <input id="v-code" className="input font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal" autoComplete="off" placeholder="mis. BOOST-7KQ2M9XA"
          value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} aria-invalid={!!error} />
        <p className="hint">Kode ada di email konfirmasi pembelianmu, atau dibagikan saat webinar.</p>
      </div>
      {error && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
      <button type="submit" className="btn-accent w-full" disabled={busy}>{busy ? 'Memeriksa…' : 'Tukar voucher'}</button>
    </form>
  );
}

/** Halaman publik /voucher — untuk pembeli dari GoAkal maupun peserta yang mau naik paket. */
export default function VoucherPage() {
  const { loading, firebaseUser, profile, notInvited, sendLoginLink } = useAuth();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const fromUrl = normalizeCode(params.get('kode') ?? '');
  const [form, setForm] = useState({ email: '', code: fromUrl || readPendingVoucher() });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState('');

  useEffect(() => { if (fromUrl) writePendingVoucher(fromUrl); }, [fromUrl]);

  async function sendLink(e: FormEvent) {
    e.preventDefault();
    const c = normalizeCode(form.code);
    if (!VOUCHER_RE.test(c)) return setError('Format kode tidak valid (4–32 huruf/angka).');
    const em = z.email().safeParse(form.email.trim());
    if (!em.success) return setError('Format email tidak valid.');
    setError('');
    setBusy(true);
    try {
      writePendingVoucher(c);
      await sendLoginLink(em.data);
      setSentTo(em.data);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-md p-6"><PageSkeleton /></div>;

  return (
    <AuthShell
      title="Akses voucher"
      subtitle="Sudah beli paket atau ikut webinar GenZ Preneur? Tukarkan kodemu di sini untuk mengaktifkan akses."
      footer={<>Belum punya voucher? <Link to="/#harga" className="font-semibold text-ink underline">Lihat paket</Link> · {firebaseUser ? <Link to="/" className="font-semibold text-ink underline">Beranda</Link> : <Link to="/masuk" className="font-semibold text-ink underline">Masuk</Link>}</>}
    >
      <nav aria-label="Navigasi halaman voucher" className="mb-6">
        {firebaseUser && profile && !notInvited ? (
          <Link to="/app" className="btn-ghost w-full">← Kembali ke Dashboard</Link>
        ) : (
          <Link to="/" className="btn-ghost w-full">← Kembali ke Beranda</Link>
        )}
      </nav>
      {firebaseUser ? (
        <div className="space-y-4">
          <p className="text-sm text-muted">Masuk sebagai <strong>{firebaseUser.email}</strong>.</p>
          <RedeemVoucherForm initialCode={form.code} onDone={() => window.setTimeout(() => nav('/app', { replace: true }), 1500)} />
        </div>
      ) : sentTo ? (
        <div role="status" className="space-y-3 rounded-3xl border-2 border-ink bg-lime/60 p-5 text-sm">
          <p className="font-display text-lg font-extrabold">📬 Langkah 2: cek emailmu</p>
          <p>Link masuk sudah dikirim ke <strong>{sentTo}</strong>. Buka email itu <strong>di perangkat ini</strong> lalu klik linknya — vouchermu langsung ditukar setelah masuk.</p>
          <p className="text-ink/70">Nggak ada? Cek folder Spam/Promosi.</p>
          <button type="button" className="text-sm font-semibold underline" onClick={() => setSentTo('')}>Pakai email lain</button>
        </div>
      ) : (
        <form onSubmit={sendLink} noValidate className="space-y-4">
          <ol className="space-y-1 rounded-2xl bg-paper-2 p-3 text-xs text-ink/75">
            <li>1. Isi kode voucher & email (email ini jadi akun belajarmu).</li>
            <li>2. Klik link masuk yang kami kirim ke email.</li>
            <li>3. Voucher ditukar otomatis — paketmu aktif.</li>
          </ol>
          <div>
            <label htmlFor="pv-code" className="label">Kode voucher</label>
            <input id="pv-code" className="input font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal" autoComplete="off" placeholder="mis. BOOST-7KQ2M9XA"
              value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label htmlFor="pv-email" className="label">Email</label>
            <input id="pv-email" type="email" autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {error && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
          <button type="submit" className="btn-accent w-full" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim link masuk'}</button>
        </form>
      )}
    </AuthShell>
  );
}
