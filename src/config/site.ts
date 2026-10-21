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
    bio: 'Menjalankan bisnis custom apparel, sales, marketing, dan relasi B2B. Di GenZ Preneur, Bung Suden membagikan cara menyiapkan bantuan dan penawaran untuk bisnis yang sudah berjalan. Pengalaman praktisi bukan jaminan hasil peserta.',
  },
  benefits: [
    { no: 1, emoji: '🔎', title: 'Pilih satu masalah', desc: 'Pisahkan pengamatan dari dugaan dan pilih kebutuhan yang ingin kamu cek.', tile: 'bg-lime' },
    { no: 2, emoji: '🛠️', title: 'Buat contoh bantuan', desc: 'Tentukan cakupan kecil yang sanggup kamu kerjakan, lalu buat satu contoh.', tile: 'bg-sky' },
    { no: 3, emoji: '🧾', title: 'Susun penawaran', desc: 'Jelaskan hasil, harga, waktu, revisi, dan batas pekerjaan secara jujur.', tile: 'bg-lilac' },
    { no: 4, emoji: '💬', title: 'Coba pendekatan personal', desc: 'Siapkan satu pesan yang relevan; kamu sendiri yang memutuskan untuk mengirim.', tile: 'bg-pink' },
    { no: 5, emoji: '🔁', title: 'Evaluasi & perbaiki', desc: 'Catat percobaan, bedakan fakta dari tafsiran, lalu perbaiki satu hal.', tile: 'bg-amber-soft' },
  ],
  plans: [
    { key: 'spark', saleReady: true, checkoutUrl: 'https://goakal.com/genzpreneur/webinar-b1/z7x0w/apply', level: 'Mulai hemat', name: 'GenZ Spark', emoji: '⚡', price: 79_000,
      tagline: 'Siapkan bantuan pertamamu.',
      desc: 'Semua langkah Misi Pertama untuk eksekusi peluang pertamamu, dikerjakan sendiri pakai panduan.',
      features: ['Misi Pertama: 9 langkah, hasil tersimpan & bisa diunduh', 'Materi dasar bisnis (Business 101 & Season 1)', 'Simulasi founder Level 1 di 10 industri', 'Tes arah awal & Dream Pact (opsional)'],
      trial: { to: 'GenZ Boost', days: 3 },
    },
    { key: 'boost', saleReady: true, checkoutUrl: 'https://goakal.com/genzpreneur/webinar-b1/tzu72/apply', level: 'Paling pas buat mulai', name: 'GenZ Boost', emoji: '🚀', price: 149_000,
      tagline: 'Kerangka yang sama, alat lebih lengkap.',
      desc: 'Semua isi Spark, plus alat yang bikin kamu lebih cepat: hitung harga, bikin proposal, dan susun pesan.',
      features: ['Semua isi GenZ Spark', 'Kalkulator harga & komisi, template proposal', 'Penyusun draf pesan: nawarin jasa, ajak kolaborasi, minta waktu ke senior', 'Materi Season 2–3'],
      trial: { to: 'GenZ Impact', days: 7 },
      badge: 'Rekomendasi',
    },
    { key: 'impact', saleReady: true, checkoutUrl: 'https://goakal.com/genzpreneur/webinar-b1/2md0s/apply', level: 'Buat yang mau naik level', name: 'GenZ Impact', emoji: '🎯', price: 299_000,
      tagline: 'Latihan naik level, dari rintis sampai skala.',
      desc: 'Semua isi Boost, plus latihan menjalankan bisnis yang lebih besar lewat simulasi founder lengkap.',
      features: ['Semua isi GenZ Boost', 'Simulasi founder lengkap: 30 skenario bisnis 90 hari', 'Playbook tim & blueprint bisnis tiap skenario', 'Materi lanjutan Season 4', 'Belum termasuk sesi bersama Bung Suden (dibuka terpisah)'],
      badge: 'Terlengkap',
    },
  ],
  faq: [
    { q: 'Aku belum punya usaha. Cocok?', a: 'Justru itu. Di sini kamu belajar jadi entrepreneur dengan bantu bisnis yang udah jalan, bukan bikin usaha dari nol.' },
    { q: 'Bedanya sama course lain?', a: 'Di sini kamu ngerjain, bukan cuma nonton. Tiap langkah menghasilkan sesuatu yang langsung bisa dipakai: contoh kerja, harga, dan pesan yang siap dikirim.' },
    { q: 'Butuh modal berapa?', a: 'Untuk nawarin jasa atau kolaborasi, cukup HP atau laptop dan skill yang kamu punya. Kamu tidak perlu beli stok atau sewa tempat.' },
    { q: 'Ada mentor atau AI Coach?', a: 'Sesi bersama Bung Suden dibuka terpisah, dan jadwalnya kami umumkan lebih dulu. AI Coach di Heybinder bisa kamu akses lewat undangan di menu Akun & Paket.' },
    { q: 'Gimana cara bayar dan mulai?', a: 'Bayar lewat GoAkal, platform pembayaran kami, lalu kode akses dikirim ke emailmu. Tukarkan kodenya di menu Tukar Voucher dengan email yang sama, dan kamu langsung bisa mulai.' },
  ],
} as const;
export const formatRupiah = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);