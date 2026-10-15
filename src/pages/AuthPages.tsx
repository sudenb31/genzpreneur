import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { authErrorMessage, useAuth } from '../auth/AuthProvider';
import { Logo } from '../components/ui';
import { fieldErrors } from '../lib/passport';

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

/* ------------------------------ Login ------------------------------ */

const loginSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
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
      subtitle="Lanjutkan perjalanan entrepreneur-mu."
      footer={<>Belum punya akun? <Link to="/daftar" className="font-semibold text-ink underline">Daftar gratis</Link></>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
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
      </form>
    </AuthShell>
  );
}

/* ----------------------------- Register ---------------------------- */

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(80, 'Maksimal 80 karakter'),
    email: z.email('Format email tidak valid'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Za-z]/, 'Password harus mengandung huruf')
      .regex(/[0-9]/, 'Password harus mengandung angka'),
    confirm: z.string(),
    consent: z.literal(true, { error: 'Kamu perlu menyetujui pemrosesan data untuk membuat akun' }),
  })
  .refine((d) => d.password === d.confirm, { path: ['confirm'], message: 'Konfirmasi password tidak sama' });

export function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setBusy(true);
    try {
      await register(parsed.data.name, parsed.data.email, parsed.data.password);
      nav('/app/passport', { replace: true, state: { welcome: true } });
    } catch (err) {
      setFormError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const field = (key: 'name' | 'email' | 'password' | 'confirm', label: string, type: string, auto: string, hint?: string) => (
    <div>
      <label htmlFor={key} className="label">{label}</label>
      <input id={key} type={type} autoComplete={auto} className="input" value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })} aria-invalid={!!errors[key]} />
      {errors[key] ? <p className="err">{errors[key]}</p> : hint && <p className="hint">{hint}</p>}
    </div>
  );

  return (
    <AuthShell
      title="Buat akun"
      subtitle="Gratis. Lengkapi Entrepreneur Passport setelah mendaftar."
      footer={<>Sudah punya akun? <Link to="/masuk" className="font-semibold text-ink underline">Masuk</Link></>}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {field('name', 'Nama lengkap', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        {field('password', 'Password', 'password', 'new-password', 'Minimal 8 karakter, kombinasi huruf dan angka.')}
        {field('confirm', 'Ulangi password', 'password', 'new-password')}
        <div>
          <label className="flex items-start gap-2 text-sm text-muted">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-amber" checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
            <span>Saya setuju data yang saya isi diproses untuk menjalankan layanan dan memberi rekomendasi belajar. Data tidak dibagikan ke peserta lain dan dapat saya ekspor atau hapus kapan saja.</span>
          </label>
          {errors.consent && <p className="err">{errors.consent}</p>}
        </div>
        {formError && <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{formError}</p>}
        <button type="submit" className="btn-primary w-full" disabled={busy}>{busy ? 'Membuat akun…' : 'Daftar'}</button>
      </form>
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
