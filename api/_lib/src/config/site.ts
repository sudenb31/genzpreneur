/** Public promises describe shipped app functions. Service enrollment is separate. */
export const PROGRAM_STATUS = {
  enrollmentOpen: false,
  mentor: 'Suden Bahaudin (Bung Suden)',
  mentorCount: 1,
  liveCadence: 'Satu sesi live per pekan',
  coachReadyByFounderConfirmation: true,
  coachAccessUrl: 'https://invite.heybinder.com/T8rQePvuj7b',
  note: 'Jadwal, kuota, dan panduan akses pendampingan diumumkan sebelum pendaftaran dibuka.',
} as const;

export const SITE = {
  brand: 'GenZ Preneur',
  tagline: 'Satu bantuan kecil. Satu percobaan nyata.',
  philosophy: "You don't need to own a business to start becoming an entrepreneur.",
  instructor: {
    name: 'Suden Bahaudin, S.Pi.', title: 'Founder & CEO GenZ Prime Corp',
    bio: 'Menjalankan bisnis custom apparel, sales, marketing, dan relasi B2B. Di GenZ Preneur, Bung Suden membagikan cara menyiapkan bantuan dan penawaran untuk bisnis yang sudah berjalan.',
  },
  /** Video demo ±60 detik di landing. Kosongkan `src` agar bagian video tidak tampil. File taruh di folder public/. */
  demoVideo: { src: '', poster: '' },
  plans: [
    { key: 'spark', saleReady: true, checkoutUrl: 'https://goakal.com/genzpreneur/webinar-b1/z7x0w/apply', level: 'Mulai praktik', name: 'GenZ Spark', emoji: '⚡', price: 79_000,
      tagline: 'Siapkan jasa pertamamu.',
      desc: 'Untuk pemula yang mau mulai: kerjakan Misi Pertama langkah demi langkah sampai punya penawaran siap kirim.',
      features: ['Misi Pertama 9 tahap: dari skill sampai penawaran pertama', 'Materi Business 101 & Season 1', 'Simulasi Founder Level 1 gratis di 10 industri', 'Dream Pact: tulis target bisnismu + versi cetak', 'Tes arah bisnis (assessment) & profil skill'],
      trial: { to: 'GenZ Boost', days: 3 },
    },
    { key: 'boost', saleReady: true, checkoutUrl: 'https://goakal.com/genzpreneur/webinar-b1/tzu72/apply', level: 'Alat lengkap', name: 'GenZ Boost', emoji: '🚀', price: 149_000,
      tagline: 'Lebih cepat, alat lebih lengkap.',
      desc: 'Untuk yang mau langsung jalan: pesan pertama, harga, dan proposal disusun dengan bantuan alat siap pakai.',
      features: ['Semua isi GenZ Spark', 'Cari Pelanggan (Outreach Studio): draf pesan nawarin jasa, ajak kolaborasi, minta waktu mentor', 'Toolkit: kalkulator harga jual & komisi, template proposal, peta masalah', 'Materi Season 2–3'],
      trial: { to: 'GenZ Impact', days: 7 },
      badge: 'Paling pas',
    },
    { key: 'impact', saleReady: true, checkoutUrl: 'https://goakal.com/genzpreneur/webinar-b1/2md0s/apply', level: 'Naik level', name: 'GenZ Impact', emoji: '🎯', price: 299_000,
      tagline: 'Latihan naik level, dari rintis sampai skala.',
      desc: 'Untuk peserta yang ingin melihat cara menjalankan bisnis saat sudah punya tim, gudang, dan modal lebih besar, lewat materi lanjutan dan simulasi lengkap.',
      features: ['Semua isi GenZ Boost', 'Materi lanjutan Season 4', 'Simulasi Founder lengkap: 30 skenario roleplay 90 hari (10 industri × 3 level modal)', 'Playbook tim & blueprint tiap skenario siap salin'],
      badge: 'Terlengkap',
    },
  ],
  faq: [
    { q: 'Bedanya sama course bisnis lain apa?', a: 'Di sini kamu tidak berhenti di nonton materi. Tiap tahap Misi Pertama menghasilkan sesuatu yang nyata: contoh hasil kerja, harga, penawaran, dan pesan untuk calon pelanggan, partner, atau mentor. Materinya ada, tapi jadi pendukung praktik.' },
    { q: 'Aku belum punya usaha dan modal. Bisa ikut?', a: 'Bisa, justru dibuat untuk itu. Kamu mulai dari skill dan waktu yang kamu punya untuk bantu bisnis yang sudah jalan, jadi tidak perlu beli stok atau sewa tempat. Yang tetap perlu: HP/laptop, kuota, dan waktu.' },
    { q: 'GoAkal itu apa? Gimana cara aksesnya?', a: 'GoAkal adalah platform pembayaran kelas online yang kami pakai. Setelah bayar di GoAkal, kode akses dikirim ke emailmu. Buka genzpreneur.id/voucher, masuk dengan email yang sama dengan email pembelian, lalu tukarkan kodenya.' },
    { q: 'Bayarnya sekali atau langganan?', a: 'Sekali bayar, bukan langganan. Pemilik Spark bisa coba Boost 3 hari dan pemilik Boost bisa coba Impact 7 hari, sekali per akun, tanpa tagihan otomatis. Trial bisa kamu mulai sendiri dari Dashboard.' },
    { q: 'Ada jaminan dapat klien atau penghasilan?', a: 'Tidak ada jaminan penghasilan atau pelanggan — itu tergantung eksekusimu. Yang kami pastikan: kamu punya langkah jelas, alat bantu, dan cara mencatat setiap percobaan supaya percobaan berikutnya lebih baik.' },
    { q: 'Ada mentor atau sesi live?', a: 'Paket di halaman ini adalah akses aplikasi. Sesi kerja bersama Bung Suden adalah layanan terpisah dan belum dibuka; info akan diumumkan lebih dulu. AI Coach di Heybinder tersedia sebagai layanan eksternal lewat tautan undangan di menu Akun & Paket.' },
  ],
} as const;
export const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);