import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { authErrorMessage, useAuth } from '../auth/AuthProvider';
import { Logo } from '../components/ui';
import { fieldErrors } from '../lib/passport';
import { joinWaitlist } from '../lib/data';

function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-ink p-10 text-paper lg:flex">
        <Link to="/" className="text-paper"><Logo /></Link>
        <div>
          <p className="font-display text-5xl font-extrabold leading-[0.95]">Learn.<br />Execute.<br /><span className="text-amber">Build.</span></p>
          <p className="mt-4 max-w-md text-paper/70">Kamu tidak harus punya bisnis untuk mulai menjadi entrepreneur. Mulai dari skill yang kamu punya hari ini.</p>
        </div>
        <p className="text-xs text-paper/50">© {new Date().getFullYear()} GenZ Preneur</p>
      </section>
      <section className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-block lg:hidden"><Logo /></Link>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-muted">{footer}</div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------ Login (link email) ------------------------------ */

const loginSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export function LoginPage() {
  const { login, sendLoginLink } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [mode, setMode] = useState<'link' | 'password'>('link');
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [busy, setBusy] = useState(false);

  async function submitLink(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    const parsed = z.email('Format email tidak valid').safeParse(form.email.trim());
    if (!parsed.success) return setErrors({ email: parsed.error.issues[0].message });
    setErrors({});
    setBusy(true);
    try {
      await sendLoginLink(parsed.data);
      setSentTo(parsed.data);
    } catch (err) {
      setFormError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function submitPassword(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    const parsed = loginSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    try {
      await login(parsed.data.email, parsed.data.password);
      const from = (loc.state as { from?: string } | null)?.from;
      nav(from && from.startsWith('/app') ? from : '/app', { replace: true });
    } catch (err) {
      setFormError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Masuk"
      subtitle="Akses khusus peserta yang sudah diundang. Tanpa password — kami kirim link masuk ke emailmu."
      footer={<>Belum punya akses? <Link to="/daftar" className="font-semibold text-ink underline">Gabung daftar tunggu</Link></>}
    >
      {sentTo ? (
        <div role="status" className="space-y-3 rounded-3xl border-2 border-ink bg-lime/60 p-5 text-sm">
          <p className="font-display text-lg font-extrabold">📬 Cek emailmu!</p>
          <p>Link masuk sudah dikirim ke <strong>{sentTo}</strong>. Buka email itu <strong>di perangkat ini</strong> lalu klik linknya.</p>
          <p className="text-ink/70">Nggak ada? Cek folder Spam/Promosi. Link hanya berlaku sekali dan untuk waktu terbatas.</p>
          <button type="button" className="text-sm font-semibold underline" onClick={() => setSentTo('')}>Pakai email lain</button>
        </div>
      ) : mode === 'link' ? (
        <form onSubmit={submitLink} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" autoComplete="email" className="input" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
            {errors.email ? <p className="err">{errors.email}</p> : <p className="hint">Pakai email yang diundang oleh tim GenZ Preneur.</p>}
          </div>
          {formError && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{formError}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim link masuk'}</button>
          <button type="button" className="w-full text-center text-xs font-medium text-muted underline" onClick={() => { setMode('password'); setFormError(''); }}>
            Akun lama dengan password? Masuk pakai password
          </button>
        </form>
      ) : (
        <form onSubmit={submitPassword} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" autoComplete="email" className="input" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} />
            {errors.email && <p className="err">{errors.email}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="label">Password</label>
              <Link to="/lupa-password" className="mb-1.5 text-xs font-medium text-muted underline">Lupa password?</Link>
            </div>
            <input id="password" type="password" autoComplete="current-password" className="input" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} aria-invalid={!!errors.password} />
            {errors.password && <p className="err">{errors.password}</p>}
          </div>
          {formError && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{formError}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Memproses…' : 'Masuk'}</button>
          <button type="button" className="w-full text-center text-xs font-medium text-muted underline" onClick={() => { setMode('link'); setFormError(''); }}>
            ← Masuk lewat link email
          </button>
        </form>
      )}
    </AuthShell>
  );
}

/* --------------------- Tujuan link email (/masuk/link) --------------------- */

export function EmailLinkPage() {
  const { isLoginLink, completeLinkSignIn, storedEmail, firebaseUser } = useAuth();
  const nav = useNavigate();
  const href = typeof window !== 'undefined' ? window.location.href : '';
  const valid = isLoginLink(href);
  const [email, setEmail] = useState(storedEmail());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tried, setTried] = useState(false);

  async function finish(e?: FormEvent) {
    e?.preventDefault();
    const parsed = z.email('Format email tidak valid').safeParse(email.trim());
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setError('');
    setBusy(true);
    try {
      await completeLinkSignIn(href, parsed.data);
      nav('/app', { replace: true });
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  // Bila email tersimpan di perangkat ini, selesaikan otomatis.
  useEffect(() => {
    if (valid && !tried && storedEmail() && !firebaseUser) {
      setTried(true);
      void finish();
    }
    if (firebaseUser) nav('/app', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid, firebaseUser]);

  return (
    <AuthShell title="Masuk lewat link" subtitle="Satu langkah lagi."
      footer={<Link to="/masuk" className="font-semibold text-ink underline">← Minta link baru</Link>}>
      {!valid ? (
        <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">Link ini tidak valid atau sudah tidak berlaku. Minta link masuk baru.</p>
      ) : (
        <form onSubmit={finish} noValidate className="space-y-4">
          <p className="text-sm text-muted">Konfirmasi email yang menerima link ini (dibutuhkan bila link dibuka di perangkat berbeda).</p>
          <div>
            <label htmlFor="confirm-email" className="label">Email</label>
            <input id="confirm-email" type="email" autoComplete="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} />
          </div>
          {error && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Memproses…' : 'Masuk sekarang'}</button>
        </form>
      )}
    </AuthShell>
  );
}

/* ----------------------------- Daftar tunggu ---------------------------- */

export const waitlistSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(80, 'Maksimal 80 karakter'),
  email: z.email('Format email tidak valid').max(120),
  whatsapp: z.string().trim().regex(/^(\+?62|0)8[0-9]{7,12}$/, 'Nomor WhatsApp tidak valid (contoh: 0812xxxxxxx)'),
  interest: z.enum(['spark', 'boost', 'impact', 'unsure']),
  message: z.string().trim().max(300, 'Maksimal 300 karakter'),
  consent: z.literal(true, { error: 'Kamu perlu menyetujui agar kami bisa menghubungimu' }),
});

const INTEREST_OPTIONS = [
  { v: 'spark', l: '⚡ GenZ Spark' },
  { v: 'boost', l: '🚀 GenZ Boost' },
  { v: 'impact', l: '🎯 GenZ Impact' },
  { v: 'unsure', l: '🤔 Belum tahu' },
] as const;

export function WaitlistPage() {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', interest: 'boost' as 'spark' | 'boost' | 'impact' | 'unsure', message: '', consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    const parsed = waitlistSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    try {
      await joinWaitlist(parsed.data);
      setDone(true);
    } catch (err) {
      console.error(err);
      setFormError('Gagal mengirim. Periksa koneksi lalu coba lagi.');
    } finally {
      setBusy(false);
    }
  }

  const field = (key: 'name' | 'email' | 'whatsapp', label: string, type: string, auto: string, hint?: string) => (
    <div>
      <label htmlFor={key} className="label">{label}</label>
      <input id={key} type={type} autoComplete={auto} className="input" value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })} aria-invalid={!!errors[key]} />
      {errors[key] ? <p className="err">{errors[key]}</p> : hint && <p className="hint">{hint}</p>}
    </div>
  );

  return (
    <AuthShell
      title="Gabung daftar tunggu"
      subtitle="Akses GenZ Preneur dibuka lewat undangan. Isi data ini — tim kami akan menghubungimu dan mengirim link masuk ke emailmu."
      footer={<>Sudah diundang? <Link to="/masuk" className="font-semibold text-ink underline">Masuk</Link></>}
    >
      {done ? (
        <div role="status" className="space-y-2 rounded-3xl border-2 border-ink bg-lime/60 p-5 text-sm">
          <p className="font-display text-lg font-extrabold">🎉 Kamu masuk daftar tunggu!</p>
          <p>Tim GenZ Preneur akan menghubungimu lewat WhatsApp/email. Setelah aksesmu aktif, link masuk dikirim ke <strong>{form.email}</strong>.</p>
          <Link to="/" className="inline-block font-semibold underline">← Kembali ke beranda</Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          {field('name', 'Nama lengkap', 'text', 'name')}
          {field('email', 'Email', 'email', 'email', 'Link masuk akan dikirim ke email ini.')}
          {field('whatsapp', 'Nomor WhatsApp', 'tel', 'tel')}
          <fieldset>
            <legend className="label">Paket yang kamu minati</legend>
            <div className="grid grid-cols-2 gap-2">
              {INTEREST_OPTIONS.map((o) => (
                <button key={o.v} type="button" aria-pressed={form.interest === o.v} onClick={() => setForm({ ...form, interest: o.v })}
                  className={`rounded-2xl border-2 px-3 py-2 text-sm font-bold ${form.interest === o.v ? 'border-ink bg-lime' : 'border-line bg-white'}`}>{o.l}</button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="message" className="label">Pesan (opsional)</label>
            <textarea id="message" rows={3} maxLength={300} className="input" value={form.message}
              placeholder="Ceritakan singkat kondisimu atau pertanyaanmu" onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {errors.message && <p className="err">{errors.message}</p>}
          </div>
          <div>
            <label className="flex items-start gap-2 text-sm text-muted">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-amber" checked={form.consent}
                onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
              <span>Saya setuju dihubungi tim GenZ Preneur lewat WhatsApp/email terkait pendaftaran. Data hanya dipakai untuk keperluan ini.</span>
            </label>
            {errors.consent && <p className="err">{errors.consent}</p>}
          </div>
          {formError && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{formError}</p>}
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Mengirim…' : 'Gabung daftar tunggu'}</button>
        </form>
      )}
    </AuthShell>
  );
}

/* ----------------------------- Belum diundang ---------------------------- */

export function NotInvitedPage() {
  const { logout, firebaseUser } = useAuth();
  return (
    <AuthShell title="Akses belum aktif" subtitle="Email ini belum terdaftar sebagai peserta."
      footer={<Link to="/" className="font-semibold text-ink underline">← Kembali ke beranda</Link>}>
      <div className="space-y-4 text-sm">
        <p>Kamu masuk sebagai <strong>{firebaseUser?.email}</strong>, tapi email ini belum mendapat undangan dari tim GenZ Preneur.</p>
        <p className="text-muted">Gabung daftar tunggu dulu. Setelah aksesmu aktif, kamu bisa masuk dengan email yang sama.</p>
        <div className="flex flex-col gap-2">
          <Link to="/daftar" className="btn-primary" onClick={() => void logout()}>Gabung daftar tunggu</Link>
          <button type="button" className="btn-ghost" onClick={() => void logout()}>Keluar</button>
        </div>
      </div>
    </AuthShell>
  );
}

/* -------------------------- Forgot password ------------------------ */

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = z.email('Format email tidak valid').safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    setError('');
    setBusy(true);
    try {
      await resetPassword(parsed.data);
      setSent(true);
    } catch (err) {
      const code = (err as { code?: string }).code;
      // Jangan bocorkan apakah email terdaftar.
      if (code === 'auth/user-not-found') setSent(true);
      else setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Reset password" subtitle="Kami kirim tautan reset ke email kamu."
      footer={<Link to="/masuk" className="font-semibold text-ink underline">← Kembali ke halaman masuk</Link>}>
      {sent ? (
        <p role="status" className="rounded-lg bg-ok-soft px-4 py-3 text-sm text-ok">
          Jika email tersebut terdaftar, tautan reset sudah dikirim. Periksa juga folder spam.
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="label">Email</label>
            <input id="reset-email" type="email" autoComplete="email" className="input" value={email}
              onChange={(e) => setEmail(e.target.value)} aria-invalid={!!error} />
            {error && <p className="err">{error}</p>}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim tautan reset'}</button>
        </form>
      )}
    </AuthShell>
  );
}
