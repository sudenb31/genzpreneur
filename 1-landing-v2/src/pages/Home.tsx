import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Logo } from '../components/ui';
import { formatRupiah, SITE } from '../config/site';
import { isFirebaseConfigured } from '../lib/firebase';
import { trackPixel } from '../lib/pixel';

/** Strip berjalan: isu Gen Z soal mulai usaha → alat di aplikasi yang menjawabnya. */
const TICKER = [
  { q: 'Nggak punya modal?', a: 'Mulai dari skill' },
  { q: 'Bingung mulai dari mana?', a: 'Misi Pertama 9 tahap' },
  { q: 'Takut chat duluan?', a: 'Cari Pelanggan' },
  { q: 'Bingung pasang harga?', a: 'Kalkulator harga jual' },
  { q: 'Belum punya portofolio?', a: 'Tawaran uji coba gratis' },
  { q: 'Mau kenal senior?', a: 'Pesan minta waktu mentor' },
  { q: 'Nggak tau cocok bisnis apa?', a: 'Tes arah bisnis' },
  { q: 'Mau jadi sales partner?', a: 'Kalkulator komisi' },
  { q: 'Takut salah ambil keputusan?', a: 'Simulasi Founder' },
  { q: 'Mimpi doang?', a: 'Dream Pact' },
];
const START_PRICE = formatRupiah(Math.min(...SITE.plans.map((p) => p.price)));
const PROOF = [`Mulai ${START_PRICE}`, 'Sekali bayar, bukan langganan', 'Tanpa modal usaha', 'Bonus trial paket di atasnya'];

/** Alur kerja — satu-satunya penjelasan langkah di halaman ini (dulu diulang 3x). */
const STEPS = [
  { k: 'Pilih peluang', d: 'Lihat bisnis di sekitarmu. Temukan satu hal kecil yang bisa kamu bantu dengan skill-mu.' },
  { k: 'Buat contoh', d: 'Bikin satu contoh hasil kerja, biar pemilik bisnis langsung kebayang.' },
  { k: 'Hitung harga', d: 'Tentukan harga dari waktu & biayamu, lengkap dengan batas revisi.' },
  { k: 'Kirim pesan', d: 'Chat personal ke pemilik bisnis, calon partner, atau senior. Kamu yang kirim sendiri.' },
  { k: 'Catat & perbaiki', d: 'Dibalas, ditolak, atau belum dibalas — semua dicatat jadi bahan langkah berikutnya.' },
];

const OLD_WAY = [
  'Nonton materi berjam-jam, nunggu "siap" dulu',
  'Nunggu modal dan ide bisnis yang sempurna',
  'Selesai kelas, bingung mulai dari mana',
  'Takut chat duluan, akhirnya nggak ngapa-ngapain',
];
const NEW_WAY = [
  'Langsung praktik dari skill yang sudah kamu punya',
  'Bantu bisnis yang udah jalan — modalnya skill & waktu',
  'Tiap tahap ada hasilnya: contoh kerja, harga, penawaran',
  'Draf pesan siap kirim: nawarin jasa, ajak kolaborasi, minta waktu mentor',
];

const INSIDE = [
  { emoji: '🧭', title: 'Misi Pertama', desc: '9 tahap dari "aku bisa apa?" sampai penawaran pertama terkirim. Draf tersimpan otomatis per tahap.', tag: 'Semua paket' },
  { emoji: '💬', title: 'Cari Pelanggan', desc: 'Outreach Studio menyusun draf pesan untuk nawarin jasa, jadi sales partner, atau minta waktu ke mentor.', tag: 'Boost & Impact' },
  { emoji: '🧮', title: 'Alat Bisnis', desc: 'Kalkulator harga jual & komisi, template proposal, dan peta masalah pelanggan.', tag: 'Boost & Impact' },
  { emoji: '🎮', title: 'Simulasi Founder', desc: 'Main peran jadi founder 90 hari di 10 industri. Level 1 gratis di semua paket.', tag: 'Semua paket' },
  { emoji: '📚', title: 'Belajar', desc: 'Materi singkat Season 1–4: dari dasar bisnis sampai mengelola tim.', tag: 'Sesuai paket' },
  { emoji: '✍️', title: 'Dream Pact', desc: 'Tulis alasan, target, dan rencana 12 bulanmu — lalu cetak dan tempel.', tag: 'Semua paket' },
];

export default function Home() {
  // ViewContent sekali saat bagian harga terlihat (sinyal minat untuk Meta).
  useEffect(() => {
    const el = document.getElementById('harga');
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { trackPixel('ViewContent', { content_name: 'Paket GenZ Preneur', content_category: 'pricing' }); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const { firebaseUser } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const loggedIn = isFirebaseConfigured && !!firebaseUser;
  const cta = loggedIn ? { to: '/app', label: 'Buka dashboard' } : { to: '/#harga', label: 'Lihat paket & mulai' };
  const { hash, pathname } = useLocation();
  /** Tombol "Lihat paket & mulai" selalu menggulir ke harga, walau alamat sudah #harga (bug: tombol terasa mati di HP). */
  const jumpHarga = (e: { preventDefault: () => void }) => {
    if (loggedIn || pathname !== '/') return;
    e.preventDefault();
    document.getElementById('harga')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Link seperti "/#harga" dari dalam aplikasi: gulir otomatis ke bagian yang dituju.
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    return () => window.clearTimeout(t);
  }, [hash]);

  const video = SITE.demoVideo;

  return (
    <div className="public-home overflow-x-hidden bg-paper text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b-2 border-ink/10 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" aria-label="GenZ Preneur — Beranda"><Logo /></Link>
          <nav aria-label="Navigasi publik" className="flex items-center gap-1 sm:gap-2">
            <button type="button" aria-expanded={mobileMenu} aria-controls="public-mobile-menu" className="btn-ghost px-3 py-2 text-xs md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>Menu</button>
            <a href="#cara-kerja" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Cara kerja</a>
            <a href="#isi" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Isi aplikasi</a>
            <a href="#harga" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Harga</a>
            <a href="#faq" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">FAQ</a>
            <Link to="/voucher" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Tukar voucher</Link>
            {!loggedIn && <Link to="/masuk" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 sm:inline-flex">Masuk</Link>}
            <Link to={cta.to} onClick={jumpHarga} className="btn-primary hidden py-2 sm:inline-flex">{loggedIn ? 'Dashboard' : 'Lihat paket'}</Link>
          </nav>
        </div>
        {mobileMenu && <nav id="public-mobile-menu" aria-label="Menu situs di HP" className="grid grid-cols-2 gap-2 border-t border-line px-4 py-3 md:hidden">
          {[{ to: '/#cara-kerja', label: 'Cara kerja' }, { to: '/#isi', label: 'Isi aplikasi' }, { to: '/#harga', label: 'Paket & harga' }, { to: '/#faq', label: 'Pertanyaan umum' }, { to: '/voucher', label: 'Tukar voucher' }, { to: loggedIn ? '/app' : '/masuk', label: loggedIn ? 'Dashboard' : 'Masuk' }].map((item) => <Link key={item.to} to={item.to} className="rounded-xl bg-white px-3 py-3 text-sm font-semibold" onClick={() => setMobileMenu(false)}>{item.label}</Link>)}
        </nav>}
      </header>

      <main id="public-content">
        {/* 1 · Hero — satu pesan utama */}
        <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:pb-14 lg:pt-16">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="chip bg-lime text-sm" style={{ transform: 'rotate(-3deg)' }}>Untuk Gen Z pemula</span>
              <span className="chip bg-lilac text-sm" style={{ transform: 'rotate(2deg)' }}>Belum punya usaha? Justru pas</span>
            </div>
            <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[0.98] tracking-tight sm:text-6xl">
              Nunggu modal, ide besar, atau "waktu yang tepat"?{' '}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">Skip.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-amber sm:h-6" />
              </span>
            </h1>
            <p className="mt-6 font-display text-2xl font-extrabold leading-snug sm:text-3xl">Punya skill? Ubah jadi jasa pertamamu.</p>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink/80">
              GenZ Preneur nuntun kamu <strong className="text-ink">nemuin peluang yang bisa langsung dieksekusi</strong> — nawarin jasa ke bisnis yang udah jalan, jadi sales partner, atau ngedeketin senior buat belajar langsung.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={cta.to} onClick={jumpHarga} className="btn-accent px-7 py-3.5 text-base">{cta.label} →</Link>
              <a href="#cara-kerja" className="btn-ghost px-7 py-3.5 text-base">Lihat cara kerjanya ↓</a>
            </div>
            <ul aria-label="Ringkasan penawaran" className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-ink/75">
              {PROOF.map((p) => <li key={p} className="flex items-center gap-1.5"><span className="text-amber" aria-hidden>✦</span>{p}</li>)}
            </ul>
          </div>

          {video.src ? (
            <figure className="relative w-full">
              <div className="card-pop overflow-hidden p-0" style={{ transform: 'rotate(1deg)' }}>
                <div className="flex items-center gap-1.5 border-b-2 border-ink bg-paper-2 px-3 py-2" aria-hidden>
                  <span className="h-3 w-3 rounded-full border-2 border-ink bg-amber" /><span className="h-3 w-3 rounded-full border-2 border-ink bg-lime" /><span className="h-3 w-3 rounded-full border-2 border-ink bg-sky" />
                  <span className="ml-2 truncate rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-muted">genzpreneur.id/app</span>
                </div>
                <video className="block aspect-video w-full bg-paper" src={video.src} poster={video.poster || undefined} controls playsInline preload="none" aria-label="Video demo aplikasi GenZ Preneur" />
              </div>
              <figcaption className="mt-4 text-center text-sm font-semibold text-ink/75">▶ Demo 50 detik: dari skill sampai pesan siap dikirim</figcaption>
            </figure>
          ) : (
            <div className="relative mx-auto w-full max-w-md" aria-label="Contoh alur kerja di aplikasi">
              <div className="card-pop rotate-2 bg-white p-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Contoh · dari skill desain Canva</p>
                <h2 className="mt-3 font-display text-2xl font-extrabold">Dari skill ke pesan pertama.</h2>
                <div className="mt-4 rounded-2xl border-2 border-ink bg-lime p-4"><p className="text-xs font-extrabold">01 · LIHAT PELUANG</p><p className="mt-1 text-sm">Kedai kopi dekat kampus: menunya cuma tulisan tangan di Instagram.</p></div>
                <div className="mt-3 rounded-2xl border-2 border-ink bg-lilac p-4"><p className="text-xs font-extrabold">02 · SIAPKAN TAWARAN</p><p className="mt-1 text-sm">Satu contoh desain menu + harga jasa, revisi 2x, selesai 3 hari.</p></div>
                <div className="mt-3 rounded-2xl border-2 border-ink bg-sky p-4"><p className="text-xs font-extrabold">03 · KIRIM PESAN</p><p className="mt-1 text-sm">"Halo Kak, aku bikinin contoh menu baru buat kedainya…" — terkirim ✓</p></div>
              </div>
            </div>
          )}
        </section>

        {/* Strip berjalan: isu Gen Z → alat di aplikasi */}
        <section aria-label="Masalah yang sering dialami Gen Z dan alat yang menjawabnya" className="marquee overflow-hidden border-y-2 border-ink bg-ink py-3.5 text-paper">
          <div className="marquee-track flex">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className={`flex shrink-0 items-center ${copy === 1 ? 'marquee-dup' : ''}`}>
                {TICKER.map((t) => (
                  <li key={t.q} className="flex shrink-0 items-center gap-2 px-5 font-display text-sm font-bold sm:text-base">
                    <span className="text-paper/70">{t.q}</span><span className="text-amber" aria-hidden>→</span><span className="text-lime">{t.a}</span><span className="pl-5 text-amber" aria-hidden>✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        {/* 3 · Filosofi */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <p className="rounded-3xl border-2 border-ink bg-white p-6 font-display text-2xl font-extrabold leading-snug text-ink shadow-[5px_5px_0_0_#111112] sm:text-3xl" style={{ transform: 'rotate(-1deg)' }}>
              "{SITE.philosophy}"
            </p>
            <div className="space-y-4 text-lg text-ink/80">
              <p>Entrepreneur itu <strong className="text-ink">skill</strong>, bukan status. Nemu masalah, nawarin solusi, dan closing bisa dilatih sekarang — dengan bantu bisnis yang <strong className="text-ink">udah jalan</strong>.</p>
              <p>Kamu dapat pengalaman nyata, portofolio, dan relasi. Bisnis yang kamu bantu dapat solusi.</p>
            </div>
          </div>
        </section>

        {/* 4 · Cara lama vs GenZ Preneur */}
        <section aria-labelledby="beda-title" className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="eyebrow">Bedanya di mana?</p>
            <h2 id="beda-title" className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Bukan sekadar nonton materi.</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border-2 border-ink/20 bg-paper-2 p-6">
                <h3 className="font-display text-xl font-extrabold text-ink/70">Cara lama</h3>
                <ul className="mt-4 space-y-3">
                  {OLD_WAY.map((t) => <li key={t} className="flex gap-3 text-ink/70"><span aria-hidden className="font-extrabold">✕</span>{t}</li>)}
                </ul>
              </div>
              <div className="card-pop bg-lime p-6">
                <h3 className="font-display text-xl font-extrabold">Di GenZ Preneur</h3>
                <ul className="mt-4 space-y-3 font-semibold">
                  {NEW_WAY.map((t) => <li key={t} className="flex gap-3"><span aria-hidden className="font-extrabold">✓</span>{t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5 · Cara kerja (satu-satunya) */}
        <section id="cara-kerja" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
          <p className="eyebrow">Cara kerja</p>
          <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">5 langkah ke peluang pertamamu.</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink/75">Semua langkah ini ada di <strong className="text-ink">Misi Pertama</strong>: kamu tinggal isi, aplikasi yang nuntun.</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.k} className="card-pop p-5" style={{ transform: `rotate(${[-1, 1, -0.5, 0.8, -1][i]}deg)` }}>
                <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-amber font-display text-lg font-extrabold">{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-extrabold">{s.k}</h3>
                <p className="mt-1 text-sm text-ink/75">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 6 · Isi aplikasi */}
        <section id="isi" className="scroll-mt-20 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="eyebrow">Isi aplikasi</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Yang kamu dapat.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INSIDE.map((b) => (
                <article key={b.title} className="public-benefit card-pop p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span className="benefit-icon" aria-hidden>{b.emoji}</span>
                    <span className="chip bg-white">{b.tag}</span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-extrabold leading-tight">{b.title}</h3>
                  <p className="mt-1 text-ink/80">{b.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Narasumber */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="card-pop grid gap-6 p-8 md:grid-cols-[auto_1fr] md:items-center">
            <div className="grid h-24 w-24 rotate-[-4deg] place-items-center rounded-3xl border-2 border-ink bg-amber font-display text-3xl font-extrabold" aria-hidden>
              {SITE.instructor.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
            </div>
            <div>
              <p className="eyebrow">Disusun oleh</p>
              <h2 className="mt-1 font-display text-3xl font-extrabold">{SITE.instructor.name}</h2>
              <p className="text-sm font-semibold text-muted">{SITE.instructor.title}</p>
              <p className="mt-3 max-w-2xl text-ink/75">{SITE.instructor.bio}</p>
            </div>
          </div>
        </section>

        {/* 7 · Harga */}
        <section id="harga" className="scroll-mt-20 border-y-2 border-ink/10 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="eyebrow">Paket & harga</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Pilih paketmu. Sekali bayar.</h2>
            <p className="mt-3 max-w-2xl text-ink/75">Pembayaran lewat <strong className="text-ink">GoAkal</strong> (platform pembayaran kelas online). Setelah bayar, kode akses dikirim ke emailmu — tukarkan di menu Tukar Voucher.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {SITE.plans.filter((p) => p.saleReady).map((p) => {
                const hot = p.key === 'boost';
                return (
                  <div key={p.key} className={`relative flex flex-col rounded-3xl border-2 border-ink p-6 ${hot ? 'bg-ink text-paper shadow-[6px_6px_0_0_#ff5a1f]' : 'bg-paper shadow-[4px_4px_0_0_#111112]'}`}>
                    <div className="flex items-center min-h-8 justify-between gap-2">
                      <p className={`text-xs font-extrabold uppercase tracking-[0.14em] ${hot ? 'text-lime' : 'text-amber-ink'}`}>{p.level}</p>
                      {'badge' in p && p.badge && <span className={`chip ${hot ? 'border-lime bg-lime text-ink' : 'bg-paper-2'}`}>{p.badge}</span>}
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-extrabold">{p.name} <span aria-hidden>{p.emoji}</span></h3>
                    <p className="mt-3 font-display text-4xl font-extrabold">{formatRupiah(p.price)}</p>
                    <p className="mt-4 font-display text-lg font-extrabold">{p.tagline}</p>
                    <p className={`text-sm ${hot ? 'text-paper/75' : 'text-ink/75'}`}>{p.desc}</p>
                    <ul className="mt-5 flex-1 space-y-2 text-sm">
                      {p.features.map((f) => <li key={f} className="flex gap-2"><span className={hot ? 'text-lime' : 'text-amber'} aria-hidden>✦</span>{f}</li>)}
                    </ul>
                    {'trial' in p && p.trial && (
                      <p className={`mt-5 rounded-2xl border-2 border-dashed p-3 text-sm font-semibold ${hot ? 'border-lime text-lime' : 'border-ink bg-lime/50'}`}>
                        Bonus: coba <strong>{p.trial.to}</strong> gratis {p.trial.days} hari.
                      </p>
                    )}
                    <a href={p.checkoutUrl} onClick={() => trackPixel('InitiateCheckout', { content_name: p.name, value: p.price, currency: 'IDR' })} target="_blank" rel="noopener noreferrer" className={`mt-6 ${hot ? 'btn-accent' : 'btn-primary'}`}>Beli {p.name} →</a>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-muted">Trial bisa kamu mulai sendiri dari Dashboard, sekali per akun, tanpa tagihan otomatis. GenZ Impact adalah paket aplikasi saja: pendampingan bersama Bung Suden terpisah dan belum dibuka. Sudah punya kode? <Link to="/voucher" className="font-semibold text-ink underline">Tukarkan vouchermu</Link>.</p>
          </div>
        </section>

        {/* 8 · FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6">
          <p className="eyebrow">Sebelum kamu beli</p>
          <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight">Yang paling sering ditanya.</h2>
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

        {/* 9 · CTA akhir */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="card-pop bg-amber px-6 py-14 text-center sm:px-8">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Skill-mu udah cukup buat mulai.</h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-ink/85">Yang kurang cuma langkah pertamanya. Mulai hari ini dari {START_PRICE}.</p>
            <Link to={cta.to} onClick={jumpHarga} className="btn-primary mt-8 px-8 py-3.5 text-base">{cta.label} →</Link>
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
