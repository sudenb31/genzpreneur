/**
 * Profil industri untuk rekomendasi Assessment.
 * Isi bersifat panduan umum — BUKAN data permintaan pasar dan BUKAN jaminan
 * suatu industri pasti menghasilkan uang.
 */
export const INDUSTRY_KEYS = [
  'fashion', 'fnb', 'digital_services', 'creator', 'education',
  'event', 'beauty', 'b2b_sales', 'tech', 'retail',
] as const;
export type IndustryKey = (typeof INDUSTRY_KEYS)[number];

export interface Industry {
  key: IndustryKey;
  name: string;
  emoji: string;
  tagline: string;
  /** Cara masuk tanpa modal uang. */
  zeroCapitalRoutes: string[];
  /** Siapa calon klien / mitra pertama yang realistis. */
  firstTargets: string[];
  /** Penawaran pertama yang masuk akal. */
  firstOffer: string;
  skills: string[];
  watchOut: string;
}

export const INDUSTRIES: Record<IndustryKey, Industry> = {
  fashion: {
    key: 'fashion', name: 'Fashion & Custom Apparel', emoji: '👕',
    tagline: 'Kaos, jaket, merchandise komunitas & organisasi.',
    zeroCapitalRoutes: [
      'Jadi sales partner brand/konveksi dengan komisi per order lunas',
      'Pegang order merchandise untuk organisasi kampus atau komunitasmu sendiri (sistem PO, bayar di depan)',
      'Bantu brand lokal kelola katalog & DM pemesanan',
    ],
    firstTargets: ['Himpunan & UKM kampus', 'Komunitas hobi', 'Panitia event', 'Kantor kecil yang butuh seragam'],
    firstOffer: 'Pengadaan merchandise satu pintu: desain, sampel, produksi, dan pengiriman — kamu jadi penghubung ke konveksi.',
    skills: ['Negosiasi', 'Follow-up', 'Rasa desain dasar', 'Manajemen PO'],
    watchOut: 'Jangan pernah menalangi uang produksi. Pakai sistem DP/PO.',
  },
  fnb: {
    key: 'fnb', name: 'Kuliner & F&B', emoji: '🍜',
    tagline: 'Warung, kafe, katering, frozen food, UMKM makanan.',
    zeroCapitalRoutes: [
      'Jadi reseller/agen frozen food atau katering dengan sistem pre-order',
      'Tawarkan jasa kelola GoFood/GrabFood/ShopeeFood untuk warung sekitar',
      'Cari klien katering kantor/acara untuk UMKM dengan komisi',
    ],
    firstTargets: ['Warung & kafe di sekitar kampus/rumah', 'Katering rumahan', 'Produsen frozen food lokal'],
    firstOffer: 'Rapikan menu & foto di aplikasi ojol + promo mingguan, dibayar bulanan atau komisi kenaikan order.',
    skills: ['Foto produk HP', 'Copywriting menu', 'Komunikasi dengan owner'],
    watchOut: 'Bisnis makanan sensitif kualitas & izin. Jangan janjikan hal di luar kendalimu.',
  },
  digital_services: {
    key: 'digital_services', name: 'Jasa Digital', emoji: '💻',
    tagline: 'Desain, admin online, web sederhana, editing.',
    zeroCapitalRoutes: [
      'Jual skill yang sudah kamu punya: desain Canva, edit video, admin chat, input data',
      'Mulai dari 1–2 proyek pilot gratis/murah untuk portofolio, lalu pasang harga',
      'Gabung tim freelancer yang lebih senior sebagai asisten',
    ],
    firstTargets: ['UMKM yang IG-nya tidak aktif', 'Toko online yang slow respon', 'Dosen/organisasi butuh materi presentasi'],
    firstOffer: 'Paket 12 desain feed + 4 story per bulan, atau admin chat 4 jam/hari.',
    skills: ['Canva/CapCut', 'Ketelitian', 'Manajemen waktu', 'Komunikasi revisi'],
    watchOut: 'Tulis jumlah revisi dan deadline di awal supaya tidak kerja tanpa batas.',
  },
  creator: {
    key: 'creator', name: 'Konten & Creator Economy', emoji: '🎬',
    tagline: 'Konten TikTok/IG/YouTube, affiliate, UGC.',
    zeroCapitalRoutes: [
      'Affiliate produk (TikTok Shop/Shopee) tanpa stok',
      'Buat konten UGC untuk brand lokal (dibayar per video)',
      'Jadi editor atau penulis script untuk creator lain',
    ],
    firstTargets: ['Brand lokal yang butuh UGC', 'Creator yang kewalahan editing', 'Toko online yang belum punya video'],
    firstOffer: '3 video UGC 30 detik per produk dengan 2 variasi hook.',
    skills: ['Storytelling', 'Editing video', 'Konsistensi posting', 'Membaca data insight'],
    watchOut: 'Hasil konten tidak bisa dijamin viral. Jual proses & kualitas, bukan janji views.',
  },
  education: {
    key: 'education', name: 'Edukasi & Kursus', emoji: '📚',
    tagline: 'Les privat, kelas skill, bimbingan, mentoring.',
    zeroCapitalRoutes: [
      'Buka les privat/kelompok untuk mata pelajaran atau skill yang kamu kuasai',
      'Jadi tim marketing lembaga kursus dengan komisi per siswa',
      'Bantu pengajar membuat materi atau kelas online',
    ],
    firstTargets: ['Orang tua siswa SD–SMA', 'Lembaga kursus lokal', 'Teman kampus menjelang ujian'],
    firstOffer: 'Paket 4 sesi belajar + ringkasan materi untuk satu topik spesifik.',
    skills: ['Menjelaskan dengan sederhana', 'Sabar', 'Penyusunan materi'],
    watchOut: 'Bangun reputasi dari hasil belajar murid, bukan klaim berlebihan.',
  },
  event: {
    key: 'event', name: 'Event & Komunitas', emoji: '🎤',
    tagline: 'Acara kampus, workshop, gathering, komunitas.',
    zeroCapitalRoutes: [
      'Cari sponsor/vendor untuk event dengan fee persentase',
      'Jadi penghubung vendor (dekor, MC, dokumentasi) dengan komisi',
      'Kelola komunitas untuk brand atau organisasi',
    ],
    firstTargets: ['Panitia event kampus', 'Vendor dokumentasi/dekor', 'Brand yang ingin masuk komunitas anak muda'],
    firstOffer: 'Paket pencarian sponsor: proposal, daftar 30 calon sponsor, dan follow-up.',
    skills: ['Networking', 'Koordinasi', 'Public speaking', 'Membuat proposal'],
    watchOut: 'Cash event sering mundur. Sepakati fee dan termin pembayaran secara tertulis.',
  },
  beauty: {
    key: 'beauty', name: 'Beauty & Personal Care', emoji: '💄',
    tagline: 'Skincare, kosmetik, barbershop, salon.',
    zeroCapitalRoutes: [
      'Reseller/affiliate brand lokal resmi (cek BPOM)',
      'Bantu salon/barbershop kelola booking & konten',
      'Buat konten review jujur untuk brand',
    ],
    firstTargets: ['Barbershop & salon kecil', 'Brand skincare lokal baru', 'Klinik kecantikan kecil'],
    firstOffer: 'Kelola Instagram + sistem booking WhatsApp untuk barbershop selama 1 bulan.',
    skills: ['Konten visual', 'Customer service', 'Pengetahuan produk'],
    watchOut: 'Hanya jual produk legal (BPOM) dan jangan membuat klaim medis.',
  },
  b2b_sales: {
    key: 'b2b_sales', name: 'Sales & Distribusi B2B', emoji: '🤝',
    tagline: 'Menjual produk/jasa ke perusahaan & organisasi.',
    zeroCapitalRoutes: [
      'Jadi sales freelance/partner untuk vendor yang sudah jalan (komisi per deal)',
      'Lead generation: carikan calon klien yang siap meeting untuk vendor',
      'Agen produk kebutuhan kantor (ATK, snack, souvenir) sistem pesan dulu',
    ],
    firstTargets: ['Vendor yang butuh sales tambahan', 'Kantor kecil & startup', 'Organisasi kampus'],
    firstOffer: 'Saya bantu cari dan menjadwalkan meeting dengan calon klien; komisi hanya dari deal yang lunas.',
    skills: ['Prospecting', 'Pitching', 'Follow-up disiplin', 'CRM sederhana'],
    watchOut: 'Pastikan skema komisi & definisi "deal" tertulis sebelum mulai.',
  },
  tech: {
    key: 'tech', name: 'Teknologi & Produk Digital', emoji: '🚀',
    tagline: 'Template, aplikasi no-code, e-book, otomasi.',
    zeroCapitalRoutes: [
      'Jual template (Notion, Canva, spreadsheet) yang kamu buat sendiri',
      'Jasa otomasi sederhana (form, spreadsheet, chatbot) untuk UMKM',
      'Jadi reseller/affiliate SaaS lokal',
    ],
    firstTargets: ['UMKM yang masih pakai catatan manual', 'Mahasiswa & freelancer', 'Komunitas'],
    firstOffer: 'Sistem pencatatan order + stok sederhana di Google Sheets, termasuk 1 sesi pelatihan.',
    skills: ['Logika & sistem', 'Belajar tools baru', 'Dokumentasi'],
    watchOut: 'Validasi dulu dengan 3–5 calon pembeli sebelum membuat produk lengkap.',
  },
  retail: {
    key: 'retail', name: 'Reseller & Social Commerce', emoji: '🛍️',
    tagline: 'Jualan produk orang lewat WA, IG, TikTok, marketplace.',
    zeroCapitalRoutes: [
      'Dropship/reseller dari supplier yang memperbolehkan tanpa stok',
      'Jual pre-order: kumpulkan pesanan & uang dulu, baru belanja',
      'Jadi admin toko online milik orang lain',
    ],
    firstTargets: ['Lingkaran pertemanan & keluarga', 'Grup komunitas', 'Pembeli marketplace sesuai niche'],
    firstOffer: 'Satu niche produk yang kamu pahami, dijual dengan konten edukasi, bukan sekadar sebar katalog.',
    skills: ['Customer service', 'Konten jualan', 'Ketelitian pesanan'],
    watchOut: 'Pilih supplier yang jelas reputasinya. Jangan menjual produk ilegal atau tiruan.',
  },
};
