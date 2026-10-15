import type { IndustryKey } from './industries';
import type { ProfileKey } from './wealthProfiles';

export type TrackKey = 'sales_partner' | 'marketing_partner' | 'business_builder';

export const TRACKS: Record<TrackKey, { name: string; emoji: string; desc: string }> = {
  sales_partner: {
    name: 'Sales Partner', emoji: '🤝',
    desc: 'Kamu paling cepat bergerak dengan membantu bisnis yang sudah jalan mendapatkan pelanggan, dibayar komisi.',
  },
  marketing_partner: {
    name: 'Marketing Partner', emoji: '📣',
    desc: 'Kekuatanmu ada di konten dan komunikasi. Jual jasa marketing ke UMKM yang belum punya tim.',
  },
  business_builder: {
    name: 'Business Builder', emoji: '🧱',
    desc: 'Kamu cocok merancang dan menguji produk/layanan sendiri — mulai kecil, validasi dulu.',
  },
};

export interface Weight {
  industries?: Partial<Record<IndustryKey, number>>;
  tracks?: Partial<Record<TrackKey, number>>;
  profiles?: Partial<Record<ProfileKey, number>>;
}

export interface Option { id: string; label: string; weight: Weight }
export type Section = 'industry' | 'profile';
export interface Question { id: string; section: Section; text: string; hint?: string; options: Option[] }

export const SECTION_INFO: Record<Section, { name: string; emoji: string; desc: string }> = {
  industry: { name: 'Bagian A · Industri & Jalur', emoji: '🧭', desc: 'Bidang bisnis dan jalur mulai yang paling cocok.' },
  profile: { name: 'Bagian B · Profil Cuan', emoji: '💰', desc: 'Cara alamimu menciptakan nilai dan kekayaan.' },
};

/**
 * 20 pertanyaan industri + 16 pertanyaan Profil Cuan. Setiap opsi memberi bobot ke industri & jalur.
 * Skor dihitung deterministik di src/lib/assessment.ts — bukan AI, bukan tes psikologi.
 */
export const QUESTIONS: Question[] = [
  {
    section: 'industry', id: 'q1', text: 'Kalau dikasih waktu luang 3 jam, kamu paling betah ngapain?',
    options: [
      { id: 'a', label: 'Ngobrol & kenalan sama orang baru', weight: { industries: { b2b_sales: 3, event: 2 }, tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Bikin konten, edit video, atau desain', weight: { industries: { creator: 3, digital_services: 2 }, tracks: { marketing_partner: 3 } } },
      { id: 'c', label: 'Ngulik tools, sistem, atau spreadsheet', weight: { industries: { tech: 3, digital_services: 2 }, tracks: { business_builder: 2 } } },
      { id: 'd', label: 'Masak, coba-coba resep, atau kulineran', weight: { industries: { fnb: 3 }, tracks: { business_builder: 1 } } },
      { id: 'e', label: 'Ngajarin teman yang belum paham', weight: { industries: { education: 3 }, tracks: { marketing_partner: 1 } } },
    ],
  },
  {
    section: 'industry', id: 'q2', text: 'Produk apa yang paling sering kamu kepoin di media sosial?',
    options: [
      { id: 'a', label: 'Outfit, sneakers, merch', weight: { industries: { fashion: 3, retail: 2 } } },
      { id: 'b', label: 'Skincare, makeup, grooming', weight: { industries: { beauty: 3, retail: 1 } } },
      { id: 'c', label: 'Makanan & tempat nongkrong', weight: { industries: { fnb: 3 } } },
      { id: 'd', label: 'Gadget, apps, AI tools', weight: { industries: { tech: 3, digital_services: 1 } } },
      { id: 'e', label: 'Kelas online, buku, tips karier', weight: { industries: { education: 3 } } },
    ],
  },
  {
    section: 'industry', id: 'q3', text: 'Peran apa yang paling sering kamu ambil di organisasi/kerja kelompok?',
    options: [
      { id: 'a', label: 'Cari sponsor / dana usaha', weight: { industries: { event: 2, b2b_sales: 3 }, tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Publikasi & dokumentasi', weight: { industries: { creator: 2, digital_services: 2 }, tracks: { marketing_partner: 3 } } },
      { id: 'c', label: 'Ketua / koordinator acara', weight: { industries: { event: 3 }, tracks: { business_builder: 2 } } },
      { id: 'd', label: 'Bendahara / administrasi', weight: { industries: { tech: 1, retail: 2 }, tracks: { business_builder: 1 } } },
      { id: 'e', label: 'Konsumsi / perlengkapan', weight: { industries: { fnb: 2, fashion: 1, retail: 1 } } },
    ],
  },
  {
    section: 'industry', id: 'q4', text: 'Gimana perasaanmu kalau harus chat duluan ke orang yang belum kenal?',
    options: [
      { id: 'a', label: 'Santai, malah seru', weight: { industries: { b2b_sales: 2, event: 1 }, tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Bisa, asal ada template/skrip', weight: { tracks: { sales_partner: 1, marketing_partner: 1 } } },
      { id: 'c', label: 'Lebih nyaman lewat konten daripada chat langsung', weight: { industries: { creator: 2, retail: 1 }, tracks: { marketing_partner: 3 } } },
      { id: 'd', label: 'Lebih suka orang yang datang ke aku', weight: { industries: { tech: 1, digital_services: 1 }, tracks: { business_builder: 2 } } },
    ],
  },
  {
    section: 'industry', id: 'q5', text: 'Skill mana yang paling bisa kamu jual MINGGU INI juga?',
    options: [
      { id: 'a', label: 'Desain / Canva', weight: { industries: { digital_services: 3, fashion: 1 }, tracks: { marketing_partner: 2 } } },
      { id: 'b', label: 'Edit video / bikin konten', weight: { industries: { creator: 3, beauty: 1 }, tracks: { marketing_partner: 2 } } },
      { id: 'c', label: 'Ngomong & meyakinkan orang', weight: { industries: { b2b_sales: 3, fashion: 1 }, tracks: { sales_partner: 3 } } },
      { id: 'd', label: 'Mengajar / menjelaskan', weight: { industries: { education: 3 } } },
      { id: 'e', label: 'Belum ada — mau belajar dulu', weight: { industries: { retail: 2 }, tracks: { sales_partner: 1 } } },
    ],
  },
  {
    section: 'industry', id: 'q6', text: 'Kamu lebih suka dibayar dengan cara apa?',
    options: [
      { id: 'a', label: 'Komisi — makin banyak terjual makin besar', weight: { industries: { b2b_sales: 2, retail: 2, fashion: 1 }, tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Fee tetap per proyek / bulan', weight: { industries: { digital_services: 2, creator: 1, education: 1 }, tracks: { marketing_partner: 3 } } },
      { id: 'c', label: 'Untung dari produk sendiri', weight: { industries: { tech: 2, fnb: 1 }, tracks: { business_builder: 3 } } },
    ],
  },
  {
    section: 'industry', id: 'q7', text: 'Siapa yang paling gampang kamu jangkau sekarang?',
    options: [
      { id: 'a', label: 'Organisasi & komunitas kampus', weight: { industries: { fashion: 3, event: 3 } } },
      { id: 'b', label: 'UMKM / toko di sekitar rumah', weight: { industries: { fnb: 2, digital_services: 2, beauty: 1 } } },
      { id: 'c', label: 'Followers & teman online', weight: { industries: { creator: 2, retail: 3 } } },
      { id: 'd', label: 'Kantor / perusahaan (lewat keluarga atau kerja)', weight: { industries: { b2b_sales: 3, tech: 1 } } },
      { id: 'e', label: 'Adik kelas / orang tua murid', weight: { industries: { education: 3 } } },
    ],
  },
  {
    section: 'industry', id: 'q8', text: 'Masalah bisnis mana yang paling bikin kamu gatel pengin bantu?',
    options: [
      { id: 'a', label: '"Produknya bagus tapi sepi pembeli"', weight: { industries: { b2b_sales: 2, retail: 2 }, tracks: { sales_partner: 2 } } },
      { id: 'b', label: '"IG-nya berantakan, nggak ada yang ngurus"', weight: { industries: { digital_services: 2, creator: 2 }, tracks: { marketing_partner: 2 } } },
      { id: 'c', label: '"Semua masih dicatat manual"', weight: { industries: { tech: 3 }, tracks: { business_builder: 2 } } },
      { id: 'd', label: '"Acaranya kurang peserta / sponsor"', weight: { industries: { event: 3 }, tracks: { sales_partner: 1 } } },
    ],
  },
  {
    section: 'industry', id: 'q9', text: 'Pilih suasana kerja favoritmu:',
    options: [
      { id: 'a', label: 'Di lapangan, ketemu orang langsung', weight: { industries: { event: 2, b2b_sales: 2, fnb: 1 }, tracks: { sales_partner: 2 } } },
      { id: 'b', label: 'Di depan laptop, fokus sendiri', weight: { industries: { digital_services: 2, tech: 2 }, tracks: { business_builder: 1 } } },
      { id: 'c', label: 'Di depan kamera / HP', weight: { industries: { creator: 3, beauty: 1 }, tracks: { marketing_partner: 2 } } },
      { id: 'd', label: 'Campur, yang penting fleksibel', weight: { industries: { retail: 1, fashion: 1 } } },
    ],
  },
  {
    section: 'industry', id: 'q10', text: 'Kalau gagal di percobaan pertama, kamu biasanya…',
    options: [
      { id: 'a', label: 'Langsung coba lagi dengan cara lain', weight: { tracks: { sales_partner: 2, business_builder: 1 } } },
      { id: 'b', label: 'Analisis dulu apa yang salah', weight: { industries: { tech: 1 }, tracks: { business_builder: 2 } } },
      { id: 'c', label: 'Tanya orang yang lebih berpengalaman', weight: { industries: { education: 1 }, tracks: { marketing_partner: 1, sales_partner: 1 } } },
      { id: 'd', label: 'Agak drop, butuh waktu', weight: { industries: { digital_services: 1 }, tracks: { marketing_partner: 1 } }, },
    ],
  },
  {
    section: 'industry', id: 'q11', text: 'Bidang mana yang paling "kamu banget"?',
    hint: 'Pilih yang paling bikin kamu semangat, bukan yang paling menghasilkan.',
    options: [
      { id: 'a', label: 'Style & penampilan', weight: { industries: { fashion: 3, beauty: 3 } } },
      { id: 'b', label: 'Makanan & tempat', weight: { industries: { fnb: 4 } } },
      { id: 'c', label: 'Teknologi & internet', weight: { industries: { tech: 3, digital_services: 2 } } },
      { id: 'd', label: 'Orang & komunitas', weight: { industries: { event: 3, education: 2 } } },
      { id: 'e', label: 'Jualan & deal-dealan', weight: { industries: { b2b_sales: 3, retail: 3 } } },
    ],
  },
  {
    section: 'industry', id: 'q12', text: 'Dalam 3 bulan ke depan, target realistismu apa?',
    options: [
      { id: 'a', label: 'Dapat klien / closing pertama', weight: { tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Punya portofolio yang bisa ditunjukkan', weight: { tracks: { marketing_partner: 3 } } },
      { id: 'c', label: 'Punya produk/layanan sendiri yang sudah diuji', weight: { tracks: { business_builder: 3 } } },
    ],
  },
  {
    section: 'industry', id: 'q13', text: 'Kalau buka usaha di dekat rumah, kamu paling pengin buka…',
    options: [
      { id: 'a', label: 'Kedai minuman / camilan', weight: { industries: { fnb: 4 }, tracks: { business_builder: 1 } } },
      { id: 'b', label: 'Studio kecil: foto, desain, editing', weight: { industries: { digital_services: 3, creator: 1 } } },
      { id: 'c', label: 'Tempat les atau kelas skill', weight: { industries: { education: 4 } } },
      { id: 'd', label: 'Toko barang pilihan (thrift, merch, aksesori)', weight: { industries: { retail: 3, fashion: 2 } } },
      { id: 'e', label: 'Salon/barbershop atau toko kecantikan', weight: { industries: { beauty: 4 } } },
    ],
  },
  {
    section: 'industry', id: 'q14', text: 'Tugas kampus/kerja yang paling kamu nikmati?',
    options: [
      { id: 'a', label: 'Bikin presentasi & visual yang keren', weight: { industries: { digital_services: 2, creator: 2 }, tracks: { marketing_partner: 2 } } },
      { id: 'b', label: 'Survei lapangan & wawancara orang', weight: { industries: { b2b_sales: 2, event: 1 }, tracks: { sales_partner: 2 } } },
      { id: 'c', label: 'Ngolah data & bikin laporan', weight: { industries: { tech: 3 }, tracks: { business_builder: 1 } } },
      { id: 'd', label: 'Ngatur acara atau kepanitiaan', weight: { industries: { event: 3 } } },
    ],
  },
  {
    section: 'industry', id: 'q15', text: 'Komunitas mana yang paling dekat denganmu?',
    options: [
      { id: 'a', label: 'Komunitas olahraga / hobi', weight: { industries: { fashion: 2, event: 2 } } },
      { id: 'b', label: 'Komunitas kreator & digital', weight: { industries: { creator: 3, tech: 1 } } },
      { id: 'c', label: 'Komunitas pengusaha / UMKM', weight: { industries: { b2b_sales: 2, digital_services: 2 } } },
      { id: 'd', label: 'Komunitas belajar / kajian / organisasi', weight: { industries: { education: 3, event: 1 } } },
      { id: 'e', label: 'Komunitas kuliner / beauty', weight: { industries: { fnb: 2, beauty: 2 } } },
    ],
  },
  {
    section: 'industry', id: 'q16', text: 'Produk seperti apa yang paling kamu percaya diri untuk jual?',
    options: [
      { id: 'a', label: 'Barang fisik yang bisa dipegang', weight: { industries: { retail: 2, fashion: 2, fnb: 1 }, tracks: { sales_partner: 1 } } },
      { id: 'b', label: 'Jasa yang aku kerjakan sendiri', weight: { industries: { digital_services: 3 }, tracks: { marketing_partner: 2 } } },
      { id: 'c', label: 'Produk digital / sistem', weight: { industries: { tech: 3 }, tracks: { business_builder: 2 } } },
      { id: 'd', label: 'Pengalaman / acara / kelas', weight: { industries: { event: 2, education: 2 } } },
    ],
  },
  {
    section: 'industry', id: 'q17', text: 'Berapa jam per minggu yang realistis untuk bisnismu sekarang?',
    options: [
      { id: 'a', label: 'Di bawah 5 jam', weight: { industries: { retail: 2, creator: 1 }, tracks: { sales_partner: 1 } } },
      { id: 'b', label: '5–10 jam', weight: { industries: { digital_services: 1, b2b_sales: 1 }, tracks: { marketing_partner: 1, sales_partner: 1 } } },
      { id: 'c', label: '10–20 jam', weight: { industries: { fnb: 1, event: 1, education: 1 }, tracks: { business_builder: 1 } } },
      { id: 'd', label: 'Lebih dari 20 jam', weight: { industries: { fnb: 2, tech: 1 }, tracks: { business_builder: 2 } } },
    ],
  },
  {
    section: 'industry', id: 'q18', text: 'Pelanggan seperti apa yang paling ingin kamu layani?',
    options: [
      { id: 'a', label: 'Perusahaan & organisasi (B2B)', weight: { industries: { b2b_sales: 3, fashion: 1, event: 1 }, tracks: { sales_partner: 2 } } },
      { id: 'b', label: 'Pemilik UMKM', weight: { industries: { digital_services: 2, tech: 1, fnb: 1 }, tracks: { marketing_partner: 2 } } },
      { id: 'c', label: 'Anak muda seumuranku', weight: { industries: { fashion: 2, creator: 1, retail: 1 } } },
      { id: 'd', label: 'Keluarga & orang tua', weight: { industries: { education: 2, fnb: 1, beauty: 1 } } },
    ],
  },
  {
    section: 'industry', id: 'q19', text: 'Kalau ada masalah di bisnis, kamu paling sering…',
    options: [
      { id: 'a', label: 'Telepon atau temui orangnya langsung', weight: { tracks: { sales_partner: 2 }, industries: { b2b_sales: 1, event: 1 } } },
      { id: 'b', label: 'Bikin konten penjelasan atau pengumuman', weight: { tracks: { marketing_partner: 2 }, industries: { creator: 1 } } },
      { id: 'c', label: 'Perbaiki prosesnya supaya tidak terulang', weight: { tracks: { business_builder: 2 }, industries: { tech: 1 } } },
    ],
  },
  {
    section: 'industry', id: 'q20', text: 'Bisnis impianmu 5 tahun lagi lebih mirip…',
    options: [
      { id: 'a', label: 'Brand yang dikenal anak muda', weight: { industries: { fashion: 2, beauty: 1, creator: 1 }, tracks: { marketing_partner: 1 } } },
      { id: 'b', label: 'Agensi/jasa dengan banyak klien', weight: { industries: { digital_services: 3 }, tracks: { marketing_partner: 2 } } },
      { id: 'c', label: 'Distributor/vendor langganan perusahaan', weight: { industries: { b2b_sales: 3, fashion: 1 }, tracks: { sales_partner: 2 } } },
      { id: 'd', label: 'Platform/aplikasi yang dipakai banyak orang', weight: { industries: { tech: 3 }, tracks: { business_builder: 2 } } },
      { id: 'e', label: 'Lembaga belajar atau komunitas besar', weight: { industries: { education: 2, event: 2 } } },
    ],
  },

  /* ----------------------------- BAGIAN B: PROFIL CUAN ----------------------------- */
  {
    section: 'profile', id: 'p1', text: 'Di kerja kelompok, kamu paling sering jadi…',
    options: [
      { id: 'a', label: 'Yang ngelempar ide-ide baru', weight: { profiles: { creator: 3 } } },
      { id: 'b', label: 'Yang presentasi di depan', weight: { profiles: { star: 3 } } },
      { id: 'c', label: 'Yang ngatur dan nyemangatin tim', weight: { profiles: { supporter: 3 } } },
      { id: 'd', label: 'Yang ngecek detail dan angka', weight: { profiles: { lord: 2, mechanic: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p2', text: 'Cara dapat uang yang paling kamu nikmati?',
    options: [
      { id: 'a', label: 'Bikin produk yang belum ada', weight: { profiles: { creator: 3 } } },
      { id: 'b', label: 'Dibayar karena orang kenal & suka kontenku', weight: { profiles: { star: 3 } } },
      { id: 'c', label: 'Dapat komisi karena berhasil nge-deal-in orang', weight: { profiles: { dealmaker: 3 } } },
      { id: 'd', label: 'Beli di harga pas, jual di momen yang tepat', weight: { profiles: { trader: 3 } } },
    ],
  },
  {
    section: 'profile', id: 'p3', text: 'Kalau tiba-tiba dapat modal Rp10 juta, kamu…',
    options: [
      { id: 'a', label: 'Bikin prototipe produk', weight: { profiles: { creator: 2, mechanic: 1 } } },
      { id: 'b', label: 'Beli barang untuk dijual lagi dengan cepat', weight: { profiles: { trader: 3 } } },
      { id: 'c', label: 'Simpan di aset yang tumbuh pelan tapi pasti', weight: { profiles: { accumulator: 3 } } },
      { id: 'd', label: 'Beli "mesin uang" yang bisa disewakan', weight: { profiles: { lord: 3 } } },
    ],
  },
  {
    section: 'profile', id: 'p4', text: 'Teman-teman paling sering bilang kamu itu…',
    options: [
      { id: 'a', label: 'Kreatif dan visioner', weight: { profiles: { creator: 3 } } },
      { id: 'b', label: 'Seru dan menonjol', weight: { profiles: { star: 3 } } },
      { id: 'c', label: 'Bisa diandalkan untuk memimpin', weight: { profiles: { supporter: 3 } } },
      { id: 'd', label: 'Rapi dan teliti', weight: { profiles: { mechanic: 2, lord: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p5', text: 'Di acara networking, kamu biasanya…',
    options: [
      { id: 'a', label: 'Cari orang buat diajak kolaborasi', weight: { profiles: { dealmaker: 3 } } },
      { id: 'b', label: 'Jadi pusat perhatian', weight: { profiles: { star: 3 } } },
      { id: 'c', label: 'Mengamati dan mencatat peluang', weight: { profiles: { trader: 2, accumulator: 1 } } },
      { id: 'd', label: 'Pulang cepat, lebih produktif kerja sendiri', weight: { profiles: { lord: 2, mechanic: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p6', text: 'Proyek yang paling bikin kamu semangat?',
    options: [
      { id: 'a', label: 'Mulai sesuatu dari nol', weight: { profiles: { creator: 3 } } },
      { id: 'b', label: 'Memperbaiki yang sudah ada jadi lebih efisien', weight: { profiles: { mechanic: 3 } } },
      { id: 'c', label: 'Memimpin tim mencapai target', weight: { profiles: { supporter: 3 } } },
      { id: 'd', label: 'Mengelola angka dan keuangan', weight: { profiles: { lord: 3 } } },
    ],
  },
  {
    section: 'profile', id: 'p7', text: 'Saat mengambil keputusan, kamu paling percaya pada…',
    options: [
      { id: 'a', label: 'Intuisi dan imajinasi', weight: { profiles: { creator: 2, star: 1 } } },
      { id: 'b', label: 'Perasaan dan hubungan dengan orang', weight: { profiles: { supporter: 2, dealmaker: 1 } } },
      { id: 'c', label: 'Momen dan timing', weight: { profiles: { trader: 3 } } },
      { id: 'd', label: 'Data dan bukti', weight: { profiles: { lord: 2, accumulator: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p8', text: 'Sikapmu terhadap risiko?',
    options: [
      { id: 'a', label: 'Berani all-in demi ide besar', weight: { profiles: { creator: 2, dealmaker: 1 } } },
      { id: 'b', label: 'Risiko terukur, keluar-masuk cepat', weight: { profiles: { trader: 3 } } },
      { id: 'c', label: 'Main aman, pelan tapi pasti', weight: { profiles: { accumulator: 3 } } },
      { id: 'd', label: 'Boleh berisiko asal sistem & kontrolnya jelas', weight: { profiles: { lord: 2, mechanic: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p9', text: 'Kalau bikin konten, kamu paling mungkin bikin…',
    options: [
      { id: 'a', label: 'Ngenalin ide atau produk baru', weight: { profiles: { creator: 2, star: 1 } } },
      { id: 'b', label: 'Vlog dan cerita keseharianku', weight: { profiles: { star: 3 } } },
      { id: 'c', label: 'Tips kerja tim dan leadership', weight: { profiles: { supporter: 3 } } },
      { id: 'd', label: 'Analisis angka, harga, atau tren', weight: { profiles: { trader: 2, lord: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p10', text: 'Saat negosiasi, kamu cenderung…',
    options: [
      { id: 'a', label: 'Cari titik temu supaya semua pihak senang', weight: { profiles: { dealmaker: 3 } } },
      { id: 'b', label: 'Mengandalkan pesona dan cerita', weight: { profiles: { star: 2, dealmaker: 1 } } },
      { id: 'c', label: 'Membahas detail syarat dan angka', weight: { profiles: { lord: 2, accumulator: 1 } } },
      { id: 'd', label: 'Lebih suka langsung kerja daripada negosiasi', weight: { profiles: { mechanic: 2, creator: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p11', text: 'Kamu paling sabar ketika…',
    options: [
      { id: 'a', label: 'Menunggu hasil investasi jangka panjang', weight: { profiles: { accumulator: 3 } } },
      { id: 'b', label: 'Menyempurnakan proses berulang kali', weight: { profiles: { mechanic: 3 } } },
      { id: 'c', label: 'Membina orang sampai berkembang', weight: { profiles: { supporter: 3 } } },
      { id: 'd', label: 'Menunggu harga atau momen yang pas', weight: { profiles: { trader: 3 } } },
    ],
  },
  {
    section: 'profile', id: 'p12', text: 'Hal yang paling bikin kamu bangga?',
    options: [
      { id: 'a', label: 'Karyaku dipakai banyak orang', weight: { profiles: { creator: 2, mechanic: 1 } } },
      { id: 'b', label: 'Namaku dikenal dan menginspirasi', weight: { profiles: { star: 3 } } },
      { id: 'c', label: 'Timku berhasil bersama', weight: { profiles: { supporter: 3 } } },
      { id: 'd', label: 'Asetku bertambah tiap tahun', weight: { profiles: { accumulator: 2, lord: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p13', text: 'Kalau gabung startup, peran idealmu…',
    options: [
      { id: 'a', label: 'Founder produk yang memegang visi', weight: { profiles: { creator: 3 } } },
      { id: 'b', label: 'Brand ambassador / wajah perusahaan', weight: { profiles: { star: 3 } } },
      { id: 'c', label: 'Operasional & people (COO)', weight: { profiles: { supporter: 2, mechanic: 1 } } },
      { id: 'd', label: 'Keuangan & business development', weight: { profiles: { lord: 2, dealmaker: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p14', text: 'Kamu paling cepat menyadari kalau…',
    options: [
      { id: 'a', label: 'Ada peluang produk baru', weight: { profiles: { creator: 3 } } },
      { id: 'b', label: 'Ada dua orang yang cocok dikenalkan', weight: { profiles: { dealmaker: 3 } } },
      { id: 'c', label: 'Harga sesuatu lagi murah atau mahal', weight: { profiles: { trader: 3 } } },
      { id: 'd', label: 'Ada proses yang boros dan bisa dirapikan', weight: { profiles: { mechanic: 2, lord: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p15', text: 'Cara belajarmu yang paling efektif…',
    options: [
      { id: 'a', label: 'Eksperimen bebas', weight: { profiles: { creator: 2, star: 1 } } },
      { id: 'b', label: 'Ngobrol dan diskusi', weight: { profiles: { dealmaker: 2, supporter: 1 } } },
      { id: 'c', label: 'Mengamati pola dan grafik', weight: { profiles: { trader: 2, accumulator: 1 } } },
      { id: 'd', label: 'Membaca panduan dan checklist', weight: { profiles: { mechanic: 2, lord: 1 } } },
    ],
  },
  {
    section: 'profile', id: 'p16', text: 'Dalam 10 tahun, kamu ingin punya…',
    options: [
      { id: 'a', label: 'Produk atau brand yang inovatif', weight: { profiles: { creator: 2, star: 1 } } },
      { id: 'b', label: 'Jaringan luas & deal-deal besar', weight: { profiles: { dealmaker: 2, supporter: 1 } } },
      { id: 'c', label: 'Portofolio aset yang terus tumbuh', weight: { profiles: { accumulator: 3 } } },
      { id: 'd', label: 'Bisnis yang jalan tanpa harus kuurus setiap hari', weight: { profiles: { lord: 2, mechanic: 1 } } },
    ],
  },
];
