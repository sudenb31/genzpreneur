import { useEffect, useState, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Logo } from '../components/ui';
import { formatRupiah, SITE } from '../config/site';
import { isFirebaseConfigured } from '../lib/firebase';
import { trackPixel } from '../lib/pixel';

/** Tiga pintu peluang — semuanya didukung Misi Pertama & Cari Pelanggan di aplikasi. */
const DOORS = [
  { title: 'Tawarkan jasa', body: 'Pakai skill yang udah kamu punya untuk beresin satu masalah kecil di bisnis orang.', example: 'Bikinin deskripsi menu GoFood buat warung dekat rumah.' },
  { title: 'Ajak kolaborasi', body: 'Jadi partner penjualan produk yang udah laku, dibayar komisi dari tiap transaksi.', example: 'Bantu jualin kaos brand lokal ke teman-teman kampus.' },
  { title: 'Dekati senior', body: 'Minta waktu ngobrol ke founder yang udah jalan, belajar langsung dari dapurnya.', example: 'Ajak pemilik kedai kopi ngobrol 20 menit soal awal usahanya.' },
];

const STEPS = [
  { title: 'Pilih satu peluang', body: 'Yang cocok sama skill dan waktumu minggu ini. Satu dulu, bukan sepuluh.' },
  { title: 'Siapkan bekalnya', body: 'Contoh kerja, harga yang masuk akal, atau alasan kenapa kamu layak diajak ngobrol.' },
  { title: 'Kirim pesannya', body: 'Kami bantu susun drafnya sampai kamu berani klik kirim. Lalu catat responsnya dan perbaiki.' },
];

export default function Home() {
  const { firebaseUser } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
  const loggedIn = isFirebaseConfigured && !!firebaseUser;
  const { hash, pathname } = useLocation();
  const startingPrice = Math.min(...SITE.plans.filter((p) => p.saleReady).map((p) => p.price));

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

  // Datang dari halaman lain lewat "/#harga": gulir otomatis ke bagian yang dituju.
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    return () => window.clearTimeout(t);
  }, [hash]);

  /**
   * Tombol ke bagian lain di halaman ini. Selalu menggulir, termasuk saat alamat sudah "#harga"
   * (sebelumnya tombol terasa mati karena alamatnya tidak berubah).
   */
  function jump(id: string) {
    return (e: MouseEvent) => {
      if (pathname !== '/') return;
      e.preventDefault();
      setMobileMenu(false);
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    };
  }

  const primary = loggedIn
    ? <Link to="/app" className="btn-accent px-7 py-3.5 text-base">Buka dashboard</Link>
    : <a href="/#harga" onClick={jump('harga')} className="btn-accent px-7 py-3.5 text-base">Mulai dari {formatRupiah(startingPrice)}</a>;

  return (
    <div className="public-home overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b-2 border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" aria-label="GenZ Preneur, beranda"><Logo /></Link>
          <nav aria-label="Navigasi publik" className="flex items-center gap-1 sm:gap-2">
            <button type="button" aria-expanded={mobileMenu} aria-controls="public-mobile-menu" className="btn-ghost px-3 py-2 text-sm md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>Menu</button>
            <a href="/#cara" onClick={jump('cara')} className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Caranya</a>
            <a href="/#harga" onClick={jump('harga')} className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Harga</a>
            <a href="/#faq" onClick={jump('faq')} className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Tanya jawab</a>
            <Link to="/voucher" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Tukar voucher</Link>
            {!loggedIn && <Link to="/masuk" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 sm:inline-flex">Masuk</Link>}
            {loggedIn
              ? <Link to="/app" className="btn-primary hidden py-2 sm:inline-flex">Dashboard</Link>
              : <a href="/#harga" onClick={jump('harga')} className="btn-primary hidden py-2 sm:inline-flex">Lihat harga</a>}
          </nav>
        </div>
        {mobileMenu && (
          <nav id="public-mobile-menu" aria-label="Menu situs di HP" className="grid grid-cols-2 gap-2 border-t border-line px-4 py-3 md:hidden">
            <a href="/#cara" onClick={jump('cara')} className="rounded-xl bg-white px-3 py-3 text-sm font-semibold">Caranya</a>
            <a href="/#harga" onClick={jump('harga')} className="rounded-xl bg-white px-3 py-3 text-sm font-semibold">Harga</a>
            <a href="/#faq" onClick={jump('faq')} className="rounded-xl bg-white px-3 py-3 text-sm font-semibold">Tanya jawab</a>
            <Link to="/voucher" className="rounded-xl bg-white px-3 py-3 text-sm font-semibold" onClick={() => setMobileMenu(false)}>Tukar voucher</Link>
            <Link to={loggedIn ? '/app' : '/masuk'} className="col-span-2 rounded-xl bg-white px-3 py-3 text-sm font-semibold" onClick={() => setMobileMenu(false)}>{loggedIn ? 'Dashboard' : 'Masuk'}</Link>
          </nav>
        )}
      </header>

      <main id="public-content">
        {/* 1. Hero — satu janji, satu tombol */}
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
          <p className="text-base font-semibold text-ink/70">Untuk Gen Z yang belum punya usaha.</p>
          <h1 className="mt-4 font-display font-extrabold tracking-tight">
            <span className="block text-4xl leading-tight sm:text-6xl">Nunggu modal?</span>
            <span className="hero-skip block text-amber">Skip.</span>
          </h1>
          <div className="mt-8 max-w-2xl sm:mt-14">
            <p className="font-display text-2xl font-extrabold leading-snug sm:text-3xl">Jadi entrepreneur dimulai dari bantu bisnis yang udah jalan.</p>
            <p className="mt-4 text-lg leading-relaxed text-ink/80">
              GenZ Preneur nuntun kamu nemuin peluang nyata dan mengeksekusinya: nawarin jasa pakai skill yang kamu punya, ngajak kolaborasi, atau ngedeketin senior yang udah duluan jalan.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {primary}
            <a href="/#cara" onClick={jump('cara')} className="text-base font-bold underline decoration-2 underline-offset-4">Lihat caranya</a>
          </div>
        </section>

        {/* 2. Bedanya */}
        <section aria-labelledby="bedanya" className="border-y-2 border-ink bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="bedanya" className="max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">"{SITE.philosophy}"</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <h3 className="text-lg font-bold text-ink/50">Course pada umumnya</h3>
                <p className="mt-2 font-display text-2xl font-extrabold leading-snug text-ink/40">Nonton video, nyatet, lalu lupa.</p>
              </div>
              <div className="border-l-4 border-amber pl-6">
                <h3 className="text-lg font-bold">GenZ Preneur</h3>
                <p className="mt-2 font-display text-2xl font-extrabold leading-snug">Kerjain langkahnya, hasilnya jadi, lalu kirim ke orang yang tepat.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Tiga pintu peluang */}
        <section aria-labelledby="pintu" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 id="pintu" className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">Tiga pintu peluang yang bisa kamu buka minggu ini.</h2>
          <div className="mt-10 grid md:grid-cols-3">
            {DOORS.map((d, i) => (
              <article key={d.title} className={`border-t-2 border-ink py-6 md:border-t-0 md:py-0 ${i > 0 ? 'md:border-l-2 md:pl-8' : ''} ${i < DOORS.length - 1 ? 'md:pr-8' : ''}`}>
                <h3 className="font-display text-2xl font-extrabold">{d.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-ink/80">{d.body}</p>
                <p className="mt-4 text-base"><span className="font-bold">Contoh:</span> <span className="italic text-ink/80">{d.example}</span></p>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Caranya — satu urutan saja */}
        <section id="cara" aria-labelledby="cara-judul" className="scroll-mt-20 bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 id="cara-judul" className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">Caranya, tiga langkah.</h2>
            <ol className="mt-12 grid gap-10 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span aria-hidden className="block font-display text-7xl font-extrabold leading-none text-lime">{i + 1}</span>
                  <h3 className="mt-4 font-display text-2xl font-extrabold">{s.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-paper/75">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-14 max-w-2xl text-lg leading-relaxed text-paper/85">
              Di dalam aplikasi, langkah ini jadi <strong className="text-paper">Misi Pertama</strong>: 9 tahap kecil yang bisa dikerjakan satu per hari, lengkap dengan kalkulator harga, template penawaran, dan draf pesan.
            </p>
          </div>
        </section>

        {/* Dari founder — pengganti bukti sosial sampai ada cerita peserta */}
        <section aria-labelledby="founder" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 id="founder" className="font-display text-2xl font-extrabold">Kenapa kami bikin ini</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/85">
            Bung Suden memulai bukan dari modal besar, tapi dari bantu bisnis orang lain: jualan, nawarin jasa, dan ngobrol dengan yang lebih senior. Cara itu yang sekarang dia rapikan jadi langkah-langkah di GenZ Preneur.
          </p>
          <p className="mt-4 font-semibold">{SITE.instructor.name}, {SITE.instructor.title}</p>
        </section>

        {/* 5. Harga */}
        <section id="harga" aria-labelledby="harga-judul" className="scroll-mt-20 border-y-2 border-ink/10 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 id="harga-judul" className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">Pilih paketmu.</h2>
            <p className="mt-3 max-w-2xl text-lg text-ink/75">Sekali bayar, tanpa langganan. Bayar lewat GoAkal, platform pembayaran kami, lalu kode akses dikirim ke emailmu.</p>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {SITE.plans.filter((p) => p.saleReady).map((p) => {
                const hot = p.key === 'boost';
                return (
                  <div key={p.key} className={`relative flex flex-col rounded-3xl border-2 border-ink p-6 ${hot ? 'bg-ink text-paper shadow-[6px_6px_0_0_#ff5a1f]' : 'bg-paper shadow-[4px_4px_0_0_#111112]'}`}>
                    <div className="flex min-h-8 items-center justify-between gap-2">
                      <p className={`text-sm font-bold ${hot ? 'text-lime' : 'text-ink/70'}`}>{p.level}</p>
                      {'badge' in p && p.badge && <span className={`chip ${hot ? 'border-lime bg-lime text-ink' : 'bg-paper-2'}`}>{p.badge}</span>}
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-extrabold">{p.name} <span aria-hidden>{p.emoji}</span></h3>
                    <p className="mt-3 font-display text-4xl font-extrabold">{formatRupiah(p.price)}</p>
                    <p className={`mt-4 text-base ${hot ? 'text-paper/85' : 'text-ink/80'}`}>{p.desc}</p>
                    <ul className="mt-5 flex-1 space-y-2 text-base">
                      {p.features.map((f) => <li key={f} className="flex gap-2"><span className={hot ? 'text-lime' : 'text-amber'} aria-hidden>✦</span>{f}</li>)}
                    </ul>
                    {'trial' in p && p.trial && (
                      <p className={`mt-5 rounded-2xl border-2 border-dashed p-3 text-sm font-semibold ${hot ? 'border-lime text-lime' : 'border-ink bg-lime/50'}`}>
                        Bonus: coba {p.trial.to} gratis {p.trial.days} hari setelah aktif.
                      </p>
                    )}
                    <a href={p.checkoutUrl} onClick={() => trackPixel('InitiateCheckout', { content_name: p.name, value: p.price, currency: 'IDR' })} target="_blank" rel="noopener noreferrer" className={`mt-6 ${hot ? 'btn-accent' : 'btn-primary'}`}>Beli {p.name}</a>
                  </div>
                );
              })}
            </div>
            <p className="mt-8 max-w-3xl text-base text-ink/75">
              Tidak ada jaminan penghasilan. Yang bisa kamu pegang: selesaikan langkahnya, dan kamu punya hasil kerja yang siap dikirim. Trial bisa kamu mulai sendiri dari Dashboard, sekali per akun, tanpa tagihan otomatis.
            </p>
            <p className="mt-3 text-base text-ink/75">Sudah bayar? <Link to="/voucher" className="font-semibold text-ink underline">Tukarkan kode aksesmu</Link>.</p>
          </div>
        </section>

        {/* 6. Tanya jawab */}
        <section id="faq" aria-labelledby="faq-judul" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 sm:px-6">
          <h2 id="faq-judul" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Yang sering ditanya.</h2>
          <div className="mt-8 space-y-3">
            {SITE.faq.map((f) => (
              <details key={f.q} className="group rounded-3xl border-2 border-ink bg-white p-5 open:shadow-[4px_4px_0_0_#111112]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">
                  {f.q}<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lime text-xl transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-ink/80">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Penutup */}
        <section className="border-t-2 border-ink bg-amber">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between">
            <h2 className="max-w-xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Peluang pertamamu nggak nunggu kamu siap.</h2>
            {loggedIn
              ? <Link to="/app" className="btn-primary shrink-0 px-8 py-3.5 text-base">Buka dashboard</Link>
              : <a href="/#harga" onClick={jump('harga')} className="btn-primary shrink-0 px-8 py-3.5 text-base">Pilih paket</a>}
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} GenZ Preneur, GenZ Prime Corp</span>
          <span>Tidak ada jaminan penghasilan. Hasil bergantung pada eksekusi masing-masing.</span>
        </div>
      </footer>
    </div>
  );
}
