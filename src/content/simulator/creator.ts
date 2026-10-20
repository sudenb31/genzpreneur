import type { SimScenarioContent } from './types';
import { o } from './helpers';

export const CREATOR: SimScenarioContent[] = [
  {
    industry: 'creator', level: 'rintis',
    title: 'Creator TikTok 9 ribu followers',
    persona: 'Kamu membuat konten tips kuliah & produktivitas. Followers 9 ribu, views naik-turun antara 2 ribu dan 80 ribu. Mulai ada brand kecil yang mengirim DM.',
    modal: 'Kas Rp3 juta + HP',
    team: ['Kamu (ide, syuting, editing, admin)'],
    start: { kas: 3, reputasi: 50, tim: 65 },
    decisions: [
      {
        title: 'Endorse produk yang tidak cocok',
        situation: 'Sebuah brand suplemen pelangsing menawarkan Rp400rb + produk untuk 1 video. Audiensmu mahasiswa, dan kamu tidak yakin dengan klaim produknya.',
        options: [
          o('Terima. Rp400rb untuk 1 video lumayan, dan ini bisa membuka pintu brand lebih besar', [0.4, -10, 0], 'Komentar meragukan klaim produk. Beberapa followers lama berhenti mengikuti dan menganggapmu "jualan apa saja".'),
          o('Tolak sopan, lalu kirim media kit ke 10 brand yang relevan dengan audiensmu', [0, 4, -2], 'Seminggu kemudian aplikasi catatan membayar Rp750rb untuk konten yang memang kamu pakai.', true),
          o('Terima, tapi buat konten jujur yang menyebut kelemahan produknya juga', [0.4, -6, -2], 'Brand marah, menolak membayar, dan menyebarkan namamu di grup agensi.'),
        ],
        lesson: 'Kepercayaan audiens adalah aset utama creator. Endorse yang tidak relevan menukar aset jangka panjang dengan uang receh. Media kit + daftar brand yang relevan lebih produktif.',
      },
      {
        title: 'Posting tiap hari asal-asalan atau terencana?',
        situation: 'Kamu kuliah dan kerja part-time. Waktumu ±10 jam/minggu untuk konten.',
        options: [
          o('Posting 2× sehari. Algoritma memberi hadiah pada volume dan konsistensi', [0, -3, -12], 'Kualitas turun, kamu kelelahan, dan engagement per video malah menurun.'),
          o('4 video/minggu dari 3 pilar konten, syuting borongan, analisis mingguan', [0, 6, 5], 'Retensi tontonan naik. Dalam 6 minggu followers menjadi 21 ribu.', true),
          o('Posting saat ada ide bagus saja. Kualitas lebih penting dari kuantitas', [0, -4, 4], 'Akun tidak konsisten, dan algoritma serta audiens lupa padamu.'),
        ],
        lesson: 'Konsistensi yang realistis mengalahkan volume yang tidak tahan lama. Pilar konten + produksi borongan + analisis mingguan adalah "pabrik" creator.',
      },
      {
        title: 'Affiliate pertama',
        situation: 'Kamu bisa mendaftar affiliate di marketplace/TikTok Shop dengan komisi 5–15%.',
        options: [
          o('Pajang produk dengan komisi tertinggi. Yang penting klik, audiens bisa memilih sendiri', [0.3, -5, 0], 'Klik banyak, tapi pembelian jarang. Audiens bingung dengan identitas akunmu.'),
          o('Pilih 5 produk yang benar-benar kamu pakai, lalu buat konten jujur', [1.2, 4, -2], 'Konversi bagus karena relevan. Komisi bulan pertama Rp1,2 juta dan terus bertambah dari video lama.', true),
          o('Tunda affiliate sampai ada brand besar, supaya akun terlihat eksklusif', [0, 0, 2], 'Kamu melewatkan penghasilan pasif dari konten yang sudah ada.'),
        ],
        lesson: 'Affiliate yang relevan dengan niche = penghasilan dari konten lama. Rekomendasi jujur menjual lebih baik daripada katalog acak.',
      },
    ],
    blueprint: {
      prioritas: ['Niche & 3 pilar konten yang jelas', 'Media kit 1 halaman', 'Kebiasaan produksi borongan mingguan'],
      rekrutSekarang: ['Belum perlu. Pakai template editing'],
      rekrutNanti: ['Editor freelance — saat ada ≥2 deal brand/bulan', 'Manajer/agensi — saat ≥50 ribu followers aktif'],
      operasional: ['Minggu: riset & syuting 4–5 video', 'Harian: balas komentar 15 menit', 'Mingguan: cek 3 video terbaik & penyebabnya', 'Bulanan: update media kit (followers, views rata-rata, demografi)'],
      modal: [{ pos: 'Alat (lighting, mic)', pct: 35 }, { pos: 'Aplikasi editing', pct: 10 }, { pos: 'Riset & kursus', pct: 15 }, { pos: 'Dana darurat', pct: 40 }],
      kpi: [{ name: 'Video per minggu', target: '4' }, { name: 'Rata-rata view', target: 'naik 10%/bulan' }, { name: 'Engagement rate', target: '≥5%' }, { name: 'Penghasilan konten', target: '≥Rp2 juta/bulan' }],
      risiko: ['Burnout', 'Endorse yang merusak kepercayaan', 'Bergantung pada satu platform'],
      naikLevel: ['≥50 ribu followers dengan engagement sehat', '≥Rp5 juta/bulan dari brand + affiliate', 'Sistem produksi konsisten 3 bulan'],
    },
  },
  {
    industry: 'creator', level: 'tumbuh',
    title: 'Creator 180 ribu followers dengan tim kecil',
    persona: 'Followers 180 ribu di TikTok dan 40 ribu di Instagram. Penghasilan ±Rp25 juta/bulan dari brand deal & affiliate. Kamu dibantu editor dan admin. Suatu hari views tiba-tiba turun drastis.',
    modal: 'Kas Rp30 juta',
    team: ['Kamu (talent & ide)', 'Editor full-time', 'Admin & negosiasi brand (part-time)'],
    start: { kas: 30, reputasi: 62, tim: 60 },
    decisions: [
      {
        title: 'Rate card & cara menjual',
        situation: 'Brand menawar tanpa standar. Ada yang membayar Rp1,5 juta, ada yang Rp8 juta untuk pekerjaan serupa.',
        options: [
          o('Terima semua tawaran yang masuk. Selama algoritma sedang bagus, ambil sebanyak mungkin', [0, -2, -6], 'Penghasilan tidak stabil, dan kamu sering mengerjakan revisi tanpa bayaran tambahan.'),
          o('Buat rate card, kontrak sederhana, dan laporan hasil kampanye', [6, 5, 3], 'Nilai rata-rata deal naik 45%. Brand yang menerima laporan cenderung repeat order.', true),
          o('Naikkan harga 3× semua deal. Followers 180 ribu sudah pantas harga premium', [-2, -2, 0], 'Deal turun drastis karena tidak ada data yang mendukung harga tersebut.'),
        ],
        lesson: 'Creator adalah bisnis media. Rate card + kontrak + laporan hasil mengubahmu dari "influencer" menjadi mitra pemasaran yang bisa dipesan ulang. Jangan lupa: hak pakai konten untuk iklan berbayar harus dihargai terpisah.',
      },
      {
        title: 'Views turun 60% dalam sebulan',
        situation: 'Perubahan algoritma membuat views rata-rata turun dari 70 ribu ke 28 ribu. Dua brand mulai ragu.',
        options: [
          o('Kejar tren: posting 3× sehari dengan audio & format yang sedang viral', [0, -4, -12], 'Identitas akunmu kabur dan timmu kelelahan.'),
          o('Analisis data, uji 2 format baru, bangun kanal milik sendiri', [-2, 4, 0], 'Views pulih ke 50 ribu, dan 6 ribu orang bergabung ke kanal milikmu yang tidak bergantung algoritma.', true),
          o('Istirahat sebulan. Audiens yang loyal akan menunggu kamu kembali', [-4, -6, 8], 'Kamu segar kembali, tapi brand pergi dan algoritma "melupakan" akunmu.'),
        ],
        lesson: 'Pinjam audiens di platform, miliki audiens di kanal sendiri. Diversifikasi platform + data, bukan panik.',
      },
      {
        title: 'Kontrak eksklusif 6 bulan',
        situation: 'Sebuah brand skincare menawarkan Rp60 juta untuk 6 bulan, dengan syarat eksklusif di semua kategori kecantikan dan perawatan diri, serta hak memakai wajahmu di iklan tanpa batas waktu.',
        options: [
          o('Tanda tangan sekarang. Rp60 juta pasti lebih besar dari total deal lain 6 bulan ke depan', [60, -3, -2], 'Setelah tanda tangan, kamu menolak 4 tawaran lain senilai total Rp45 juta, dan wajahmu masih dipakai di iklan setahun kemudian tanpa bayaran.'),
          o('Negosiasi cakupan eksklusivitas & batas waktu hak pakai iklan', [70, 4, 2], 'Brand setuju di Rp70 juta dengan cakupan lebih sempit. Kamu tetap bisa menerima brand lain di luar kategori.', true),
          o('Tolak. Kebebasan memilih brand lebih penting daripada satu kontrak besar', [0, 0, 2], 'Kamu kehilangan pemasukan stabil yang sebenarnya bisa dinegosiasikan.'),
        ],
        lesson: 'Dalam kontrak creator, yang paling mahal adalah cakupan eksklusivitas dan hak pakai konten. Semua bisa dinegosiasikan. Baca, atau minta orang yang paham hukum membaca, sebelum tanda tangan.',
      },
    ],
    blueprint: {
      prioritas: ['Rate card & kontrak standar', 'Kanal milik sendiri (newsletter/WA channel)', 'Produksi tetap jalan tanpa kamu mengedit'],
      rekrutSekarang: ['Manajer talent / brand partnership (komisi 10–20%)'],
      rekrutNanti: ['Editor kedua', 'Ahli riset konten / scriptwriter'],
      operasional: ['Mingguan: kalender konten + slot brand', 'Setiap kampanye: brief, kontrak, laporan hasil', 'Bulanan: analisis performa per format & platform', 'Kuartalan: update rate card'],
      modal: [{ pos: 'Gaji tim', pct: 40 }, { pos: 'Alat produksi', pct: 15 }, { pos: 'Kanal milik sendiri (tools email/komunitas)', pct: 5 }, { pos: 'Konsultasi hukum kontrak', pct: 5 }, { pos: 'Dana darurat', pct: 35 }],
      kpi: [{ name: 'Rata-rata nilai deal', target: 'naik 30%' }, { name: 'Repeat brand', target: '≥40%' }, { name: 'Audiens di kanal milik sendiri', target: '≥5% dari followers' }, { name: 'Penghasilan bulanan', target: '≥Rp40 juta' }],
      risiko: ['Algoritma platform', 'Kontrak yang merugikan', 'Burnout talent'],
      naikLevel: ['Penghasilan ≥Rp50 juta/bulan dari ≥3 sumber', 'Audiens di ≥2 platform', 'Tim produksi berjalan tanpa kamu mengedit'],
    },
  },
  {
    industry: 'creator', level: 'skala',
    title: 'Media brand dengan 12 orang & roster creator',
    persona: 'Kamu mengelola media brand edukasi bisnis dengan 4 creator dalam roster dan 12 staf. Pendapatan ±Rp240 juta/bulan, 80% dari sponsor. Investor menyarankan kamu membuat produk sendiri.',
    modal: 'Kas Rp260 juta',
    team: ['Kamu (CEO & talent utama)', '4 creator roster', 'Head of content', '3 editor', 'Sales sponsor', 'Admin keuangan', 'Community manager'],
    start: { kas: 260, reputasi: 70, tim: 58 },
    decisions: [
      {
        title: 'Produk sendiri atau tetap sponsor?',
        situation: '80% pendapatan dari sponsor membuatmu rentan saat brand memotong anggaran iklan. Ide produk: kelas online/merchandise/aplikasi.',
        options: [
          o('Bangun aplikasi sendiri. Platform milik sendiri = data & pendapatan berulang', [-200, 0, -10], 'Pengembangan molor 8 bulan dan biaya membengkak. Audiens tidak terlalu butuh aplikasi.'),
          o('Survei audiens, lalu jual kelas cohort lewat pre-order sebelum produksi', [80, 6, -4], '410 orang membayar di muka (±Rp205 juta). Produk dibiayai pembeli, dan pendapatan tidak lagi 80% dari sponsor.', true),
          o('Tetap sponsor. Itu yang sudah terbukti, jangan bereksperimen di skala ini', [0, -2, 2], 'Saat dua brand besar memangkas anggaran di kuartal berikutnya, pendapatanmu turun 35%.'),
        ],
        lesson: 'Audiens yang percaya adalah distribusi. Validasi produk dengan pre-order sebelum membangun. Diversifikasi pendapatan melindungi media brand dari siklus anggaran iklan.',
      },
      {
        title: 'Bagi hasil dengan creator roster',
        situation: 'Creator roster terbaikmu ingin keluar dan membuat channel sendiri, karena merasa bagi hasilnya tidak adil.',
        options: [
          o('Tegaskan isi kontrak. Bagi hasil sudah disepakati, perusahaan juga menanggung biaya', [0, -8, -12], 'Ia tetap keluar dengan cerita buruk tentang perusahaanmu, dan creator lain jadi waspada.'),
          o('Buka angka biaya & pendapatan, lalu ubah ke bagi hasil berbasis performa', [-15, 6, 12], 'Ia bertahan dan justru membawa creator baru ke roster.', true),
          o('Biarkan keluar dan rekrut creator baru. Formatnya milik perusahaan, bukan pribadi', [-20, -3, -6], 'Penggantinya butuh 6 bulan untuk mencapai performa yang sama.'),
        ],
        lesson: 'Bisnis talent dibangun di atas keadilan yang terlihat. Transparansi + insentif berbasis performa mempertahankan orang lebih baik daripada ancaman kontrak.',
      },
      {
        title: 'Konten blunder viral',
        situation: 'Satu video dari tim berisi data bisnis yang salah dan menyinggung kelompok tertentu. Video sudah ditonton 500 ribu kali dan komentar memanas.',
        options: [
          o('Hapus video secepatnya. Makin lama tayang, makin besar kerusakannya', [0, -10, -3], 'Tangkapan layar beredar dan orang menganggapmu kabur.'),
          o('Takedown, minta maaf spesifik, koreksi data, perbaiki proses cek fakta', [-5, 5, 2], 'Kritik mereda dalam 3 hari. Banyak yang menghargai cara kalian bertanggung jawab.', true),
          o('Buat video klarifikasi yang menjelaskan konteks dan maksud asli konten itu', [0, -16, -4], 'Dua sponsor menangguhkan kerja sama.'),
        ],
        lesson: 'Media brand hidup dari kepercayaan. Proses cek fakta sebelum tayang + permintaan maaf yang spesifik saat salah adalah bagian dari operasional, bukan pilihan.',
      },
    ],
    blueprint: {
      prioritas: ['Pendapatan non-sponsor ≥30%', 'Skema bagi hasil creator yang transparan', 'Proses editorial & cek fakta'],
      rekrutSekarang: ['Product/program manager (kelas & produk)', 'Head of partnership'],
      rekrutNanti: ['Talent manager', 'Data & growth analyst'],
      operasional: ['Harian: kalender tayang & review editorial', 'Mingguan: pipeline sponsor & performa konten', 'Bulanan: laporan pendapatan per kanal & per creator', 'Kuartalan: review kontrak creator'],
      modal: [{ pos: 'SDM & talent', pct: 40 }, { pos: 'Pengembangan produk (setelah pre-order)', pct: 20 }, { pos: 'Produksi & alat', pct: 10 }, { pos: 'Hukum & kontrak', pct: 5 }, { pos: 'Dana darurat', pct: 25 }],
      kpi: [{ name: 'Porsi pendapatan non-sponsor', target: '≥30%' }, { name: 'Retensi creator roster', target: '≥90%/tahun' }, { name: 'Konversi audiens ke pembeli', target: '≥1%' }, { name: 'Net margin', target: '≥20%' }],
      risiko: ['Ketergantungan pada sponsor', 'Talent kunci keluar', 'Krisis reputasi'],
      naikLevel: ['Produk sendiri untung', '≥3 creator dengan pendapatan stabil', 'Manajemen berjalan tanpa CEO sebagai talent utama'],
    },
  },
];
