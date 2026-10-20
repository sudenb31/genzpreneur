import type { SimScenarioContent } from './types';
import { o } from './helpers';

export const EDUCATION: SimScenarioContent[] = [
  {
    industry: 'education', level: 'rintis',
    title: 'Kelas online keterampilan pertama',
    persona: 'Kamu jago Canva dan desain konten. Banyak teman minta diajari, jadi kamu ingin membuka kelas online lewat Zoom + grup WhatsApp.',
    modal: 'Kas Rp2 juta',
    team: ['Kamu (mentor, admin, marketing)', 'Teman bantu jadi moderator (dibayar per kelas)'],
    start: { kas: 2, reputasi: 50, tim: 70 },
    decisions: [
      {
        title: 'Harga kelas pertama',
        situation: 'Kelas 3 sesi. Ada tiga pilihan: murah sekali agar ramai, menengah dengan janji hasil, atau gratis untuk membangun nama.',
        options: [
          o('Rp25rb supaya ramai. Kelas pertama tujuannya testimoni & nama, bukan uang', [1.5, -2, -8], '60 orang daftar, tapi banyak yang tidak serius. Grup berisik dan hanya sedikit yang menyelesaikan tugas.'),
          o('Rp149rb (early bird Rp99rb), maksimal 30 peserta, janji hasil yang jelas', [2.7, 5, 0], '27 peserta yang serius. 21 menyelesaikan tugas, dan testimoninya kuat untuk batch berikutnya.', true),
          o('Gratis untuk 200 orang, lalu jual kelas lanjutan ke peserta yang aktif', [0, 1, -12], 'Kamu kewalahan menjawab pertanyaan. Hanya 15 orang yang hadir sampai akhir.'),
        ],
        lesson: 'Di edukasi, harga menyaring keseriusan. Jual hasil yang jelas (transformasi), batasi kuota agar kualitas terjaga, dan biarkan testimoni menjual batch berikutnya.',
      },
      {
        title: 'Yang daftar banyak, yang hadir sedikit',
        situation: 'Dari 27 peserta, hanya 14 yang hadir di sesi pertama.',
        options: [
          o('Biarkan. Peserta dewasa harus bertanggung jawab atas pilihannya sendiri', [0, -4, 0], 'Banyak yang tidak menyelesaikan kelas. Testimoni sedikit dan batch berikutnya sepi.'),
          o('Pengingat, rekaman + ringkasan, tugas kecil dengan feedback, buddy system', [-0.2, 6, -3], 'Kehadiran sesi 2 naik ke 22 orang. Tingkat penyelesaian 78%.', true),
          o('Kurangi jadi 2 sesi yang lebih padat supaya peserta tidak bosan', [0, -8, 0], 'Materi jadi terlalu padat. Peserta yang tertinggal makin bingung, dan kehadiran tidak membaik.'),
        ],
        lesson: 'Penyelesaian kelas adalah produkmu. Pengingat, rekaman, tugas kecil, dan feedback adalah fitur yang menentukan apakah peserta berhasil dan merekomendasikan.',
      },
      {
        title: 'Permintaan refund',
        situation: 'Satu peserta meminta refund setelah sesi 2 karena "ternyata tidak cocok". Kamu belum punya kebijakan refund.',
        options: [
          o('Tolak. Peserta sudah mendapat 2 sesi materi, dan kebijakan harus konsisten', [0, -6, 0], 'Ia mengeluh di media sosial dan calon peserta jadi ragu.'),
          o('Refund kali ini, lalu tulis kebijakan refund jelas untuk batch berikutnya', [-0.1, 4, 2], 'Peserta itu malah memberi ulasan positif tentang pelayananmu. Batch berikutnya tidak ada sengketa.', true),
          o('Tawarkan refund ke semua peserta yang kurang puas supaya nama tetap bersih', [-2.7, -2, -4], 'Kamu bekerja tanpa bayaran, dan peserta lain bingung.'),
        ],
        lesson: 'Kebijakan refund yang ditulis sebelum penjualan mencegah konflik. Pengecualian satu kali yang ditangani dengan baik bisa menjadi promosi.',
      },
    ],
    blueprint: {
      prioritas: ['1 kelas dengan hasil yang jelas & terbukti', 'Tingkat penyelesaian ≥70%', 'Testimoni dan karya alumni'],
      rekrutSekarang: ['Moderator/asisten per kelas'],
      rekrutNanti: ['Admin pendaftaran — saat >50 peserta/batch', 'Mentor tambahan dari alumni terbaik'],
      operasional: ['Sebelum kelas: pengingat & materi', 'Saat kelas: absensi & tugas', 'Setelah kelas: rekaman, ringkasan, feedback tugas', 'Akhir batch: survei & kumpulkan testimoni'],
      modal: [{ pos: 'Tools (Zoom, desain materi)', pct: 25 }, { pos: 'Promosi', pct: 25 }, { pos: 'Honor moderator', pct: 15 }, { pos: 'Dana darurat', pct: 35 }],
      kpi: [{ name: 'Tingkat penyelesaian', target: '≥70%' }, { name: 'Peserta per batch', target: '20–30' }, { name: 'Skor kepuasan', target: '≥4,5/5' }, { name: 'Peserta dari referral', target: '≥25%' }],
      risiko: ['Peserta tidak menyelesaikan kelas', 'Harga terlalu murah', 'Sengketa refund'],
      naikLevel: ['3 batch dengan kepuasan ≥4,5', 'Pendapatan ≥Rp8 juta/batch', 'Kurikulum & materi bisa diajarkan orang lain'],
    },
  },
  {
    industry: 'education', level: 'tumbuh',
    title: 'Program kursus 300 alumni, tim 5 orang',
    persona: 'Program bootcamp desain digitalmu sudah punya 300 alumni. Satu batch berisi 60 peserta dengan harga Rp1,2 juta. Tim 5 orang, dan kamu masih mengajar hampir semua sesi.',
    modal: 'Kas Rp45 juta',
    team: ['Kamu (founder & mentor utama)', 'Admin & CS', 'Marketing konten', '2 asisten mentor (part-time)'],
    start: { kas: 45, reputasi: 64, tim: 55 },
    decisions: [
      {
        title: 'Kelas rekaman atau tetap live?',
        situation: 'Kamu kelelahan mengajar live 3 batch sekaligus. Ide: jual kelas rekaman Rp299rb tanpa batas peserta.',
        options: [
          o('Ganti ke rekaman Rp299rb tanpa batas peserta. Bisa skala tanpa kamu kelelahan', [10, -6, 8], 'Penjualan awal bagus, tapi tingkat penyelesaian anjlok ke 12% dan keluhan "tidak ada bimbingan" meningkat.'),
          o('Hybrid: materi direkam, sesi live dipegang mentor terlatih dengan rubrik', [-6, 5, 10], 'Waktumu mengajar turun 60%. Tingkat penyelesaian tetap 70%, dan kapasitas naik ke 4 batch paralel.', true),
          o('Tetap live semua. Interaksi langsung dengan founder adalah nilai jual utama', [0, -2, -12], 'Kualitas mulai turun karena kamu kelelahan.'),
        ],
        lesson: 'Rekam yang tidak berubah (materi), manusiakan yang membuat peserta berhasil (feedback, akuntabilitas). Rubrik membuat mentor lain bisa menilai dengan standar yang sama.',
      },
      {
        title: 'Mentor mahal dan langka',
        situation: 'Kamu butuh 3 mentor tambahan. Praktisi senior meminta Rp1,5 juta per sesi.',
        options: [
          o('Rekrut 3 praktisi senior. Kualitas mentor adalah janji utama program', [-18, 3, 0], 'Kualitas bagus, tapi margin per batch turun ke hampir nol.'),
          o('Latih alumni terbaik jadi mentor, praktisi senior hanya sesi tamu', [-5, 4, 8], 'Biaya terkendali. Alumni-mentor menjadi bukti hasil program dan motivasi bagi peserta baru.', true),
          o('Kurangi kuota per batch supaya kamu tetap bisa mengajar dengan kualitas sama', [-8, -1, 2], 'Pertumbuhan berhenti, dan daftar tunggu pendaftar kecewa.'),
        ],
        lesson: 'Alumni terbaik adalah sumber mentor, testimoni, dan budaya program. Sistem pelatihan mentor + rubrik membuat kualitas tidak bergantung pada satu orang.',
      },
      {
        title: 'Tawaran kerja sama kampus',
        situation: 'Sebuah kampus swasta ingin membeli programmu untuk 200 mahasiswa dengan harga Rp450rb per orang (diskon besar), dibayar setelah semester berakhir.',
        options: [
          o('Terima apa adanya. Masuk ke kampus jauh lebih penting daripada termin', [-15, 2, -10], 'Kamu harus menalangi biaya mentor 4 bulan, dan pembayaran molor karena birokrasi kampus.'),
          o('Terima dengan MoU, termin 40/60, dan ukuran keberhasilan bersama', [26, 6, -4], 'Pendapatan B2B baru yang stabil. Kampus memperpanjang untuk semester berikutnya.', true),
          o('Tolak. Harga Rp450rb merusak posisi harga program reguler', [0, -1, 2], 'Kamu kehilangan kanal B2B yang bisa mendatangkan ratusan peserta per semester.'),
        ],
        lesson: 'B2B edukasi (kampus, sekolah, korporat) memberi volume, tapi ingat birokrasi pembayaran. MoU + termin + indikator keberhasilan membuat kerja sama sehat.',
      },
    ],
    blueprint: {
      prioritas: ['Founder lepas dari mengajar harian', 'Sistem mentor dari alumni', 'Kanal B2B (kampus/korporat)'],
      rekrutSekarang: ['Program manager / koordinator mentor', 'Partnership officer (B2B)'],
      rekrutNanti: ['Instructional designer', 'Sales B2B full-time'],
      operasional: ['Mingguan: rapat mentor & cek progres peserta', 'Setiap batch: onboarding, kelas live, penilaian tugas', 'Akhir batch: survei, showcase karya, rekrut calon mentor', 'Bulanan: laporan keuangan per batch'],
      modal: [{ pos: 'Honor mentor & tim', pct: 40 }, { pos: 'Produksi materi rekaman', pct: 15 }, { pos: 'Pemasaran', pct: 15 }, { pos: 'Platform (LMS/komunitas)', pct: 5 }, { pos: 'Dana darurat', pct: 25 }],
      kpi: [{ name: 'Tingkat penyelesaian', target: '≥70%' }, { name: 'Margin per batch', target: '≥40%' }, { name: 'Peserta dari B2B', target: '≥25%' }, { name: 'Refund rate', target: '<3%' }],
      risiko: ['Kualitas turun saat skala', 'Bergantung pada founder sebagai pengajar', 'Pembayaran B2B lambat'],
      naikLevel: ['4 batch paralel dengan kepuasan ≥4,5', '≥2 klien B2B', 'Founder mengajar ≤20% sesi'],
    },
  },
  {
    industry: 'education', level: 'skala',
    title: 'Akademi digital dengan 3 program, 18 orang',
    persona: 'Akademimu punya 3 program (desain, digital marketing, data), ±1.200 peserta/tahun, dan pendapatan ±Rp300 juta/bulan. Kamu ingin membangun platform belajar sendiri dan berencana mengajukan kerja sama sertifikasi.',
    modal: 'Kas Rp320 juta',
    team: ['Kamu (CEO)', 'Kepala akademik', '3 program manager', '8 mentor tetap', 'Marketing (3)', 'Finance & admin'],
    start: { kas: 320, reputasi: 70, tim: 58 },
    decisions: [
      {
        title: 'Bangun LMS sendiri?',
        situation: 'Vendor menawarkan pembuatan LMS custom Rp250 juta, selesai dalam 6 bulan. Saat ini kamu memakai LMS siap pakai Rp4 juta/bulan.',
        options: [
          o('Bangun LMS custom. Platform sendiri adalah aset jangka panjang perusahaan', [-250, -2, -8], 'Proyek molor 5 bulan. Biaya pemeliharaan tak terduga muncul, dan fitur yang dibuat tidak lebih baik dari LMS yang ada.'),
          o('Tetap LMS siap pakai, investasi ke data progres & intervensi peserta', [-25, 6, 4], 'Tingkat penyelesaian naik 8 poin. Uang tetap tersedia untuk program baru.', true),
          o('Pindah ke platform gratis supaya hemat Rp48 juta setahun', [3, -6, -6], 'Banyak fitur hilang, peserta kebingungan, dan keluhan naik.'),
        ],
        lesson: 'Bangun sendiri hanya jika itu keunggulan bersaingmu. Untuk akademi, keunggulannya ada pada hasil belajar & kurikulum, bukan pada software LMS.',
      },
      {
        title: 'Kualitas turun saat skala',
        situation: 'Kepuasan program data turun dari 4,6 ke 4,0. Mentor baru kurang konsisten.',
        options: [
          o('Ganti mentor program data dengan mentor baru yang lebih berpengalaman', [-20, -2, -10], 'Masalahnya ternyata ada di kurikulum yang terlalu padat. Kamu kehilangan mentor yang sebenarnya bagus.'),
          o('Investigasi per kelas: wawancara, observasi, revisi kurikulum, sertifikasi mentor', [-10, 6, 6], 'Akar masalah ditemukan: materi minggu 3 terlalu padat. Setelah revisi, kepuasan kembali ke 4,5.', true),
          o('Beri diskon batch berikutnya untuk menjaga reputasi sambil mencari solusi', [-15, -2, 0], 'Keluhan berhenti sementara, tapi tingkat penyelesaian tetap rendah.'),
        ],
        lesson: 'Masalah kualitas di skala jarang soal satu orang. Gunakan data per kelas, wawancara, dan observasi untuk menemukan akar sebelum mengambil keputusan.',
      },
      {
        title: 'Jalan pintas "sertifikat resmi"',
        situation: 'Seorang perantara menawarkan "sertifikat berlogo lembaga resmi" untuk lulusanmu dengan biaya per peserta, tanpa proses uji kompetensi.',
        options: [
          o('Ambil. Sertifikat berlogo lembaga membuat paket jauh lebih mudah dijual', [-30, -15, -4], 'Belakangan diketahui lembaga tersebut tidak pernah memberi izin. Kamu terseret masalah dan harus menarik sertifikat.'),
          o('Kerja sama dengan lembaga sertifikasi terverifikasi lewat uji kompetensi', [-12, 8, 2], 'Proses lebih lama, tapi sertifikat diakui industri dan paket premium laris.', true),
          o('Terbitkan sertifikat akademi sendiri yang ditandatangani praktisi industri', [0, -4, 0], 'Sertifikatnya sah sebagai bukti pelatihan, tapi peserta yang berharap kredensial resmi kecewa, dan paket premium sulit dijual.'),
        ],
        lesson: 'Kredensial harus bisa diverifikasi. Selalu cek legalitas lembaga sertifikasi dan jangan membuat klaim yang tidak bisa dibuktikan.',
      },
    ],
    blueprint: {
      prioritas: ['Hasil belajar terukur & kurikulum terbaik', 'Sistem mutu mentor', 'Kerja sama kredensial yang sah'],
      rekrutSekarang: ['Head of quality / learning experience', 'Data analyst pembelajaran'],
      rekrutNanti: ['Career services (penyaluran kerja)', 'B2B enterprise sales'],
      operasional: ['Mingguan: dashboard progres & intervensi peserta tertinggal', 'Bulanan: review kualitas per program', 'Per batch: sertifikasi mentor & observasi kelas', 'Tahunan: revisi kurikulum bersama industri'],
      modal: [{ pos: 'SDM akademik', pct: 45 }, { pos: 'Pengembangan kurikulum', pct: 15 }, { pos: 'Pemasaran', pct: 15 }, { pos: 'Teknologi & data', pct: 5 }, { pos: 'Dana darurat', pct: 20 }],
      kpi: [{ name: 'Tingkat penyelesaian', target: '≥75%' }, { name: 'Alumni bekerja/naik penghasilan', target: '≥50% dalam 6 bulan' }, { name: 'Kepuasan program', target: '≥4,5' }, { name: 'Net margin', target: '≥20%' }],
      risiko: ['Kualitas turun', 'Investasi teknologi berlebihan', 'Klaim kredensial yang menyesatkan'],
      naikLevel: ['Hasil alumni terdokumentasi & diaudit', '3 program masing-masing untung', 'Mitra industri/kredensial resmi'],
    },
  },
];
