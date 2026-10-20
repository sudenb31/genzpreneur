import type { SimScenarioContent } from './types';
import { o } from './helpers';

export const FASHION: SimScenarioContent[] = [
  {
    industry: 'fashion', level: 'rintis',
    title: 'Vendor kaos kampus dari kamar kos',
    persona: 'Kamu mahasiswa semester 5. Belum punya mesin, tapi kenal 2 vendor sablon di Bogor dan punya jaringan himpunan. Dua order kecil sudah lunas, dan sekarang datang order yang lebih besar.',
    modal: 'Kas Rp5 juta (tabungan + laba 2 order pertama)',
    team: ['Kamu (sales, desain, admin)', 'Desainer freelance (bayar per desain)', 'Vendor sablon rekanan'],
    start: { kas: 5, reputasi: 50, tim: 70 },
    decisions: [
      {
        title: 'Order 120 kaos tanpa DP',
        situation: 'Ketua himpunan pesan 120 kaos (Rp85rb/pcs, total Rp10,2 juta) untuk acara 3 minggu lagi. Ia minta bayar penuh setelah barang jadi karena "dana cair dari fakultas belakangan". Vendor minta DP 50% dari ongkos produksi (±Rp3,6 juta).',
        options: [
          o('Terima tanpa DP. Himpunan kampus jarang kabur, dan kepercayaan ini bisa membuka order dari fakultas lain', [-3.6, 4, -5], 'Produksi jalan, tapi dana fakultas telat 5 minggu. Kasmu tinggal Rp1,4 juta dan kamu menolak dua order kecil karena tidak ada modal.'),
          o('Minta DP 50% lewat invoice & surat pesanan resmi supaya bendahara bisa mencairkan dana', [1.5, 2, 0], 'Bendahara menalangi DP Rp5,1 juta dari kas himpunan begitu ada invoice resmi. DP vendor terbayar dari situ, dan kasmu malah bertambah.', true),
          o('Tolak dengan sopan. Tanpa DP, risikonya terlalu besar untuk kas Rp5 juta', [0, -6, 5], 'Aman di kas, tapi ketua himpunan pindah ke vendor lain dan membawa 3 himpunan teman-temannya.'),
        ],
        lesson: 'Jangan menjadi bank untuk klienmu. Invoice dan surat pesanan resmi membuat organisasi bisa mencairkan DP lebih cepat. Talangan penuh hanya untuk klien yang sudah terbukti tepat bayar.',
      },
      {
        title: 'Bahan lebih murah, margin lebih besar',
        situation: 'Vendor menawarkan bahan cotton carded, Rp9rb/pcs lebih murah dari cotton combed 30s yang kamu janjikan di mockup. Klien tidak akan tahu bedanya sampai kaosnya dicuci beberapa kali.',
        options: [
          o('Pakai carded diam-diam. Untuk kaos acara sekali pakai, klien tidak akan memperhatikan', [1.1, -12, 0], 'Dua bulan kemudian keluhan masuk: kaos melar dan berbulu. Himpunan itu tidak pernah order lagi dan cerita di grup ketua himpunan.'),
          o('Tetap combed 30s sesuai janji, lalu tawarkan carded sebagai kelas hemat di order berikutnya', [0, 6, 0], 'Klien puas. Kamu sekarang punya dua kelas harga yang jelas dan bisa melayani klien bujet rendah tanpa menipu.', true),
          o('Pakai carded, tapi kasih diskon 5% supaya klien tetap merasa untung', [0.6, -4, -2], 'Klien bingung kenapa tiba-tiba ada diskon, dan tetap kecewa setelah kaos dicuci. Kamu repot menjelaskan.'),
        ],
        lesson: 'Spesifikasi yang dijanjikan adalah kontrak. Margin dari kualitas yang diturunkan diam-diam selalu dibayar mahal lewat reputasi. Buat tingkatan produk yang jelas, jangan menurunkan kualitas diam-diam.',
      },
      {
        title: 'Rp2 juta terakhir untuk promosi',
        situation: 'Musim pengadaan (makrab, PKKMB, dies natalis) tinggal sebulan lagi. Ada Rp2 juta yang bisa dipakai untuk mencari order.',
        options: [
          o('Bayar selebgram kampus Rp2 juta. Followers-nya 40 ribu, persis target pasarmu', [-2, 2, 0], 'Story-nya ditonton 15 ribu orang, tapi hanya 1 yang bertanya dan tidak jadi order. Penontonnya bukan pengambil keputusan pengadaan.'),
          o('Kirim penawaran personal + katalog ke 40 ketua ormawa, plus 2 kaos sampel', [-0.4, 5, -4], '9 ormawa membalas dan 3 jadi order (total 260 pcs). Melelahkan, tapi ini sumber pendapatan bulan depan.', true),
          o('Diskon 30% sebulan penuh supaya order musim pengadaan jatuh ke kamu duluan', [-1.5, 1, -3], 'Pesanan naik, tapi marginmu habis. Kamu kerja dua kali lipat untuk laba yang sama.'),
        ],
        lesson: 'Di B2B, cari pengambil keputusan, bukan sekadar penonton. Portofolio nyata + sampel + follow-up personal hampir selalu mengalahkan iklan mahal di tahap rintis.',
      },
    ],
    blueprint: {
      prioritas: ['10 klien pertama yang membayar dengan DP', 'SOP order 6 langkah: brief → mockup → DP → produksi → QC → kirim', '2 vendor cadangan dengan harga & kualitas yang sudah dites'],
      rekrutSekarang: ['Desainer freelance (per desain)', 'Kurir/ojek online per pengiriman'],
      rekrutNanti: ['Admin order part-time — saat order ≥15 per bulan', 'Sales kampus berbasis komisi — saat ada katalog & SOP'],
      operasional: ['Harian: balas chat calon klien < 1 jam', 'Per order: mockup final ditandatangani klien sebelum produksi', 'Mingguan: follow-up 20 ormawa baru', 'Setiap produksi: cek sampel pertama sebelum diproduksi massal'],
      modal: [{ pos: 'Sampel & katalog', pct: 15 }, { pos: 'Talangan produksi (hanya klien terpercaya)', pct: 30 }, { pos: 'Promosi tertarget', pct: 20 }, { pos: 'Alat kerja (laptop/akun desain)', pct: 10 }, { pos: 'Dana darurat', pct: 25 }],
      kpi: [{ name: 'Order per bulan', target: '≥5 order' }, { name: 'Gross margin', target: '≥30%' }, { name: 'Order dengan DP', target: '100%' }, { name: 'Repeat/referral', target: '≥30% klien' }],
      risiko: ['Klien telat bayar (dana organisasi)', 'Vendor telat di musim ramai', 'Revisi desain tanpa batas'],
      naikLevel: ['Omzet stabil Rp15–20 juta/bulan selama 3 bulan', 'Punya ≥2 vendor andal', 'Kas usaha terpisah dari uang pribadi'],
    },
  },
  {
    industry: 'fashion', level: 'tumbuh',
    title: 'Custom apparel dengan 4 orang tim',
    persona: 'Bisnismu sudah setahun. Omzet rata-rata Rp70 juta/bulan dari ormawa, komunitas, dan beberapa kantor kecil. Produksi masih lewat vendor. Kamu masih ikut closing, mengecek produksi, dan membalas komplain.',
    modal: 'Kas Rp45 juta',
    team: ['Kamu (founder)', 'Admin order & CS', 'Desainer full-time', 'Sales kampus (komisi 5%)', '2 vendor produksi'],
    start: { kas: 45, reputasi: 60, tim: 60 },
    decisions: [
      {
        title: 'Beli mesin DTF Rp38 juta?',
        situation: 'Ada tawaran mesin DTF + heat press Rp38 juta. Kalau produksi sendiri, ongkos per pcs bisa turun ±Rp6rb. Order bulananmu ±800 pcs, tapi naik-turun mengikuti kalender kampus (sepi saat libur semester).',
        options: [
          o('Beli tunai sekarang. Hemat Rp6rb/pcs × 800 pcs, modal balik dalam 8 bulan', [-38, 2, -10], 'Bulan berikutnya libur semester, order turun ke 300 pcs. Mesin lebih banyak diam, kas tinggal Rp7 juta, dan kamu perlu operator yang belum ada.'),
          o('Kontrak volume dengan vendor (−Rp3rb/pcs), beli mesin saat order stabil', [3, 3, 2], 'Hemat ±Rp2,4 juta/bulan tanpa utang dan tanpa beban operator. Keputusan beli mesin nanti didasarkan pada data utilisasi.', true),
          o('Ambil cicilan 12 bulan supaya kas tetap aman dan hemat produksi langsung terasa', [-7, 1, -6], 'Cicilan tetap jalan saat order sepi. Dua bulan pertama, cicilan memakan hampir seluruh laba.'),
        ],
        lesson: 'Beli aset hanya jika utilisasinya terbukti. Hitung: hemat per pcs × volume rata-rata (bukan volume tertinggi) vs cicilan + operator + perawatan. Kontrak volume sering memberi 50% manfaatnya tanpa risikonya.',
      },
      {
        title: 'Musim wisuda: order melebihi kapasitas',
        situation: 'Order masuk 1.900 pcs dalam 2 minggu. Dua vendormu hanya sanggup 1.300 pcs tepat waktu.',
        options: [
          o('Terima semua 1.900 pcs dan bayar vendor ekstra untuk lembur. Musim ramai hanya setahun sekali', [8, -10, -12], 'Vendor kewalahan: 400 pcs telat 5 hari dan 60 pcs cacat sablon. Tiga klien minta potongan dan satu menulis ulasan buruk.'),
          o('Ambil 1.300 pcs, uji vendor ketiga dengan order kecil, dan beri tanggal jujur untuk sisanya', [6, 6, -4], 'Vendor ketiga lolos uji dan menangani 300 pcs. Dua klien setuju mundur jadwal. Semua tepat waktu sesuai janji.', true),
          o('Terima kapasitas yang pasti saja. Kualitas & ketepatan waktu adalah merekmu', [3, -2, 3], 'Aman, tapi kamu kehilangan ±Rp20 juta omzet di musim terbaik tahun ini, dan klien yang ditolak belum tentu kembali.'),
        ],
        lesson: 'Kapasitas adalah janji. Lebih baik menjanjikan tanggal yang jujur daripada menerima semua lalu gagal. Musim ramai juga momen terbaik untuk menguji vendor cadangan, tapi dengan order kecil dan QC ketat.',
      },
      {
        title: 'Klien korporat minta termin 45 hari',
        situation: 'Sebuah perusahaan logistik pesan 600 polo (Rp52 juta) untuk seragam. Mereka minta pembayaran 45 hari setelah barang diterima (kebijakan finance mereka). Ongkos produksimu ±Rp34 juta.',
        options: [
          o('Terima tanpa syarat. Perusahaan sebesar itu pasti bayar, dan ini pintu masuk klien korporat', [-34, 4, -4], 'Pembayaran baru masuk hari ke-62 karena "proses invoice". Selama 2 bulan, kamu menolak order lain karena kas habis.'),
          o('Terima dengan PO resmi, DP 30%, dan pelunasan maksimal 30 hari', [-18, 5, -2], 'Finance mereka menyetujui DP 30% karena ada PO. Pelunasan masuk hari ke-33. Kas sempat ketat tapi aman.', true),
          o('Tawarkan diskon 5% asal dibayar penuh di muka. Arus kas lebih penting', [0, -3, 2], 'Mereka memilih vendor lain. Kas aman, tapi kamu kehilangan klien yang bisa order rutin setiap tahun.'),
        ],
        lesson: 'Klien korporat sering butuh termin, dan itu wajar. Kuncinya: PO resmi, DP sebagian, batas waktu tertulis, dan pastikan kasmu cukup untuk menunggu. Pertumbuhan yang tidak dibiayai adalah penyebab umum usaha bangkrut walaupun sedang laris.',
      },
    ],
    blueprint: {
      prioritas: ['Founder lepas dari admin & QC harian', 'Sistem kapasitas: tahu berapa pcs yang sanggup dikirim tepat waktu per minggu', 'Pisahkan klien kampus (musiman) dan korporat (rutin) agar omzet lebih stabil'],
      rekrutSekarang: ['Staf QC & packing', 'Admin keuangan part-time (invoice, piutang)'],
      rekrutNanti: ['Sales korporat (gaji pokok + komisi) — setelah 3 klien korporat rutin', 'Operator mesin — hanya jika beli mesin'],
      operasional: ['Senin: rapat 30 menit — order minggu ini vs kapasitas vendor', 'Setiap order: checklist QC (warna, ukuran, posisi sablon)', 'Mingguan: daftar piutang & penagihan', 'Bulanan: evaluasi vendor (tepat waktu, cacat)'],
      modal: [{ pos: 'Modal kerja produksi & termin klien', pct: 45 }, { pos: 'Gaji tim (cadangan 2 bulan)', pct: 25 }, { pos: 'Pemasaran B2B (sampel, katalog, kunjungan)', pct: 10 }, { pos: 'Sistem (pembukuan, CRM sederhana)', pct: 5 }, { pos: 'Dana darurat', pct: 15 }],
      kpi: [{ name: 'Ketepatan waktu kirim', target: '≥95%' }, { name: 'Reject rate', target: '<2%' }, { name: 'Hari piutang rata-rata', target: '<30 hari' }, { name: 'Net margin', target: '≥12%' }],
      risiko: ['Kas habis karena termin klien besar', 'Ketergantungan pada satu vendor', 'Founder masih jadi bottleneck keputusan'],
      naikLevel: ['Omzet ≥Rp150 juta/bulan dengan net margin ≥12%', '≥30% omzet dari klien korporat rutin', 'Operasional jalan 1 minggu tanpa founder'],
    },
  },
  {
    industry: 'fashion', level: 'skala',
    title: 'Workshop sendiri, 22 karyawan',
    persona: 'Kamu punya workshop produksi (sablon, DTF, bordir) dengan 22 karyawan dan omzet ±Rp420 juta/bulan, 55% dari korporat. Investor keluarga menawarkan tambahan modal. Masalahnya: kamu masih menyetujui hampir semua keputusan sendiri.',
    modal: 'Kas Rp350 juta',
    team: ['Kamu (CEO)', 'Kepala sales', 'Supervisor produksi', '14 staf produksi & QC', '3 admin/CS', 'Desainer & marketing'],
    start: { kas: 350, reputasi: 70, tim: 55 },
    decisions: [
      {
        title: 'Rekrut Head of Production?',
        situation: 'Reject rate naik ke 6% dan lembur makin sering. Kandidat Head of Production berpengalaman meminta gaji Rp18 juta/bulan. Supervisor sekarang bagus di lantai produksi, tapi lemah di perencanaan.',
        options: [
          o('Kamu turun langsung ke produksi 3 bulan. Tidak ada yang lebih paham bisnis ini daripada kamu', [0, -4, -12], 'Reject turun sebentar, tapi penjualan korporat melambat karena kamu tidak sempat bertemu klien. Kamu kelelahan.'),
          o('Rekrut Head of Production dengan target 90 hari tertulis', [-54, 6, 8], 'Dalam 3 bulan ada perencanaan produksi mingguan dan reject turun ke 1,8%. Kamu kembali fokus ke klien besar.', true),
          o('Promosikan supervisor yang sudah loyal. Lebih murah dan menjaga moral tim', [-6, -3, -4], 'Supervisor kewalahan di perencanaan dan dua staf senior resign karena merasa dilangkahi.'),
        ],
        lesson: 'Di level skala, aset terpentingmu adalah waktumu. Rekrut orang yang lebih ahli darimu di bidang tertentu, dengan target terukur di 90 hari pertama. Mempromosikan orang tanpa membekali kemampuan barunya justru menyiksa mereka.',
      },
      {
        title: 'Ekspansi ke brand retail sendiri?',
        situation: 'Investor ingin kamu meluncurkan brand streetwear sendiri dengan Rp200 juta (stok, foto, iklan). Bisnis B2B-mu sudah untung tapi marginnya stagnan.',
        options: [
          o('Luncurkan penuh: 12 desain, stok besar, iklan besar. Momentum & modal investor sedang ada', [-200, 3, -10], 'Dua desain laku, sepuluh lainnya menumpuk. Setelah 6 bulan, stok mati Rp110 juta.'),
          o('Pilot Rp35 juta: 3 desain, pre-order, target sell-through ≥70%', [-12, 5, -2], 'Dua dari tiga drop terjual habis. Kamu dapat data harga, ukuran, dan kanal mana yang laku sebelum memakai modal besar.', true),
          o('Tetap fokus B2B yang sudah untung. Jangan pecah fokus di saat bisnis bagus', [0, 0, 2], 'Aman, tapi peluang margin lebih tinggi tidak pernah diuji. Investor kurang yakin dengan visimu.'),
        ],
        lesson: 'Model bisnis baru di dalam perusahaan lama = startup baru. Uji dengan modal kecil dan target angka yang jelas (sell-through, CAC) sebelum menuang modal besar.',
      },
      {
        title: 'Karyawan mengeluh lembur & upah',
        situation: 'Lima staf produksi mengeluh lembur tidak dibayar sesuai aturan, dan satu mengancam melapor ke dinas ketenagakerjaan. Hitunganmu: membayar lembur sesuai ketentuan menambah biaya ±Rp9 juta/bulan.',
        options: [
          o('Biarkan. Lembur itu konsekuensi musim ramai, dan gaji di sini sudah di atas rata-rata', [9, -10, -20], 'Tiga staf terbaik keluar menjelang musim ramai. Laporan masuk ke dinas dan kamu harus membayar kekurangan plus menanggung masalah reputasi.'),
          o('Audit jam kerja, bayar lembur sesuai aturan, kurangi lembur lewat perencanaan', [-12, 6, 15], 'Biaya naik di awal, tapi lembur turun 40% dalam 2 bulan karena perencanaan membaik. Turnover turun dan produktivitas naik.', true),
          o('Bonus Rp500rb per orang sekarang, dan bahas sistem lembur setelah musim ramai', [-11, 0, 3], 'Keluhan reda sebentar, lalu muncul lagi bulan depan karena akar masalahnya (lembur tak terencana) tidak berubah.'),
        ],
        lesson: 'Kepatuhan ketenagakerjaan bukan biaya tambahan; itu biaya yang memang seharusnya dibayar. Cara memangkasnya: perencanaan yang lebih baik, bukan melanggar aturan. Cek aturan upah & lembur terbaru dengan konsultan/HR.',
      },
    ],
    blueprint: {
      prioritas: ['Kepala divisi yang memegang target sendiri (produksi, sales, keuangan)', 'Rapat KPI mingguan berbasis angka, bukan perasaan', 'Uji lini bisnis baru dengan modal terbatas'],
      rekrutSekarang: ['Head of Production', 'Finance/accounting full-time', 'HR generalist (kontrak kerja, BPJS, lembur)'],
      rekrutNanti: ['COO — saat ada ≥2 lini bisnis', 'Brand manager — jika pilot brand lolos target'],
      operasional: ['Senin: rapat KPI kepala divisi (60 menit)', 'Harian: perencanaan produksi & laporan reject', 'Bulanan: laporan laba rugi, arus kas, dan neraca', 'Kuartalan: review gaji, kepuasan karyawan, dan vendor'],
      modal: [{ pos: 'Modal kerja & piutang korporat', pct: 35 }, { pos: 'SDM kunci (gaji 6 bulan cadangan)', pct: 20 }, { pos: 'Pilot lini baru', pct: 10 }, { pos: 'Perawatan & upgrade mesin', pct: 10 }, { pos: 'Sistem (ERP/pembukuan, HR)', pct: 5 }, { pos: 'Dana darurat', pct: 20 }],
      kpi: [{ name: 'Omzet per karyawan', target: '≥Rp20 juta/bulan' }, { name: 'Reject rate', target: '<2%' }, { name: 'Turnover karyawan', target: '<15%/tahun' }, { name: 'EBITDA margin', target: '≥15%' }],
      risiko: ['Founder masih menjadi pengambil keputusan untuk semua hal', 'Ekspansi terlalu cepat dengan modal investor', 'Masalah ketenagakerjaan & kepatuhan'],
      naikLevel: ['Bisnis jalan 1 bulan tanpa founder di operasional', 'Laporan keuangan rapi siap diperiksa investor/bank', 'Lini kedua terbukti untung'],
    },
  },
];
