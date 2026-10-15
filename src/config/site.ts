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

  tracks: [
    { name: 'Sales Partner', desc: 'Bantu bisnis yang sudah berjalan mendapatkan pelanggan, dengan skema komisi.' },
    { name: 'Marketing Partner', desc: 'Tawarkan jasa konten, social media, atau lead generation ke UMKM.' },
    { name: 'Business Builder', desc: 'Rancang dan uji layanan atau produkmu sendiri dari nol.' },
  ],

  /** Harga perkenalan — final dikonfigurasi admin di Sprint 2. */
  plans: [
    { name: 'Starter', price: 99_000, features: ['Live webinar + replay', 'Materi & worksheet dasar', 'Tools AI terpilih', 'Execution Challenge 7 hari'] },
    { name: 'Core', price: 249_000, features: ['Semua isi Starter', 'Materi lanjutan & bootcamp praktik', 'Tools tambahan & akses AI lebih panjang', 'Review tugas sesuai ketentuan program'], highlight: true },
    { name: 'Advanced', price: 499_000, features: ['Semua isi Core', 'Tools lanjutan', 'Challenge lanjutan', 'Sesi mentoring bila dijadwalkan & progress review'] },
  ],

  faq: [
    { q: 'Apakah saya harus punya bisnis atau modal?', a: 'Tidak. Program ini dirancang agar kamu bisa mulai dari skill yang kamu punya, misalnya membantu bisnis lain di bidang sales atau marketing.' },
    { q: 'Apakah ada jaminan penghasilan?', a: 'Tidak ada. GenZ Preneur membantu kamu belajar dan berlatih secara terstruktur. Hasil bergantung pada eksekusi, pasar, dan banyak faktor lain.' },
    { q: 'Apakah data saya aman?', a: 'Data Passport hanya bisa dilihat oleh kamu dan admin untuk keperluan layanan. Data tidak dibagikan ke peserta lain, dan kamu bisa mengekspor atau menghapusnya kapan saja.' },
    { q: 'Apakah AI Coach menggantikan mentor?', a: 'Tidak. AI Coach adalah alat bantu belajar. Ia bukan mentor manusia dan tidak mengambil keputusan atas namamu.' },
  ],
} as const;

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
