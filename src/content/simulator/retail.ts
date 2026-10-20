import type { SimScenarioContent } from './types';
import { o } from './helpers';

export const RETAIL: SimScenarioContent[] = [
  {
    industry: 'retail', level: 'rintis',
    title: 'Reseller hijab lewat WA & TikTok',
    persona: 'Kamu menjual hijab dari supplier di Tanah Abang lewat WhatsApp, Instagram, dan mulai mencoba live TikTok. Penjualan ±40 pcs/minggu.',
    modal: 'Kas Rp4 juta',
    team: ['Kamu (stok, konten, live, packing)', 'Adik bantu packing'],
    start: { kas: 4, reputasi: 50, tim: 70 },
    decisions: [
      {
        title: 'Stok apa dan berapa?',
        situation: 'Supplier memberi harga grosir lebih murah 15% untuk 150 pcs satu model. Kamu belum tahu warna mana yang paling laku.',
        options: [
          o('Ambil 150 pcs satu model. Harga grosir 15% lebih murah = margin lebih tebal', [-3.3, 0, -2], 'Dua warna laku, empat warna lainnya mengendap. Setelah 2 bulan, 70 pcs belum terjual.'),
          o('Ambil 6 warna × 8 pcs, restock yang laris, pre-order untuk model baru', [-1.5, 3, 0], 'Data penjualan menunjukkan 3 warna menyumbang 70% penjualan. Restock berikutnya tepat sasaran.', true),
          o('Dropship semua tanpa stok. Tanpa modal, tanpa risiko barang menumpuk', [0.3, -3, 2], 'Tidak perlu modal, tapi pengiriman lama dan foto tidak sesuai kualitas asli. Beberapa pembeli komplain.'),
        ],
        lesson: 'Di retail, stok salah = uang mati. Uji dengan jumlah kecil, baca data penjualan, lalu perbesar yang terbukti laku.',
      },
      {
        title: 'Live selling pertama',
        situation: 'Live pertamamu ditonton 12 orang selama 1 jam dan hanya terjual 1 pcs.',
        options: [
          o('Hentikan live. Penontonnya terlalu sedikit untuk sebanding dengan waktunya', [0, -1, 3], 'Kamu melewatkan kanal yang sedang tumbuh paling cepat di kategori fashion muslim.'),
          o('Jadwal tetap 3×/minggu, naskah singkat, evaluasi data tiap sesi', [0.8, 4, -4], 'Setelah 4 minggu, penonton rata-rata naik ke 90 orang dengan 15–25 pcs terjual per sesi.', true),
          o('Live setiap hari selama mungkin supaya algoritma cepat mengenali akun', [0.4, 1, -14], 'Penjualan naik sedikit, tapi kamu kelelahan dan kualitas live turun.'),
        ],
        lesson: 'Live selling adalah keterampilan yang bisa dilatih: jadwal konsisten, naskah, demo produk, dan evaluasi data per sesi.',
      },
      {
        title: 'Retur & masalah COD',
        situation: '15% pesanan COD ditolak saat paket tiba. Ongkir pulang-pergi kamu yang menanggung.',
        options: [
          o('Matikan COD untuk semua pembeli. Retur langsung jadi nol', [0.2, -2, 0], 'Retur turun, tapi penjualan turun 30% karena banyak pembeli hanya mau COD.'),
          o('Konfirmasi COD sebelum kirim, batasi COD berisiko, bonus untuk transfer', [0.5, 2, -2], 'Retur turun ke 4% tanpa kehilangan banyak penjualan.', true),
          o('Biarkan. COD menarik pembeli baru, dan retur adalah biaya pemasaran', [-0.6, 0, 0], 'Ongkir retur terus memakan margin.'),
        ],
        lesson: 'Retur adalah biaya tersembunyi yang bisa dikendalikan dengan konfirmasi pesanan, aturan COD yang cerdas, dan insentif pembayaran di muka.',
      },
    ],
    blueprint: {
      prioritas: ['Data produk terlaris & restock tepat', 'Jadwal live & konten konsisten', 'Kendalikan retur'],
      rekrutSekarang: ['Bantuan packing per jam'],
      rekrutNanti: ['Host live (gaji + komisi) — saat live ≥4×/minggu', 'Admin chat & pesanan'],
      operasional: ['Harian: kirim pesanan sebelum jam 15.00', 'Live terjadwal 3×/minggu', 'Mingguan: cek stok per warna/ukuran', 'Mingguan: restock berdasarkan data'],
      modal: [{ pos: 'Stok uji (variasi kecil)', pct: 50 }, { pos: 'Alat live (lampu, HP stand)', pct: 10 }, { pos: 'Packaging', pct: 10 }, { pos: 'Dana darurat', pct: 30 }],
      kpi: [{ name: 'Perputaran stok', target: '<30 hari' }, { name: 'Retur', target: '<5%' }, { name: 'Penjualan per live', target: '≥15 pcs' }, { name: 'Gross margin', target: '≥30%' }],
      risiko: ['Stok mati', 'Retur COD', 'Ketergantungan pada satu supplier'],
      naikLevel: ['Penjualan ≥250 pcs/bulan', 'Perputaran stok <30 hari', 'Ada 2 supplier & kanal live yang stabil'],
    },
  },
  {
    industry: 'retail', level: 'tumbuh',
    title: 'Toko online multi-marketplace, 5 orang',
    persona: 'Tokomu kini ada di 3 marketplace + TikTok Shop dengan omzet ±Rp140 juta/bulan. Tim 5 orang. Stok di gudang rumah mulai berantakan, dan 30% stok tidak bergerak dalam 60 hari.',
    modal: 'Kas Rp45 juta',
    team: ['Kamu (owner, pembelian)', '2 host live', 'Admin marketplace', 'Packing & gudang'],
    start: { kas: 45, reputasi: 60, tim: 58 },
    decisions: [
      {
        title: '30% stok tidak bergerak',
        situation: 'Ada stok ±Rp35 juta yang tidak terjual selama lebih dari 60 hari.',
        options: [
          o('Simpan. Model lama sering kembali tren, dan diobral berarti rugi', [0, 0, 0], 'Stok makin ketinggalan tren. Uang tetap mati, dan gudang penuh.'),
          o('Cuci gudang terencana: bundling, flash sale, jual ke reseller; aturan umur stok', [22, 2, -2], 'Rp22 juta kembali menjadi kas dan dipakai untuk restock produk laris yang marginnya lebih tinggi.', true),
          o('Obral 70% di semua kanal minggu ini supaya gudang langsung lega', [12, -4, -2], 'Kas kembali sedikit, tapi pembeli setia menunggu diskon besar berikutnya.'),
        ],
        lesson: 'Stok tua adalah kas yang terkunci. Punya aturan umur stok + mekanisme cuci gudang yang terencana, dan pakai kas yang kembali untuk produk yang terbukti laku.',
      },
      {
        title: 'Biaya marketplace naik',
        situation: 'Biaya admin & layanan marketplace naik. Margin bersih turun dari 12% ke 7%.',
        options: [
          o('Serap kenaikannya. Menaikkan harga membuat toko kalah di hasil pencarian', [-4, 0, 0], 'Laba makin tipis. Satu bulan sepi saja membuatmu rugi.'),
          o('Hitung harga per kanal, naikkan selektif, bangun kanal milik sendiri', [4, 3, -2], 'Margin kembali ke 11%. 20% pembeli berulang beralih ke kanal sendiri.', true),
          o('Tarik diri dari marketplace dan pindah total ke website sendiri', [-10, -3, -4], 'Penjualan turun drastis karena trafik utama ada di marketplace.'),
        ],
        lesson: 'Marketplace adalah tempat menyewa trafik. Hitung harga per kanal, dan bangun kanal milik sendiri untuk pembeli berulang.',
      },
      {
        title: 'Merekrut host live',
        situation: 'Live adalah 45% penjualan, dan kamu masih menjadi host utama 4 malam per minggu.',
        options: [
          o('Tetap kamu yang live. Penjualan live sangat bergantung pada kepercayaan pada host', [0, 0, -10], 'Kamu tidak sempat mengurus pembelian dan keuangan. Kesalahan stok meningkat.'),
          o('Rekrut 2 host: gaji pokok + komisi, pelatihan naskah, target per sesi', [-6, 3, 6], 'Setelah 6 minggu, host baru menyamai 80% performamu. Kamu fokus ke pembelian dan pertumbuhan.', true),
          o('Rekrut 2 host berpengalaman bergaji tinggi supaya langsung jalan tanpa pelatihan', [-9, -1, 0], 'Performa live turun, dan biaya tetap naik.'),
        ],
        lesson: 'Peran yang membuat founder sibuk setiap hari harus menjadi peran pertama yang distandarkan dan diserahkan. Insentif berbasis hasil + pelatihan + naskah membuatnya bisa direplikasi.',
      },
    ],
    blueprint: {
      prioritas: ['Aturan umur stok & data restock', 'Profitabilitas per kanal', 'Founder lepas dari live harian'],
      rekrutSekarang: ['2 host live (pokok + komisi)', 'Admin stok/gudang'],
      rekrutNanti: ['Purchasing & merchandiser', 'Customer retention (CRM/WA)'],
      operasional: ['Harian: pengiriman & update stok', 'Live terjadwal dengan target per sesi', 'Mingguan: laporan stok per umur & kanal', 'Bulanan: P&L per kanal'],
      modal: [{ pos: 'Stok laris', pct: 50 }, { pos: 'Gaji tim', pct: 20 }, { pos: 'Iklan & promosi live', pct: 10 }, { pos: 'Gudang & packaging', pct: 5 }, { pos: 'Dana darurat', pct: 15 }],
      kpi: [{ name: 'Stok >60 hari', target: '<10%' }, { name: 'Net margin', target: '≥10%' }, { name: 'Penjualan via kanal sendiri', target: '≥15%' }, { name: 'GMV per sesi live', target: 'naik 10%/bulan' }],
      risiko: ['Stok mati', 'Biaya platform naik', 'Bergantung pada founder sebagai host'],
      naikLevel: ['Omzet ≥Rp300 juta/bulan dengan net margin ≥10%', 'Gudang & stok tercatat rapi', 'Live jalan tanpa founder'],
    },
  },
  {
    industry: 'retail', level: 'skala',
    title: 'Brand fashion muslim dengan gudang & 16 orang',
    persona: 'Kamu kini menjual campuran produk supplier dan beberapa produk dengan merek sendiri. Omzet ±Rp650 juta/bulan dengan 16 karyawan dan gudang sewaan. 60% penjualan dari satu platform.',
    modal: 'Kas Rp320 juta',
    team: ['Kamu (CEO)', 'Merchandiser & purchasing', '4 host live', 'Admin marketplace (3)', 'Gudang (5)', 'Finance', 'Desainer produk'],
    start: { kas: 320, reputasi: 70, tim: 58 },
    decisions: [
      {
        title: 'Merek sendiri atau tetap jualan barang supplier?',
        situation: 'Margin produk supplier 20–25%, sedangkan produk merek sendiri (produksi via konveksi) bisa 45–55%. Tapi butuh modal desain, sampel, dan stok.',
        options: [
          o('Ganti semua ke merek sendiri. Margin hampir 2× lipat', [-200, -2, -10], 'Lead time produksi molor. Separuh desain tidak laku, dan stok supplier yang laris sempat kosong.'),
          o('Naikkan porsi merek sendiri bertahap, uji lewat live & pre-order', [-60, 6, 0], 'Merek sendiri mencapai 35% penjualan dalam 9 bulan, dan margin keseluruhan naik 8 poin.', true),
          o('Tetap 100% supplier. Model yang sekarang sudah untung dan minim risiko', [0, -2, 2], 'Margin tetap tipis, dan kamu bersaing harga dengan ratusan toko yang menjual barang sama.'),
        ],
        lesson: 'Private label menaikkan margin dan diferensiasi, tapi menambah risiko stok & produksi. Jalankan bertahap dengan uji pasar (live, pre-order) sebelum produksi besar.',
      },
      {
        title: 'Sistem gudang & stok',
        situation: 'Selisih stok fisik vs sistem 6%. Salah kirim 2% dari pesanan.',
        options: [
          o('Tambah staf gudang. Volume naik, tangan juga harus bertambah', [-24, 0, -2], 'Lebih banyak orang, tapi kesalahan tetap terjadi karena tidak ada sistem.'),
          o('Sistem inventaris terhubung semua kanal, barcode, opname bergilir', [-35, 6, 4], 'Selisih stok turun ke 0,5% dan salah kirim ke 0,3%. Overselling di marketplace berhenti.', true),
          o('Tunda sistem sampai musim ramai lewat; fokus jualan dulu', [0, -6, -4], 'Overselling makin sering, dan rating toko turun.'),
        ],
        lesson: 'Di skala, akurasi stok = reputasi toko. Sistem inventaris terhubung + barcode + opname rutin adalah fondasi, bukan kemewahan.',
      },
      {
        title: 'Akun utama terkena pembatasan',
        situation: 'Akun di platform utama (60% penjualan) terkena pembatasan 14 hari karena pelanggaran kebijakan oleh admin (foto produk melanggar hak cipta).',
        options: [
          o('Buka akun cadangan dengan nama lain supaya penjualan tidak berhenti', [-5, -8, -2], 'Akun baru juga terdeteksi dan diblokir permanen.'),
          o('Banding dengan bukti perbaikan, SOP konten, alihkan pembeli ke kanal lain', [-15, 4, 2], 'Akun pulih di hari ke-10. Penjualan di kanal lain naik dan menjadi bantalan permanen.', true),
          o('Tunggu 14 hari. Akun akan pulih sendiri setelah masa pembatasan', [-80, -3, -2], 'Kehilangan 2 minggu penjualan tanpa rencana pemulihan.'),
        ],
        lesson: 'Ketergantungan pada satu platform adalah risiko besar. Patuhi kebijakan platform (hak cipta foto!), punya SOP konten, dan jaga diversifikasi kanal.',
      },
    ],
    blueprint: {
      prioritas: ['Porsi merek sendiri bertahap', 'Sistem inventaris terhubung semua kanal', 'Tidak ada platform >40% penjualan'],
      rekrutSekarang: ['Inventory/warehouse lead', 'Brand & product manager'],
      rekrutNanti: ['Head of e-commerce', 'CRM & retention specialist'],
      operasional: ['Harian: sinkronisasi stok semua kanal', 'Mingguan: opname bergilir & laporan umur stok', 'Bulanan: P&L per kanal & per lini (supplier vs merek sendiri)', 'Setiap drop: uji pre-order sebelum produksi besar'],
      modal: [{ pos: 'Stok (supplier & merek sendiri)', pct: 40 }, { pos: 'Pengembangan produk merek sendiri', pct: 15 }, { pos: 'Sistem gudang & inventaris', pct: 10 }, { pos: 'Pemasaran & live', pct: 15 }, { pos: 'Dana darurat', pct: 20 }],
      kpi: [{ name: 'Porsi merek sendiri', target: '≥40%' }, { name: 'Akurasi stok', target: '≥99%' }, { name: 'Kanal terbesar', target: '≤40% penjualan' }, { name: 'Net margin', target: '≥12%' }],
      risiko: ['Pembatasan akun platform', 'Stok mati merek sendiri', 'Selisih stok & overselling'],
      naikLevel: ['Merek sendiri ≥40% penjualan & untung', 'Diversifikasi kanal tercapai', 'Operasional gudang terstandar'],
    },
  },
];
