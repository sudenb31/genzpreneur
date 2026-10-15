import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Logo } from '../components/ui';
import { formatRupiah, SITE } from '../config/site';
import { isFirebaseConfigured } from '../lib/firebase';

const STEPS = [
  { k: 'Discover', d: 'Kenali skill, waktu, dan modal yang kamu punya lewat Entrepreneur Passport.' },
  { k: 'Learn', d: 'Pelajari sales, marketing, dan AI for business dari praktisi.' },
  { k: 'Practice', d: 'Latih pitching dan negosiasi di simulasi sebelum bicara dengan klien sungguhan.' },
  { k: 'Offer', d: 'Susun paket layanan dan proposal kerja sama yang siap dikirim.' },
  { k: 'Execute', d: 'Hubungi calon mitra, catat follow-up, dan jalankan challenge harian.' },
  { k: 'Review & Grow', d: 'Evaluasi apa yang berhasil, lalu tentukan langkah berikutnya.' },
];

const PATHS = [
  'Sales partner bisnis yang sudah berjalan',
  'Membantu UMKM mencari calon pelanggan',
  'Jasa social media marketing',
  'Jasa lead generation',
  'Strategi konten untuk bisnis',
  'Marketing freelancer',
];

export default function Home() {
  const { firebaseUser } = useAuth();
  const loggedIn = isFirebaseConfigured && !!firebaseUser;
  const primaryCta = loggedIn ? { to: '/app', label: 'Buka dashboard' } : { to: '/daftar', label: 'Buat akun gratis' };

  return (
    <div className="bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <nav aria-label="Navigasi publik" className="flex items-center gap-1 sm:gap-2">
            <a href="#program" className="hidden rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper-2 sm:block">Program</a>
            <a href="#harga" className="hidden rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper-2 sm:block">Harga</a>
            <a href="#faq" className="hidden rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper-2 sm:block">FAQ</a>
            {!loggedIn && <Link to="/masuk" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-paper-2">Masuk</Link>}
            <Link to={primaryCta.to} className="btn-primary py-2">{loggedIn ? 'Dashboard' : 'Daftar'}</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <p className="inline-block rounded-full bg-amber-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-ink">{SITE.tagline}</p>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Kamu tidak harus punya bisnis untuk mulai menjadi <span className="text-amber">entrepreneur</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            GenZ Preneur adalah sistem belajar dan praktik kewirausahaan untuk Gen Z Indonesia. Mulai dari skill yang kamu punya,
            tawarkan nilai ke bisnis yang sudah berjalan, dan bangun pengalaman nyata langkah demi langkah.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={primaryCta.to} className="btn-accent px-6 py-3 text-base">{primaryCta.label}</Link>
            <a href="#program" className="btn-ghost px-6 py-3 text-base">Lihat cara kerjanya</a>
          </div>
        </section>

        {/* Problem */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">Ingin mulai, tapi bingung dari mana.</h2>
              <p className="mt-4 text-muted">
                Banyak anak muda menunggu punya ide besar, produk sendiri, atau modal cukup sebelum berani memulai. Padahal keterampilan
                kewirausahaan — menemukan masalah, menawarkan solusi, dan menutup kesepakatan — bisa dilatih sejak sekarang dengan membantu bisnis yang sudah ada.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {PATHS.map((p) => (
                <li key={p} className="rounded-xl border border-line bg-paper px-4 py-3 text-sm font-medium">{p}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section id="program" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Dari belajar sampai eksekusi.</h2>
          <p className="mt-3 max-w-2xl text-muted">Setiap tahap menghasilkan output yang langsung dipakai di tahap berikutnya — kamu tidak perlu mengisi data yang sama berulang kali.</p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.k} className="card p-5">
                <span className="text-xs font-semibold text-amber-ink">0{i + 1}</span>
                <h3 className="mt-1 text-lg font-semibold">{s.k}</h3>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Tracks */}
        <section className="bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Tiga jalur, satu tujuan: bisa menciptakan nilai.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {SITE.tracks.map((t) => (
                <div key={t.name} className="rounded-2xl border border-paper/15 p-6">
                  <h3 className="text-lg font-semibold text-amber">{t.name}</h3>
                  <p className="mt-2 text-sm text-paper/70">{t.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-paper/60">Jalur yang cocok direkomendasikan dari Entrepreneur Passport-mu. Ini asesmen pengembangan diri, bukan tes psikologi.</p>
          </div>
        </section>

        {/* Instructor */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="card grid gap-6 p-8 md:grid-cols-[auto_1fr] md:items-center">
            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-amber-soft font-display text-3xl font-semibold text-amber-ink" aria-hidden>
              {SITE.instructor.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-ink">Narasumber utama</p>
              <h2 className="mt-1 text-2xl font-semibold">{SITE.instructor.name}</h2>
              <p className="text-sm text-muted">{SITE.instructor.title}</p>
              <p className="mt-3 max-w-2xl text-muted">{SITE.instructor.bio}</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="harga" className="scroll-mt-20 border-t border-line bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Pilih paket sesuai kebutuhanmu.</h2>
            <p className="mt-3 text-muted">Pembelian program dibuka bersamaan dengan pengumuman batch pertama. Buat akun sekarang agar Passport-mu siap.</p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {SITE.plans.map((p) => (
                <div key={p.name} className={`flex flex-col rounded-2xl border p-6 ${'highlight' in p && p.highlight ? 'border-ink bg-ink text-paper' : 'border-line bg-paper'}`}>
                  <h3 className="font-semibold">GenZ Preneur {p.name}</h3>
                  <p className="mt-3 font-display text-3xl font-semibold">{formatRupiah(p.price)}</p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {p.features.map((f) => <li key={f} className="flex gap-2"><span className="text-amber" aria-hidden>✓</span>{f}</li>)}
                  </ul>
                  <Link to={primaryCta.to} className={`mt-6 ${'highlight' in p && p.highlight ? 'btn-accent' : 'btn-ghost'}`}>{loggedIn ? 'Buka dashboard' : 'Buat akun dulu'}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Pertanyaan yang sering muncul</h2>
          <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white">
            {SITE.faq.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}<span className="text-muted transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="rounded-3xl bg-amber px-8 py-14 text-center text-ink">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Mulai dari yang kamu punya hari ini.</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/80">Buat akun, lengkapi Entrepreneur Passport, dan temukan jalur yang paling masuk akal untukmu.</p>
            <Link to={primaryCta.to} className="btn-primary mt-8 px-6 py-3 text-base">{primaryCta.label}</Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} GenZ Preneur · GenZ Prime Corp</span>
          <span>Tidak ada jaminan penghasilan. Hasil bergantung pada eksekusi masing-masing.</span>
        </div>
      </footer>
    </div>
  );
}
