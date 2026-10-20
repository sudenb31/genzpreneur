import type { SimScenarioContent } from './types';
import { o } from './helpers';

export const FNB: SimScenarioContent[] = [
  {
    industry: 'fnb', level: 'rintis',
    title: 'Rice bowl rumahan di aplikasi ojol',
    persona: 'Kamu memasak rice bowl ayam dari dapur rumah dan berjualan lewat GoFood/GrabFood serta pre-order kantor sekitar. Rata-rata terjual 25 porsi/hari. Ramai, tapi saldo tidak pernah terasa bertambah.',
    modal: 'Kas Rp8 juta',
    team: ['Kamu (masak, belanja, admin)', 'Adik/teman bantu packing (dibayar harian)'],
    start: { kas: 8, reputasi: 50, tim: 65 },
    decisions: [
      {
        title: 'Kenapa ramai tapi tidak untung?',
        situation: 'Harga jual Rp25rb. Bahan + kemasan per porsi Rp12,5rb (food cost 50%). Aplikasi memotong ±20%. Kamu belum menghitung gas, listrik, dan tenagamu sendiri.',
        options: [
          o('Naikkan harga ke Rp35rb. Rasa sudah terbukti, pelanggan setia pasti tetap beli', [1, -6, 0], 'Penjualan turun 40%. Pembeli membandingkan dengan menu sejenis yang Rp27rb dan pindah.'),
          o('Hitung HPP penuh, rampingkan menu, standarkan porsi, dan buka pre-order langsung', [3, 3, 2], 'Food cost turun ke 36% dan pembeli kantor beralih ke pre-order langsung tanpa potongan aplikasi. Laba bersih per porsi naik hampir 2×.', true),
          o('Cari bahan lebih murah di pasar induk. Pelanggan jarang bisa membedakan', [2, -10, 0], 'Rating turun dari 4,8 ke 4,3 dalam 3 minggu. Algoritma aplikasi menurunkan posisi tokomu.'),
        ],
        lesson: 'Kuliner untung di detail: gramasi standar, menu ramping, food cost ±30–35%, dan harga yang sudah memperhitungkan potongan platform. Kanal langsung (pre-order, WA) menyelamatkan margin.',
      },
      {
        title: 'Ikut promo diskon besar dari aplikasi?',
        situation: 'Aplikasi menawarkan promo "diskon 40%" selama 2 minggu. Subsidinya dibagi dua dengan merchant: kamu menanggung 20%. Tokomu akan muncul di halaman depan.',
        options: [
          o('Ikut 2 minggu penuh. Muncul di halaman depan aplikasi = ribuan calon pelanggan baru', [-3, 3, -10], 'Order melonjak 3×. Kamu kewalahan, beberapa pesanan telat dan dibatalkan, dan setelah promo selesai pembeli pergi ke toko lain yang sedang promo.'),
          o('Promo sendiri: bundling minuman + kartu stempel untuk pembeli langsung', [1, 4, -2], 'Order naik 30% dan nilai per transaksi naik. 40 pembeli tetap mulai pesan lewat WA.', true),
          o('Tidak ikut promo. Margin sudah tipis, jangan dibakar untuk diskon', [0, -2, 2], 'Aman di margin, tapi tokomu tenggelam di aplikasi karena pesaing aktif promo.'),
        ],
        lesson: 'Promo bagus mendatangkan pelanggan yang kembali tanpa diskon. Hitung: apakah margin masih positif setelah diskon dan potongan aplikasi? Apakah dapurmu sanggup melayani lonjakannya?',
      },
      {
        title: 'Rating turun karena pesanan lama',
        situation: 'Jam makan siang kamu menerima 15 pesanan dalam 30 menit. Waktu siap rata-rata 25 menit, dan dua ulasan bintang 2 menyebut "lama banget".',
        options: [
          o('Matikan toko saat jam paling sibuk supaya tidak ada pesanan yang telat dan rating aman', [-1, -4, 3], 'Ulasan buruk berhenti, tapi kamu kehilangan jam penjualan terbaik.'),
          o('Siapkan bahan sebelum jam 11, ramping menu siang, tambah orang 3 jam', [-0.8, 6, 4], 'Waktu siap turun ke 9 menit. Rating kembali ke 4,8 dalam 2 minggu.', true),
          o('Balas ulasan dengan penjelasan detail bahwa semua masakan dibuat fresh per pesanan', [0, -6, 0], 'Penjelasan panjang terdengar seperti alasan. Masalah waktu tunggu tetap ada, dan ulasan buruk terus bertambah.'),
        ],
        lesson: 'Kecepatan adalah fitur. Persiapan bahan sebelum jam ramai (mise en place) dan menu jam sibuk yang ramping lebih efektif daripada menambah orang tanpa sistem.',
      },
    ],
    blueprint: {
      prioritas: ['Hitung HPP per menu, termasuk potongan aplikasi', 'Bangun kanal langsung (WA/pre-order kantor)', 'Standar resep & gramasi tertulis'],
      rekrutSekarang: ['Pembantu packing paruh waktu di jam sibuk'],
      rekrutNanti: ['Juru masak kedua — saat penjualan ≥60 porsi/hari', 'Admin pesanan WA — saat pre-order ≥20/hari'],
      operasional: ['Pagi: belanja & persiapan bahan sesuai prakiraan', '10.30: semua bahan setengah jadi siap', 'Malam: catat penjualan, sisa bahan, dan uang masuk', 'Mingguan: cek food cost & 3 menu terlaris'],
      modal: [{ pos: 'Bahan baku & kemasan (perputaran mingguan)', pct: 35 }, { pos: 'Alat dapur & wadah', pct: 20 }, { pos: 'Legal (NIB, sertifikasi halal jalur usaha mikro)', pct: 5 }, { pos: 'Promosi & foto menu', pct: 15 }, { pos: 'Dana darurat', pct: 25 }],
      kpi: [{ name: 'Food cost', target: '30–36%' }, { name: 'Rating aplikasi', target: '≥4,7' }, { name: 'Waktu siap pesanan', target: '<12 menit' }, { name: 'Porsi per hari', target: '≥40' }],
      risiko: ['Margin habis oleh potongan aplikasi & diskon', 'Bahan terbuang', 'Kesehatan & kebersihan dapur'],
      naikLevel: ['Laba bersih konsisten ≥Rp6 juta/bulan', '≥30% penjualan lewat kanal langsung', 'Resep terstandar sehingga bisa dimasak orang lain'],
    },
  },
  {
    industry: 'fnb', level: 'tumbuh',
    title: 'Satu outlet kecil, 5 karyawan shift',
    persona: 'Kamu menyewa ruko kecil dekat kampus (sewa Rp60 juta/tahun). Omzet ±Rp95 juta/bulan, 5 karyawan dalam 2 shift. Investor kenalan menawarkan modal untuk buka cabang kedua.',
    modal: 'Kas Rp60 juta',
    team: ['Kamu (owner, sering di dapur)', 'Kepala dapur', '2 cook', '2 kasir/pelayan', 'Kurir lepas'],
    start: { kas: 60, reputasi: 62, tim: 58 },
    decisions: [
      {
        title: 'Buka cabang kedua sekarang?',
        situation: 'Outlet pertama untung tipis: net margin 6%, dan selisih stok sering tidak jelas. Investor siap menaruh Rp150 juta untuk cabang kedua bulan depan.',
        options: [
          o('Terima dan buka bulan depan. Lokasi bagus jarang muncul, dan investor bisa berubah pikiran', [-20, -4, -15], 'Kamu bolak-balik dua outlet. Masalah selisih stok menular ke cabang baru, dan setelah 4 bulan cabang kedua masih rugi.'),
          o('Minta waktu 3 bulan untuk membereskan outlet 1 dulu, lalu buka dengan target angka', [6, 4, 5], 'Net margin naik ke 13% setelah stok bocor ditemukan. Investor lebih yakin karena kamu bicara dengan angka.', true),
          o('Tolak. Kamu belum siap mengurus dua outlet dan tidak mau berutang budi', [0, 0, 2], 'Aman, tapi kamu kehilangan rekan modal yang sebenarnya mau menunggu.'),
        ],
        lesson: 'Cabang menggandakan sistemmu, termasuk masalahnya. Buka cabang hanya kalau outlet pertama untung tanpa kehadiranmu setiap hari dan SOP-nya sudah tertulis.',
      },
      {
        title: 'Stok bocor 8%',
        situation: 'Pembelian ayam dan beras tidak sebanding dengan porsi terjual: ada selisih ±8% setiap bulan (±Rp3 juta). Belum jelas karena porsi tidak standar, bahan terbuang, atau diambil orang.',
        options: [
          o('Ganti karyawan yang paling dicurigai. Lebih baik tegas sejak awal daripada kebocoran berlanjut', [0, -3, -15], 'Ternyata penyebab terbesar adalah porsi yang tidak ditimbang. Tim jadi takut dan saling curiga.'),
          o('Opname harian, timbang porsi, catat bahan terbuang, bonus tim bila selisih <2%', [2.5, 2, 6], 'Selisih turun ke 1,5% dalam sebulan. Tim merasa ikut memiliki target.', true),
          o('Anggap wajar. Selisih kecil normal di dapur, fokus saja ke penjualan', [-3, 0, 0], 'Kebocoran terus terjadi, Rp36 juta setahun hilang.'),
        ],
        lesson: 'Yang tidak diukur tidak bisa diperbaiki. Opname harian bahan utama, porsi ditimbang, dan insentif tim lebih efektif daripada saling curiga.',
      },
      {
        title: 'Harga ayam naik 15%',
        situation: 'Supplier menaikkan harga ayam 15%. Food cost menu utama naik dari 34% ke 39%.',
        options: [
          o('Naikkan semua harga 15%. Semua pesaing juga pasti menaikkan harga', [2, -6, 0], 'Pelanggan mahasiswa protes. Penjualan menu termurah turun tajam.'),
          o('Kontrak 2 supplier, naikkan harga di menu terlaris saja, dorong menu margin tinggi', [3, 2, 0], 'Food cost kembali ke 35%. Pelanggan hampir tidak merasakan perubahan.', true),
          o('Kurangi porsi ayam sedikit. Lebih halus daripada menaikkan harga', [2, -9, -2], 'Pelanggan setia sadar dan mengeluh di media sosial.'),
        ],
        lesson: 'Menu engineering: kenali menu bintang (laris + margin tinggi) dan menu beban. Supplier kedua selalu memperkuat posisi tawarmu.',
      },
    ],
    blueprint: {
      prioritas: ['SOP dapur & kasir tertulis', 'Kendali stok & food cost mingguan', 'Kepala outlet yang bisa menggantikanmu'],
      rekrutSekarang: ['Kepala outlet / supervisor shift'],
      rekrutNanti: ['Admin keuangan & purchasing — saat 2 outlet', 'Marketing lokal (konten & kerja sama komunitas)'],
      operasional: ['Buka: checklist kebersihan & persiapan', 'Tutup: opname bahan utama + rekap kas', 'Mingguan: laporan food cost, labor cost, dan menu terlaris', 'Bulanan: rapat tim & evaluasi supplier'],
      modal: [{ pos: 'Bahan baku & stok', pct: 25 }, { pos: 'Gaji (cadangan 2 bulan)', pct: 25 }, { pos: 'Sewa & utilitas', pct: 20 }, { pos: 'Sistem kasir & stok (POS)', pct: 5 }, { pos: 'Pemasaran lokal', pct: 5 }, { pos: 'Dana darurat', pct: 20 }],
      kpi: [{ name: 'Food cost', target: '≤35%' }, { name: 'Labor cost', target: '≤25% omzet' }, { name: 'Selisih stok', target: '<2%' }, { name: 'Net margin', target: '≥12%' }],
      risiko: ['Buka cabang sebelum sistem siap', 'Turnover karyawan dapur', 'Kenaikan harga bahan & sewa'],
      naikLevel: ['Net margin ≥12% selama 3 bulan', 'Outlet berjalan tanpa owner di dapur', 'Resep, SOP, dan laporan siap direplikasi'],
    },
  },
  {
    industry: 'fnb', level: 'skala',
    title: '3 outlet & rencana central kitchen',
    persona: 'Kamu punya 3 outlet dengan 28 karyawan dan omzet ±Rp380 juta/bulan. Rasa antar-outlet mulai berbeda. Calon mitra ingin membuka outlet dengan sistem kemitraan.',
    modal: 'Kas Rp450 juta',
    team: ['Kamu (CEO)', 'Area manager', '3 kepala outlet', '18 staf dapur & layanan', 'Purchasing', 'Admin keuangan', 'Marketing'],
    start: { kas: 450, reputasi: 70, tim: 55 },
    decisions: [
      {
        title: 'Central kitchen atau masak di tiap outlet?',
        situation: 'Konsistensi rasa turun dan biaya bahan per outlet berbeda-beda. Membangun central kitchen kecil butuh ±Rp180 juta (alat, sewa, izin) plus 4 staf.',
        options: [
          o('Perketat pelatihan di tiap outlet. Lebih murah dan dapur tetap fleksibel', [-10, -3, -4], 'Sedikit membaik, tapi perbedaan rasa tetap ada dan purchasing tetap tidak efisien.'),
          o('Central kitchen untuk bumbu & bahan dasar, outlet memasak bagian akhir', [-180, 7, 4], 'Rasa konsisten, food cost turun 3 poin karena pembelian terpusat. Investasi kembali dalam ±14 bulan.', true),
          o('Central kitchen penuh: semua dimasak terpusat supaya rasa 100% sama', [-240, -5, -6], 'Biaya distribusi tinggi, dan kualitas beberapa menu turun karena dipanaskan ulang.'),
        ],
        lesson: 'Sentralisasi bagian yang menentukan konsistensi (bumbu, saus, bahan dasar), dan sisakan di outlet bagian yang menentukan kesegaran. Hitung payback sebelum membangun.',
      },
      {
        title: 'Tawaran kemitraan dari calon mitra',
        situation: 'Tiga calon mitra masing-masing siap membayar biaya kemitraan Rp75 juta. SOP-mu baru 60% tertulis dan belum ada tim pendamping mitra.',
        options: [
          o('Terima ketiganya. Rp225 juta tunai bisa membiayai central kitchen & ekspansi', [225, -10, -12], 'Uang masuk cepat, tapi dua outlet mitra tidak menjalankan SOP. Ulasan buruk menyeret mereknya.'),
          o('Pilot 1 mitra dengan kontrak & audit, sambil menuntaskan SOP', [75, 5, -3], 'Mitra pertama berjalan baik dan menjadi studi kasus. Kamu juga belajar apa yang perlu ada di manual sebelum membuka lebih banyak.', true),
          o('Tolak semua. Merek ini terlalu berharga untuk dipegang orang lain', [0, 0, 2], 'Merek tetap terjaga, tapi pertumbuhan hanya dari modal sendiri.'),
        ],
        lesson: 'Kemitraan/waralaba menjual sistem, bukan sekadar merek. Tanpa SOP lengkap, pelatihan, dan audit, kamu menjual risiko reputasi. Cek ketentuan waralaba yang berlaku dengan konsultan hukum sebelum menawarkan ke publik.',
      },
      {
        title: 'Pelanggan mengaku keracunan',
        situation: 'Seorang pelanggan mengunggah video mengaku sakit perut setelah makan di outlet 2. Video ditonton 80 ribu kali dalam 6 jam.',
        options: [
          o('Tunggu 24 jam sampai faktanya jelas. Pernyataan terburu-buru bisa dianggap pengakuan', [0, -15, -3], 'Komentar makin liar. Media lokal mengangkatnya, dan penjualan ketiga outlet turun 30% selama 2 minggu.'),
          o('Hubungi pelanggan, tanggung biaya periksa, cek dapur & batch, umumkan langkahmu', [-8, 6, 2], 'Hasil pemeriksaan menunjukkan dapur sesuai standar, dan sikap terbukamu dipuji. Penjualan pulih dalam seminggu.', true),
          o('Unggah video dapur yang bersih + bukti uji lab lama untuk membantah tuduhan', [0, -18, -4], 'Publik berbalik menyerang merekmu. Masalahnya menjadi pertempuran opini, bukan fakta.'),
        ],
        lesson: 'Krisis keamanan pangan: utamakan pelanggan, cek fakta, bertindak cepat, dan berkomunikasi terbuka. Siapkan protokol krisis sebelum dibutuhkan.',
      },
    ],
    blueprint: {
      prioritas: ['Konsistensi rasa & biaya lintas outlet', 'Manual operasional lengkap sebelum ekspansi mitra', 'Protokol keamanan pangan & krisis'],
      rekrutSekarang: ['Kepala central kitchen', 'QA/food safety officer', 'Finance manager'],
      rekrutNanti: ['Franchise/partnership manager — setelah pilot mitra berhasil', 'HR & training lead'],
      operasional: ['Harian: produksi central kitchen sesuai pesanan outlet', 'Mingguan: audit rasa & kebersihan acak tiap outlet', 'Bulanan: laporan P&L per outlet', 'Kuartalan: review menu & harga'],
      modal: [{ pos: 'Central kitchen & alat', pct: 35 }, { pos: 'SDM kunci', pct: 15 }, { pos: 'Modal kerja bahan', pct: 15 }, { pos: 'Sistem (POS terpusat, inventaris)', pct: 5 }, { pos: 'Pemasaran merek', pct: 10 }, { pos: 'Dana darurat', pct: 20 }],
      kpi: [{ name: 'Food cost gabungan', target: '≤33%' }, { name: 'Skor audit outlet', target: '≥90' }, { name: 'Same-store growth', target: '≥5%/kuartal' }, { name: 'Payback outlet baru', target: '<18 bulan' }],
      risiko: ['Kualitas menurun saat ekspansi', 'Krisis keamanan pangan', 'Mitra yang tidak patuh SOP'],
      naikLevel: ['Semua outlet untung dan auditnya lolos', 'Pilot mitra berhasil 6 bulan', 'Laporan keuangan per outlet rapi'],
    },
  },
];
