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

  /**
   * Paket — harga perkenalan batch pertama. Final dikonfigurasi admin di Sprint 2.
   * ATURAN: fitur yang ditulis harus SUDAH ADA di aplikasi (atau jelas "sesuai jadwal program").
   * Harga normal (refPrice) hanya boleh ditampilkan bila benar-benar berlaku setelah masa perkenalan.
   */
  plans: [
    {
      key: 'spark', level: 'Level 01 · Start', name: 'GenZ Spark', emoji: '⚡', price: 49_000, refPrice: 99_000,
      tagline: 'Find Your Spark.',
      desc: 'Temukan potensi, kenali peluang cuan, dan mulai langkah pertamamu.',
      features: [
        'Entrepreneur Passport + rangkuman kesiapan',
        'Assessment 36 soal: industri, jalur & Profil Cuan',
        'Business 101: 13 pelajaran peta dunia bisnis',
        'Season 1 — Wake Up',
        'Action Plan 7 Hari',
        'Dream Pact + versi cetak',
      ],
      trial: { to: 'GenZ Boost', days: 3 },
    },
    {
      key: 'boost', level: 'Level 02 · Execute', name: 'GenZ Boost', emoji: '🚀', price: 149_000, refPrice: 249_000,
      tagline: 'Turn Skills Into Action.',
      desc: 'Bangun skill, gunakan AI business tools, dan mulai eksekusi bisnis secara nyata.',
      features: [
        'Semua isi GenZ Spark',
        'Season 2 — Find Your Why & Edge',
        'Season 3 — Build & Sell',
        'AI Business Toolkit lengkap: 38 prompt, Kalkulator HPP & Harga, Kalkulator Komisi, Template Proposal, Problem Map',
        'Outreach Studio: pesan ke mentor, klien & partner',
      ],
      trial: { to: 'GenZ Impact', days: 7 },
      badge: 'Paling Pas',
    },
    {
      key: 'impact', level: 'Level 03 · Accelerate', name: 'GenZ Impact', emoji: '🎯', price: 299_000, refPrice: 499_000,
      tagline: 'Build Something That Matters.',
      desc: 'Percepat perkembangan lewat challenge lanjutan, evaluasi, dan mentoring sesuai program.',
      features: [
        'Semua isi GenZ Boost',
        'Season 4 — Lead & Last (tim, life ops, future proof)',
        'Challenge lanjutan sesuai jadwal program',
        'Evaluasi progres & mentoring sesuai jadwal program',
      ],
      badge: 'Premium',
    },
  ],

  faq: [
    { q: 'Aku belum punya ide bisnis sama sekali. Cocok nggak?', a: 'Cocok — justru dibuat untuk itu. Assessment (36 soal) memetakan industri, jalur, dan Profil Cuan-mu, lalu kamu pilih satu dari 10 jalur mulai. Problem Map membantu mengubah keresahan di sekitarmu jadi ide yang bisa dicoba.' },
    { q: 'Aku masih kuliah/kerja. Butuh waktu berapa?', a: 'Satu pelajaran 6–9 menit, dan Action Plan berisi 3 misi kecil per hari. Supaya ada kemajuan nyata, siapkan sekitar 5 jam per minggu — lebih penting rutin daripada lama.' },
    { q: 'Bedanya apa sama nonton konten bisnis gratis di TikTok/YouTube?', a: 'Konten gratis memberi informasi yang tercecer. Di sini kamu ikut alur yang berurutan dan langsung memakai alatnya: hitung HPP & harga, bikin pesan outreach, susun proposal, dan tulis Dream Pact. Hasil kerjamu tersimpan — bukan cuma ditonton.' },
    { q: 'Aku introvert / nggak jago jualan. Bisa?', a: 'Bisa. Sales di sini diajarkan sebagai skill: mendengar, bertanya, dan menjelaskan dengan jujur. Outreach Studio memberi draf pesan yang tinggal kamu sesuaikan, dan banyak jalur (freelance, produk digital) tidak menuntut banyak bicara.' },
    { q: 'Apakah aku harus punya modal?', a: 'Tidak wajib. Sebagian besar dari 10 jalur bisa dimulai dengan modal Rp0 — memakai skill, waktu, dan HP yang kamu punya. Jalur produk fisik diajarkan dengan sistem pre-order supaya tidak menumpuk stok.' },
    { q: 'Apakah ada jaminan penghasilan?', a: 'Tidak ada. GenZ Preneur membantu kamu belajar dan berlatih secara terstruktur. Hasil bergantung pada eksekusi, pasar, dan banyak faktor lain. Hati-hati dengan program apa pun yang menjanjikan angka pasti.' },
    { q: 'Gimana cara dapat akses? Ada free trial?', a: 'Akses dibuka lewat undangan: gabung daftar tunggu, tim kami menghubungimu, lalu link masuk dikirim ke emailmu — tanpa password. Setiap pembeli GenZ Spark bisa mencoba GenZ Boost gratis 3 hari, dan pembeli GenZ Boost bisa mencoba GenZ Impact gratis 7 hari — tanpa tagihan otomatis.' },
    { q: 'Data pribadiku aman?', a: 'Data Passport hanya bisa dilihat olehmu dan admin untuk keperluan layanan, tidak dibagikan ke peserta lain, dan bisa kamu ekspor atau hapus kapan saja dari halaman Passport.' },
  ],
} as const;

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
