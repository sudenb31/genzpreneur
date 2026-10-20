import type { SimScenarioContent } from './types';
import { o } from './helpers';

export const DIGITAL_SERVICES: SimScenarioContent[] = [
  {
    industry: 'digital_services', level: 'rintis',
    title: 'Freelancer social media & desain',
    persona: 'Kamu bisa desain dan mengelola Instagram. Ada 2 klien UMKM (kedai kopi dan toko hijab), masing-masing membayar Rp600rb/bulan. Kamu hampir tiap malam lembur karena revisi.',
    modal: 'Kas Rp2 juta + laptop',
    team: ['Kamu (desain, copywriting, posting, laporan)'],
    start: { kas: 2, reputasi: 50, tim: 55 },
    decisions: [
      {
        title: 'Revisi tanpa batas',
        situation: 'Klien kedai kopi meminta revisi desain ke-7 untuk satu postingan, lewat chat jam 11 malam. Kalian tidak punya kontrak tertulis.',
        options: [
          o('Kerjakan dulu. Klien pertama yang puas adalah portofolio dan sumber referral', [0, 2, -12], 'Klien senang, tapi kamu kehabisan waktu untuk klien lain dan mulai telat posting.'),
          o('Kirim ringkasan layanan tertulis: jumlah konten, batas revisi, dan jam kerja', [0.3, 3, 10], 'Klien awalnya kaget tapi setuju. Revisi berkurang drastis karena brief jadi lebih jelas.', true),
          o('Bilang revisi berikutnya berbayar tanpa penjelasan lain, biar klien belajar menghargai', [0, -8, 3], 'Klien memutus kerja sama dan bercerita ke pemilik usaha lain di komunitasnya.'),
        ],
        lesson: 'Batas layanan yang tertulis melindungi kedua pihak. Klien yang baik menghargai kejelasan, dan revisi tanpa batas biasanya tanda brief yang buruk.',
      },
      {
        title: 'Harga terlalu murah?',
        situation: 'Calon klien ketiga, klinik kecantikan, bertanya harga. Di marketplace jasa, banyak penawaran "kelola IG Rp300rb/bulan".',
        options: [
          o('Rp400rb dulu untuk dapat klien, harga dinaikkan setelah ada hasil', [0.4, 0, -8], 'Kamu dapat kliennya, tapi bekerja dengan bayaran di bawah upah wajar per jam.'),
          o('Tawarkan 3 paket berbasis hasil, lengkap dengan contoh & laporan', [2.5, 4, 2], 'Klinik memilih paket Growth. Satu klien dengan harga layak setara empat klien murah, tanpa tambahan beban kerja.', true),
          o('Pasang Rp5 juta. Harga tinggi membuat kamu terlihat seperti agensi profesional', [0, -2, 0], 'Calon klien mundur karena tidak ada bukti yang menjustifikasi harga.'),
        ],
        lesson: 'Jasa dijual berdasarkan hasil yang dibayangkan klien, bukan jam kerjamu. Paket + bukti + laporan mengubah perbandingan harga menjadi perbandingan nilai.',
      },
      {
        title: 'Kebanjiran klien',
        situation: 'Empat klien aktif sekaligus. Kamu tidur 4 jam per malam dan dua jadwal posting terlewat minggu ini.',
        options: [
          o('Bertahan sendiri dulu. Merekrut orang berarti margin turun dan kualitas tidak terkontrol', [1, -6, -15], 'Kualitas turun, satu klien berhenti, dan kamu sakit seminggu.'),
          o('Subkontrak desain ke freelancer junior dengan template per klien', [-1, 5, 10], 'Kualitas stabil, margin tetap ±60%, dan kamu punya waktu mencari klien yang lebih besar.', true),
          o('Lepas klien termurah minggu ini juga supaya kualitas klien lain terjaga', [-0.4, -7, 5], 'Klien itu merasa ditinggalkan dan memberi ulasan buruk.'),
        ],
        lesson: 'Rekrutmen pertama di bisnis jasa biasanya untuk pekerjaan yang paling bisa distandarkan (desain berdasarkan template). Simpan untukmu pekerjaan bernilai tertinggi: strategi dan relasi.',
      },
    ],
    blueprint: {
      prioritas: ['Paket layanan & harga tertulis', 'Kontrak sederhana + batas revisi', '3 studi kasus dengan angka (reach, leads, penjualan)'],
      rekrutSekarang: ['Desainer junior freelance (per konten)'],
      rekrutNanti: ['Content writer/caption — saat 6+ klien', 'Account executive — saat ingin klien menengah'],
      operasional: ['Senin: kalender konten semua klien', 'Harian: posting & membalas klien di jam kerja', 'Akhir bulan: laporan hasil per klien (1 halaman)', 'Invoice di muka setiap tanggal 1'],
      modal: [{ pos: 'Tools (desain, penjadwalan)', pct: 20 }, { pos: 'Subkontrak freelancer', pct: 30 }, { pos: 'Portofolio & presentasi', pct: 10 }, { pos: 'Kursus/skill', pct: 10 }, { pos: 'Dana darurat', pct: 30 }],
      kpi: [{ name: 'Pendapatan per klien', target: '≥Rp1,5 juta/bulan' }, { name: 'Jam kerja per klien', target: '<20 jam/bulan' }, { name: 'Retensi klien', target: '≥3 bulan' }, { name: 'Invoice dibayar di muka', target: '100%' }],
      risiko: ['Underpricing', 'Revisi tanpa batas', 'Burnout karena mengerjakan semuanya sendiri'],
      naikLevel: ['Pendapatan ≥Rp10 juta/bulan dari ≥4 klien', 'Ada 1–2 freelancer andal & template kerja', '2 studi kasus dengan hasil terukur'],
    },
  },
  {
    industry: 'digital_services', level: 'tumbuh',
    title: 'Agensi kecil: 6 orang, 9 klien retainer',
    persona: 'Agensimu mengelola konten & iklan untuk 9 klien dengan total retainer Rp58 juta/bulan. Satu klien properti menyumbang 40% pendapatan. Tim 6 orang, dan kamu masih mereview semua konten sebelum tayang.',
    modal: 'Kas Rp35 juta',
    team: ['Kamu (founder, strategi, sales)', '2 desainer', '1 videografer/editor', '1 copywriter', '1 account manager'],
    start: { kas: 35, reputasi: 60, tim: 55 },
    decisions: [
      {
        title: 'Klien terbesar minta diskon 30%',
        situation: 'Klien properti (Rp23 juta/bulan) meminta diskon 30% karena "anggaran dipotong". Kalau mereka pergi, kamu harus memotong 2 orang.',
        options: [
          o('Setuju diskon 30%. Kehilangan klien 40% pendapatan jauh lebih berbahaya', [-7, 0, -8], 'Tim mengerjakan pekerjaan yang sama untuk bayaran lebih kecil. Klien lain mendengar dan ikut menawar.'),
          o('Tawarkan paket ramping (harga & lingkup turun), sambil kejar 2 klien baru', [-4.6, 4, 2], 'Klien memilih paket ramping. Dalam 2 bulan masuk 2 klien baru, dan ketergantunganmu turun ke 28%.', true),
          o('Tolak dan pertahankan harga. Klien yang menawar sekarang akan menawar terus', [-23, -3, -10], 'Klien pergi. Kamu terpaksa memotong 2 orang, dan moral tim jatuh.'),
        ],
        lesson: 'Jangan potong harga tanpa memotong lingkup kerja. Konsentrasi klien di atas 25–30% pendapatan adalah risiko eksistensial, jadi diversifikasi harus menjadi target bulanan.',
      },
      {
        title: 'Rekrut 1 senior atau 2 junior?',
        situation: 'Kualitas mulai tidak konsisten. Anggaran gaji tambahan Rp9 juta/bulan: cukup untuk 1 senior content strategist atau 2 junior.',
        options: [
          o('2 junior. Output dua kali lipat, dan junior bisa dibentuk sesuai budaya tim', [0, -3, -4], 'Output naik, tapi kamu tetap mereview semuanya. Bottleneck-nya tetap kamu.'),
          o('1 senior yang memegang standar kualitas & membuat playbook', [0, 5, 6], 'Dalam 2 bulan kamu berhenti mereview semua konten. Senior memegang QC dan melatih tim.', true),
          o('Tunda rekrut 3 bulan sampai kas lebih tebal. Kamu tutup kekurangannya sendiri', [0, -2, -10], 'Kamu jadi bottleneck yang makin parah, dan telat tayang meningkat.'),
        ],
        lesson: 'Di bisnis jasa, rekrut untuk melepaskan bottleneck, bukan sekadar menambah tenaga. Satu orang senior + sistem bisa melipatgandakan kualitas tim yang ada.',
      },
      {
        title: 'Klien telat bayar 60 hari',
        situation: 'Dua klien telat bayar total Rp14 juta. Satu dari mereka tetap minta konten bulan ini.',
        options: [
          o('Tetap kerjakan. Mereka klien lama, dan menagih keras bisa merusak hubungan', [-6, 1, -5], 'Piutang makin besar. Kamu harus menalangi gaji dari kas darurat.'),
          o('Terapkan kebijakan tagihan tertulis: invoice di muka, jeda layanan di H+30', [8, 2, 3], 'Satu klien langsung melunasi dan satu menyetujui cicilan. Klien baru menerima kebijakan ini sejak awal.', true),
          o('Hentikan semua pekerjaan hari ini dan kirim somasi lewat pengacara', [0, -12, -2], 'Biaya pengacara keluar, kedua klien merasa dipermalukan dan pergi, dan kabarnya menyebar di komunitas pemilik usaha.'),
        ],
        lesson: 'Arus kas jasa dijaga oleh kebijakan penagihan yang konsisten dan tertulis sejak awal, bukan oleh drama ketika telat.',
      },
    ],
    blueprint: {
      prioritas: ['Tidak ada klien >25% pendapatan', 'Playbook kualitas yang tidak bergantung pada founder', 'Kebijakan penagihan tertulis'],
      rekrutSekarang: ['Senior content strategist / creative lead', 'Admin keuangan part-time'],
      rekrutNanti: ['Performance marketer (ads)', 'Sales/business development'],
      operasional: ['Senin: rapat status semua klien (dashboard)', 'Harian: alur kerja di tools manajemen proyek', 'Akhir bulan: laporan hasil & invoice bulan berikutnya', 'Kuartalan: review harga & profitabilitas per klien'],
      modal: [{ pos: 'Gaji (cadangan 2 bulan)', pct: 45 }, { pos: 'Tools & software', pct: 10 }, { pos: 'Akuisisi klien (konten, event, proposal)', pct: 15 }, { pos: 'Pelatihan tim', pct: 5 }, { pos: 'Dana darurat', pct: 25 }],
      kpi: [{ name: 'Konsentrasi klien terbesar', target: '<25%' }, { name: 'Utilisasi tim', target: '70–80%' }, { name: 'Hari piutang', target: '<15 hari' }, { name: 'Margin kotor proyek', target: '≥50%' }],
      risiko: ['Kehilangan klien besar', 'Founder bottleneck di review', 'Piutang menumpuk'],
      naikLevel: ['Pendapatan retainer ≥Rp120 juta/bulan', 'Founder tidak lagi mereview konten harian', '≥2 kanal akuisisi klien yang konsisten'],
    },
  },
  {
    industry: 'digital_services', level: 'skala',
    title: 'Agensi 20 orang di era AI',
    persona: 'Agensimu punya 20 orang dan retainer ±Rp260 juta/bulan. Klien mulai bertanya, "Kenapa bayar mahal kalau AI bisa bikin konten?" Satu account director senior juga mulai dilirik kompetitor.',
    modal: 'Kas Rp220 juta',
    team: ['Kamu (CEO)', 'Creative director', 'Account director', '2 account manager', '10 kreatif (desain, video, copy)', '2 performance marketer', 'Finance & HR'],
    start: { kas: 220, reputasi: 68, tim: 55 },
    decisions: [
      {
        title: 'Klien menekan harga karena AI',
        situation: 'Tiga klien meminta potongan 25% karena "AI bisa bikin konten". Tim produksimu masih bekerja manual.',
        options: [
          o('Beri potongan 25% ke klien yang meminta saja, supaya mereka tidak pindah', [-65, 0, -8], 'Margin hancur. Tim tetap bekerja manual dengan target yang sama.'),
          o('Latih tim pakai AI, potong waktu produksi, jual paket berbasis hasil', [-15, 7, 4], 'Waktu produksi turun, margin justru naik, dan klien membayar untuk hasil, bukan jumlah postingan.', true),
          o('Tegaskan nilai kerja manusia. Klien yang pergi karena AI bukan klien ideal', [0, -6, -3], 'Kompetitor yang memakai AI menawarkan harga 40% lebih murah dan merebut 2 klien.'),
        ],
        lesson: 'Teknologi baru mengubah apa yang dibayar klien. Pindah dari menjual output (jumlah konten) ke menjual hasil (leads, penjualan, brand) yang dibantu teknologi.',
      },
      {
        title: 'Produktisasi layanan',
        situation: 'Setiap klien memakai proses berbeda. Onboarding klien baru butuh 3 minggu dan banyak kesalahan.',
        options: [
          o('Tetap custom. Fleksibilitas adalah alasan klien memilih agensi kecil', [0, -2, -6], 'Skala tetap mahal dan tim kelelahan dengan proses yang selalu berbeda.'),
          o('Buat 3 paket standar + SOP; custom tetap ada dengan harga premium', [-8, 5, 8], 'Onboarding turun ke 5 hari. Sales lebih mudah menjual karena paketnya jelas.', true),
          o('Hanya terima klien paket standar mulai bulan depan supaya operasional rapi', [0, -4, 3], 'Proses rapi, tapi kamu kehilangan klien besar yang membutuhkan custom.'),
        ],
        lesson: 'Skala di bisnis jasa datang dari produktisasi: paket standar + SOP + template. Custom tetap boleh, asalkan harganya mencerminkan biayanya.',
      },
      {
        title: 'Account director dibajak kompetitor',
        situation: 'Account director-mu (memegang 4 klien, ±Rp90 juta/bulan) ditawari gaji +40% oleh kompetitor.',
        options: [
          o('Lepas dengan baik. Menahan orang dengan uang hanya menunda kepergiannya', [-30, -5, -8], 'Dua klien ikut pindah karena hubungan mereka ada di orang itu, bukan di perusahaan.'),
          o('Tawarkan jalur karier & bonus retensi, dan pasang 2 PIC di setiap klien', [-18, 3, 8], 'Ia bertahan dengan paket baru. Risiko kehilangan klien karena satu orang turun drastis.', true),
          o('Kontra-tawar gaji +60% hari ini juga. Kehilangan Rp90 juta/bulan terlalu mahal', [-40, 0, -4], 'Ia bertahan, tapi rekan lain merasa tidak adil dan meminta kenaikan juga.'),
        ],
        lesson: 'Relasi klien harus dimiliki perusahaan, bukan individu: dokumentasi akun, dua PIC per klien, dan insentif berbasis retensi. Retensi talenta = jalur karier + keadilan, bukan sekadar gaji.',
      },
    ],
    blueprint: {
      prioritas: ['Produktisasi layanan & harga berbasis hasil', 'Integrasi AI ke alur produksi', 'Relasi klien milik perusahaan'],
      rekrutSekarang: ['Head of operations / delivery', 'AI & automation specialist'],
      rekrutNanti: ['Head of sales', 'Data/analytics lead'],
      operasional: ['Mingguan: dashboard hasil klien & utilisasi', 'Bulanan: profitabilitas per klien & per paket', 'Kuartalan: business review dengan setiap klien', 'Setiap klien: 2 PIC + dokumentasi akun'],
      modal: [{ pos: 'Gaji & retensi talenta', pct: 45 }, { pos: 'Tools AI & sistem', pct: 10 }, { pos: 'Pelatihan', pct: 5 }, { pos: 'Pemasaran agensi (studi kasus, event)', pct: 10 }, { pos: 'Dana darurat', pct: 30 }],
      kpi: [{ name: 'Pendapatan per karyawan', target: '≥Rp13 juta/bulan' }, { name: 'Retensi klien', target: '≥85%/tahun' }, { name: 'Waktu onboarding', target: '≤5 hari' }, { name: 'Net margin', target: '≥18%' }],
      risiko: ['Komoditisasi oleh AI', 'Ketergantungan pada individu kunci', 'Ekspansi layanan tanpa standar'],
      naikLevel: ['3 paket standar menyumbang ≥60% pendapatan', 'Net margin ≥18% selama 2 kuartal', 'Kepala divisi memegang target sendiri'],
    },
  },
];
