import type { SimScenario } from './types';
import { o } from './helpers';

export const TECH: SimScenario[] = [
  {
    industry: 'tech', level: 'rintis',
    title: 'Aplikasi manajemen kos dari nol',
    persona: 'Kamu melihat pemilik kos di sekitar kampus mencatat pembayaran di buku dan WhatsApp. Kamu bisa sedikit coding dan paham alat no-code. Ide: aplikasi tagihan & laporan kos.',
    modal: 'Kas Rp5 juta + laptop',
    team: ['Kamu (produk, coding, jualan)', 'Teman desainer (sukarela)'],
    start: { kas: 5, reputasi: 50, tim: 70 },
    decisions: [
      {
        title: 'Bangun lengkap atau MVP?',
        situation: 'Kamu punya daftar 25 fitur: tagihan, laporan, chat penghuni, peta kos, marketplace laundry, dan lainnya.',
        options: [
          o('Bangun versi lengkap dulu. Pengguna tidak akan kembali kalau kesan pertamanya buruk', [-3, -2, -12], 'Enam bulan kemudian ternyata pemilik kos hanya butuh 3 fitur, dan dua di antaranya kamu buat dengan cara yang tidak mereka mau.'),
          o('Wawancara 15 pemilik kos, buat MVP 2 minggu, uji ke 5 pengguna', [-0.5, 5, 0], 'Empat dari lima pemakai aktif setiap minggu. Kamu tahu fitur kedua yang benar-benar diminta: pengingat telat bayar.', true),
          o('Buat landing page & kumpulkan 100 pendaftar sebelum mulai coding', [-0.3, 0, 2], '50 orang mendaftar, tapi kamu tidak tahu apakah mereka akan memakai atau membayar.'),
        ],
        lesson: 'Produk teknologi gagal paling sering karena membangun hal yang tidak dibutuhkan. Bicara dengan pengguna, buat MVP terkecil yang menyelesaikan 1 masalah, ukur pemakaian nyata.',
      },
      {
        title: 'Gratis atau berbayar?',
        situation: 'Lima pemilik kos memakai MVP-mu. Kamu ragu meminta bayaran.',
        options: [
          o('Gratis dulu sampai 1.000 pengguna. Monetisasi setelah product-market fit', [0, 1, -4], 'Pengguna bertambah, tapi tidak ada sinyal apakah mereka mau membayar. Biaya server mulai terasa.'),
          o('Pilot berbayar Rp49rb/bulan setelah 1 bulan gratis', [0.8, 3, 2], 'Tiga dari lima membayar setelah bulan gratis. Itu bukti pertama bahwa masalahnya cukup sakit.', true),
          o('Pasang Rp500rb/bulan. Harga tinggi menyaring pelanggan serius', [0, -3, 0], 'Tidak ada yang membayar, dan kamu tidak belajar apa-apa tentang harga yang tepat.'),
        ],
        lesson: 'Pembayaran adalah validasi terkuat. Harga pilot yang wajar + janji nilai yang jelas memberi sinyal apakah bisnisnya nyata.',
      },
      {
        title: 'Biaya teknis tak terduga',
        situation: 'Tagihan layanan WhatsApp API & server naik karena pemakaian. Biaya ini memakan 60% pendapatan.',
        options: [
          o('Biarkan dulu. Biaya per pengguna akan turun sendiri seiring skala', [-1.5, 0, -2], 'Biaya naik seiring pengguna. Kamu rugi di setiap pelanggan baru.'),
          o('Hitung biaya per pelanggan, kurangi pesan, harga sesuai jumlah kamar', [0.6, 1, 0], 'Biaya per pelanggan turun 55%. Paket berbasis jumlah kamar terasa adil bagi pemilik kos.', true),
          o('Matikan pengingat WA dan ganti notifikasi email yang gratis', [0.4, -5, 0], 'Fitur yang paling disukai hilang, dan dua pelanggan berhenti.'),
        ],
        lesson: 'Software juga punya HPP: server, API, dan dukungan. Pahami unit economics per pelanggan sejak awal, dan rancang harga mengikuti nilai + biaya.',
      },
    ],
    blueprint: {
      prioritas: ['1 masalah yang jelas & MVP terkecil', '10 pengguna yang membayar', 'Unit economics per pelanggan'],
      rekrutSekarang: ['Belum perlu. Pakai alat no-code & freelancer'],
      rekrutNanti: ['Developer part-time — saat ≥30 pelanggan berbayar', 'Customer success (onboarding)'],
      operasional: ['Mingguan: wawancara 3 pengguna', 'Mingguan: rilis 1 perbaikan kecil', 'Bulanan: cek aktivasi, retensi, dan biaya per pelanggan', 'Setiap pelanggan baru: onboarding langsung 15 menit'],
      modal: [{ pos: 'Server & layanan API', pct: 25 }, { pos: 'Tools no-code/dev', pct: 20 }, { pos: 'Riset pengguna & promosi', pct: 15 }, { pos: 'Dana darurat', pct: 40 }],
      kpi: [{ name: 'Pengguna aktif mingguan', target: '≥70% pelanggan' }, { name: 'Pelanggan berbayar', target: '≥10' }, { name: 'Churn bulanan', target: '<5%' }, { name: 'Margin kotor per pelanggan', target: '≥60%' }],
      risiko: ['Membangun fitur yang tidak dibutuhkan', 'Biaya teknis tak terkendali', 'Founder sendirian'],
      naikLevel: ['≥30 pelanggan berbayar dengan churn <5%', 'MRR ≥Rp3 juta', 'Bukti channel akuisisi yang berulang'],
    },
  },
  {
    industry: 'tech', level: 'tumbuh',
    title: 'Startup SaaS: MRR Rp18 juta, tim 5 orang',
    persona: 'Aplikasimu dipakai 280 pemilik kos & properti kecil. MRR Rp18 juta. Kamu mendapat pendanaan angel Rp100 juta, dan tim terdiri dari 5 orang. Churn bulanan 11%.',
    modal: 'Kas Rp110 juta',
    team: ['Kamu (CEO/produk)', '2 developer', '1 customer success', '1 marketing'],
    start: { kas: 110, reputasi: 60, tim: 60 },
    decisions: [
      {
        title: 'Kejar pertumbuhan atau perbaiki churn?',
        situation: 'Investor ingin MRR naik 3× dalam 6 bulan. Churn 11% berarti hampir separuh pelanggan hilang dalam 6 bulan.',
        options: [
          o('Pakai Rp60 juta untuk iklan. Investor ingin pertumbuhan, dan iklan paling cepat', [-60, -2, -6], 'Pelanggan baru masuk, tapi cepat pergi juga. MRR hampir tidak naik, dan kas terkuras.'),
          o('Telepon pelanggan yang berhenti, perbaiki onboarding, baru akselerasi', [-10, 6, 4], 'Churn turun ke 4,5% dalam 3 bulan. Iklan setelah itu jauh lebih efektif karena pelanggan bertahan.', true),
          o('Turunkan harga 50% supaya pelanggan tidak punya alasan berhenti', [-9, -1, -2], 'Churn hanya turun sedikit karena masalahnya bukan harga, dan pendapatan turun.'),
        ],
        lesson: 'Menambah pelanggan ke ember bocor membuang uang. Perbaiki retensi dan aktivasi dulu, baru akselerasi akuisisi.',
      },
      {
        title: 'Rekrutmen berikutnya',
        situation: 'Anggaran untuk 2 orang. Developer ingin menambah 2 engineer; CS kewalahan dengan 280 pelanggan.',
        options: [
          o('2 engineer. Produk yang lebih lengkap akan mengurangi churn dengan sendirinya', [-30, -2, -2], 'Fitur bertambah, tapi pelanggan baru tetap kesulitan memakai, dan CS burnout.'),
          o('1 engineer + 1 CS/sales hybrid untuk onboarding & paket tahunan', [-30, 5, 6], 'Aktivasi naik, 40 pelanggan pindah ke paket tahunan (kas masuk di muka), dan roadmap tetap jalan.', true),
          o('Tidak rekrut dulu. Simpan kas, tim yang ada kerja lebih keras sementara', [0, -3, -14], 'Tim kelelahan dan satu developer resign.'),
        ],
        lesson: 'Di SaaS tahap tumbuh, distribusi & retensi sama pentingnya dengan teknologi. Paket tahunan memperbaiki arus kas.',
      },
      {
        title: 'Klien besar minta fitur custom',
        situation: 'Pengelola 40 kos meminta fitur custom laporan pajak & multi-cabang. Mereka akan membayar Rp3 juta/bulan, tapi butuh 2 bulan kerja developer.',
        options: [
          o('Bangun persis sesuai permintaan. Rp3 juta/bulan itu 17% MRR', [3, 1, -8], 'Fitur hanya cocok untuk satu klien. Roadmap untuk 280 pelanggan lain terhenti 2 bulan.'),
          o('Bangun versi umum multi-properti sebagai paket Pro, klien ini pembeli pertama', [6, 4, -2], 'Paket Pro dibeli 25 pelanggan lain dalam 3 bulan. Satu fitur menjadi lini pendapatan baru.', true),
          o('Tolak. Fitur custom akan merusak fokus roadmap untuk 280 pelanggan lain', [0, -2, 2], 'Klien besar memilih aplikasi kompetitor.'),
        ],
        lesson: 'Permintaan klien besar adalah sinyal, bukan perintah. Bangun solusi yang bisa dipakai banyak pelanggan, jangan biarkan satu klien menulis roadmap-mu.',
      },
    ],
    blueprint: {
      prioritas: ['Churn <5% & aktivasi yang tinggi', 'Paket harga (bulanan, tahunan, Pro)', 'Runway ≥12 bulan'],
      rekrutSekarang: ['Customer success/sales hybrid', 'Engineer ketiga'],
      rekrutNanti: ['Growth marketer', 'Product designer'],
      operasional: ['Harian: monitor error & tiket dukungan', 'Mingguan: metrik aktivasi, churn, MRR', 'Dua mingguan: rilis produk', 'Bulanan: wawancara pelanggan yang berhenti'],
      modal: [{ pos: 'Gaji tim', pct: 55 }, { pos: 'Infrastruktur', pct: 10 }, { pos: 'Akuisisi pelanggan', pct: 10 }, { pos: 'Tools & keamanan', pct: 5 }, { pos: 'Dana darurat / runway', pct: 20 }],
      kpi: [{ name: 'MRR growth', target: '≥10%/bulan' }, { name: 'Churn bulanan', target: '<5%' }, { name: 'Aktivasi (setup selesai 7 hari)', target: '≥70%' }, { name: 'Runway', target: '≥12 bulan' }],
      risiko: ['Kehabisan kas sebelum product-market fit', 'Churn tinggi', 'Roadmap dikendalikan satu klien'],
      naikLevel: ['MRR ≥Rp80 juta dengan churn <4%', 'Kanal akuisisi yang bisa diprediksi', 'Siap untuk pendanaan seed / profitabilitas'],
    },
  },
  {
    industry: 'tech', level: 'skala',
    title: 'SaaS dengan dana seed, 16 orang',
    persona: 'Kamu baru menerima dana seed Rp800 juta. MRR Rp120 juta, 16 orang, dan 2.000 pelanggan menyimpan data penghuni (nama, nomor HP, KTP) di sistemmu.',
    modal: 'Kas Rp800 juta',
    team: ['Kamu (CEO)', 'CTO + 6 engineer', 'Head of growth', '3 sales & CS', 'Finance & HR', 'Product designer'],
    start: { kas: 800, reputasi: 70, tim: 60 },
    decisions: [
      {
        title: 'Burn rate & runway',
        situation: 'Tim ingin merekrut 12 orang sekaligus agar pertumbuhan lebih cepat. Burn rate akan naik dari Rp60 juta ke Rp180 juta/bulan.',
        options: [
          o('Rekrut 12 orang sekarang. Dana seed memang untuk mempercepat pertumbuhan', [-300, 0, -10], 'Runway turun ke 5 bulan. Kamu harus fundraising dalam kondisi terdesak.'),
          o('Rekrut bertahap terkait milestone, jaga runway ≥18 bulan', [-120, 4, 4], 'Pertumbuhan stabil dan kamu fundraising dari posisi kuat setelah 12 bulan.', true),
          o('Bekukan rekrutmen setahun supaya runway sepanjang mungkin', [0, -2, -8], 'Tim kewalahan dan target yang dijanjikan ke investor terlewat.'),
        ],
        lesson: 'Dana investor bukan pendapatan. Hubungkan rekrutmen dengan milestone, jaga runway 18–24 bulan, dan hitung setiap posisi dari dampaknya.',
      },
      {
        title: 'Insiden keamanan data',
        situation: 'Peneliti keamanan melaporkan celah yang memungkinkan data penghuni (termasuk foto KTP) diakses tanpa login.',
        options: [
          o('Tambal celah malam ini juga, tanpa pengumuman supaya pelanggan tidak panik', [-10, -6, -2], 'Celah ditambal, tapi belakangan muncul bukti data sempat diakses. Pelanggan marah karena tidak diberi tahu.'),
          o('Tutup celah, investigasi log, beri tahu yang terdampak sesuai UU PDP, audit', [-60, 5, 2], 'Penanganan profesional menjaga kepercayaan. Audit menemukan 3 celah lain yang langsung diperbaiki.', true),
          o('Minta pelapor menandatangani perjanjian kerahasiaan sebelum celah dibahas', [0, -15, -4], 'Pelapor menolak dan memublikasikan temuannya. Publik melihatmu sedang menutupi masalah, dan investor mempertanyakan tata kelolamu.'),
        ],
        lesson: 'Data pribadi (apalagi KTP) adalah tanggung jawab hukum dan etika. Siapkan prosedur insiden, minimalkan data yang disimpan, dan hargai pelapor keamanan.',
      },
      {
        title: 'Ekspansi produk atau pasar?',
        situation: 'Ada dua jalan: masuk segmen apartemen/properti menengah, atau membuat fitur pembayaran (fintech) yang membutuhkan izin dari regulator.',
        options: [
          o('Bangun fitur pembayaran sendiri. Fintech adalah sumber pendapatan terbesar', [-200, -4, -8], 'Proses perizinan panjang dan tim terdistraksi dari produk inti.'),
          o('Masuk segmen properti menengah; pembayaran lewat mitra berizin', [-80, 5, 2], 'Segmen baru menyumbang 30% MRR dalam setahun. Fitur pembayaran tersedia lewat mitra tanpa beban perizinan.', true),
          o('Tahan ekspansi, fokus optimasi produk inti sampai MRR 2×', [0, -2, 0], 'Pertumbuhan melambat dan investor gelisah.'),
        ],
        lesson: 'Ekspansi ke tempat keunggulanmu bisa dipakai ulang. Untuk area yang diatur ketat seperti pembayaran, bermitra dengan pemain berizin biasanya lebih cepat dan aman.',
      },
    ],
    blueprint: {
      prioritas: ['Runway ≥18 bulan dengan rekrutmen berbasis milestone', 'Keamanan & kepatuhan data', 'Ekspansi segmen yang memakai ulang keunggulan'],
      rekrutSekarang: ['Security/DevOps engineer', 'Head of customer success'],
      rekrutNanti: ['VP sales', 'Legal & compliance (data, kontrak)'],
      operasional: ['Harian: monitoring sistem & keamanan', 'Mingguan: metrik SaaS (MRR, churn, NRR, CAC payback)', 'Bulanan: laporan investor', 'Kuartalan: audit keamanan & review roadmap'],
      modal: [{ pos: 'Gaji tim', pct: 55 }, { pos: 'Infrastruktur & keamanan', pct: 10 }, { pos: 'Go-to-market', pct: 15 }, { pos: 'Legal & kepatuhan', pct: 5 }, { pos: 'Runway cadangan', pct: 15 }],
      kpi: [{ name: 'Net revenue retention', target: '≥100%' }, { name: 'CAC payback', target: '<12 bulan' }, { name: 'Runway', target: '≥18 bulan' }, { name: 'Insiden keamanan kritis', target: '0' }],
      risiko: ['Burn rate terlalu cepat', 'Kebocoran data', 'Ekspansi ke area regulasi tanpa kesiapan'],
      naikLevel: ['MRR ≥Rp400 juta', 'NRR ≥100%', 'Siap untuk Series A atau profitabilitas'],
    },
  },
];
