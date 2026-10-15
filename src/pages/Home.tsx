import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Logo } from '../components/ui';
import { formatRupiah, SITE } from '../config/site';
import { isFirebaseConfigured } from '../lib/firebase';

const PATHS = [
  'Sales partner komisi', 'Jasa konten UMKM', 'Admin online', 'Affiliate', 'Lead generation',
  'Desain Canva', 'Pre-order merch', 'Les privat', 'UGC creator', 'Event sponsorship',
];

const STEPS = [
  { k: 'Kenali diri', d: 'Isi Passport + Assessment → tahu industri & jalur yang paling cocok.' },
  { k: 'Belajar cepat', d: 'Materi singkat Mindset, Sales & Marketing, dan Business Partner.' },
  { k: 'Susun penawaran', d: 'Pakai template proposal & kalkulator komisi.' },
  { k: 'Chat duluan', d: 'Outreach Studio bikin pesan personal ke mentor & calon klien.' },
  { k: 'Eksekusi 7 hari', d: 'Action Plan harian sampai kamu benar-benar bergerak.' },
];

export default function Home() {
  const { firebaseUser } = useAuth();
  const loggedIn = isFirebaseConfigured && !!firebaseUser;
  const cta = loggedIn ? { to: '/app', label: 'Buka dashboard' } : { to: '/daftar', label: 'Mulai gratis' };

  return (
    <div className="overflow-x-hidden bg-paper text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b-2 border-ink/10 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <nav aria-label="Navigasi publik" className="flex items-center gap-1 sm:gap-2">
            <a href="#benefit" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Benefit</a>
            <a href="#harga" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Harga</a>
            <a href="#faq" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">FAQ</a>
            {!loggedIn && <Link to="/masuk" className="rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2">Masuk</Link>}
            <Link to={cta.to} className="btn-primary py-2">{loggedIn ? 'Dashboard' : 'Daftar'}</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pt-20">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="chip bg-lime" style={{ transform: 'rotate(-3deg)' }}>✦ Modal Rp0</span>
              <span className="chip bg-lilac" style={{ transform: 'rotate(2deg)' }}>⚡ AI Toolkit</span>
              <span className="chip bg-sky" style={{ transform: 'rotate(-1deg)' }}>✅ 7-day plan</span>
            </div>
            <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
              Nggak punya bisnis?<br />
              <span className="relative inline-block">
                <span className="relative z-10">Mulai aja dulu.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-amber sm:h-6" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink/75">
              GenZ Preneur bantu kamu nemuin industri yang paling cocok, belajar jualan, dan chat duluan ke mentor & bisnis yang udah jalan —
              <strong className="text-ink"> tanpa modal uang.</strong>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={cta.to} className="btn-accent px-7 py-3.5 text-base">{cta.label} →</Link>
              <a href="#benefit" className="btn-ghost px-7 py-3.5 text-base">Lihat isinya</a>
            </div>
            <p className="mt-4 text-xs text-muted">Daftar akun gratis. Tidak ada jaminan penghasilan — yang ada sistem untuk mulai bergerak.</p>
          </div>

          {/* Visual: contoh kartu hasil (ilustrasi produk, bukan data pengguna) */}
          <div className="relative mx-auto w-full max-w-md" aria-label="Contoh tampilan hasil assessment">
            <div className="card-pop rotate-2 bg-white p-5">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted">Contoh hasil assessment</p>
              <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-ink bg-lime p-3">
                <span className="text-3xl" aria-hidden>👕</span>
                <div className="flex-1"><p className="text-xs font-bold">🥇 Peringkat 1</p><p className="font-display font-extrabold">Fashion & Custom Apparel</p></div>
              </div>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border-2 border-ink/20 bg-sky p-3">
                <span className="text-2xl" aria-hidden>🤝</span>
                <p className="flex-1 font-display text-sm font-extrabold">Sales & Distribusi B2B</p>
              </div>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border-2 border-ink/20 bg-lilac p-3">
                <span className="text-2xl" aria-hidden>🎤</span>
                <p className="flex-1 font-display text-sm font-extrabold">Event & Komunitas</p>
              </div>
              <p className="mt-4 rounded-2xl bg-ink px-3 py-2 text-xs font-bold text-lime">Jalur cocok: Sales Partner 🤝</p>
            </div>
            <div className="card-pop absolute -bottom-8 -left-4 w-56 -rotate-3 bg-amber p-4 sm:-left-10">
              <p className="text-[11px] font-extrabold uppercase">Outreach Studio</p>
              <p className="mt-1 text-sm font-semibold leading-snug">"Halo Kak! 👋 Aku perhatiin menu di GoFood belum ada fotonya…"</p>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <section aria-label="Contoh jalur mulai" className="border-y-2 border-ink bg-ink py-3 text-paper">
          <div className="flex w-max gap-8 whitespace-nowrap" style={{ animation: 'marquee 28s linear infinite' }}>
            {[...PATHS, ...PATHS].map((p, i) => (
              <span key={i} className="font-display text-lg font-extrabold">{p} <span className="text-amber" aria-hidden>✦</span></span>
            ))}
          </div>
        </section>

        {/* Problem → philosophy */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Nunggu modal, ide besar, atau "waktu yang tepat"? <span className="text-amber">Skip.</span>
            </h2>
            <div className="space-y-4 text-lg text-ink/75">
              <p>Skill entrepreneur — nemu masalah, nawarin solusi, dan closing — bisa dilatih sekarang dengan bantu bisnis yang <strong className="text-ink">udah jalan</strong>.</p>
              <p className="rounded-3xl border-2 border-ink bg-white p-5 font-display text-xl font-extrabold text-ink shadow-[4px_4px_0_0_#111112]">
                "{SITE.philosophy}"
              </p>
            </div>
          </div>
        </section>

        {/* Benefits bento */}
        <section id="benefit" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="eyebrow">Yang kamu dapat</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">5 benefit, 1 sistem.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-6">
              {SITE.benefits.map((b, i) => (
                <article key={b.no}
                  className={`card-pop p-6 ${b.tile} ${i < 2 ? 'md:col-span-3' : 'md:col-span-2'}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-4xl" aria-hidden>{b.emoji}</span>
                    <span className="chip bg-white">#{b.no}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-extrabold leading-tight">{b.title}</h3>
                  <p className="mt-1 text-ink/75">{b.desc}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="card-pop bg-ink p-6 text-paper">
                <p className="text-xs font-extrabold uppercase tracking-wider text-lime">Bonus · Assessment Industri</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold">Bingung mau bisnis apa?</h3>
                <p className="mt-1 text-paper/70">12 pertanyaan → 3 industri paling cocok, jalurmu, dan cara mulai modal Rp0 untuk masing-masing.</p>
              </article>
              <article className="card-pop bg-amber p-6">
                <p className="text-xs font-extrabold uppercase tracking-wider">Bonus · Outreach Studio</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold">Takut chat duluan?</h3>
                <p className="mt-1 text-ink/80">Pesan siap kirim untuk minta waktu ke mentor, jadi sales partner, atau nawarin jasa ke UMKM.</p>
              </article>
              <article className="card-pop bg-lime p-6">
                <p className="text-xs font-extrabold uppercase tracking-wider">Final Boss · Dream Pact</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold">Mimpi yang ditulis &amp; ditandatangani.</h3>
                <p className="mt-1 text-ink/80">WHY, Edge, Dream Statement, 6 level milestone, dan rencana 12 bulan — siap dicetak dan ditempel.</p>
              </article>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Gimana cara kerjanya?</h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.k} className="card p-5">
                <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-lime font-display text-lg font-extrabold">{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-extrabold">{s.k}</h3>
                <p className="mt-1 text-sm text-muted">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Tracks */}
        <section className="bg-ink py-20 text-paper">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Pilih jalurmu.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {SITE.tracks.map((t, i) => (
                <div key={t.name} className={`rounded-3xl border-2 border-paper/20 p-6 ${i === 0 ? 'bg-paper/5' : ''}`}>
                  <h3 className="font-display text-2xl font-extrabold text-lime">{t.name}</h3>
                  <p className="mt-2 text-paper/70">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructor */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="card-pop grid gap-6 p-8 md:grid-cols-[auto_1fr] md:items-center">
            <div className="grid h-24 w-24 rotate-[-4deg] place-items-center rounded-3xl border-2 border-ink bg-amber font-display text-3xl font-extrabold" aria-hidden>
              {SITE.instructor.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
            </div>
            <div>
              <p className="eyebrow">Narasumber utama</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold">{SITE.instructor.name}</h2>
              <p className="text-sm font-semibold text-muted">{SITE.instructor.title}</p>
              <p className="mt-3 max-w-2xl text-ink/75">{SITE.instructor.bio}</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="harga" className="scroll-mt-20 border-y-2 border-ink/10 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Harga perkenalan.</h2>
            <p className="mt-3 text-muted">Pembelian dibuka bersamaan dengan batch pertama. Bikin akun sekarang biar Passport & Assessment-mu udah siap.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {SITE.plans.map((p) => {
                const hot = 'highlight' in p && p.highlight;
                return (
                  <div key={p.name} className={`relative flex flex-col rounded-3xl border-2 border-ink p-6 ${hot ? 'bg-ink text-paper shadow-[6px_6px_0_0_#ff5a1f]' : 'bg-paper shadow-[4px_4px_0_0_#111112]'}`}>
                    {hot && <span className="chip absolute -top-3 right-5 bg-lime text-ink">Paling pas</span>}
                    <h3 className="font-display text-xl font-extrabold">{p.name}</h3>
                    <p className="mt-3 font-display text-4xl font-extrabold">{formatRupiah(p.price)}</p>
                    <ul className="mt-5 flex-1 space-y-2 text-sm">
                      {p.features.map((f) => <li key={f} className="flex gap-2"><span className={hot ? 'text-lime' : 'text-amber'} aria-hidden>✦</span>{f}</li>)}
                    </ul>
                    <Link to={cta.to} className={`mt-6 ${hot ? 'btn-accent' : 'btn-primary'}`}>{loggedIn ? 'Buka dashboard' : 'Buat akun dulu'}</Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 className="font-display text-4xl font-extrabold tracking-tight">FAQ</h2>
          <div className="mt-8 space-y-3">
            {SITE.faq.map((f) => (
              <details key={f.q} className="group rounded-3xl border-2 border-ink bg-white p-5 open:shadow-[4px_4px_0_0_#111112]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {f.q}<span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lime text-lg transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="card-pop bg-amber px-8 py-14 text-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Mulai dari yang kamu punya hari ini.</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/80">Bikin akun, ikuti Assessment, dan kirim outreach pertamamu minggu ini.</p>
            <Link to={cta.to} className="btn-primary mt-8 px-8 py-3.5 text-base">{cta.label} →</Link>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} GenZ Preneur · GenZ Prime Corp</span>
          <span>Tidak ada jaminan penghasilan. Hasil bergantung pada eksekusi masing-masing.</span>
        </div>
      </footer>
    </div>
  );
}
