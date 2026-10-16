/**
 * Konten publik sementara (Sprint 1).
 * Mulai Sprint 2 (produk & harga) dan Sprint 3 (CMS), data ini dipindah ke
 * database dan dikelola dari Command Center tanpa mengubah kode.
 *
 * ATURAN: jangan menambahkan angka omzet, jumlah alumni, testimoni, atau
 * klaim keberhasilan yang belum terverifikasi.
 */
export const SITE = {
  brand: 'GenZ Preneur',
  tagline: 'Future Entrepreneurs — Learn. Execute. Build.',
  philosophy: "You don't need to own a business to start becoming an entrepreneur.",

  instructor: {
    name: 'Suden Bahaudin, S.Pi.',
    title: 'Founder & CEO GenZ Prime Corp',
    bio: 'Praktisi yang membangun dan menjalankan bisnis custom apparel, sales, marketing, dan relasi B2B. Di GenZ Preneur, ia membagikan cara kerja yang ia jalankan sendiri — dari mencari calon klien sampai menutup kesepakatan.',
  },

  benefits: [
    { no: 1, emoji: '🧠', title: 'Entrepreneur Mindset', desc: 'Pola pikir dan mentalitas untuk mulai.', tile: 'bg-lime' },
    { no: 2, emoji: '📈', title: 'Sales & Marketing Skills', desc: 'Belajar mencari prospek dan membuat penawaran.', tile: 'bg-sky' },
    { no: 3, emoji: '🤝', title: 'Business Partner Strategy', desc: 'Belajar menawarkan jasa ke bisnis yang sudah berjalan.', tile: 'bg-lilac' },
    { no: 4, emoji: '⚡', title: 'AI Business Toolkit', desc: 'Template dan tools untuk mendukung eksekusi.', tile: 'bg-pink' },
    { no: 5, emoji: '✅', title: 'Practical Action Plan', desc: 'Panduan langkah awal yang terstruktur.', tile: 'bg-amber-soft' },
  ],

  /** Harga perkenalan — final dikonfigurasi admin di Sprint 2. */
  plans: [
    { name: 'Starter', price: 99_000, features: ['Live webinar + replay', 'Materi & worksheet dasar', 'Tools AI terpilih', 'Execution Challenge 7 hari'] },
    { name: 'Core', price: 249_000, features: ['Semua isi Starter', 'Materi lanjutan & bootcamp praktik', 'Tools tambahan & akses AI lebih panjang', 'Review tugas sesuai ketentuan program'], highlight: true },
    { name: 'Advanced', price: 499_000, features: ['Semua isi Core', 'Tools lanjutan', 'Challenge lanjutan', 'Sesi mentoring bila dijadwalkan & progress review'] },
  ],

  faq: [
    { q: 'Aku belum punya ide bisnis sama sekali. Cocok nggak?', a: 'Cocok — justru dibuat untuk itu. Assessment (36 soal) memetakan industri, jalur, dan Profil Cuan-mu, lalu kamu pilih satu dari 10 jalur mulai. Problem Map membantu mengubah keresahan di sekitarmu jadi ide yang bisa dicoba.' },
    { q: 'Aku masih kuliah/kerja. Butuh waktu berapa?', a: 'Satu pelajaran 6–9 menit, dan Action Plan berisi 3 misi kecil per hari. Supaya ada kemajuan nyata, siapkan sekitar 5 jam per minggu — lebih penting rutin daripada lama.' },
    { q: 'Bedanya apa sama nonton konten bisnis gratis di TikTok/YouTube?', a: 'Konten gratis memberi informasi yang tercecer. Di sini kamu ikut alur yang berurutan dan langsung memakai alatnya: hitung HPP & harga, bikin pesan outreach, susun proposal, dan tulis Dream Pact. Hasil kerjamu tersimpan — bukan cuma ditonton.' },
    { q: 'Aku introvert / nggak jago jualan. Bisa?', a: 'Bisa. Sales di sini diajarkan sebagai skill: mendengar, bertanya, dan menjelaskan dengan jujur. Outreach Studio memberi draf pesan yang tinggal kamu sesuaikan, dan banyak jalur (freelance, produk digital) tidak menuntut banyak bicara.' },
    { q: 'Apakah aku harus punya modal?', a: 'Tidak wajib. Sebagian besar dari 10 jalur bisa dimulai dengan modal Rp0 — memakai skill, waktu, dan HP yang kamu punya. Jalur produk fisik diajarkan dengan sistem pre-order supaya tidak menumpuk stok.' },
    { q: 'Apakah ada jaminan penghasilan?', a: 'Tidak ada. GenZ Preneur membantu kamu belajar dan berlatih secara terstruktur. Hasil bergantung pada eksekusi, pasar, dan banyak faktor lain. Hati-hati dengan program apa pun yang menjanjikan angka pasti.' },
    { q: 'Kapan bisa beli dan bagaimana cara bayarnya?', a: 'Pembelian dibuka bersamaan dengan batch pertama. Detail paket, jadwal, dan cara pembayaran diumumkan saat itu. Bikin akun sekarang supaya Passport & Assessment-mu sudah siap.' },
    { q: 'Data pribadiku aman?', a: 'Data Passport hanya bisa dilihat olehmu dan admin untuk keperluan layanan, tidak dibagikan ke peserta lain, dan bisa kamu ekspor atau hapus kapan saja dari halaman Passport.' },
  ],
} as const;

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
