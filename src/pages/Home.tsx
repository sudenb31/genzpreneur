import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Logo } from '../components/ui';
import { formatRupiah, SITE } from '../config/site';
import { isFirebaseConfigured } from '../lib/firebase';
import { PATH_FAMILIES, pathsByFamily } from '../content/paths';
import type { TrackKey } from '../content/assessment';
import { trackPixel } from '../lib/pixel';

const PATHS = ['Deskripsi menu', 'Draf konten sederhana', 'Foto produk dasar', 'Rapi katalog', 'Catatan pertanyaan pelanggan'];
const STEPS = [
  { k: 'Amati satu masalah', d: 'Mulai dari waktu dan skill yang tersedia. Pisahkan pengamatan dari dugaan tentang kebutuhan bisnis.' },
  { k: 'Buat satu contoh', d: 'Pilih bantuan kecil dengan batas jelas, lalu buat contoh yang bisa diperiksa.' },
  { k: 'Jelaskan penawaran', d: 'Tulis hasil, harga berbasis waktu/biaya, durasi, revisi, dan pengecualiannya.' },
  { k: 'Coba secara etis', d: 'Siapkan pendekatan personal. Kirim sendiri melalui saluran yang wajar, tanpa broadcast.' },
  { k: 'Evaluasi & perbaiki', d: 'Catat respons apa adanya, termasuk belum dibalas atau ditolak. Perbaiki satu hal.' },
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
  const { hash } = useLocation();

  // Link seperti "/#harga" dari dalam aplikasi: gulir otomatis ke bagian yang dituju.
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <div className="public-home overflow-x-hidden bg-paper text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b-2 border-ink/10 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" aria-label="GenZ Preneur — Beranda"><Logo /></Link>
          <nav aria-label="Navigasi publik" className="flex items-center gap-1 sm:gap-2">
            <button type="button" aria-expanded={mobileMenu} aria-controls="public-mobile-menu" className="btn-ghost px-3 py-2 text-xs md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>Menu</button>
<a href="#benefit" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Benefit</a>
            <a href="#jalur" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Jalur</a>
            <a href="#harga" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Harga</a>
            <Link to="/voucher" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">Tukar voucher</Link>
            <a href="#faq" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 md:block">FAQ</a>
            {!loggedIn && <Link to="/masuk" className="hidden rounded-full px-3 py-2 text-sm font-semibold hover:bg-paper-2 sm:inline-flex">Masuk</Link>}
            <Link to={cta.to} className="btn-primary hidden py-2 sm:inline-flex">{loggedIn ? 'Dashboard' : 'Lihat paket'}</Link>
          </nav>
        </div>
        {mobileMenu && <nav id="public-mobile-menu" aria-label="Menu situs di HP" className="grid grid-cols-2 gap-2 border-t border-line px-4 py-3 md:hidden">
          {[{ to: '/#benefit', label: 'Isi program' }, { to: '/#jalur', label: 'Jalur mulai' }, { to: '/#harga', label: 'Paket & harga' }, { to: '/#faq', label: 'Pertanyaan umum' }, { to: '/voucher', label: 'Tukar voucher' }, { to: loggedIn ? '/app' : '/masuk', label: loggedIn ? 'Dashboard' : 'Masuk' }].map((item) => <Link key={item.to} to={item.to} className="rounded-xl bg-white px-3 py-3 text-sm font-semibold" onClick={() => setMobileMenu(false)}>{item.label}</Link>)}
        </nav>}
      </header>

<main id="public-content">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pt-20">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="chip bg-lime text-sm" style={{ transform: 'rotate(-3deg)' }}>Untuk Gen Z pemula</span>
              <span className="chip bg-lilac text-sm" style={{ transform: 'rotate(2deg)' }}>Tanpa modal besar</span>
              <span className="chip bg-sky text-sm" style={{ transform: 'rotate(-1deg)' }}>Mulai dari skill yang kamu punya</span>
            </div>
            <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
              Punya skill?<br />
              Ubah jadi{' '}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">jasa pertamamu.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-amber sm:h-6" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-ink/80">
              GenZ Preneur nuntun kamu <strong className="text-ink">dari nol sampai berani nawarin jasa ke bisnis nyata</strong>: cari bisnis yang butuh bantuan, bikin contoh kerja, hitung harga, lalu kirim penawaran pertamamu.
            </p>
            <ul className="mt-6 grid max-w-xl gap-2 text-base font-semibold sm:grid-cols-3">
              <li className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-3 py-2"><span aria-hidden>✅</span>Misi 9 tahap</li>
              <li className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-3 py-2"><span aria-hidden>⚡</span>Alat harga & proposal</li>
              <li className="flex items-center gap-2 rounded-2xl border-2 border-ink bg-white px-3 py-2"><span aria-hidden>🎮</span>Simulasi founder</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={cta.to} className="btn-accent px-7 py-3.5 text-base">{cta.label} →</Link>
              <a href="#benefit" className="btn-ghost px-7 py-3.5 text-base">Jelajahi isi program ↓</a>
            </div>
            <p className="mt-4 text-sm text-muted">Pilih paket, bayar lewat GoAkal, lalu tukarkan kode akses dari emailmu. Tidak ada jaminan penghasilan.</p>
          </div>

          <div className="relative mx-auto w-full max-w-md" aria-label="Ilustrasi hasil kerja, bukan hasil peserta">
            <div className="card-pop rotate-2 bg-white p-5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Ilustrasi alur · bukan hasil peserta</p>
              <h2 className="mt-3 font-display text-2xl font-extrabold">Dari skill ke penawaran pertama.</h2>
              <div className="mt-4 rounded-2xl border-2 border-ink bg-lime p-4"><p className="text-xs font-extrabold">01 · PENGAMATAN</p><p className="mt-1 text-sm">Tiga menu publik belum punya deskripsi. Kebutuhannya masih perlu ditanyakan.</p></div>
              <div className="mt-3 rounded-2xl border-2 border-ink bg-lilac p-4"><p className="text-xs font-extrabold">02 · CONTOH & PENAWARAN</p><p className="mt-1 text-sm">Contoh teks menu, batas revisi, waktu kerja, dan dasar harga.</p></div>
              <div className="mt-3 rounded-2xl border-2 border-ink bg-sky p-4"><p className="text-xs font-extrabold">03 · PERCOBAAN & CATATAN</p><p className="mt-1 text-sm">Tanya satu pemilik yang relevan, catat respons, lalu perbaiki.</p></div>
              <p className="mt-4 text-xs font-semibold">Tanpa janji pelanggan, omzet, atau hasil instan.</p>
            </div>
          </div>
        </section>

        <section aria-label="Hasil yang bisa kamu kerjakan" className="mx-auto mb-12 grid max-w-6xl gap-3 px-4 sm:grid-cols-3 sm:px-6">
          {[{ no: '01', title: 'Pilih bantuan kecil', desc: 'Satu masalah dan cakupan pekerjaan sesuai skill serta waktumu.' }, { no: '02', title: 'Bawa pulang hasil kerja', desc: 'Latihan, perhitungan harga, dan penawaran yang bisa dipakai.' }, { no: '03', title: 'Lakukan langkah nyata', desc: 'Catat satu percobaan etis dan perbaikan yang ingin kamu uji.' }].map((item) => <div key={item.no} className="flex gap-4 rounded-2xl border border-line bg-white p-5"><span className="font-display text-lg font-extrabold text-amber-ink">{item.no}</span><div><h2 className="text-lg font-bold">{item.title}</h2><p className="mt-1 text-base leading-relaxed text-muted">{item.desc}</p></div></div>)}
        </section>
        {/* Jalur mulai — statis agar nyaman dibaca */}
        <section aria-label="Contoh jalur mulai" className="border-y-2 border-ink bg-ink py-3 text-paper">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-3 px-4">
            {PATHS.map((p, i) => (
              <span key={i} className="font-display text-sm font-bold">{p} <span className="text-amber" aria-hidden>✦</span></span>
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
            <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Dari pengamatan ke percobaan.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-6">
              {SITE.benefits.map((b, i) => (
                <article key={b.no}
                  className={`public-benefit card-pop p-6 ${i < 2 ? 'md:col-span-3' : 'md:col-span-2'}`}>
                  <div className="flex items-start justify-between">
                    <span className="benefit-icon" aria-hidden>{b.emoji}</span>
                    <span className="chip bg-white">#{b.no}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-extrabold leading-tight">{b.title}</h3>
                  <p className="mt-1 text-ink/75">{b.desc}</p>
                </article>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <article className="card-pop bg-ink p-6 text-paper">
                <p className="text-xs font-extrabold uppercase tracking-wider text-lime">Opsional · Assessment</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold">Butuh arah awal?</h3>
                <p className="mt-1 text-paper/70">Assessment memberi saran refleksi dari jawabanmu. Tidak perlu diselesaikan sebelum praktik, dan hasilnya belum membuktikan kebutuhan pasar.</p>
              </article>
              <article className="card-pop bg-amber p-6">
                <p className="text-xs font-extrabold uppercase tracking-wider">Bonus · Outreach Studio</p>
                <h3 className="mt-2 font-display text-2xl font-extrabold">Takut chat duluan?</h3>
                <p className="mt-1 text-ink/80">Pesan siap kirim untuk minta waktu ke mentor, jadi sales partner, atau nawarin jasa ke UMKM.</p>
              </article>
              <article className="card-pop bg-lime p-6">
                <p className="text-xs font-extrabold uppercase tracking-wider">Opsional · Dream Pact</p>
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

        {/* Jalur mulai */}
        <section id="jalur" className="scroll-mt-20 bg-ink py-20 text-paper">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-lime">10 jalur · 3 gaya main</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Jalur referensi untuk dieksplorasi.</h2>
            <p className="mt-3 max-w-2xl text-paper/70">Fokus awal program ini adalah bantuan kecil untuk bisnis yang sudah berjalan. Pilihan di bawah merupakan referensi lebih luas; kamu tidak perlu mencoba semuanya.</p>

            <details className="mt-8"><summary className="cursor-pointer text-sm font-bold text-lime">Lihat 10 jalur referensi (opsional)</summary><div className="mt-6 space-y-10">
              {(Object.keys(PATH_FAMILIES) as TrackKey[]).map((fam) => {
                const F = PATH_FAMILIES[fam];
                return (
                  <div key={fam}>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="font-display text-2xl font-extrabold text-lime">{F.emoji} {F.title}</h3>
                      <p className="text-sm text-paper/60">{F.desc}</p>
                    </div>
                    <div className={`mt-4 grid gap-4 sm:grid-cols-2 ${pathsByFamily(fam).length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                      {pathsByFamily(fam).map((p) => (
                        <article key={p.key} className="flex flex-col rounded-3xl border-2 border-paper/20 bg-paper/5 p-5">
                          <p className="text-3xl" aria-hidden>{p.emoji}</p>
                          <h4 className="mt-2 font-display text-lg font-extrabold">{p.name}</h4>
                          <p className="mt-1 flex-1 text-sm text-paper/70">{p.oneLiner}</p>
                          <dl className="mt-4 space-y-1.5 text-xs">
                            <div className="flex gap-2"><dt className="w-14 shrink-0 font-bold text-lime">Cuan</dt><dd className="text-paper/80">{p.howMoney}</dd></div>
                            <div className="flex gap-2"><dt className="w-14 shrink-0 font-bold text-lime">Modal</dt><dd className="text-paper/80">{p.capital}</dd></div>
                            <div className="flex gap-2"><dt className="w-14 shrink-0 font-bold text-lime">Skill</dt><dd className="text-paper/80">{p.skills}</dd></div>
                          </dl>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            </details><div className="mt-10 flex flex-col gap-3 rounded-3xl border-2 border-lime p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-display text-xl font-extrabold">Butuh titik mulai? <span className="text-lime">Misi Pertama</span> mengajakmu memilih satu bantuan kecil.</p>
              <Link to={loggedIn ? '/app/action-plan' : cta.to} className="btn-accent shrink-0">{loggedIn ? 'Buka Misi Pertama' : 'Lihat paket & mulai'} →</Link>
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
            <p className="eyebrow">Fungsi aplikasi · pendampingan dipisahkan</p>
            <h2 className="mt-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Pilih alat bantu yang dibutuhkan.</h2>
            <p className="mt-3 max-w-2xl text-muted">Misi Pertama dapat dikerjakan manual di Spark. Boost menambah alat bantu, Impact membuka materi lanjutan dan simulasi lengkap. Bayar lewat GoAkal, lalu tukarkan kode akses yang dikirim ke emailmu.</p>
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
                        Termasuk trial gratis: <strong>{p.trial.to}</strong> {p.trial.days} hari. Tidak termasuk layanan pendampingan.
                      </p>
                    )}
                    <a href={p.checkoutUrl} onClick={() => trackPixel('InitiateCheckout', { content_name: p.name, value: p.price, currency: 'IDR' })} target="_blank" rel="noopener noreferrer" className={`mt-6 ${hot ? 'btn-accent' : 'btn-primary'}`}>Beli {p.name} →</a>
                    <p className={`mt-2 text-center text-xs ${hot ? 'text-paper/70' : 'text-muted'}`}>Pembayaran lewat GoAkal. Setelah bayar, kode akses dikirim ke emailmu; tukarkan di menu Tukar Voucher.</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-muted">Trial bisa kamu mulai sendiri dari Dashboard, sekali per akun, dan berakhir tanpa tagihan otomatis. Harga tidak mencakup live, konsultasi, atau AI Coach eksternal. Sudah menerima voucher? <Link to="/voucher" className="font-semibold text-ink underline">Tukarkan kode vouchermu</Link>.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-labelledby="support-status"><div className="card-pop bg-lilac p-6"><p className="eyebrow">Pendampingan terpisah · belum dibuka</p><h2 id="support-status" className="mt-2 font-display text-2xl font-extrabold">Sesi kerja bersama Bung Suden: bukan tambahan janji.</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed">Pendampingan terpisah dari paket aplikasi, termasuk GenZ Impact. Rancangan awal: dua sesi kerja, satu per pekan, bersama Bung Suden. Jadwal, kuota, batas review, dan panduan akses layanan eksternal akan diumumkan sebelum pendaftaran dibuka. Paket aplikasi dan trial tidak menjanjikan konsultasi harian atau review individual.</p><Link to="/daftar?minat=impact" className="btn-primary mt-5">Catat minat pendampingan →</Link><p className="mt-3 text-xs">Pencatatan minat bukan pembelian atau kepastian jadwal.</p></div></section>
        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-20 sm:px-6">
          <p className="eyebrow">Sebelum kamu daftar</p>
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

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="card-pop bg-amber px-8 py-14 text-center">
            <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl">Mulai dari yang kamu punya hari ini.</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/80">Pilih paket yang sesuai. Setelah aktif, mulai dari satu masalah, buat contoh bantuan, lalu tentukan percobaan yang pantas dicoba.</p>
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
