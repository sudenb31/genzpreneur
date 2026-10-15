import type { IndustryKey } from './industries';

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
}

export interface Option { id: string; label: string; weight: Weight }
export interface Question { id: string; text: string; hint?: string; options: Option[] }

/**
 * 12 pertanyaan. Setiap opsi memberi bobot ke industri & jalur.
 * Skor dihitung deterministik di src/lib/assessment.ts — bukan AI, bukan tes psikologi.
 */
export const QUESTIONS: Question[] = [
  {
    id: 'q1', text: 'Kalau dikasih waktu luang 3 jam, kamu paling betah ngapain?',
    options: [
      { id: 'a', label: 'Ngobrol & kenalan sama orang baru', weight: { industries: { b2b_sales: 3, event: 2 }, tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Bikin konten, edit video, atau desain', weight: { industries: { creator: 3, digital_services: 2 }, tracks: { marketing_partner: 3 } } },
      { id: 'c', label: 'Ngulik tools, sistem, atau spreadsheet', weight: { industries: { tech: 3, digital_services: 2 }, tracks: { business_builder: 2 } } },
      { id: 'd', label: 'Masak, coba-coba resep, atau kulineran', weight: { industries: { fnb: 3 }, tracks: { business_builder: 1 } } },
      { id: 'e', label: 'Ngajarin teman yang belum paham', weight: { industries: { education: 3 }, tracks: { marketing_partner: 1 } } },
    ],
  },
  {
    id: 'q2', text: 'Produk apa yang paling sering kamu kepoin di media sosial?',
    options: [
      { id: 'a', label: 'Outfit, sneakers, merch', weight: { industries: { fashion: 3, retail: 2 } } },
      { id: 'b', label: 'Skincare, makeup, grooming', weight: { industries: { beauty: 3, retail: 1 } } },
      { id: 'c', label: 'Makanan & tempat nongkrong', weight: { industries: { fnb: 3 } } },
      { id: 'd', label: 'Gadget, apps, AI tools', weight: { industries: { tech: 3, digital_services: 1 } } },
      { id: 'e', label: 'Kelas online, buku, tips karier', weight: { industries: { education: 3 } } },
    ],
  },
  {
    id: 'q3', text: 'Peran apa yang paling sering kamu ambil di organisasi/kerja kelompok?',
    options: [
      { id: 'a', label: 'Cari sponsor / dana usaha', weight: { industries: { event: 2, b2b_sales: 3 }, tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Publikasi & dokumentasi', weight: { industries: { creator: 2, digital_services: 2 }, tracks: { marketing_partner: 3 } } },
      { id: 'c', label: 'Ketua / koordinator acara', weight: { industries: { event: 3 }, tracks: { business_builder: 2 } } },
      { id: 'd', label: 'Bendahara / administrasi', weight: { industries: { tech: 1, retail: 2 }, tracks: { business_builder: 1 } } },
      { id: 'e', label: 'Konsumsi / perlengkapan', weight: { industries: { fnb: 2, fashion: 1, retail: 1 } } },
    ],
  },
  {
    id: 'q4', text: 'Gimana perasaanmu kalau harus chat duluan ke orang yang belum kenal?',
    options: [
      { id: 'a', label: 'Santai, malah seru', weight: { industries: { b2b_sales: 2, event: 1 }, tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Bisa, asal ada template/skrip', weight: { tracks: { sales_partner: 1, marketing_partner: 1 } } },
      { id: 'c', label: 'Lebih nyaman lewat konten daripada chat langsung', weight: { industries: { creator: 2, retail: 1 }, tracks: { marketing_partner: 3 } } },
      { id: 'd', label: 'Lebih suka orang yang datang ke aku', weight: { industries: { tech: 1, digital_services: 1 }, tracks: { business_builder: 2 } } },
    ],
  },
  {
    id: 'q5', text: 'Skill mana yang paling bisa kamu jual MINGGU INI juga?',
    options: [
      { id: 'a', label: 'Desain / Canva', weight: { industries: { digital_services: 3, fashion: 1 }, tracks: { marketing_partner: 2 } } },
      { id: 'b', label: 'Edit video / bikin konten', weight: { industries: { creator: 3, beauty: 1 }, tracks: { marketing_partner: 2 } } },
      { id: 'c', label: 'Ngomong & meyakinkan orang', weight: { industries: { b2b_sales: 3, fashion: 1 }, tracks: { sales_partner: 3 } } },
      { id: 'd', label: 'Mengajar / menjelaskan', weight: { industries: { education: 3 } } },
      { id: 'e', label: 'Belum ada — mau belajar dulu', weight: { industries: { retail: 2 }, tracks: { sales_partner: 1 } } },
    ],
  },
  {
    id: 'q6', text: 'Kamu lebih suka dibayar dengan cara apa?',
    options: [
      { id: 'a', label: 'Komisi — makin banyak terjual makin besar', weight: { industries: { b2b_sales: 2, retail: 2, fashion: 1 }, tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Fee tetap per proyek / bulan', weight: { industries: { digital_services: 2, creator: 1, education: 1 }, tracks: { marketing_partner: 3 } } },
      { id: 'c', label: 'Untung dari produk sendiri', weight: { industries: { tech: 2, fnb: 1 }, tracks: { business_builder: 3 } } },
    ],
  },
  {
    id: 'q7', text: 'Siapa yang paling gampang kamu jangkau sekarang?',
    options: [
      { id: 'a', label: 'Organisasi & komunitas kampus', weight: { industries: { fashion: 3, event: 3 } } },
      { id: 'b', label: 'UMKM / toko di sekitar rumah', weight: { industries: { fnb: 2, digital_services: 2, beauty: 1 } } },
      { id: 'c', label: 'Followers & teman online', weight: { industries: { creator: 2, retail: 3 } } },
      { id: 'd', label: 'Kantor / perusahaan (lewat keluarga atau kerja)', weight: { industries: { b2b_sales: 3, tech: 1 } } },
      { id: 'e', label: 'Adik kelas / orang tua murid', weight: { industries: { education: 3 } } },
    ],
  },
  {
    id: 'q8', text: 'Masalah bisnis mana yang paling bikin kamu gatel pengin bantu?',
    options: [
      { id: 'a', label: '"Produknya bagus tapi sepi pembeli"', weight: { industries: { b2b_sales: 2, retail: 2 }, tracks: { sales_partner: 2 } } },
      { id: 'b', label: '"IG-nya berantakan, nggak ada yang ngurus"', weight: { industries: { digital_services: 2, creator: 2 }, tracks: { marketing_partner: 2 } } },
      { id: 'c', label: '"Semua masih dicatat manual"', weight: { industries: { tech: 3 }, tracks: { business_builder: 2 } } },
      { id: 'd', label: '"Acaranya kurang peserta / sponsor"', weight: { industries: { event: 3 }, tracks: { sales_partner: 1 } } },
    ],
  },
  {
    id: 'q9', text: 'Pilih suasana kerja favoritmu:',
    options: [
      { id: 'a', label: 'Di lapangan, ketemu orang langsung', weight: { industries: { event: 2, b2b_sales: 2, fnb: 1 }, tracks: { sales_partner: 2 } } },
      { id: 'b', label: 'Di depan laptop, fokus sendiri', weight: { industries: { digital_services: 2, tech: 2 }, tracks: { business_builder: 1 } } },
      { id: 'c', label: 'Di depan kamera / HP', weight: { industries: { creator: 3, beauty: 1 }, tracks: { marketing_partner: 2 } } },
      { id: 'd', label: 'Campur, yang penting fleksibel', weight: { industries: { retail: 1, fashion: 1 } } },
    ],
  },
  {
    id: 'q10', text: 'Kalau gagal di percobaan pertama, kamu biasanya…',
    options: [
      { id: 'a', label: 'Langsung coba lagi dengan cara lain', weight: { tracks: { sales_partner: 2, business_builder: 1 } } },
      { id: 'b', label: 'Analisis dulu apa yang salah', weight: { industries: { tech: 1 }, tracks: { business_builder: 2 } } },
      { id: 'c', label: 'Tanya orang yang lebih berpengalaman', weight: { industries: { education: 1 }, tracks: { marketing_partner: 1, sales_partner: 1 } } },
      { id: 'd', label: 'Agak drop, butuh waktu', weight: { industries: { digital_services: 1 }, tracks: { marketing_partner: 1 } }, },
    ],
  },
  {
    id: 'q11', text: 'Bidang mana yang paling "kamu banget"?',
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
    id: 'q12', text: 'Dalam 3 bulan ke depan, target realistismu apa?',
    options: [
      { id: 'a', label: 'Dapat klien / closing pertama', weight: { tracks: { sales_partner: 3 } } },
      { id: 'b', label: 'Punya portofolio yang bisa ditunjukkan', weight: { tracks: { marketing_partner: 3 } } },
      { id: 'c', label: 'Punya produk/layanan sendiri yang sudah diuji', weight: { tracks: { business_builder: 3 } } },
    ],
  },
];
