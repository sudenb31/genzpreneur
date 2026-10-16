import type { TrackKey } from './assessment';

/**
 * 10 JALUR MULAI — turunan konkret dari 3 gaya main (track) di Assessment.
 * Tidak ada klaim penghasilan: yang dijelaskan adalah CARA uang masuk, bukan berapa.
 */
export interface StartPath {
  key: string;
  family: TrackKey;
  emoji: string;
  name: string;
  oneLiner: string;
  howMoney: string;
  capital: string;
  skills: string;
  firstStep: string;
  watchOut: string;
}

export const PATH_FAMILIES: Record<TrackKey, { title: string; emoji: string; desc: string }> = {
  sales_partner: { title: 'Bantu Jualin', emoji: '🤝', desc: 'Jual produk/jasa yang sudah ada. Modal paling kecil, paling cepat dapat transaksi.' },
  marketing_partner: { title: 'Jual Skill', emoji: '🛠️', desc: 'Tukar skill dan waktumu dengan bayaran. Cocok untuk yang suka ngulik dan bikin hasil kerja.' },
  business_builder: { title: 'Bangun Sendiri', emoji: '🏗️', desc: 'Punya produk/brand sendiri. Lebih lama dibangun, tapi asetnya milikmu.' },
};

export const START_PATHS: StartPath[] = [
  /* ---------------- Bantu Jualin ---------------- */
  {
    key: 'sales-partner', family: 'sales_partner', emoji: '💼', name: 'Sales Partner Komisi',
    oneLiner: 'Jualin produk/jasa bisnis yang sudah jalan ke calon pembeli baru.',
    howMoney: 'Komisi per transaksi yang kamu bawa', capital: 'Rp0', skills: 'Komunikasi, outreach, follow-up',
    firstStep: 'Hubungi 3 bisnis lokal yang produknya kamu percaya, tawarkan jadi sales partner berbasis komisi.',
    watchOut: 'Sepakati hitungan & waktu pembayaran komisi secara tertulis sebelum mulai.',
  },
  {
    key: 'reseller', family: 'sales_partner', emoji: '📦', name: 'Reseller & Dropship',
    oneLiner: 'Ambil produk dari pemasok, jual lagi ke circle atau online.',
    howMoney: 'Selisih harga beli dan harga jual', capital: 'Rp0 (dropship) – kecil (stok)', skills: 'Pilih produk, foto/konten, layanan chat',
    firstStep: 'Pilih 1 produk yang dibutuhkan circle-mu, minta sistem dropship dari pemasok, buka pre-order 7 hari.',
    watchOut: 'Hitung semua potongan (ongkir, fee marketplace) — margin sering lebih tipis dari dugaan.',
  },
  {
    key: 'affiliate', family: 'sales_partner', emoji: '🔗', name: 'Affiliate Creator',
    oneLiner: 'Bikin konten review/rekomendasi dengan link affiliate.',
    howMoney: 'Komisi dari setiap pembelian lewat link-mu', capital: 'Rp0', skills: 'Konten video/foto, konsistensi',
    firstStep: 'Pilih 1 niche yang kamu kuasai, buat 10 konten review jujur dalam 2 minggu.',
    watchOut: 'Persaingan ketat dan aturan komisi platform bisa berubah — jangan jadikan satu-satunya sumber.',
  },
  /* ---------------- Jual Skill ---------------- */
  {
    key: 'umkm-content', family: 'marketing_partner', emoji: '📣', name: 'Jasa Konten & Sosmed UMKM',
    oneLiner: 'Kelola konten Instagram/TikTok untuk bisnis yang belum punya tim marketing.',
    howMoney: 'Fee bulanan atau per paket konten', capital: 'Rp0 (pakai HP)', skills: 'Desain, copywriting, video pendek',
    firstStep: 'Audit 5 akun UMKM di sekitarmu, tawarkan 1 contoh konten gratis ke yang paling butuh.',
    watchOut: 'Batasi jumlah revisi dan cakupan kerja di awal supaya tidak kerja tanpa ujung.',
  },
  {
    key: 'digitalization', family: 'marketing_partner', emoji: '📲', name: 'Digitalisasi UMKM',
    oneLiner: 'Bantu warung & toko masuk online: foto menu, ojol, marketplace, Google Maps.',
    howMoney: 'Fee per setup + paket perawatan bulanan', capital: 'Rp0', skills: 'Foto HP, paham aplikasi, sabar menjelaskan',
    firstStep: 'Cari 10 usaha di Maps yang foto/menunya berantakan, tawarkan rapikan 1 hal kecil dulu.',
    watchOut: 'Jangan pegang akun/password klien tanpa izin tertulis; ajari mereka mengelola sendiri.',
  },
  {
    key: 'freelance', family: 'marketing_partner', emoji: '💻', name: 'Freelance Skill',
    oneLiner: 'Jual skill spesifik: desain, edit video, copywriting, admin virtual, data.',
    howMoney: 'Fee per proyek atau per jam', capital: 'Rp0 – alat yang sudah kamu punya', skills: 'Satu skill yang bisa ditunjukkan hasilnya',
    firstStep: 'Bikin 3 contoh karya (boleh proyek latihan), susun portofolio 1 halaman, kirim ke 10 calon klien.',
    watchOut: 'Hitung harga dengan Kalkulator HPP — waktumu juga biaya.',
  },
  {
    key: 'tutor', family: 'marketing_partner', emoji: '🎓', name: 'Tutor & Kelas Skill',
    oneLiner: 'Ajarkan yang kamu kuasai: les pelajaran, bahasa, coding, musik, desain.',
    howMoney: 'Bayaran per sesi atau paket kelas', capital: 'Rp0', skills: 'Paham materi, sabar, komunikasi',
    firstStep: 'Tawarkan 1 sesi percobaan ke 5 orang di circle-mu, minta masukan, lalu buka paket 4 sesi.',
    watchOut: 'Jangan menjanjikan nilai/hasil ujian tertentu.',
  },
  /* ---------------- Bangun Sendiri ---------------- */
  {
    key: 'physical-product', family: 'business_builder', emoji: '🧋', name: 'Produk Fisik Kecil',
    oneLiner: 'Makanan/minuman pre-order, merch, thrift, kerajinan.',
    howMoney: 'Margin dari setiap produk terjual', capital: 'Kecil — mulai dari sistem pre-order', skills: 'Produksi, kontrol kualitas, jualan',
    firstStep: 'Hitung HPP 1 produk, buka pre-order terbatas 20 unit ke circle-mu.',
    watchOut: 'Stok menumpuk = uang mati. Pre-order dulu, produksi kemudian. Urus izin pangan bila menjual makanan.',
  },
  {
    key: 'digital-product', family: 'business_builder', emoji: '🧩', name: 'Produk Digital',
    oneLiner: 'Template, e-book, preset, kelas rekaman, atau tools sederhana.',
    howMoney: 'Dijual berulang tanpa produksi ulang', capital: 'Rp0 – kecil', skills: 'Keahlian spesifik + kemampuan mengemas',
    firstStep: 'Validasi dulu: tawarkan versi jasa/manual dari produkmu ke 5 orang sebelum membuat produk digitalnya.',
    watchOut: 'Banyak yang bikin produk dulu tanpa pembeli. Bangun audiens dan validasi sebelum produksi.',
  },
  {
    key: 'event-community', family: 'business_builder', emoji: '🎪', name: 'Event & Komunitas',
    oneLiner: 'Workshop kecil, komunitas hobi, kelas bareng, atau event kampus.',
    howMoney: 'Tiket, sponsor, kemitraan dengan brand', capital: 'Kecil — mulai dari event gratis/kolaborasi', skills: 'Networking, organisasi, eksekusi detail',
    firstStep: 'Bikin 1 meetup kecil (10–20 orang) dengan topik yang spesifik, gandeng 1 kafe/partner.',
    watchOut: 'Tulis kesepakatan dengan venue & sponsor; siapkan rencana kalau peserta sedikit.',
  },
];

export const pathsByFamily = (family: TrackKey) => START_PATHS.filter((p) => p.family === family);
