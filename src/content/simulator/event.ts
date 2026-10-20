import type { SimScenarioContent } from './types';
import { o } from './helpers';

export const EVENT: SimScenarioContent[] = [
  {
    industry: 'event', level: 'rintis',
    title: 'Workshop 60 orang pertama',
    persona: 'Kamu dan dua teman komunitas ingin membuat workshop "Personal Branding untuk Mahasiswa" berbayar (Rp75rb) di sebuah coworking space, dengan 1 pembicara praktisi.',
    modal: 'Kas Rp5 juta',
    team: ['Kamu (project lead)', '2 teman panitia (sukarela + bagi hasil)'],
    start: { kas: 5, reputasi: 50, tim: 70 },
    decisions: [
      {
        title: 'DP venue sebelum tiket laku?',
        situation: 'Coworking space meminta DP Rp2,5 juta untuk mengunci tanggal 4 minggu lagi. Tiket belum dijual sama sekali.',
        options: [
          o('Bayar DP sekarang. Tanggal bagus cepat diambil orang, dan acara butuh kepastian', [-2.5, 1, 0], 'Tanggal aman, tapi 2 minggu kemudian baru 12 tiket terjual. Kalian panik.'),
          o('Buka pre-sale early bird 7 hari dulu, bayar DP kalau target tiket tercapai', [1.3, 3, -2], '31 tiket terjual dalam 6 hari. DP dibayar dari uang tiket, dan kalian punya bukti permintaan.', true),
          o('Pakai aula kampus yang gratis. Izin bisa diurus sambil jalan', [0, -6, -4], 'H-3 izin ditolak, dan kalian harus memindahkan acara dengan panik.'),
        ],
        lesson: 'Validasi permintaan sebelum komitmen biaya terbesar. Pre-sale early bird adalah alat riset pasar sekaligus sumber modal.',
      },
      {
        title: 'H-10, tiket baru 45%',
        situation: 'Target 60 peserta, baru 27 tiket terjual. Promosi di Instagram tidak banyak berdampak.',
        options: [
          o('Turunkan harga tiket ke Rp25rb. Lebih baik ramai daripada setengah kosong', [0.5, -3, 0], 'Peserta early bird protes merasa rugi, dan yang hadir banyak yang tidak serius.'),
          o('Gandeng 5 komunitas sebagai partner dengan kode diskon & komisi', [1.6, 4, -4], 'Tiket naik ke 58 dalam 8 hari. Komunitas partner juga membawa peserta yang tepat sasaran.', true),
          o('Pasang iklan Instagram Rp2 juta dengan target mahasiswa di Bogor-Jakarta', [-2, 1, 0], 'Terjual 9 tiket tambahan. Biaya per peserta lebih mahal dari harga tiketnya.'),
        ],
        lesson: 'Event dijual lewat komunitas, bukan sekadar iklan. Partner komunitas dengan insentif yang jelas adalah kanal distribusi paling efisien di tahap awal.',
      },
      {
        title: 'Pembicara batal H-3',
        situation: 'Pembicara utama sakit dan membatalkan kehadiran H-3.',
        options: [
          o('Undur acara 2 minggu dan refund bagi yang tidak bisa hadir di tanggal baru', [-3.4, -8, -5], 'Separuh peserta minta refund karena tanggal baru bentrok. DP venue hangus, dan momentum acara hilang.'),
          o('Panggil pembicara cadangan, umumkan perubahan dengan jujur, tawarkan refund', [-0.5, 5, -4], 'Pembicara cadangan ternyata disukai. Hanya 3 peserta minta refund.', true),
          o('Ganti format jadi sesi diskusi panitia supaya acara tetap jalan sesuai jadwal', [0, -12, 0], 'Peserta datang untuk pembicara, bukan panitia. Banyak yang merasa tertipu, dan ulasannya buruk di media sosial.'),
        ],
        lesson: 'Event selalu punya rencana B: pembicara cadangan, venue cadangan, dan kebijakan refund. Transparansi saat ada perubahan menjaga kepercayaan.',
      },
    ],
    blueprint: {
      prioritas: ['Validasi permintaan lewat pre-sale', 'Jaringan komunitas partner', 'Rencana cadangan untuk setiap risiko besar'],
      rekrutSekarang: ['Panitia inti 2–3 orang dengan pembagian peran jelas'],
      rekrutNanti: ['Desainer & dokumentasi freelance', 'Koordinator sponsor — saat event ≥200 orang'],
      operasional: ['H-30: venue, pembicara, pre-sale', 'H-14: partner komunitas & materi promosi', 'H-3: konfirmasi semua pihak & briefing panitia', 'H+3: survei, dokumentasi, laporan keuangan'],
      modal: [{ pos: 'Venue', pct: 40 }, { pos: 'Honor pembicara', pct: 20 }, { pos: 'Konsumsi & perlengkapan', pct: 15 }, { pos: 'Promosi & komisi partner', pct: 10 }, { pos: 'Dana darurat', pct: 15 }],
      kpi: [{ name: 'Tiket terjual vs target', target: '≥95%' }, { name: 'Kehadiran vs pendaftar', target: '≥85%' }, { name: 'Skor kepuasan', target: '≥4,5' }, { name: 'Laba per event', target: '≥15% pendapatan' }],
      risiko: ['Tiket tidak laku', 'Pembicara/venue batal', 'Biaya membengkak'],
      naikLevel: ['3 event untung berturut-turut', 'Database ≥500 peserta', '≥3 partner komunitas tetap'],
    },
  },
  {
    industry: 'event', level: 'tumbuh',
    title: 'Event organizer: seminar 600 orang',
    persona: 'Kamu sudah rutin membuat seminar & workshop. Sekarang mau menggelar seminar karier 600 orang di aula hotel. Biaya total ±Rp120 juta, pendapatan dari tiket (Rp100rb) dan sponsor.',
    modal: 'Kas Rp50 juta',
    team: ['Kamu (event director)', 'Koordinator acara', 'Koordinator sponsor', 'Desainer & media sosial', 'Panitia lepas hari H (15 orang)'],
    start: { kas: 50, reputasi: 60, tim: 60 },
    decisions: [
      {
        title: 'Proposal sponsor',
        situation: 'Butuh sponsor Rp60 juta. Kamu sudah mengirim proposal umum ke 40 perusahaan dan belum ada jawaban.',
        options: [
          o('Perbanyak jangkauan: kirim proposal ke 100 perusahaan lagi. Ini permainan angka', [0, -1, -6], 'Hanya 1 balasan masuk, dan isinya penolakan. Minggu-minggu berharga habis untuk mengirim email.'),
          o('Pilih 15 brand yang tepat, buat proposal spesifik, lalu follow-up', [55, 5, -4], 'Tiga brand setuju dengan total Rp55 juta. Satu minta laporan leads sebagai syarat perpanjangan.', true),
          o('Turunkan harga paket sponsor 70% supaya lebih mudah disetujui', [18, -2, -2], 'Dapat Rp18 juta, tapi sponsor tidak menghargai acaramu dan tidak memperpanjang.'),
        ],
        lesson: 'Sponsor membeli akses ke audiens tertentu + hasil yang terukur. Proposal spesifik + aktivasi + laporan pasca-acara jauh lebih efektif daripada proposal massal.',
      },
      {
        title: 'Izin keramaian & keamanan',
        situation: 'Acara 600 orang membutuhkan izin keramaian dan rencana keamanan. Panitia menyarankan "nanti saja, banyak acara lain juga tidak urus".',
        options: [
          o('Banyak acara jalan tanpa izin. Waktu lebih baik dipakai mencari sponsor', [2, -14, -6], 'Hari H acara dihentikan sementara oleh aparat. Peserta menunggu 1 jam, dan sponsor kecewa.'),
          o('Urus izin keramaian, keamanan, tim medis, jalur evakuasi, asuransi', [-6, 6, 2], 'Acara berjalan aman. Sponsor menyebut profesionalismemu sebagai alasan memperpanjang.', true),
          o('Ganti jadi acara online. Lebih murah, jangkauan lebih luas, tanpa izin', [-10, -4, -4], 'Pengalaman sponsor hilang dan tiket banyak yang minta refund.'),
        ],
        lesson: 'Izin & keselamatan adalah bagian dari biaya event, bukan opsional. Venue besar dan sponsor korporat akan menanyakannya.',
      },
      {
        title: 'Cashflow: sponsor membayar setelah acara',
        situation: 'Dua sponsor (Rp40 juta) baru membayar 30 hari setelah acara. Vendor sound & dekorasi meminta pelunasan H-3.',
        options: [
          o('Ambil pinjaman online jangka pendek. Uang sponsor pasti masuk sebulan lagi', [-6, -2, -8], 'Bunga dan biaya mencekik. Stresmu meningkat.'),
          o('Minta DP sponsor dengan kontrak, dan termin ke vendor (DP + sisa H+7)', [8, 3, 2], 'Satu sponsor setuju DP 50%. Vendor menerima termin karena kamu sudah langganan. Kas tetap aman.', true),
          o('Bayar vendor setelah sponsor membayar. Vendor langganan pasti mengerti', [10, -10, -4], 'Vendor marah dan menolak bekerja sama di event berikutnya.'),
        ],
        lesson: 'Di event, uang keluar sebelum uang masuk. Petakan kalender kas: siapa membayar kapan, siapa harus dibayar kapan, lalu negosiasikan termin di kedua sisi sejak awal.',
      },
    ],
    blueprint: {
      prioritas: ['Pipeline sponsor yang berulang', 'SOP izin & keselamatan', 'Kalender kas per event'],
      rekrutSekarang: ['Sponsorship manager (gaji + komisi)', 'Production manager'],
      rekrutNanti: ['Finance & admin event', 'Community/partnership officer'],
      operasional: ['H-60: konsep, venue, sponsor target', 'H-30: izin, vendor, tiket', 'H-7: rundown, briefing, cek keselamatan', 'H+7: laporan sponsor & keuangan'],
      modal: [{ pos: 'Venue & produksi', pct: 45 }, { pos: 'Talent/pembicara', pct: 15 }, { pos: 'Izin, keamanan, asuransi', pct: 5 }, { pos: 'Pemasaran', pct: 15 }, { pos: 'Dana darurat', pct: 20 }],
      kpi: [{ name: 'Sponsor : biaya total', target: '≥40%' }, { name: 'Tiket terjual', target: '≥90% kapasitas' }, { name: 'Sponsor repeat', target: '≥50%' }, { name: 'Margin per event', target: '≥20%' }],
      risiko: ['Kas negatif sebelum acara', 'Sponsor gagal', 'Insiden keselamatan'],
      naikLevel: ['3 event besar untung dengan sponsor repeat', 'Tim inti yang bisa menjalankan event tanpa kamu', 'Database peserta ≥5.000'],
    },
  },
  {
    industry: 'event', level: 'skala',
    title: 'Festival 4.000 orang & tim 15 orang',
    persona: 'Perusahaanmu menggelar festival tahunan anak muda (4.000 pengunjung, 60 tenant, 12 sponsor). Anggaran ±Rp900 juta. Kamu ingin event ini berkelanjutan, bukan bertaruh setiap tahun.',
    modal: 'Kas Rp400 juta',
    team: ['Kamu (CEO)', 'Festival director', 'Head of partnership', 'Head of production', 'Finance', 'Marketing (3)', 'Tim operasional (7)'],
    start: { kas: 400, reputasi: 70, tim: 58 },
    decisions: [
      {
        title: 'Tiket & transaksi di lokasi',
        situation: 'Tahun lalu antrean masuk 90 menit dan pencatatan transaksi tenant kacau.',
        options: [
          o('Tetap tiket kertas & tunai. Pengunjung lebih nyaman, dan tidak ada risiko sistem', [0, -8, -6], 'Antrean panjang lagi. Ada kebocoran tiket palsu dan keluhan viral.'),
          o('Pakai platform tiket QR & pembayaran nontunai yang sudah teruji', [-45, 7, 4], 'Check-in rata-rata 3 menit. Data tenant membuat penjualan booth tahun depan lebih mudah.', true),
          o('Bangun aplikasi tiket sendiri supaya semua data pengunjung jadi milikmu', [-150, -3, -8], 'Aplikasi baru error di hari H. Tim panik.'),
        ],
        lesson: 'Di skala besar, sistem adalah pengalaman pengunjung. Pakai platform yang sudah teruji. Data transaksi menjadi aset penjualan sponsor & tenant.',
      },
      {
        title: 'Sponsor utama menawarkan eksklusivitas',
        situation: 'Satu brand minuman menawarkan Rp300 juta sebagai sponsor utama, dengan syarat semua tenant minuman lain dilarang.',
        options: [
          o('Terima penuh. Rp300 juta menutup sepertiga anggaran festival', [300, -4, -2], 'Dana besar masuk, tapi 15 tenant minuman lokal kehilangan tempat dan festival dianggap "terlalu korporat".'),
          o('Negosiasi eksklusivitas hanya untuk minuman kemasan, tenant lokal tetap ada', [250, 5, 2], 'Sponsor setuju. Ekosistem tenant lokal tetap hidup, yang justru menjadi daya tarik festival.', true),
          o('Tolak eksklusivitas. Festival harus netral untuk semua brand', [0, 1, 2], 'Sponsor pindah ke festival lain. Anggaranmu bolong besar.'),
        ],
        lesson: 'Eksklusivitas bisa dinegosiasikan cakupannya. Jaga hal yang membuat event-mu bernilai (dalam kasus ini, ekosistem lokal) sambil memenuhi kebutuhan sponsor.',
      },
      {
        title: 'Cuaca ekstrem H-1',
        situation: 'Prakiraan cuaca memperlihatkan hujan lebat dan angin kencang di hari H.',
        options: [
          o('Jalan terus. Prakiraan cuaca sering meleset, dan menggeser jadwal membuat kacau', [0, -12, -8], 'Panggung harus dihentikan karena alasan keselamatan. Pengunjung kecewa dan menuntut refund.'),
          o('Aktifkan rencana cuaca: tenda, geser jadwal, cek struktur, komunikasi real-time', [-35, 6, 2], 'Festival tetap berjalan dengan jadwal yang disesuaikan. Pengunjung menghargai komunikasimu yang jelas.', true),
          o('Batalkan sekarang supaya tidak ada risiko apa pun bagi pengunjung', [-200, -10, -10], 'Kerugian besar tanpa perlindungan, dan reputasi festival jatuh.'),
        ],
        lesson: 'Event besar butuh rencana kontinjensi tertulis dan asuransi sebelum dibutuhkan. Keselamatan selalu nomor satu, dan komunikasi yang jelas menyelamatkan kepercayaan.',
      },
    ],
    blueprint: {
      prioritas: ['Pendapatan berulang (sponsor multi-tahun, tenant)', 'Sistem tiket & data', 'Manajemen risiko & asuransi'],
      rekrutSekarang: ['Risk & safety manager', 'Data & CRM officer'],
      rekrutNanti: ['Business development (IP/event lisensi)', 'Head of finance'],
      operasional: ['T-9 bulan: sponsor utama & tanggal', 'T-3 bulan: perizinan, vendor, tiket', 'T-2 minggu: simulasi & rencana kontinjensi', 'T+1 bulan: laporan sponsor, audit keuangan, survei'],
      modal: [{ pos: 'Produksi & venue', pct: 45 }, { pos: 'Talent', pct: 15 }, { pos: 'Sistem tiket & data', pct: 5 }, { pos: 'Keamanan, izin, asuransi', pct: 10 }, { pos: 'Pemasaran', pct: 10 }, { pos: 'Dana darurat', pct: 15 }],
      kpi: [{ name: 'Sponsor kontrak multi-tahun', target: '≥40% nilai sponsor' }, { name: 'Waktu check-in', target: '<5 menit' }, { name: 'Kepuasan pengunjung', target: '≥4,4' }, { name: 'EBITDA event', target: '≥15%' }],
      risiko: ['Cuaca & keselamatan', 'Ketergantungan pada sponsor tunggal', 'Kegagalan sistem di hari H'],
      naikLevel: ['Festival untung 3 tahun berturut-turut', 'Format event bisa direplikasi di kota lain', 'Pendapatan non-festival (event korporat, lisensi)'],
    },
  },
];
