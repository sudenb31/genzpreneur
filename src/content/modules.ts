/**
 * Materi modul benefit. Sementara disimpan di kode; mulai Sprint 3 dipindah
 * ke CMS agar bisa diedit dari Command Center tanpa mengubah kode.
 */
export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  body: string[];
  keyPoints: string[];
  example?: { title: string; text: string };
  exercise: { prompt: string; placeholder: string };
  /** Tautan ke tool yang relevan di dalam aplikasi. */
  tool?: { to: string; label: string };
}

export interface LearningModule {
  slug: string;
  benefitNo: number;
  emoji: string;
  color: 'lime' | 'lilac' | 'sky' | 'pink' | 'amber-soft';
  title: string;
  tagline: string;
  lessons: Lesson[];
}

export const MODULES: LearningModule[] = [
  {
    slug: 'mindset',
    benefitNo: 1,
    emoji: '🧠',
    color: 'lime',
    title: 'Entrepreneur Mindset',
    tagline: 'Pola pikir dan mentalitas untuk mulai.',
    lessons: [
      {
        id: 'mindset-1',
        title: 'Entrepreneur = pencipta nilai, bukan pemilik toko',
        minutes: 5,
        body: [
          'Banyak orang menunda jadi entrepreneur karena merasa harus punya produk, kantor, atau modal besar dulu. Padahal inti kewirausahaan sederhana: menemukan masalah orang lain, lalu menawarkan solusi yang mau mereka bayar.',
          'Artinya kamu bisa mulai hari ini dengan menjual keterampilan, waktu, atau jaringanmu ke bisnis yang sudah berjalan. Bisnis itu sudah punya produk dan pelanggan — yang sering mereka kurang adalah tenaga, waktu, dan orang yang mau mengerjakan hal yang mereka tunda.',
          'Pertanyaan yang lebih berguna daripada "bisnis apa yang mau aku bikin?" adalah "masalah siapa yang bisa aku bantu selesaikan minggu ini?"',
        ],
        keyPoints: [
          'Nilai tercipta saat kamu menyelesaikan masalah orang lain.',
          'Produk sendiri itu opsional di awal; skill dan inisiatif itu wajib.',
          'Bisnis yang sudah jalan adalah "kelas praktik" terbaik dan gratis.',
        ],
        example: {
          title: 'Contoh nyata yang sederhana',
          text: 'Warung kopi dekat kampus punya Instagram yang terakhir posting 4 bulan lalu. Owner-nya sibuk melayani. Kamu menawarkan diri memotret menu dan memposting 3x seminggu. Kamu tidak punya kafe — tapi kamu sudah berbisnis.',
        },
        exercise: {
          prompt: 'Tulis 3 bisnis di sekitarmu yang kamu lihat punya masalah. Untuk masing-masing: apa masalahnya dan bantuan apa yang bisa kamu tawarkan?',
          placeholder: '1. Laundry dekat kos — antrean chat lama dibalas — aku bisa jadi admin WA sore hari…',
        },
      },
      {
        id: 'mindset-2',
        title: 'Ownership: semua hasil adalah tanggung jawabmu',
        minutes: 4,
        body: [
          'Ownership berarti berhenti mencari alasan di luar diri. Calon klien tidak membalas? Mungkin pesannya kurang spesifik. Tidak ada yang beli? Mungkin targetnya salah. Ini bukan menyalahkan diri — ini mengambil kendali atas hal yang bisa diubah.',
          'Orang yang punya ownership selalu bertanya "apa yang bisa aku perbaiki di percobaan berikutnya?" lalu langsung mencoba lagi.',
        ],
        keyPoints: [
          'Fokus pada yang bisa kamu kendalikan: aktivitas, kualitas pesan, kecepatan follow-up.',
          'Hasil adalah data, bukan vonis.',
          'Disiplin kecil yang konsisten mengalahkan semangat besar yang sesekali.',
        ],
        exercise: {
          prompt: 'Ingat satu kegagalan terakhirmu (apa pun). Tulis: apa yang terjadi, bagian mana yang ada dalam kendalimu, dan apa yang akan kamu lakukan berbeda.',
          placeholder: 'Yang terjadi… Yang bisa aku kendalikan… Lain kali aku akan…',
        },
      },
      {
        id: 'mindset-3',
        title: 'Ditolak itu bagian dari pekerjaan',
        minutes: 4,
        body: [
          'Dalam penjualan, penolakan adalah hal biasa. Kalau kamu menghubungi 20 orang, wajar jika sebagian besar tidak membalas atau menolak. Itu bukan tanda kamu gagal — itu tanda kamu sedang bekerja.',
          'Ubah cara mengukur keberhasilan di awal: bukan "berapa yang closing", tapi "berapa orang yang sudah aku hubungi dengan pesan yang baik". Aktivitas yang konsisten adalah satu-satunya hal yang sepenuhnya ada di tanganmu.',
        ],
        keyPoints: [
          'Ukur aktivitas dulu, hasil menyusul.',
          '"Belum" bukan berarti "tidak selamanya" — catat dan follow-up dengan sopan.',
          'Setiap penolakan memberi petunjuk untuk memperbaiki pesan berikutnya.',
        ],
        exercise: {
          prompt: 'Tentukan target aktivitasmu minggu ini (contoh: menghubungi 10 bisnis). Tulis juga apa yang akan kamu lakukan saat ditolak supaya tetap jalan.',
          placeholder: 'Target minggu ini: … Kalau ditolak, aku akan…',
        },
        tool: { to: '/app/action-plan', label: 'Buka Action Plan' },
      },
      {
        id: 'mindset-4',
        title: 'Etika: reputasi adalah modal yang paling mahal',
        minutes: 4,
        body: [
          'Saat mulai dengan modal Rp0, aset terbesarmu adalah kepercayaan orang. Sekali kamu melebih-lebihkan, terlambat tanpa kabar, atau memakai uang orang lain, reputasi itu sulit kembali.',
          'Prinsip sederhana: janjikan yang bisa kamu tepati, tulis kesepakatan sebelum mulai, jangan menalangi uang, dan jangan pernah membuat testimoni atau angka palsu.',
        ],
        keyPoints: [
          'Under-promise, over-deliver.',
          'Kesepakatan tertulis (walau via chat) melindungi kedua pihak.',
          'Kejujuran tentang keterbatasanmu justru membangun kepercayaan.',
        ],
        exercise: {
          prompt: 'Tulis 3 aturan pribadimu dalam berbisnis yang tidak akan kamu langgar.',
          placeholder: '1. Aku tidak akan… 2. Aku selalu… 3. …',
        },
      },
    ],
  },
  {
    slug: 'sales-marketing',
    benefitNo: 2,
    emoji: '📈',
    color: 'sky',
    title: 'Sales & Marketing Skills',
    tagline: 'Belajar mencari prospek dan membuat penawaran.',
    lessons: [
      {
        id: 'sales-1',
        title: 'Mencari prospek: 20 nama dalam 30 menit',
        minutes: 6,
        body: [
          'Prospek adalah orang atau bisnis yang punya masalah yang bisa kamu bantu DAN mungkin mampu membayar. Jangan mulai dari "siapa pun". Mulai dari satu segmen spesifik, misalnya "kafe kecil di sekitar kampus" atau "himpunan mahasiswa yang punya acara bulan depan".',
          'Sumber prospek gratis: Google Maps (cari kategori + lokasi), Instagram (hashtag lokal, akun yang di-tag), marketplace, grup komunitas, dan lingkaran teman/keluarga.',
          'Saat mencatat, tulis juga alasan kenapa mereka cocok. Alasan itulah yang nanti kamu pakai sebagai kalimat pembuka pesan.',
        ],
        keyPoints: [
          'Satu segmen spesifik lebih baik dari target yang luas.',
          'Catat: nama, kontak publik, alasan cocok, sumber.',
          'Kualitas daftar menentukan kualitas hasil outreach.',
        ],
        example: {
          title: 'Format catatan prospek',
          text: 'Kopi Senja · IG @kopisenja · posting terakhir Juni, menu belum ada foto · sumber: Google Maps "kafe dekat UI".',
        },
        exercise: {
          prompt: 'Pilih satu segmen dan tulis 5 prospek pertamamu beserta alasan kenapa mereka cocok.',
          placeholder: '1. [Nama bisnis] — [kontak publik] — [alasan cocok]',
        },
      },
      {
        id: 'sales-2',
        title: 'Rumus penawaran: masalah → hasil → bukti → ajakan',
        minutes: 6,
        body: [
          'Penawaran yang baik bukan daftar fitur. Ia menjawab empat hal: masalah apa yang kamu lihat, hasil apa yang bisa mereka harapkan (secara realistis), bukti kenapa kamu bisa melakukannya, dan satu ajakan yang mudah dijawab.',
          'Kalau belum punya bukti, buat bukti kecil: contoh hasil yang kamu buat khusus untuk mereka, atau tawarkan uji coba dengan batas yang jelas.',
        ],
        keyPoints: [
          'Mulai dari masalah mereka, bukan dari dirimu.',
          'Hasil harus realistis — jangan menjanjikan omzet atau viral.',
          'Satu ajakan saja: "boleh saya kirim contohnya?" lebih mudah dijawab daripada "mau kerja sama?"',
        ],
        example: {
          title: 'Contoh penawaran singkat',
          text: 'Masalah: menu di GoFood belum ada foto. Hasil: menu lebih menarik & mudah dipilih. Bukti: ini 2 contoh foto yang saya ambil dengan HP. Ajakan: boleh saya fotokan 5 menu terlaris minggu ini?',
        },
        exercise: {
          prompt: 'Susun penawaranmu untuk 1 prospek dengan rumus Masalah → Hasil → Bukti → Ajakan.',
          placeholder: 'Masalah: … Hasil: … Bukti: … Ajakan: …',
        },
        tool: { to: '/app/toolkit?tab=proposal', label: 'Buka Template Proposal' },
      },
      {
        id: 'sales-3',
        title: 'Pesan pertama yang dibalas',
        minutes: 5,
        body: [
          'Pesan pertama punya satu tugas: mendapatkan balasan, bukan langsung closing. Buat pendek, personal, dan mudah dijawab.',
          'Hindari pesan copy-paste yang bisa dikirim ke siapa saja. Satu kalimat spesifik tentang bisnis mereka sudah membuatmu berbeda dari 90% pesan promosi yang mereka terima.',
        ],
        keyPoints: [
          'Pendek: idealnya bisa dibaca dalam 20 detik.',
          'Personal: sebut satu hal spesifik tentang mereka.',
          'Mudah dijawab: tanya ya/tidak atau beri pilihan angka.',
        ],
        exercise: {
          prompt: 'Buat pesan pertamamu di Outreach Studio, lalu tempel versi finalnya di sini.',
          placeholder: 'Tempel pesanmu di sini…',
        },
        tool: { to: '/app/outreach', label: 'Buka Outreach Studio' },
      },
      {
        id: 'sales-4',
        title: 'Follow-up, menangani keberatan, dan closing',
        minutes: 6,
        body: [
          'Banyak kesepakatan terjadi setelah follow-up, bukan di pesan pertama. Orang sibuk; diam bukan berarti menolak. Follow-up sopan 3–5 hari kemudian, maksimal dua kali.',
          'Keberatan seperti "kemahalan" atau "sudah ada vendor" adalah pertanyaan tersembunyi. Dengarkan, akui, lalu tawarkan opsi — misalnya cakupan yang lebih kecil atau peran sebagai cadangan.',
          'Closing berarti menyepakati hal yang konkret: apa yang dikerjakan, kapan, berapa, dan bagaimana pembayaran. Tulis ringkasannya di chat agar keduanya punya catatan.',
        ],
        keyPoints: [
          'Selalu akhiri percakapan dengan langkah berikutnya yang spesifik.',
          'Keberatan = informasi. Jangan dibantah, tapi dijawab dengan opsi.',
          'Ringkas kesepakatan secara tertulis.',
        ],
        exercise: {
          prompt: 'Pilih 2 keberatan yang paling kamu takutkan dan tulis jawabanmu.',
          placeholder: 'Keberatan 1: … Jawabanku: …',
        },
        tool: { to: '/app/outreach', label: 'Lihat contoh jawaban keberatan' },
      },
    ],
  },
  {
    slug: 'business-partner',
    benefitNo: 3,
    emoji: '🤝',
    color: 'lilac',
    title: 'Business Partner Strategy',
    tagline: 'Belajar menawarkan jasa ke bisnis yang sudah berjalan.',
    lessons: [
      {
        id: 'partner-1',
        title: '5 jalur bisnis modal Rp0',
        minutes: 6,
        body: [
          'Modal Rp0 bukan berarti tanpa usaha — artinya kamu menukar waktu, skill, dan jaringan, bukan uang. Ada lima jalur yang paling realistis:',
          '1) Sales partner: menjual produk bisnis lain dengan komisi dari order lunas. 2) Jasa skill: desain, konten, admin, editing, les. 3) Pre-order: kumpulkan pesanan dan pembayaran dulu, baru belanja ke supplier. 4) Affiliate: rekomendasikan produk lewat link resmi. 5) Penghubung (broker): pertemukan pembeli dan penjual/vendor, dapat fee.',
          'Pilih SATU jalur dulu yang paling sesuai skill dan jaringanmu. Hasil Assessment bisa membantumu memilih.',
        ],
        keyPoints: [
          'Tukar waktu & skill, bukan uang.',
          'Jangan pernah menalangi dana produksi atau stok.',
          'Satu jalur yang ditekuni mengalahkan lima jalur yang dicoba setengah-setengah.',
        ],
        exercise: {
          prompt: 'Jalur mana yang kamu pilih untuk 30 hari ke depan, dan kenapa?',
          placeholder: 'Aku pilih jalur … karena …',
        },
        tool: { to: '/app/assessment', label: 'Lihat hasil Assessment' },
      },
      {
        id: 'partner-2',
        title: 'Membaca kebutuhan bisnis dalam 10 menit',
        minutes: 5,
        body: [
          'Sebelum menawarkan apa pun, lakukan "audit kecil". Lihat Instagram mereka (kapan terakhir posting, kualitas foto, respons komentar), Google Maps (rating, isi ulasan, jam buka), dan marketplace/ojol (foto menu, deskripsi).',
          'Bedakan fakta dan dugaan. Fakta: "posting terakhir 4 bulan lalu". Dugaan: "sepertinya owner tidak sempat mengurus". Pakai fakta di pesanmu, lalu konfirmasi dugaanmu dengan bertanya.',
        ],
        keyPoints: [
          'Fakta dulu, dugaan belakangan, lalu tanyakan.',
          'Cari 1 masalah yang paling jelas dan paling mudah kamu bantu.',
          'Ulasan pelanggan adalah tambang emas insight.',
        ],
        exercise: {
          prompt: 'Audit satu bisnis: tulis 3 fakta yang kamu temukan, 1 dugaan masalah, dan 1 pertanyaan validasi untuk owner.',
          placeholder: 'Fakta: … Dugaan: … Pertanyaan: …',
        },
        tool: { to: '/app/toolkit?tab=prompts', label: 'Pakai prompt audit bisnis' },
      },
      {
        id: 'partner-3',
        title: 'Skema kerja sama: komisi, fee, atau bagi hasil',
        minutes: 6,
        body: [
          'Komisi: kamu dibayar persentase dari penjualan yang kamu bawa. Cocok untuk sales partner. Pastikan jelas: komisi dari harga jual atau dari keuntungan, dan dihitung dari order yang sudah lunas.',
          'Fee tetap: dibayar per proyek atau per bulan untuk pekerjaan tertentu. Cocok untuk jasa. Tuliskan cakupan, jumlah revisi, dan tenggat.',
          'Bagi hasil: berbagi keuntungan dari suatu proyek. Lebih kompleks — butuh keterbukaan angka. Hindari di awal kecuali dengan orang yang sudah sangat dipercaya.',
        ],
        keyPoints: [
          'Hitung dulu sebelum sepakat — gunakan kalkulator komisi.',
          'Definisikan "deal yang dihitung" dan kapan komisi dibayar.',
          'Semua kesepakatan ditulis, walau hanya di chat.',
        ],
        exercise: {
          prompt: 'Simulasikan satu skema: produk apa, harga, komisi berapa persen, dan berapa unit yang harus terjual untuk mencapai target kecilmu.',
          placeholder: 'Produk … harga … komisi …% … target Rp… → perlu … unit',
        },
        tool: { to: '/app/toolkit?tab=calculator', label: 'Buka Kalkulator Komisi' },
      },
      {
        id: 'partner-4',
        title: 'Dari satu klien menjadi portofolio',
        minutes: 5,
        body: [
          'Klien pertama adalah fondasi portofolio. Dokumentasikan sejak awal: kondisi sebelum, apa yang kamu kerjakan, dan hasil yang bisa diukur (jumlah konten, waktu respons, pesanan yang dibawa).',
          'Minta testimoni dengan sopan setelah pekerjaan selesai dan klien puas. Jangan pernah mengarang testimoni atau angka. Portofolio yang jujur dan kecil jauh lebih kuat daripada yang besar tapi palsu.',
        ],
        keyPoints: [
          'Sebelum → apa yang dikerjakan → sesudah.',
          'Pisahkan proyek nyata, uji coba gratis, dan latihan.',
          'Minta izin sebelum memajang hasil kerja klien.',
        ],
        exercise: {
          prompt: 'Rancang struktur studi kasus pertamamu (boleh dari proyek latihan): masalah, apa yang kamu kerjakan, hasil yang akan kamu ukur.',
          placeholder: 'Masalah: … Yang aku kerjakan: … Hasil yang diukur: …',
        },
      },
    ],
  },
];

export function findModule(slug: string) {
  return MODULES.find((m) => m.slug === slug);
}

export const ALL_LESSON_IDS = MODULES.flatMap((m) => m.lessons.map((l) => l.id));
