/**
 * PROFIL CUAN — 8 tipe cara menciptakan nilai & kekayaan.
 * Terinspirasi konsep 8 profil kekayaan Roger Hamilton (buku "Your Life Your
 * Legacy"). Soal, deskripsi, dan pemetaan di sini ditulis ulang secara
 * orisinal untuk GenZ Preneur — BUKAN tes Wealth Dynamics resmi.
 *
 * Contoh tokoh adalah ilustrasi pola, bukan klaim kepribadian. Tokoh Muslim
 * dipilih dari peran yang dikenal dalam sejarah; mereka manusia utuh dengan
 * banyak kekuatan, dan Rasulullah ﷺ adalah teladan menyeluruh — bukan satu
 * profil saja.
 */
export const PROFILE_KEYS = ['creator', 'star', 'supporter', 'dealmaker', 'trader', 'accumulator', 'lord', 'mechanic'] as const;
export type ProfileKey = (typeof PROFILE_KEYS)[number];

export interface WealthProfile {
  key: ProfileKey;
  name: string;
  alias: string;
  emoji: string;
  tile: string;
  oneLiner: string;
  howYouWin: string;
  strengths: string[];
  watchOut: string[];
  teamRole: string;
  /** Langkah bisnis modal kecil yang cocok untuk Gen Z. */
  startHere: string[];
  globalFigures: string[];
  muslimFigures: { name: string; why: string }[];
}

export const WEALTH_PROFILES: Record<ProfileKey, WealthProfile> = {
  creator: {
    key: 'creator', name: 'Pencipta', alias: 'The Creator', emoji: '💡', tile: 'bg-lime',
    oneLiner: 'Kamu menghasilkan nilai dengan menciptakan sesuatu yang belum ada.',
    howYouWin: 'Cuan datang dari ide, produk, dan inovasi. Kekuatanmu ada di memulai — bukan di mengurus detail sehari-hari.',
    strengths: ['Melihat kemungkinan yang orang lain belum lihat', 'Cepat membuat prototipe dan konsep', 'Berani mencoba hal baru'],
    watchOut: ['Terlalu banyak proyek, sedikit yang selesai', 'Bosan dengan rutinitas dan detail', 'Jatuh cinta pada ide sebelum divalidasi pasar'],
    teamRole: 'Pemilik visi produk. Pasangkan dirimu dengan Si Perakit Sistem atau Si Raja Sistem agar ide jadi bisnis yang jalan.',
    startHere: ['Jual produk digital buatanmu (template, desain, e-book)', 'Validasi 1 ide dengan 10 calon pembeli sebelum dibangun penuh', 'Cari partner eksekutor sejak awal'],
    globalFigures: ['Thomas Alva Edison', 'Walt Disney', 'Bill Gates', 'Steve Jobs'],
    muslimFigures: [
      { name: 'Al-Jazari', why: 'Insinyur yang merancang ratusan mesin dan mekanisme otomatis.' },
      { name: 'Ibnu al-Haytham', why: 'Pelopor optika dan metode eksperimen ilmiah.' },
      { name: 'Al-Khwarizmi', why: 'Pengembang aljabar dan metode algoritmik.' },
    ],
  },
  star: {
    key: 'star', name: 'Bintang', alias: 'The Star', emoji: '🌟', tile: 'bg-pink',
    oneLiner: 'Kamu menghasilkan nilai lewat dirimu sendiri — suara, wajah, dan cerita.',
    howYouWin: 'Cuan datang dari perhatian dan kepercayaan publik pada dirimu: personal brand, konten, panggung.',
    strengths: ['Menarik perhatian dan membangun penggemar', 'Pandai bercerita dan tampil', 'Membuat produk terasa hidup'],
    watchOut: ['Bergantung pada validasi dan popularitas', 'Bisnis berhenti saat kamu berhenti tampil', 'Kurang sabar mengurus angka dan sistem'],
    teamRole: 'Wajah brand dan juru bicara. Butuh Si Penggerak atau Si Raja Sistem di belakang layar.',
    startHere: ['Bangun personal brand di satu niche', 'Jadi UGC creator/brand ambassador UMKM', 'Jual kelas atau jasa yang memakai wajah & suaramu'],
    globalFigures: ['Oprah Winfrey', 'Martha Stewart', 'Paul Newman'],
    muslimFigures: [
      { name: "Mush'ab bin Umair", why: 'Duta pertama ke Madinah; pesona dan cara bicaranya membuka hati banyak orang.' },
      { name: 'Hassan bin Tsabit', why: 'Penyair yang suaranya menjadi corong dakwah di zamannya.' },
      { name: "Ja'far bin Abi Thalib", why: 'Juru bicara kaum Muslimin di hadapan Raja Habasyah.' },
    ],
  },
  supporter: {
    key: 'supporter', name: 'Penggerak', alias: 'The Supporter', emoji: '🫂', tile: 'bg-sky',
    oneLiner: 'Kamu menghasilkan nilai dengan memimpin dan membesarkan orang lain.',
    howYouWin: 'Cuan datang dari tim yang solid: kamu menggerakkan orang, menjaga semangat, dan memastikan target tercapai bersama.',
    strengths: ['Membangun kepercayaan dan loyalitas', 'Memimpin dan mengembangkan orang', 'Menjaga energi tim tetap tinggi'],
    watchOut: ['Sulit berkata tidak', 'Kurang menonjol saat bekerja sendirian', 'Bergantung pada visi orang lain'],
    teamRole: 'Leader tim / COO. Pasangan ideal untuk Si Pencipta dan Si Bintang.',
    startHere: ['Pimpin tim sales/reseller kecil dengan skema komisi', 'Kelola komunitas untuk brand', 'Jadi project lead di bisnis teman'],
    globalFigures: ['Jack Welch', 'Michael Eisner', 'Meg Whitman', 'Steve Case'],
    muslimFigures: [
      { name: 'Abu Bakar Ash-Shiddiq', why: 'Pendukung utama Rasulullah ﷺ; banyak sahabat masuk Islam lewat ajakannya.' },
      { name: 'Khalid bin Walid', why: 'Komandan yang menggerakkan pasukan menuju kemenangan.' },
      { name: 'Abu Ubaidah bin Jarrah', why: 'Dijuluki kepercayaan umat; memimpin dengan amanah dan rendah hati.' },
    ],
  },
  dealmaker: {
    key: 'dealmaker', name: 'Pembuat Transaksi', alias: 'The Deal Maker', emoji: '🤝', tile: 'bg-amber-soft',
    oneLiner: 'Kamu menghasilkan nilai dengan mempertemukan orang dan peluang.',
    howYouWin: 'Cuan datang dari koneksi dan kesepakatan: mempertemukan pembeli–penjual, investor–founder, brand–kreator.',
    strengths: ['Jaringan luas dan mudah akrab', 'Negosiasi dan membaca kebutuhan orang', 'Cepat melihat siapa butuh siapa'],
    watchOut: ['Meremehkan detail setelah deal', 'Terlalu banyak janji', 'Mengandalkan relasi tanpa sistem pencatatan'],
    teamRole: 'Bizdev & partnership. Butuh Si Perakit Sistem untuk mengeksekusi setelah deal.',
    startHere: ['Jadi sales partner/broker dengan komisi dari order lunas', 'Carikan sponsor untuk event', 'Pertemukan UMKM dengan vendor yang tepat'],
    globalFigures: ['Donald Trump', 'David Geffen', 'Masayoshi Son', 'Henry Kravis', 'Rupert Murdoch'],
    muslimFigures: [
      { name: 'Abdurrahman bin Auf', why: 'Datang ke Madinah tanpa harta, minta ditunjukkan pasar, lalu membangun kekayaan lewat kesepakatan dagang yang jujur.' },
      { name: 'Hakim bin Hizam', why: 'Saudagar Quraisy yang dikenal piawai berniaga dan dermawan.' },
    ],
  },
  trader: {
    key: 'trader', name: 'Pedagang', alias: 'The Trader', emoji: '📈', tile: 'bg-lilac',
    oneLiner: 'Kamu menghasilkan nilai dengan membaca waktu dan harga.',
    howYouWin: 'Cuan datang dari membeli di waktu yang tepat dan menjual di waktu yang tepat — kamu peka pada ritme pasar.',
    strengths: ['Peka momen dan perubahan harga', 'Tenang dan membumi', 'Disiplin pada aturan main'],
    watchOut: ['Terjebak spekulasi dan judi (hindari!)', 'Sulit melihat gambaran besar jangka panjang', 'Kurang sabar membangun brand'],
    teamRole: 'Pengatur stok, pembelian, dan harga. Pasangan kuat bagi Si Bintang dan Si Pencipta.',
    startHere: ['Reseller/pre-order dengan timing musim (wisuda, Ramadan, akhir tahun)', 'Jual-beli barang preloved yang kamu pahami', 'Kelola stok & harga toko online orang lain'],
    globalFigures: ['George Soros', 'Peter Lynch', 'Jim Rogers'],
    muslimFigures: [
      { name: 'Rasulullah ﷺ (masa muda)', why: 'Dikenal sebagai pedagang yang jujur dan amanah — Al-Amin — dalam perniagaan ke Syam. (Beliau teladan menyeluruh, bukan satu profil saja.)' },
      { name: 'Abu Bakar Ash-Shiddiq (sebagai saudagar)', why: 'Pedagang kain yang dikenal jujur sebelum dan sesudah Islam.' },
    ],
  },
  accumulator: {
    key: 'accumulator', name: 'Pengumpul Aset', alias: 'The Accumulator', emoji: '🏦', tile: 'bg-lime',
    oneLiner: 'Kamu menghasilkan nilai dengan sabar mengumpulkan aset yang tumbuh.',
    howYouWin: 'Cuan datang dari konsistensi: menabung, berinvestasi, dan menjaga aset produktif dalam jangka panjang.',
    strengths: ['Sabar dan bisa diandalkan', 'Teliti menilai risiko', 'Menyelesaikan apa yang dimulai'],
    watchOut: ['Terlalu lama menunggu sebelum mulai', 'Melewatkan peluang karena terlalu hati-hati', 'Sulit mempromosikan diri'],
    teamRole: 'Penjaga keuangan & aset. Penyeimbang bagi Si Pencipta yang suka risiko.',
    startHere: ['Bisnis berulang (langganan, sewa alat) yang tumbuh pelan', 'Kelola keuangan UMKM teman', 'Sisihkan sebagian cuan ke aset produktif dan wakaf'],
    globalFigures: ['Benjamin Graham', 'Warren Buffett', 'Paul Allen'],
    muslimFigures: [
      { name: 'Utsman bin Affan', why: 'Membeli Sumur Raumah dan mewakafkannya; aset produktif itu manfaatnya terus mengalir lintas generasi.' },
      { name: 'Az-Zubair bin Awwam', why: 'Membangun kekayaan bertahap lewat aset tanah dan properti.' },
    ],
  },
  lord: {
    key: 'lord', name: 'Raja Sistem', alias: 'The Lord', emoji: '👑', tile: 'bg-sky',
    oneLiner: 'Kamu menghasilkan nilai dengan mengendalikan aset dan arus kas.',
    howYouWin: 'Cuan datang dari memiliki & mengontrol "mesin uang": aset, data, dan arus kas — sering dari balik layar.',
    strengths: ['Detail dan berbasis data', 'Mengendalikan biaya dan arus kas', 'Melihat pola dalam angka'],
    watchOut: ['Terlalu mengontrol', 'Kurang luwes dengan orang', 'Sulit berinovasi'],
    teamRole: 'CFO / pemilik aset. Pasangan ideal untuk Si Pencipta dan Si Bintang.',
    startHere: ['Sewa aset (kamera, sound system, kostum) dengan pencatatan rapi', 'Jasa pembukuan & arus kas UMKM', 'Bangun bisnis yang pemasukannya bisa diukur harian'],
    globalFigures: ['Andrew Carnegie', 'John D. Rockefeller', 'Sergey Brin', 'Lakshmi Mittal'],
    muslimFigures: [
      { name: 'Khadijah binti Khuwailid', why: 'Pemilik modal yang mengelola kafilah dagang lewat mitra (mudharabah) — mengendalikan aset dan arus kas.' },
      { name: 'Umar bin Abdul Aziz', why: 'Mengelola keuangan negara dengan ketat dan detail hingga kesejahteraan merata.' },
    ],
  },
  mechanic: {
    key: 'mechanic', name: 'Perakit Sistem', alias: 'The Mechanic', emoji: '⚙️', tile: 'bg-amber-soft',
    oneLiner: 'Kamu menghasilkan nilai dengan menyempurnakan dan menyistemkan.',
    howYouWin: 'Cuan datang dari proses yang lebih baik, lebih cepat, dan bisa diduplikasi — kamu membuat sesuatu yang sudah ada jadi mesin yang jalan.',
    strengths: ['Menyempurnakan proses', 'Membuat SOP dan sistem', 'Menyelesaikan dengan tuntas'],
    watchOut: ['Perfeksionis, lama mulai', 'Terlalu fokus detail, lupa pasar', 'Kesulitan menjual diri'],
    teamRole: 'Operasional & sistem. Pasangan ideal untuk Si Pencipta dan Si Pembuat Transaksi.',
    startHere: ['Jasa SOP, otomasi, atau sistem order untuk UMKM', 'Ambil model bisnis yang sudah terbukti lalu jalankan lebih rapi', 'Franchise/kemitraan dengan sistem yang jelas'],
    globalFigures: ['Henry Ford', 'Ray Kroc', 'Sam Walton'],
    muslimFigures: [
      { name: 'Umar bin Khattab', why: 'Menata sistem pemerintahan: diwan (administrasi), kalender Hijriah, dan pengelolaan wilayah.' },
      { name: 'Fatima al-Fihri', why: 'Membangun Al-Qarawiyyin menjadi sistem pendidikan yang bertahan berabad-abad.' },
    ],
  },
};

export const PROFILE_DISCLAIMER =
  'Profil Cuan terinspirasi konsep 8 profil kekayaan Roger Hamilton, dengan soal dan penjelasan yang disusun ulang oleh GenZ Preneur. Ini alat refleksi, bukan tes psikologi atau tes resmi Wealth Dynamics. Contoh tokoh adalah ilustrasi pola, bukan penilaian kepribadian mereka.';
