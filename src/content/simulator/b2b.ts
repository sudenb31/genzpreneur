import type { SimScenario } from './types';
import { o } from './helpers';

export const B2B_SALES: SimScenario[] = [
  {
    industry: 'b2b_sales', level: 'rintis',
    title: 'Sales partner pengadaan kantor',
    persona: 'Kamu menjadi sales partner berbasis komisi untuk distributor alat tulis & kebutuhan kantor. Target pasarmu kantor-kantor kecil di Jabodetabek. Belum ada yang membeli.',
    modal: 'Kas Rp3 juta',
    team: ['Kamu (prospecting, presentasi, follow-up)'],
    start: { kas: 3, reputasi: 50, tim: 70 },
    decisions: [
      {
        title: 'Cara mencari pembeli',
        situation: 'Kamu punya katalog PDF dan 200 nomor WhatsApp dari internet.',
        options: [
          o('Broadcast katalog ke 200 nomor. Dari 200, pasti ada yang butuh', [0, -6, -2], 'Dua orang membalas "siapa ini?", dan nomormu dilaporkan sebagai spam.'),
          o('Pilih 30 kantor sekitar, cari nama PIC pengadaan, kirim pesan personal', [0.6, 4, -4], '7 membalas, dan 2 menjadi pembeli rutin bulanan. Lelah, tapi berkelanjutan.', true),
          o('Iklan berbayar Rp1,5 juta dengan target "kantor" di sekitar Jabodetabek', [-1.5, 1, 0], 'Banyak yang klik, tapi kebanyakan konsumen eceran, bukan kantor.'),
        ],
        lesson: 'B2B dimulai dari daftar target yang spesifik dan nama pengambil keputusannya. Pesan personal ke 30 yang tepat lebih kuat dari broadcast ke 200 yang salah.',
      },
      {
        title: 'Klien minta tempo 30 hari',
        situation: 'Klinik ingin order Rp6 juta per bulan dengan pembayaran 30 hari. Distributor meminta pembayaran di muka darimu.',
        options: [
          o('Talangi sendiri. Klien rutin Rp6 juta/bulan layak dimodali', [-3, 2, -4], 'Kas habis. Klien membayar di hari ke-41, dan kamu tidak bisa melayani klien lain.'),
          o('Atur agar distributor kirim & menagih langsung; kamu terima komisi', [0.5, 3, 0], 'Distributor setuju karena kamu membawa klien rutin. Kas tidak tersentuh dan komisi tetap masuk.', true),
          o('Tawarkan diskon 3% asal klinik mau bayar di muka', [0, -3, 2], 'Kebijakan keuangan klinik tidak mengizinkan bayar di muka. Mereka memilih pemasok lain, dan kamu kehilangan klien rutin pertama.'),
        ],
        lesson: 'Sebagai sales partner, jangan menanggung risiko piutang yang seharusnya ditanggung pemilik barang. Strukturkan alur barang & uang supaya kamu fokus pada penjualan.',
      },
      {
        title: 'Kesepakatan komisi',
        situation: 'Distributor menjanjikan komisi 7% secara lisan. Setelah 2 bulan, mereka bilang komisinya 4% karena "promo harga".',
        options: [
          o('Terima 4%. Relasi dengan distributor lebih berharga daripada 3% komisi', [-0.3, 0, -5], 'Komisi terus berubah-ubah dan motivasimu turun.'),
          o('Minta perjanjian tertulis: persentase, waktu bayar, promo, kepemilikan klien', [0.4, 3, 4], 'Distributor setuju di 6% dengan aturan jelas. Kamu juga tercatat sebagai pemilik akun klien yang kamu bawa.', true),
          o('Pindah ke distributor lain yang menawarkan komisi lebih tinggi', [-0.6, -2, -2], 'Klien bingung karena pemasok berganti tiba-tiba.'),
        ],
        lesson: 'Semua kesepakatan komisi harus tertulis: persentase, waktu bayar, kondisi khusus, dan kepemilikan klien. Lisan = mudah berubah.',
      },
    ],
    blueprint: {
      prioritas: ['Daftar 100 target akun dengan nama pengambil keputusan', 'Perjanjian komisi tertulis', '5 klien rutin bulanan'],
      rekrutSekarang: ['Belum perlu'],
      rekrutNanti: ['Admin order & penagihan — saat ≥15 klien rutin', 'Sales partner kedua per wilayah'],
      operasional: ['Harian: 10 kontak baru + 5 follow-up', 'Mingguan: kunjungan ke 3 calon klien', 'Bulanan: pengingat kebutuhan rutin klien', 'Bulanan: rekonsiliasi komisi dengan distributor'],
      modal: [{ pos: 'Transportasi & kunjungan', pct: 35 }, { pos: 'Sampel & materi presentasi', pct: 20 }, { pos: 'Pulsa/data & tools', pct: 10 }, { pos: 'Dana darurat', pct: 35 }],
      kpi: [{ name: 'Kontak baru per minggu', target: '50' }, { name: 'Conversion rate', target: '≥5%' }, { name: 'Klien rutin', target: '≥5' }, { name: 'Komisi per bulan', target: '≥Rp3 juta' }],
      risiko: ['Kesepakatan lisan', 'Menanggung piutang', 'Pipeline kosong'],
      naikLevel: ['≥10 klien rutin', 'Komisi stabil ≥Rp7 juta/bulan', 'Siap menjadi distributor kecil sendiri'],
    },
  },
  {
    industry: 'b2b_sales', level: 'tumbuh',
    title: 'Distributor kecil dengan 6 orang & gudang mini',
    persona: 'Kamu kini membeli langsung dari pabrik dan menjual ke 60 kantor & sekolah. Omzet ±Rp180 juta/bulan dengan margin kotor 18%. Piutang menumpuk Rp95 juta.',
    modal: 'Kas Rp70 juta',
    team: ['Kamu (owner)', '2 sales', 'Admin & penagihan', 'Staf gudang', 'Kurir'],
    start: { kas: 70, reputasi: 60, tim: 58 },
    decisions: [
      {
        title: 'Piutang menumpuk',
        situation: 'Piutang Rp95 juta, 40% di antaranya lewat 60 hari. Kas cukup untuk 1 bulan operasional.',
        options: [
          o('Tetap kirim ke semua klien. Menahan barang = mendorong mereka ke kompetitor', [-20, 0, -6], 'Piutang macet bertambah, dan kamu terpaksa menunda pembayaran ke pabrik.'),
          o('Kebijakan kredit: limit per klien, stop kirim di 45 hari, diskon bayar cepat', [28, 2, 2], 'Piutang turun 35% dalam 2 bulan. Hanya 2 klien bermasalah yang pergi, dan keduanya memang tidak menguntungkan.', true),
          o('Tagih semua tunggakan minggu ini juga, tanpa pengecualian', [15, -8, -2], 'Uang masuk sebagian, tapi beberapa klien bagus tersinggung dan pindah pemasok.'),
        ],
        lesson: 'Distributor bangkrut bukan karena tidak laku, tapi karena kas terkunci di piutang. Kebijakan kredit tertulis + penagihan rutin + insentif bayar cepat adalah operasional inti.',
      },
      {
        title: 'Tender besar dengan jaminan',
        situation: 'Ada tender pengadaan senilai Rp600 juta dengan syarat jaminan penawaran dan pelaksanaan dari bank, serta pembayaran 60–90 hari setelah barang diterima.',
        options: [
          o('Ikut sendiri. Jaminkan aset pribadi, karena tender seperti ini jarang muncul', [-80, 0, -12], 'Kamu menang, tapi kas habis untuk pengadaan. Bisnis harianmu terganggu selama 3 bulan.'),
          o('Bermitra dengan distributor besar yang menanggung modal & jaminan', [12, 4, -2], 'Tender dimenangkan bersama. Kamu mendapat margin tanpa mengunci kas, plus pengalaman tender untuk ke depan.', true),
          o('Lewati. Tender bukan dunia kita, fokus ke klien rutin', [0, 0, 2], 'Kamu aman, tapi kehilangan kesempatan belajar & membangun portofolio proyek besar.'),
        ],
        lesson: 'Peluang besar butuh struktur yang sesuai dengan kapasitas modal. Konsorsium/kemitraan bisa membuka proyek tanpa mempertaruhkan bisnis inti. Pastikan proses pengadaan berjalan bersih.',
      },
      {
        title: 'Sales tidak punya data pipeline',
        situation: 'Dua sales mencatat prospek di buku masing-masing. Kamu tidak tahu berapa deal yang hampir closing bulan depan.',
        options: [
          o('Biarkan. Sales yang mencapai target tidak perlu diatur cara kerjanya', [0, 0, -2], 'Satu sales resign dan membawa daftar kliennya. Ramalan omzet selalu meleset.'),
          o('CRM sederhana + rapat pipeline Senin; komisi dihitung dari data CRM', [-2, 2, 4], 'Akurasi prediksi omzet naik. Data klien tetap milik perusahaan.', true),
          o('Wajibkan laporan harian rinci dari setiap sales mulai minggu depan', [0, 0, -8], 'Sales sibuk membuat laporan alih-alih menjual.'),
        ],
        lesson: 'Pipeline yang tercatat = omzet yang bisa diprediksi + data klien milik perusahaan. Sistem harus sederhana agar dipakai.',
      },
    ],
    blueprint: {
      prioritas: ['Kebijakan kredit & penagihan', 'CRM & rapat pipeline mingguan', 'Hubungan pemasok (harga & termin)'],
      rekrutSekarang: ['Staf penagihan/finance', 'Sales ketiga untuk wilayah baru'],
      rekrutNanti: ['Sales manager', 'Kepala gudang & logistik'],
      operasional: ['Senin: rapat pipeline & target mingguan', 'Harian: pengiriman & tanda terima', 'Mingguan: aging piutang & penagihan', 'Bulanan: margin per klien & per produk'],
      modal: [{ pos: 'Stok', pct: 35 }, { pos: 'Piutang (modal kerja)', pct: 30 }, { pos: 'Gaji tim', pct: 15 }, { pos: 'Logistik', pct: 5 }, { pos: 'Dana darurat', pct: 15 }],
      kpi: [{ name: 'Hari piutang rata-rata', target: '<35 hari' }, { name: 'Piutang >60 hari', target: '<5%' }, { name: 'Margin kotor', target: '≥18%' }, { name: 'Akurasi prediksi omzet', target: '±10%' }],
      risiko: ['Piutang macet', 'Ketergantungan pada satu pemasok', 'Data klien di tangan individu'],
      naikLevel: ['Omzet ≥Rp400 juta/bulan dengan piutang sehat', 'Hak distribusi resmi dari ≥1 principal', 'Tim sales berjalan dengan sistem'],
    },
  },
  {
    industry: 'b2b_sales', level: 'skala',
    title: 'Distributor resmi 30 orang',
    persona: 'Kamu kini distributor resmi sebuah merek alat kebersihan untuk Jabodetabek. Omzet ±Rp1,2 miliar/bulan, 30 karyawan, gudang 600 m². Principal menaikkan target 40%.',
    modal: 'Kas Rp600 juta',
    team: ['Kamu (CEO)', 'Sales manager + 10 sales', 'Finance (3)', 'Gudang & logistik (10)', 'Admin & CS (4)'],
    start: { kas: 600, reputasi: 70, tim: 55 },
    decisions: [
      {
        title: 'Target principal naik 40%',
        situation: 'Principal menaikkan target tahunan 40%. Jika tidak tercapai, wilayahmu bisa dibagi ke distributor lain.',
        options: [
          o('Tambah 8 sales baru. Target naik 40% butuh tenaga 40% lebih banyak', [-120, 0, -10], 'Biaya naik cepat, tapi sales baru butuh 4–6 bulan untuk produktif. Margin turun.'),
          o('Petakan potensi segmen, tambah 3 sales tertarget, negosiasi target bertahap', [-40, 5, 2], 'Principal menerima target bertahap. Pertumbuhan 28% di tahun pertama, dengan margin terjaga.', true),
          o('Turunkan harga jual 8% untuk mendongkrak volume dengan cepat', [-60, -2, -4], 'Volume naik, tapi margin jatuh dan principal menegur karena merusak harga pasar.'),
        ],
        lesson: 'Hadapi target dengan data: segmentasi pasar, akun prioritas, dan rencana yang bisa dieksekusi. Menambah orang tanpa peta hanya menambah biaya.',
      },
      {
        title: 'Gudang penuh & pengiriman telat',
        situation: 'Ketepatan pengiriman turun ke 82%. Gudang penuh, pencarian barang lama, dan kesalahan kirim sering terjadi.',
        options: [
          o('Sewa gudang 2× lebih besar. Masalahnya jelas kekurangan ruang', [-150, 0, -4], 'Biaya naik, tapi kekacauan pindah ke dua lokasi.'),
          o('Rapikan sistem gudang: lokasi rak, FIFO, picking list, rute pengiriman', [-30, 6, 4], 'Ketepatan kirim naik ke 96% tanpa gudang baru. Stok mati berkurang.', true),
          o('Tambah 5 staf gudang supaya barang lebih cepat dicari & dikirim', [-60, 2, -2], 'Lebih banyak orang, tapi tanpa sistem, kesalahan tetap terjadi.'),
        ],
        lesson: 'Masalah gudang biasanya masalah sistem, bukan ruang. Lokasi rak, FIFO, dan rute yang tepat lebih murah daripada gudang baru.',
      },
      {
        title: 'Merancang insentif sales',
        situation: 'Sales dibayar komisi dari omzet. Akibatnya mereka mengejar klien yang besar tapi lambat bayar dan memberi diskon berlebihan.',
        options: [
          o('Naikkan komisi omzet 2%. Sales yang lebih termotivasi akan menjual lebih banyak', [-20, -2, 2], 'Diskon makin besar dan piutang makin lama.'),
          o('Ubah komisi jadi berbasis margin yang sudah tertagih + bonus akun baru', [10, 3, -2], 'Diskon berlebihan berhenti dan piutang membaik. Sales terbaik justru mendapat lebih banyak.', true),
          o('Ganti komisi dengan gaji tetap lebih tinggi supaya sales tidak memberi diskon asal', [0, -2, -12], 'Sales terbaik keluar ke kompetitor.'),
        ],
        lesson: 'Orang melakukan apa yang dibayar. Komisi dari margin yang sudah tertagih menyelaraskan sales dengan kesehatan perusahaan.',
      },
    ],
    blueprint: {
      prioritas: ['Segmentasi pasar & program akun utama', 'Sistem gudang & logistik', 'Insentif sales berbasis margin tertagih'],
      rekrutSekarang: ['Key account manager', 'Supply chain/warehouse manager'],
      rekrutNanti: ['Business analyst', 'Manajer cabang wilayah baru'],
      operasional: ['Harian: pengiriman & ketepatan kirim', 'Mingguan: pipeline per segmen & akun utama', 'Bulanan: review dengan principal (target, stok, promo)', 'Bulanan: aging piutang & margin per sales'],
      modal: [{ pos: 'Stok', pct: 35 }, { pos: 'Piutang', pct: 30 }, { pos: 'Sistem (WMS, CRM)', pct: 5 }, { pos: 'SDM sales & logistik', pct: 15 }, { pos: 'Dana darurat', pct: 15 }],
      kpi: [{ name: 'Pencapaian target principal', target: '≥95%' }, { name: 'Ketepatan kirim', target: '≥96%' }, { name: 'Hari piutang', target: '<40 hari' }, { name: 'Net margin', target: '≥5%' }],
      risiko: ['Kehilangan hak distribusi', 'Kas terkunci di stok & piutang', 'Insentif yang salah arah'],
      naikLevel: ['Target principal tercapai 2 tahun', 'Menjadi distributor untuk ≥2 principal', 'Laporan keuangan diaudit'],
    },
  },
];
