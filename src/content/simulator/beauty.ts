import type { SimScenario } from './types';
import { o } from './helpers';

export const BEAUTY: SimScenario[] = [
  {
    industry: 'beauty', level: 'rintis',
    title: 'Mulai jualan skincare dengan modal Rp10 juta',
    persona: 'Kamu suka skincare dan punya 2.000 followers yang sering bertanya rekomendasi. Kamu ingin punya produk sendiri suatu hari, tapi modal baru Rp10 juta.',
    modal: 'Kas Rp10 juta',
    team: ['Kamu (konten, jualan, packing)'],
    start: { kas: 10, reputasi: 50, tim: 70 },
    decisions: [
      {
        title: 'Produk sendiri, maklon, atau reseller?',
        situation: 'Maklon menawarkan serum dengan MOQ 1.000 pcs (±Rp28 juta termasuk pengurusan notifikasi BPOM). Teman menyarankan meracik sendiri di rumah dan langsung jual.',
        options: [
          o('Racik sendiri dengan bahan aman dan label rapi. Banyak brand besar mulai dari dapur', [3, -15, -4], 'Laku di awal, sampai ada pembeli yang iritasi dan akun marketplace-mu ditutup karena produk tanpa notifikasi BPOM. Ada risiko hukum juga.'),
          o('Jadi reseller resmi brand ber-BPOM dulu, sambil kumpulkan data kebutuhan pembeli', [2, 5, 0], 'Margin 25–30%. Dalam 4 bulan kamu tahu persis masalah kulit apa yang paling banyak ditanyakan, sebagai bahan riset produk sendiri.', true),
          o('Pinjam Rp20 juta untuk maklon 1.000 pcs. Lebih cepat punya merek sendiri', [-18, 0, -6], 'Produk jadi, tapi baru terjual 180 pcs dalam 4 bulan. Utang berjalan, dan sisa stok mendekati batas kedaluwarsa.'),
        ],
        lesson: 'Produk kosmetik wajib punya notifikasi BPOM sebelum dijual. Mulai dari reseller resmi adalah cara murah untuk belajar pasar dan membangun audiens sebelum menanggung MOQ maklon.',
      },
      {
        title: 'Klaim "putih dalam 3 hari"',
        situation: 'Supplier memberi materi promosi: "Kulit putih dalam 3 hari, dijamin!" Konten pesaing dengan klaim serupa laku keras.',
        options: [
          o('Pakai klaim supplier. Mereka yang membuat produknya, jadi tanggung jawab mereka', [2, -10, 0], 'Laku sebentar, lalu muncul komplain karena hasilnya tidak sesuai. Ada pembeli yang melaporkan konten ke platform.'),
          o('Pakai klaim jujur yang diizinkan, plus edukasi & foto pemakaian nyata', [1, 6, -2], 'Penjualan lebih pelan di awal, tapi tingkat retur rendah dan pembeli kembali karena ekspektasinya tepat.', true),
          o('Pakai klaim "hasil terlihat dalam 3 hari*" dengan catatan kecil di bawah', [1.5, -7, 0], 'Catatan kecil tidak dibaca orang. Laku di awal, lalu komplain berdatangan dan kontenmu dilaporkan sebagai klaim menyesatkan.'),
        ],
        lesson: 'Klaim berlebihan merusak kepercayaan dan melanggar aturan iklan kosmetik. Edukasi + ekspektasi realistis = pelanggan yang kembali.',
      },
      {
        title: 'Pelanggan beli sekali lalu hilang',
        situation: 'Dari 120 pembeli, hanya 9 yang membeli lagi. Satu botol serum biasanya habis dalam ±6 minggu.',
        options: [
          o('Fokus akuisisi. Pembeli baru adalah sumber pertumbuhan utama', [0, -1, -4], 'Biaya iklan naik terus. Pembeli lama membeli di toko lain.'),
          o('Pengingat isi ulang di minggu ke-5, bundling hemat, grup konsultasi', [2.5, 5, -2], 'Repeat order naik ke 28% dalam 2 bulan, dan biaya mendapatkan pembeli turun.', true),
          o('Diskon 50% khusus pembeli lama supaya mereka kembali', [-1.5, 1, 0], 'Pembeli lama kembali, tapi hanya saat ada diskon.'),
        ],
        lesson: 'Beauty adalah bisnis repeat order. Hitung siklus habis produk, ingatkan pada waktu yang tepat, dan bangun komunitas yang bertanya kepadamu.',
      },
    ],
    blueprint: {
      prioritas: ['Pahami pasar lewat produk resmi (reseller)', 'Bangun audiens & kepercayaan dengan edukasi', 'Sistem repeat order'],
      rekrutSekarang: ['Belum perlu. Pakai template packing & pesan'],
      rekrutNanti: ['Admin chat & packing — saat >15 order/hari', 'Konsultan regulasi/maklon — saat siap produk sendiri'],
      operasional: ['Harian: balas chat & kirim paket', 'Mingguan: 3 konten edukasi kulit', 'Mingguan: pengingat isi ulang ke pelanggan', 'Bulanan: catat produk/masalah kulit yang paling sering ditanya'],
      modal: [{ pos: 'Stok reseller (perputaran cepat)', pct: 45 }, { pos: 'Konten & foto', pct: 15 }, { pos: 'Packaging & pengiriman', pct: 10 }, { pos: 'Dana darurat', pct: 30 }],
      kpi: [{ name: 'Repeat order', target: '≥25%' }, { name: 'Perputaran stok', target: '<30 hari' }, { name: 'Gross margin', target: '≥25%' }, { name: 'Komplain/retur', target: '<2%' }],
      risiko: ['Produk tanpa izin edar', 'Klaim berlebihan', 'Stok kedaluwarsa'],
      naikLevel: ['Omzet ≥Rp15 juta/bulan dengan repeat ≥25%', 'Data jelas tentang kebutuhan pelanggan', 'Modal cukup untuk MOQ maklon tanpa utang konsumtif'],
    },
  },
  {
    industry: 'beauty', level: 'tumbuh',
    title: 'Brand serum sendiri lewat maklon',
    persona: 'Brand serum pertamamu (lewat maklon, sudah ber-notifikasi BPOM) terjual ±1.500 pcs/bulan. Omzet ±Rp105 juta/bulan, tim 4 orang. Stok, iklan, dan KOL mulai menyedot kas.',
    modal: 'Kas Rp80 juta',
    team: ['Kamu (founder, brand)', 'Admin marketplace & CS', 'Content creator', 'Packing & gudang'],
    start: { kas: 80, reputasi: 62, tim: 60 },
    decisions: [
      {
        title: 'Order produksi berikutnya',
        situation: 'Maklon memberi harga lebih murah 12% untuk order 5.000 pcs (±Rp110 juta). Penjualanmu ±1.500 pcs/bulan. Masa simpan produk 24 bulan.',
        options: [
          o('Ambil 5.000 pcs dan pinjam selisihnya. Hemat 12% = laba tambahan besar', [-60, 0, -6], 'Kas terkunci di stok 3 bulan lebih, dan kamu tidak punya dana iklan saat musim ramai.'),
          o('Order 3.000 pcs (±2 bulan) dan negosiasi harga untuk 3 order berturut-turut', [-12, 2, 0], 'Harga turun 7% tanpa mengunci kas. Stok selalu segar, dan dana iklan tetap tersedia.', true),
          o('Order 1.000 pcs saja supaya kas tetap longgar', [-5, -4, -4], 'Stok habis di tengah kampanye, dan pembeli kecewa dengan status "habis".'),
        ],
        lesson: 'Stok adalah uang yang diam. Rencanakan stok ±1,5–2 bulan penjualan, dan dapatkan harga lebih baik lewat komitmen berkala, bukan menumpuk sekaligus.',
      },
      {
        title: '1 KOL besar atau 25 nano creator?',
        situation: 'Anggaran KOL Rp30 juta: cukup untuk 1 selebriti (1 video) atau 25 nano creator (5–30 ribu followers).',
        options: [
          o('1 selebriti. Satu video dari nama besar membangun kredibilitas merek', [-30, 3, 0], 'Viral sehari dan penjualan naik 3 hari, lalu kembali normal. Kamu tidak tahu konten mana yang benar-benar menjual.'),
          o('25 nano creator dengan kode affiliate, lalu perbesar yang terbukti', [-10, 5, -2], 'Penjualan naik 40% dan stabil. Kamu tahu 5 creator dengan konversi terbaik untuk kampanye berikutnya.', true),
          o('Pindahkan semua ke iklan berbayar yang lebih mudah diukur', [-8, 0, 0], 'Biaya per pembelian dari iklan saja makin mahal tanpa bukti sosial.'),
        ],
        lesson: 'Uji banyak creator kecil dengan pelacakan (kode/affiliate), lalu perbesar yang terbukti. Data konversi lebih berharga daripada sekali viral.',
      },
      {
        title: 'Perang harga di marketplace',
        situation: 'Kompetitor menurunkan harga produk serupa 30% di marketplace. Penjualanmu turun 25% dalam 2 minggu.',
        options: [
          o('Samakan harga dengan kompetitor. Di marketplace, pembeli selalu bandingkan harga', [-8, -2, 0], 'Margin habis. Kompetitor turun lagi, dan kamu terjebak.'),
          o('Pertahankan harga, tambah bundling bernilai & dorong kanal sendiri', [4, 5, -2], 'Penjualan pulih dalam 3 minggu dengan margin terjaga. Pembeli yang loyal tidak sensitif harga.', true),
          o('Ganti ke formula yang sedikit lebih murah supaya bisa bersaing harga', [3, -12, 0], 'Pembeli lama merasakan perbedaan dan berpindah merek.'),
        ],
        lesson: 'Jangan ikut perang harga kalau kamu bukan pemain dengan biaya termurah. Lawan dengan nilai: bundling, edukasi, komunitas, dan kanal milik sendiri.',
      },
    ],
    blueprint: {
      prioritas: ['Perencanaan stok berbasis data penjualan', 'Mesin pemasaran creator yang terukur', 'Kanal milik sendiri (website/WA) di samping marketplace'],
      rekrutSekarang: ['Marketing & KOL specialist', 'Admin keuangan & inventaris'],
      rekrutNanti: ['Brand manager', 'Product development (formula baru dengan maklon)'],
      operasional: ['Mingguan: stok vs penjualan (hari stok tersisa)', 'Mingguan: performa creator & iklan per kode', 'Bulanan: P&L per SKU', 'Per batch: cek CoA, kemasan, dan masa kedaluwarsa'],
      modal: [{ pos: 'Stok produksi', pct: 40 }, { pos: 'Pemasaran (KOL, iklan)', pct: 25 }, { pos: 'Gaji tim', pct: 15 }, { pos: 'Regulasi & pengembangan produk', pct: 5 }, { pos: 'Dana darurat', pct: 15 }],
      kpi: [{ name: 'Hari stok', target: '45–60 hari' }, { name: 'ROAS iklan/KOL', target: '≥3' }, { name: 'Repeat order', target: '≥30%' }, { name: 'Net margin', target: '≥15%' }],
      risiko: ['Stok menumpuk / kedaluwarsa', 'Perang harga', 'Ketergantungan pada marketplace'],
      naikLevel: ['Omzet ≥Rp250 juta/bulan dengan net margin ≥15%', '≥25% penjualan di kanal sendiri', '≥3 SKU yang laku stabil'],
    },
  },
  {
    industry: 'beauty', level: 'skala',
    title: 'Brand kecantikan 25 orang & tawaran retail offline',
    persona: 'Brand-mu punya 6 SKU dengan omzet ±Rp600 juta/bulan, 25 karyawan. Jaringan toko kosmetik offline menawarkan penempatan di 80 toko.',
    modal: 'Kas Rp550 juta',
    team: ['Kamu (CEO)', 'Brand manager', 'Head of sales (online & offline)', 'Product development', 'Finance', 'Tim gudang (6)', 'Marketing (6)', 'CS (4)'],
    start: { kas: 550, reputasi: 72, tim: 58 },
    decisions: [
      {
        title: 'Tambah 10 SKU baru?',
        situation: 'Tim ingin meluncurkan 10 SKU baru sekaligus (toner, masker, lip). Produk andalan (hero) menyumbang 55% penjualan.',
        options: [
          o('Luncurkan 10 SKU sekaligus. Katalog lengkap membuat merek terlihat besar', [-220, -4, -10], 'Tim marketing terpecah, 7 SKU lambat laku, dan stok mati menumpuk.'),
          o('Perdalam hero product & luncurkan 2 SKU yang divalidasi komunitas', [-60, 6, 2], 'Dua SKU baru laku sejak bulan pertama karena divalidasi komunitas. Hero product makin kuat.', true),
          o('Tunda semua produk baru sampai omzet hero product menyentuh Rp1 miliar', [0, -3, 2], 'Pelanggan setia mencari variasi ke merek lain.'),
        ],
        lesson: 'Kedalaman produk andalan biasanya lebih menguntungkan daripada lebar katalog. Luncurkan sedikit SKU yang divalidasi data, bukan banyak SKU berdasarkan selera tim.',
      },
      {
        title: 'Tawaran 80 toko offline',
        situation: 'Jaringan toko meminta sistem konsinyasi (dibayar setelah laku, rekap 60 hari), stok awal ±Rp250 juta, dan biaya listing.',
        options: [
          o('Ambil 80 toko sekaligus. Kesempatan masuk jaringan retail besar jarang datang', [-250, 2, -8], 'Kas terkunci. Separuh toko lambat menjual, dan barang retur mendekati kedaluwarsa.'),
          o('Pilot 15 toko terbaik 3 bulan dengan laporan sell-out mingguan', [-50, 5, -2], 'Lima toko berkinerja sangat baik. Kamu masuk ke 40 toko berikutnya dengan data, bukan tebakan.', true),
          o('Tolak retail offline. Online lebih untung dan datanya lebih jelas', [0, -2, 2], 'Kamu kehilangan kanal yang menjangkau pembeli yang belum online.'),
        ],
        lesson: 'Konsinyasi = kamu memodali stok di toko orang. Pilot dengan data sell-out, syarat retur, dan perhitungan kas sebelum ekspansi kanal.',
      },
      {
        title: 'Laporan reaksi alergi',
        situation: 'Empat pelanggan melaporkan reaksi kemerahan setelah memakai batch tertentu. Satu mengunggahnya ke media sosial.',
        options: [
          o('Tunggu pola lebih jelas. Empat kasus dari ribuan pembeli bisa karena kulit sensitif', [0, -14, -4], 'Laporan bertambah. Media sosial ramai dan marketplace menahan toko.'),
          o('Tanggapi pelanggan, hentikan batch itu, uji ulang, lapor, umumkan temuan', [-25, 7, 2], 'Ditemukan masalah penyimpanan di satu gudang. Penanganan transparan membuat pelanggan tetap percaya.', true),
          o('Tarik semua produk dari semua batch hari ini juga untuk keamanan', [-120, -2, -6], 'Kerugian besar dan pasar menganggap produkmu bermasalah total.'),
        ],
        lesson: 'Siapkan sistem keluhan & penelusuran batch (traceability) sejak awal. Investigasi cepat + transparansi menyelamatkan merek lebih baik daripada diam atau panik.',
      },
    ],
    blueprint: {
      prioritas: ['Hero product & portofolio SKU berbasis data', 'Ekspansi kanal dengan pilot terukur', 'Sistem mutu & penelusuran batch'],
      rekrutSekarang: ['Quality & regulatory manager', 'Trade marketing (retail offline)'],
      rekrutNanti: ['Head of supply chain', 'Head of international — jika ekspor'],
      operasional: ['Mingguan: sell-out per kanal & stok per batch', 'Bulanan: P&L per SKU & per kanal', 'Per batch: CoA, retensi sampel, catatan distribusi', 'Kuartalan: review portofolio SKU'],
      modal: [{ pos: 'Stok & kanal baru', pct: 35 }, { pos: 'Pemasaran merek', pct: 25 }, { pos: 'R&D & regulasi', pct: 10 }, { pos: 'SDM kunci', pct: 10 }, { pos: 'Dana darurat', pct: 20 }],
      kpi: [{ name: 'Sell-through retail', target: '≥60%' }, { name: 'Kontribusi hero product', target: '40–55%' }, { name: 'Komplain produk', target: '<0,3%' }, { name: 'EBITDA margin', target: '≥15%' }],
      risiko: ['Stok mati karena SKU berlebihan', 'Kas terkunci di konsinyasi', 'Isu keamanan produk'],
      naikLevel: ['Omzet stabil multi-kanal', 'Sistem mutu teruji', 'Laporan keuangan siap audit/investor'],
    },
  },
];
