import type { LearningModule } from './modules';

/**
 * Modul tambahan GenZ Preneur.
 * Ditulis ulang secara orisinal: konsep umum (Golden Circle, growth mindset,
 * grit, prinsip pengaruh, siklus peradaban, dsb.) diadaptasi ke konteks
 * Gen Z yang memulai bisnis — bukan salinan materi sumber mana pun.
 */
export const EXTRA_MODULES: LearningModule[] = [
  /* ============================ SEASON 1 ============================ */
  {
    slug: 'read-the-game',
    season: 1,
    emoji: '🔭',
    color: 'sky',
    title: 'Read The Game',
    tagline: 'Baca dunia dulu, baru ikut main.',
    lessons: [
      {
        id: 'rtg-1',
        title: 'Fakta, sinyal, tren — atau cuma hype?',
        minutes: 6,
        body: [
          'Tiap minggu ada "bisnis yang lagi naik": es kopi susu, thrifting, jasa joki, jualan AI prompt. Masalahnya, banyak orang ikut terjun karena FOMO, bukan karena membaca situasinya dengan benar.',
          'Biasakan memilah informasi ke dalam tangga ini. FAKTA: sudah terjadi dan bisa dicek. SINYAL: gejala awal yang belum tentu berlanjut. TREN: pola yang konsisten dalam waktu cukup lama. PREDIKSI: tebakan berbasis data dan asumsi. NARASI: cara fakta dirangkai supaya terasa bermakna. HYPE/PROPAGANDA: pesan yang sengaja dibuat untuk menggiring perilaku — biasanya supaya kamu beli sesuatu. SKENARIO: beberapa kemungkinan masa depan untuk persiapan, bukan kepastian.',
          'Entrepreneur yang baik tidak alergi tren, tapi selalu bertanya: "ini sudah fakta, masih sinyal, atau cuma narasi orang yang jualan kelas?"',
        ],
        keyPoints: [
          'Pisahkan apa yang terjadi dari cerita tentang apa yang terjadi.',
          'Satu video viral = sinyal. Tiga bulan permintaan stabil = mulai jadi tren.',
          'Hati-hati dengan "peluang" yang paling keras dipromosikan oleh penjual kursus.',
        ],
        example: {
          title: 'Coba praktikkan',
          text: '"Semua orang sekarang buka usaha matcha." → Fakta: ada 3 kedai baru di dekat kampus. Sinyal: antrean ramai di minggu pertama. Belum tren: kita belum tahu apakah ramai setelah 3 bulan. Narasi: "matcha = cuan pasti".',
        },
        exercise: {
          prompt: 'Pilih satu ide bisnis yang lagi ramai di timeline-mu. Tulis: apa faktanya, apa sinyalnya, apakah sudah tren, dan bagian mana yang cuma narasi/hype.',
          placeholder: 'Ide: … Fakta: … Sinyal: … Tren?: … Hype: …',
        },
      },
      {
        id: 'rtg-2',
        title: '3 Jebakan yang bikin kamu nggak mulai-mulai',
        minutes: 6,
        body: [
          'Banyak anak muda punya ide, tapi tetap diam di tempat. Biasanya bukan karena kurang pintar, tapi karena terjebak di salah satu dari tiga jebakan ini.',
          'JEBAKAN DIRI: butuh validasi terus, takut dinilai, perfeksionis, mager, atau masih membawa pengalaman gagal yang belum selesai. JEBAKAN LINGKUNGAN: standar sukses yang sempit ("yang penting IPK & kerja aman"), circle yang pesimis, dan budaya "nanti aja kalau sudah siap". JEBAKAN DIGITAL: FOMO, flexing, paylater untuk gaya hidup, dan scroll tanpa ujung yang menghabiskan fokus.',
          'Jalan keluarnya bukan menyalahkan diri. Kenali jebakannya → pilih satu kebiasaan penangkal → buktikan dengan aksi kecil yang konsisten.',
        ],
        keyPoints: [
          'Kamu nggak bisa keluar dari jebakan yang nggak kamu sadari.',
          'Lawan jebakan dengan kebiasaan, bukan dengan niat sesaat.',
          'Satu langkah kecil yang selesai lebih kuat dari rencana besar yang ditunda.',
        ],
        exercise: {
          prompt: 'Jebakan mana yang paling sering menahanmu? Tulis satu contoh nyata dan satu kebiasaan penangkal yang akan kamu jalankan minggu ini.',
          placeholder: 'Jebakan terbesarku: … Contohnya: … Penangkalnya: …',
        },
      },
      {
        id: 'rtg-3',
        title: 'Problem Map: dari keresahan jadi peluang',
        minutes: 7,
        body: [
          'Bisnis yang kuat lahir dari masalah yang dipahami dengan jernih. Problem Map membantumu bergerak dari "kayaknya ada yang salah" menjadi "aku tahu harus bantu apa".',
          'Isi berurutan: (1) FENOMENA — apa yang terlihat di permukaan. (2) MASALAH INTI — apa yang sebenarnya rusak. (3) AKAR MASALAH — kenapa itu terus terjadi. (4) DAMPAK — siapa rugi dan seberapa besar. (5) SIAPA TERDAMPAK — orang/bisnis yang paling merasakan. (6) LANGKAH AWAL — bantuan kecil yang bisa kamu tawarkan sekarang.',
          'Langkah awal itulah calon bisnismu. Kalau kamu bisa menyelesaikannya untuk satu orang, kamu bisa mulai menawarkannya ke orang berikutnya.',
        ],
        keyPoints: [
          'Jangan berhenti di fenomena — gali sampai akar.',
          'Peluang bisnis = langkah awal yang realistis untuk orang yang terdampak.',
          'Validasi dugaanmu dengan bertanya ke orang yang mengalaminya.',
        ],
        example: {
          title: 'Contoh Problem Map',
          text: 'Fenomena: warung di sekitar kos sepi di aplikasi ojol. Masalah inti: menu tidak menarik & jarang promo. Akar: owner sibuk melayani, tidak paham aplikasi. Dampak: omzet turun, kalah dari brand besar. Terdampak: warung keluarga. Langkah awal: jasa rapikan menu + foto HP + atur promo mingguan.',
        },
        exercise: {
          prompt: 'Buat Problem Map untuk satu keresahan yang kamu lihat di sekitarmu. Simpan versi rapinya di AI Toolkit.',
          placeholder: 'Fenomena: … Masalah inti: … Akar: … Dampak: … Terdampak: … Langkah awal: …',
        },
        tool: { to: '/app/toolkit?tab=problem', label: 'Buka Problem Map' },
      },
      {
        id: 'rtg-4',
        title: '6 Zona Dampak: cuan yang bikin hidup orang lebih baik',
        minutes: 6,
        body: [
          'Bisnis terbaik bukan cuma menghasilkan uang, tapi menjaga sesuatu yang penting dalam hidup orang. Pakai 6 Zona Dampak ini untuk melihat di mana bisnismu berkontribusi.',
          '🧭 NILAI & MAKNA — membantu orang hidup lebih terarah dan berintegritas. ❤️ JIWA & KESEHATAN — makanan sehat, olahraga, kesehatan mental, keselamatan. 🧠 AKAL & PENDIDIKAN — belajar, literasi, skill, melawan hoaks. 👨‍👩‍👧 KELUARGA & GENERASI — parenting, relasi sehat, anak & remaja. 💰 EKONOMI & HARTA — UMKM, literasi keuangan, lapangan kerja, transaksi jujur. 🌱 ALAM & LINGKUNGAN — sampah, pangan lokal, energi, gaya hidup berkelanjutan.',
          'Saat bisnismu jelas menjaga salah satu zona ini, kamu punya alasan yang lebih kuat untuk bertahan — dan pelanggan lebih mudah percaya.',
        ],
        keyPoints: [
          'Cuan dan makna bisa berjalan bersama.',
          'Pilih satu zona utama supaya pesan bisnismu fokus.',
          'Hindari bisnis yang merusak zona-zona ini (riba yang menjerat, produk ilegal, eksploitasi).',
        ],
        exercise: {
          prompt: 'Zona dampak mana yang paling bikin kamu peduli? Tulis 2 ide bisnis modal kecil yang menjaga zona itu.',
          placeholder: 'Zonaku: … Ide 1: … Ide 2: …',
        },
        tool: { to: '/app/toolkit?tab=problem', label: 'Petakan dengan Problem Map' },
      },
    ],
  },

  /* ============================ SEASON 2 ============================ */
  {
    slug: 'why-engine',
    season: 2,
    emoji: '🔥',
    color: 'pink',
    title: 'Why Engine',
    tagline: 'Alasan yang bikin kamu tetap jalan waktu capek.',
    lessons: [
      {
        id: 'why-1',
        title: 'Kenapa WHY lebih kuat dari modal',
        minutes: 5,
        body: [
          'Dua kedai kopi bisa menjual kopi yang sama. Yang satu tutup setelah 6 bulan, yang lain bertahan 10 tahun. Sering kali bedanya bukan modal, tapi alasan yang membuat pendirinya tetap bangun pagi saat penjualan sepi.',
          'Simon Sinek menggambarkannya dengan Golden Circle: WHY (kenapa kamu melakukannya), HOW (cara khasmu), WHAT (produk/jasanya). Kebanyakan orang menjelaskan bisnis dari WHAT. Bisnis yang membekas berbicara dari WHY.',
          'WHY bukan slogan untuk dipajang. Ia kompas: membantu memilih klien, menolak tawaran yang tidak sejalan, dan bertahan saat hasil belum terlihat.',
        ],
        keyPoints: [
          'Resources membantu memulai, WHY membantu bertahan.',
          'Orang membeli dari yang mereka percayai, bukan cuma dari spesifikasi.',
          'WHY yang kuat terlihat dari konsistensi, bukan dari kata-kata.',
        ],
        exercise: {
          prompt: 'Tulis WHY, HOW, dan WHAT dari bisnis/jasa yang ingin kamu jalankan (boleh masih kasar).',
          placeholder: 'WHY: … HOW: … WHAT: …',
        },
      },
      {
        id: 'why-2',
        title: 'Mimpi, target, dan kontribusi — apa bedanya?',
        minutes: 5,
        body: [
          'Mimpi sering berbunyi "punya mobil", "omzet 100 juta", "jadi bos". Itu sah. Tapi mimpi yang hanya tentang diri sendiri gampang padam ketika sudah tercapai — atau ketika terasa terlalu jauh.',
          'Kontribusi adalah manfaat yang kamu hadirkan untuk orang lain. Di GenZ Preneur, kami melihat karier dan cuan sebagai TANGGA untuk memperluas kontribusi, bukan tujuan akhir.',
          'Bedakan juga kontribusi biasa (rutinitas baik sehari-hari) dengan KONTRIBUSI UNGGULAN: satu karya besar yang ingin kamu tinggalkan — bisnis, sistem, gerakan, atau karya yang manfaatnya terasa luas. Kalau memikirkannya bikin kamu deg-degan dan pengin bergerak, berarti kamu berada di jalur yang tepat.',
        ],
        keyPoints: [
          'Target = angka. Kontribusi = manfaat. Keduanya perlu, tapi kontribusi memberi arah.',
          'Cuan adalah alat memperluas dampak.',
          'Kontribusi unggulan itu fokus: satu masterpiece, bukan seratus proyek setengah jalan.',
        ],
        exercise: {
          prompt: 'Tulis 3 mimpi pribadimu, lalu ubah masing-masing menjadi versi kontribusi ("supaya orang lain bisa…").',
          placeholder: 'Mimpi: punya bisnis apparel → Kontribusi: supaya 50 anak muda punya penghasilan sambil kuliah…',
        },
      },
      {
        id: 'why-3',
        title: 'Rumus Personal WHY: UNTUK… SUPAYA…',
        minutes: 7,
        body: [
          'Personal WHY bisa dirumuskan dari empat bahan. (1) KERESAHAN: masalah apa yang secara pribadi bikin kamu gelisah? (2) KEYAKINAN: apa yang kamu percaya benar tentang masalah itu? (3) SIAPA YANG DILAYANI: kelompok spesifik yang ingin kamu bantu. (4) KOMITMEN: kontribusi yang siap kamu jalankan secara konsisten.',
          'Untuk menemukannya, lihat ke belakang: pengalaman apa yang paling membentukmu? Tema apa yang terus muncul — hal yang bikin kamu marah, peduli, atau bersemangat? Hubungkan titik-titiknya.',
          'Lalu rumuskan: "UNTUK [kontribusi yang kujalankan] bagi [siapa yang kulayani], SUPAYA [dampak yang ingin kuhadirkan]." Versi pertama tidak harus sempurna. WHY akan makin tajam seiring kamu bergerak.',
        ],
        keyPoints: [
          'WHY ditemukan dari pola hidupmu, bukan dikarang dari nol.',
          'Semakin spesifik siapa yang kamu layani, semakin tajam WHY-mu.',
          'Kalau kamu bergabung dengan tim/komunitas, WHY pribadimu tidak harus sama, tapi harus selaras.',
        ],
        example: {
          title: 'Contoh Personal WHY',
          text: 'Keresahan: banyak UMKM di kampungku tutup karena tidak bisa jualan online. Keyakinan: usaha kecil layak naik kelas kalau dibantu dengan tepat. Siapa: pemilik warung & UMKM keluarga. → "UNTUK membantu UMKM keluarga berjualan online dengan rapi, SUPAYA mereka bertahan dan bisa membuka lapangan kerja di lingkungannya."',
        },
        exercise: {
          prompt: 'Isi empat bahan Personal WHY-mu, lalu tulis kalimat UNTUK… SUPAYA… versi pertamamu.',
          placeholder: 'Keresahan: … Keyakinan: … Siapa: … Komitmen: … → UNTUK … SUPAYA …',
        },
        tool: { to: '/app/dream-pact', label: 'Tulis di Dream Pact' },
      },
      {
        id: 'why-4',
        title: 'Dream Statement: tulis masa depanmu',
        minutes: 6,
        body: [
          'Mimpi yang hanya ada di kepala gampang berubah jadi wacana. Mimpi yang ditulis menjadi tujuan. Tujuan yang diberi waktu menjadi rencana. Rencana yang dieksekusi menjadi kenyataan.',
          'Tulis Dream Statement-mu dengan format: "Di usia ___, aku membangun ___ supaya ___ bisa merasakan ___." Lalu lakukan backcasting: mulai dari mimpi di masa depan, hitung mundur milestone-nya sampai ke langkah yang bisa kamu lakukan minggu ini.',
          'Satu pertanyaan uji: "Kalau suatu hari namamu disebut, kamu ingin dikenang sebagai apa?" Jawaban jujurmu atas pertanyaan ini sering lebih jelas daripada target omzet.',
        ],
        keyPoints: [
          'Tulis → beri waktu → pecah jadi milestone → eksekusi.',
          'Mimpi besar dikerjakan dengan langkah kecil yang terjadwal.',
          'Dream Pact adalah komitmen tertulismu — cetak dan tempel di tempat yang sering kamu lihat.',
        ],
        exercise: {
          prompt: 'Tulis Dream Statement versi pertamamu dan jawab: kamu ingin dikenang sebagai apa?',
          placeholder: 'Di usia … aku membangun … supaya … bisa merasakan … · Dikenang sebagai: …',
        },
        tool: { to: '/app/dream-pact', label: 'Buat Dream Pact' },
      },
    ],
  },
  {
    slug: 'find-your-edge',
    season: 2,
    emoji: '⚔️',
    color: 'lime',
    title: 'Find Your Edge',
    tagline: 'Kenali senjata utamamu, asah sampai tajam.',
    lessons: [
      {
        id: 'edge-1',
        title: 'Bakat itu benih, bukan hasil',
        minutes: 6,
        body: [
          'Bakat bukan jaminan sukses — ia benih. Urutannya: BAKAT (kecenderungan alami) + MINAT (energi untuk mengeksplorasi) → LATIHAN (diulang dengan sengaja) → SKILL → KEKUATAN (performa yang konsisten) → MASTERY (kekuatan yang punya pembeda) → PERAN (posisi untuk memberi manfaat) → DAMPAK.',
          'Enam tanda sesuatu adalah bakatmu: terasa NATURAL, NIKMAT saat dikerjakan, CEPAT dipahami, HASILNYA cenderung bagus, bisa DIULANG dengan konsisten, dan bikin NAGIH ingin melakukannya lagi.',
          'Lihat bakat sebagai titipan: dikenali, dikembangkan, dipakai untuk kebaikan — dan suatu hari dipertanggungjawabkan.',
        ],
        keyPoints: [
          'Bakat tanpa latihan = potensi yang tidur.',
          'Kekuatan dibuktikan oleh konsistensi, bukan oleh perasaan.',
          'Assessment adalah peta awal, bukan batas.',
        ],
        exercise: {
          prompt: 'Tulis 3 aktivitas yang memenuhi paling banyak dari 6 tanda bakat. Tanda mana saja yang terpenuhi?',
          placeholder: '1. Bikin konten — natural, nikmat, nagih…',
        },
      },
      {
        id: 'edge-2',
        title: 'Peta kekuatan: Main Weapon, Hidden Gem, Blind Spot',
        minutes: 6,
        body: [
          'Cara kamu melihat dirimu dan cara orang lain melihatmu sering berbeda. Petakan kekuatanmu ke empat kotak.',
          '⚔️ MAIN WEAPON — kamu sadar dan orang lain juga melihatnya. Asah terus jadi mastery. 💎 HIDDEN GEM — kamu tahu, tapi belum pernah ditunjukkan (takut, belum ada kesempatan, belum ada portofolio). Aktifkan. 🙈 BLIND SPOT — orang lain melihatnya, kamu tidak: bisa kekuatan yang tidak kamu sadari, atau kebiasaan yang dampaknya berbeda dari niatmu. Kelola. 🧪 UNEXPLORED — belum diketahui siapa pun karena belum pernah dicoba. Eksplorasi.',
          'Minta feedback dari tiga orang yang pernah bekerja bersamamu: "Menurutmu aku paling bisa diandalkan untuk apa? Apa yang sebaiknya kuperbaiki?"',
        ],
        keyPoints: [
          'Feedback adalah cermin yang tidak bisa kamu buat sendiri.',
          'Hidden gem butuh panggung kecil untuk dibuktikan.',
          'Blind spot yang dikelola bisa berubah jadi kekuatan.',
        ],
        exercise: {
          prompt: 'Isi keempat kotak peta kekuatanmu, minimal satu poin per kotak. Catat juga jawaban feedback dari teman.',
          placeholder: 'Main Weapon: … Hidden Gem: … Blind Spot: … Unexplored: …',
        },
      },
      {
        id: 'edge-3',
        title: 'Skill Stack: Core, Connector, Multiplier',
        minutes: 6,
        body: [
          'Satu skill jarang cukup untuk berbisnis. Susun skill-mu berlapis. CORE SKILL: keahlian inti yang ingin kamu kuasai paling dalam (misal: desain, video, sales). CONNECTOR SKILL: keterampilan yang membuat core skill bisa dipakai di dunia nyata (memahami brief, presentasi, manajemen proyek, copywriting). MULTIPLIER SKILL: yang memperbesar skala dan dampak (jualan, networking, membangun tim, memahami keuangan).',
          'Pikirkan juga bentuk keahlianmu. I-shaped: spesialis dalam. T-shaped: dalam di satu bidang + paham banyak hal. Pi-shaped: dalam di dua bidang. Comb-shaped: beberapa keahlian dalam sekaligus. Makin kompleks peran yang kamu ambil, makin perlu kombinasi kedalaman dan keluasan.',
        ],
        keyPoints: [
          'Core membuatmu unggul, connector membuatmu terpakai, multiplier membuatmu besar.',
          'Untuk mulai, cukup T-shaped: satu yang dalam, sisanya cukup paham.',
          'Pilih skill berikutnya berdasarkan peran yang ingin kamu ambil.',
        ],
        example: {
          title: 'Contoh skill stack',
          text: 'Core: desain feed Instagram. Connector: memahami brief UMKM + copywriting caption. Multiplier: menawarkan paket bulanan + merekrut 1 asisten saat klien bertambah.',
        },
        exercise: {
          prompt: 'Susun skill stack-mu sekarang dan skill stack yang kamu butuhkan 1 tahun lagi.',
          placeholder: 'Sekarang — Core: … Connector: … Multiplier: … · 1 tahun lagi: …',
        },
      },
      {
        id: 'edge-4',
        title: 'Level-Up Loop: growth mindset + grit',
        minutes: 6,
        body: [
          'Growth mindset (Carol Dweck) adalah keyakinan bahwa kemampuan bisa berkembang dan kegagalan adalah feedback. Grit (Angela Duckworth) adalah ketahanan untuk tetap di jalur sampai kemampuan itu benar-benar tumbuh. Tanpa grit, growth mindset cuma jadi kutipan.',
          'Pakai Level-Up Loop: BELAJAR → LATIHAN → BERKARYA → MINTA FEEDBACK → PERBAIKI → ULANGI. Lengkapi dengan lima perangkat: role model (standar terbaik di bidangmu), mentor (yang memberi arahan), sumber belajar, latihan yang disengaja, dan proyek nyata sebagai bukti.',
          'Lalu rumuskan Edge Statement: "Dengan kekuatan ___ yang kuasah lewat ___, aku ambil peran sebagai ___ untuk membantu ___ menyelesaikan ___, supaya ___."',
        ],
        keyPoints: [
          'Penghambat umum: label dari keluarga, lingkungan stagnan, takut salah, fatalisme, dan prokrastinasi.',
          'Ukur progres, bukan pembuktian diri.',
          'Mastery dibangun lewat proyek nyata, bukan cuma nonton tutorial.',
        ],
        exercise: {
          prompt: 'Isi lima perangkat Level-Up-mu (role model, mentor, sumber belajar, latihan, proyek nyata) dan tulis Edge Statement versi pertama.',
          placeholder: 'Role model: … Mentor: … Sumber: … Latihan: … Proyek: … · Dengan kekuatan …',
        },
        tool: { to: '/app/dream-pact', label: 'Simpan Edge di Dream Pact' },
      },
    ],
  },

  /* ============================ SEASON 4 ============================ */
  {
    slug: 'lead-the-squad',
    season: 4,
    emoji: '🫡',
    color: 'lilac',
    title: 'Lead The Squad',
    tagline: 'Leadership bukan jabatan — mulai dari ambil tanggung jawab.',
    lessons: [
      {
        id: 'lead-1',
        title: 'Pimpin diri sendiri dulu',
        minutes: 5,
        body: [
          'Leadership bukan posisi di struktur organisasi. Ia dimulai ketika kamu berani mengambil inisiatif dan menanggung konsekuensinya.',
          'Sebelum memimpin orang lain, kamu memimpin diri sendiri: disiplin, bertanggung jawab atas hasil, berani mengambil risiko yang terukur, tetap tenang di bawah tekanan, dan bangkit lagi setelah jatuh. Setelah itu baru kamu bisa memimpin orang lain: mengarahkan, mengajari, memberi contoh, dan memengaruhi.',
          'Perdebatan "pemimpin itu dilahirkan atau dibentuk" tidak terlalu penting. Yang penting: leadership bisa DIBANGUN dengan sengaja — sebagai amanah, bukan sebagai gengsi.',
        ],
        keyPoints: [
          'Self-leadership adalah fondasi leadership.',
          'Kamu dimintai tanggung jawab atas apa yang kamu pimpin, sekecil apa pun.',
          'Ambil satu inisiatif kecil minggu ini tanpa menunggu disuruh.',
        ],
        exercise: {
          prompt: 'Tulis satu area hidupmu yang belum kamu pimpin dengan baik, dan satu inisiatif kecil yang akan kamu ambil.',
          placeholder: 'Area: … Inisiatif: …',
        },
      },
      {
        id: 'lead-2',
        title: '4 skill founder-leader',
        minutes: 7,
        body: [
          'Pemimpin yang efektif butuh empat skill. TEKNIS: paham bidang yang dikerjakan. INTERPERSONAL: komunikasi, mendengar, empati, negosiasi, memberi & menerima feedback. STRATEGIS: membaca realitas, menemukan akar masalah, menentukan prioritas, menyesuaikan strategi. MANAJERIAL: mengubah gagasan menjadi target, jadwal, pembagian peran, dan evaluasi.',
          'Lihat dua kombinasi ini. Teknis kuat tapi interpersonal lemah = jago, tapi susah kerja bareng. Interpersonal kuat tapi teknis lemah = disukai, tapi kurang substansi. Strategis kuat tapi manajerial lemah = visinya keren, eksekusinya berantakan. Manajerial kuat tapi strategis lemah = rapi, tapi belum tentu menuju arah yang benar.',
          'Tujuannya bukan sempurna di keempatnya, tapi tahu gap-mu dan cari partner yang melengkapinya.',
        ],
        keyPoints: [
          'Visi besar butuh eksekusi yang rapi.',
          'Kompetensi butuh kemampuan menggerakkan orang.',
          'Cari co-founder/partner yang menutup gap terbesarmu.',
        ],
        exercise: {
          prompt: 'Nilai dirimu 1–5 untuk keempat skill. Skill mana yang paling perlu dinaikkan dalam 3 bulan, dan bagaimana caranya?',
          placeholder: 'Teknis: … Interpersonal: … Strategis: … Manajerial: … · Fokus: …',
        },
      },
      {
        id: 'lead-3',
        title: 'Pengaruh yang etis: 7 pemicu keputusan',
        minutes: 7,
        body: [
          'Orang mengambil keputusan dengan dua mode: cepat-otomatis (emosi, kebiasaan) dan lambat-sadar (pertimbangan). Pengaruh yang baik membantu orang memutuskan dengan jernih — bukan memanipulasi mode cepatnya.',
          'Tujuh pemicu yang sering bekerja: PERHATIAN (yang unik, baru, relevan), TIMBAL BALIK (kebaikan yang didahulukan, misal contoh gratis), BUKTI SOSIAL (orang ikut yang dipercaya banyak orang), KONSISTENSI (orang percaya pada yang terbukti menepati), KEDEKATAN (orang lebih percaya pada yang mirip & tulus), OTORITAS (kredibilitas, portofolio, penampilan profesional), dan KELANGKAAN (sesuatu yang benar-benar terbatas).',
          'Garis merah GenZ Preneur: dilarang membuat testimoni palsu, angka palsu, kelangkaan palsu ("sisa 2!" padahal tidak), atau menakut-nakuti. Pengaruh dibangun dari kepercayaan, dan kepercayaan hancur dalam satu kebohongan.',
        ],
        keyPoints: [
          'Persuasi etis = membantu orang memutuskan yang terbaik untuknya.',
          'Bukti nyata (contoh hasil, portofolio) adalah alat pengaruh paling kuat untuk pemula.',
          'Manipulasi mungkin menang sekali, tapi kalah selamanya.',
        ],
        exercise: {
          prompt: 'Pilih 3 pemicu yang akan kamu pakai secara jujur dalam penawaranmu. Tulis cara konkretnya.',
          placeholder: 'Timbal balik: kirim 1 contoh desain gratis… Bukti sosial: …',
        },
        tool: { to: '/app/outreach', label: 'Terapkan di Outreach Studio' },
      },
      {
        id: 'lead-4',
        title: 'Squad: kapan memimpin, kapan dipimpin',
        minutes: 6,
        body: [
          'Tim yang sehat butuh dua hal: PERAN yang sesuai kekuatan masing-masing, dan TRUST supaya energi tidak habis untuk friksi. Tanpa keduanya, muncul tumpang tindih, konflik, dan suasana toxic.',
          'Pahami posisimu. Saat DIPIMPIN, tugasmu mendengar, memahami brief, dan mengeksekusi dengan disiplin dan total. Saat MEMIMPIN, tugasmu memberi arah, merencanakan, menetapkan target, mengawasi, dan mengevaluasi. Orang yang sama bisa berganti peran di proyek yang berbeda.',
          'Karakter adalah kompas: jujur dalam kata, bisa dipercaya dalam tindakan, adil, rendah hati, dan tangguh. Tambahkan cara berpikir jangka panjang: lihat lebih jauh, jaga arah, jangan cepat menilai hasil, dan ubah strategi — bukan tujuan — saat keadaan berubah.',
        ],
        keyPoints: [
          'Taruh orang sesuai kekuatannya.',
          'Trust dibangun dari konsistensi kecil yang berulang.',
          'Adaptasi strategi boleh, tujuan tetap.',
        ],
        exercise: {
          prompt: 'Bayangkan tim 3 orang untuk bisnismu. Peran apa yang dibutuhkan, peran mana yang kamu ambil, dan aturan main apa yang menjaga trust?',
          placeholder: 'Peran 1: … Peran 2: … Peranku: … Aturan main: …',
        },
      },
    ],
  },
  {
    slug: 'life-ops',
    season: 4,
    emoji: '🗂️',
    color: 'amber-soft',
    title: 'Life Ops',
    tagline: 'Kelola hidup seperti kamu mengelola bisnis.',
    lessons: [
      {
        id: 'ops-1',
        title: '6 Aset Founder',
        minutes: 6,
        body: [
          'Sebelum bicara modal uang, cek modal hidupmu. Semakin kuat asetnya, semakin luas ruang geraknya. Semakin lemah, semakin sempit peluangmu.',
          '⏳ WAKTU — terbatas dan tidak bisa diulang; nilai seseorang terlihat dari produktivitas per waktunya. ⚡ ENERGI & KESEHATAN — fisik adalah kendaraan ide besar: tidur cukup, makan benar, gerak rutin. 🧠 PIKIRAN — akal yang jernih, tidak mudah termakan hoaks dan bias. 🏠 KELUARGA — dukungan, doa, dan tempat pulang; jaga hubungannya. 🤝 NETWORK — teman tumbuh, rekan kerja, mentor, dan mentee. 🧭 MAKNA — alasan hidup yang membuatmu tenang dan tidak serakah.',
        ],
        keyPoints: [
          'Aset hidup yang rusak akan menggerus bisnis yang sedang tumbuh.',
          'Burnout adalah tanda aset energi dikuras tanpa diisi ulang.',
          'Network yang baik = ada yang kamu ajari, ada yang mengajarimu.',
        ],
        exercise: {
          prompt: 'Nilai 6 aset founder-mu (1–5). Pilih satu yang paling lemah dan satu kebiasaan untuk memperkuatnya.',
          placeholder: 'Waktu: … Energi: … Pikiran: … Keluarga: … Network: … Makna: … · Fokus: …',
        },
      },
      {
        id: 'ops-2',
        title: 'Skill Tree: 4 cabang pertumbuhan',
        minutes: 6,
        body: [
          'Mimpi besar butuh kapasitas, dan kapasitas perlu kurikulum pribadi — daftar hal yang sengaja kamu latih, bukan sekadar yang kebetulan kamu pelajari.',
          'Bagi Skill Tree-mu menjadi empat cabang. 🧠 BRAIN: pengetahuan & skill (marketing, keuangan, bahasa Inggris, AI tools). ❤️ HEART: kematangan emosi (sabar, komunikatif, empatik, berani tampil). ✨ SOUL: nilai & spiritual (ibadah/refleksi rutin, integritas, syukur). 💪 BODY: fisik & stamina (lari, olahraga rutin, tidur, nutrisi).',
          'Cara menyusunnya: pelajari biografi orang yang kamu kagumi, serap arahan mentor, lalu sesuaikan dengan kebutuhan Dream Pact-mu.',
        ],
        keyPoints: [
          'Keempat cabang harus terisi — jangan cuma Brain.',
          'Kurikulum pribadi membuat setiap langkah fokus pada yang paling relevan.',
          'Belajar dari biografi = mengikuti jalan terbaik yang pernah ada dan menghindari kesalahan yang tidak perlu diulang.',
        ],
        exercise: {
          prompt: 'Isi minimal 3 item untuk setiap cabang Skill Tree-mu.',
          placeholder: 'Brain: … Heart: … Soul: … Body: …',
        },
        tool: { to: '/app/dream-pact', label: 'Isi Skill Tree di Dream Pact' },
      },
      {
        id: 'ops-3',
        title: 'Rencana 12 bulan: Level Up, Cuan, Impact',
        minutes: 7,
        body: [
          'Bagi aktivitas tahunanmu ke tiga kategori. 📈 LEVEL UP: membangun kapasitas (kursus, latihan, kebiasaan). 💸 CUAN: karier & bisnis (klien pertama, target omzet, skripsi/kerja). 🌍 IMPACT: kontribusi (organisasi, komunitas, membantu usaha keluarga).',
          'Lima aturan mainnya: BERTAHAP — mulai ringan di tahun pertama. PRIORITAS — tulis hanya agenda yang benar-benar layak. SEIMBANG — keempat cabang Skill Tree punya porsi. BERKELANJUTAN — target tahunan terhubung ke milestone jangka panjang. MOMENTUM — manfaatkan momen spesifik (libur semester, bulan ramai belanja).',
          'Jaga ritmenya dengan tiga cara: hemat energi (jangan semua dimulai di bulan yang sama), jadwal realistis, dan lingkungan yang mendukung.',
        ],
        keyPoints: [
          'Rencana tanpa bulan = keinginan.',
          'Lebih baik 8 agenda yang selesai daripada 30 yang ditinggal.',
          'Review rencanamu tiap akhir bulan.',
        ],
        example: {
          title: 'Contoh potongan rencana mahasiswa',
          text: 'Level Up: kursus digital marketing (Maret), latihan public speaking (Mei–Juni). Cuan: 3 klien desain UMKM (April–Juli), target Rp1,5 jt/bulan (Agustus). Impact: bantu promosi usaha orang tua (sepanjang tahun).',
        },
        exercise: {
          prompt: 'Tulis 2 agenda untuk masing-masing kategori lengkap dengan target dan bulannya.',
          placeholder: 'Level Up: … (bulan) · Cuan: … · Impact: …',
        },
        tool: { to: '/app/dream-pact', label: 'Susun di Dream Pact' },
      },
      {
        id: 'ops-4',
        title: 'Berpikir jernih & belajar cepat',
        minutes: 7,
        body: [
          'Keputusan bisnis yang buruk sering lahir dari jebakan logika. Waspadai: SUNK COST ("sudah keluar banyak, sayang kalau berhenti"), BANDWAGON ("semua orang jualan ini, pasti laku"), GENERALISASI TERGESA ("2 orang nggak balas, berarti jasaku nggak laku"), BERLINDUNG DI BALIK OTORITAS ("kata influencer A pasti benar"), DILEMA PALSU ("pilihannya cuma kerja kantoran atau gagal"), dan SALAH SEBAB-AKIBAT.',
          'Latih beberapa mode berpikir: KRITIS (mencari celah untuk menguji kebenaran), KREATIF (melihat masalah dari sudut baru), DIVERGEN lalu KONVERGEN (banyak ide dulu, lalu pilih satu), dan STRATEGIS (mengantisipasi dan membangun masa depan).',
          'Untuk belajar cepat: baca dengan tujuan, rangkum dengan kata sendiri, dengarkan untuk mencari gambaran besar, lalu tulis. Cari mentor lewat tiga jalur: langsung (bertemu dan belajar), lintas bidang (dari orang di luar industrimu), dan jarak jauh (lewat buku, podcast, dan konten mereka).',
        ],
        keyPoints: [
          'Data kecil jangan dipakai untuk kesimpulan besar.',
          'Banyak ide dulu, baru pilih — jangan langsung jatuh cinta pada ide pertama.',
          'Belajar paling melekat saat kamu mengajarkannya lagi.',
        ],
        exercise: {
          prompt: 'Ingat satu keputusan terakhirmu yang kurang tepat. Jebakan logika mana yang ikut berperan? Apa yang akan kamu lakukan berbeda?',
          placeholder: 'Keputusan: … Jebakan: … Lain kali: …',
        },
        tool: { to: '/app/outreach?skenario=mentor', label: 'Hubungi calon mentor' },
      },
    ],
  },
  {
    slug: 'future-proof',
    season: 4,
    emoji: '🛡️',
    color: 'sky',
    title: 'Future Proof',
    tagline: 'Dunia berubah cepat. Siapkan dirimu dan bisnismu.',
    lessons: [
      {
        id: 'fp-1',
        title: '3 cakrawala masa depan',
        minutes: 6,
        body: [
          'Masa depan bukan cuma soal apa yang ingin kamu capai. Ada tiga cakrawala yang perlu dipikirkan bersama.',
          'PERTAMA, hidupmu punya batas waktu. Status, saldo, dan pencapaian berhenti saat hidup berhenti — tapi karya dan kebaikan bisa terus mengalir. Ada tiga warisan yang terus bekerja: SISTEM & ASET PRODUKTIF yang memberi manfaat, ILMU yang kamu wariskan (kurikulum, buku, konten, metode), dan ORANG yang kamu bina sebagai penerus. KEDUA, duniamu akan berubah: teknologi, ekonomi, dan pusat kekuatan bergeser. KETIGA, ada hal yang sama sekali di luar kendalimu — dan justru di situ kesiapan diri diuji.',
          'Founder yang matang membangun bisnis yang tetap berguna setelah dia tidak lagi mengurusnya sendiri.',
        ],
        keyPoints: [
          'Bangun yang bertahan lebih lama dari dirimu: sistem, ilmu, dan orang.',
          'Kaderisasi adalah strategi bisnis, bukan sekadar kegiatan organisasi.',
          'Kamu tidak bisa mengendalikan semua perubahan, tapi bisa memilih persiapanmu.',
        ],
        exercise: {
          prompt: 'Dari tiga warisan (sistem, ilmu, orang), mana yang paling mungkin kamu mulai tahun ini lewat bisnismu?',
          placeholder: 'Warisan yang kumulai: … Caranya: …',
        },
      },
      {
        id: 'fp-2',
        title: 'Kenapa bisnis (dan peradaban) naik-turun',
        minutes: 7,
        body: [
          'Sejarawan seperti Ibnu Khaldun dan Arnold Toynbee melihat pola berulang: lahir → tumbuh → makmur → nyaman & stagnan → runtuh. Pola yang mirip juga terjadi pada brand dan startup.',
          'Tanda-tanda rapuh dari dalam: SOLIDARITAS memudar (kepentingan pribadi lebih besar dari tujuan bersama), PEMIMPIN menjauh dari pelanggan & tim, ATURAN tidak konsisten, EKONOMI bergantung pada utang dan pengeluaran gengsi, TEKNOLOGI tertinggal, dan KEPERCAYAAN hilang. Pemicu dari luar: bencana, krisis ekonomi, disrupsi teknologi, dan perubahan pasar.',
          'Pelajarannya untuk founder muda: saat bisnis mulai "aman", justru itu waktu paling berbahaya untuk berhenti belajar.',
        ],
        keyPoints: [
          'Banyak bisnis tidak kalah dari kompetitor — mereka melemah dari dalam.',
          'Tetap dekat dengan pelanggan, tim, dan realitas lapangan.',
          'Utang untuk gaya hidup adalah tanda kerapuhan.',
        ],
        exercise: {
          prompt: 'Pikirkan satu brand yang dulu besar lalu meredup. Tanda kerapuhan mana yang menurutmu terjadi? Apa pelajarannya untuk bisnismu?',
          placeholder: 'Brand: … Tanda kerapuhan: … Pelajaranku: …',
        },
      },
      {
        id: 'fp-3',
        title: '3 kunci dunia berikutnya',
        minutes: 6,
        body: [
          'Untuk bertahan di dunia yang sedang bergeser, siapkan tiga kapasitas. PAHAMI PERGESERAN EKONOMI: pusat pertumbuhan dunia makin banyak bergeser ke Asia; perdagangan, infrastruktur, dan konektivitas jadi sumber kekuatan. Itu peluang bagi Indonesia — kalau kita siap.',
          'PAHAMI TEKNOLOGI: AI, otomasi, dan data mengubah cara bisnis berjalan. Jangan takut tergantikan; jadilah orang yang paling cepat memakai teknologi untuk menyelesaikan masalah nyata — dengan etika.',
          'KUASAI DIRIMU: berpikir jernih, komunikasi, kemampuan belajar mandiri, kecerdasan emosi, literasi keuangan & bisnis, kemampuan teknologi, serta etika dan nilai yang kokoh.',
        ],
        keyPoints: [
          'Peta dunia berubah; pelajari arahnya, bukan cuma beritanya.',
          'AI adalah alat — nilai dan penilaianmu tetap yang menentukan.',
          'Kapasitas diri adalah satu-satunya aset yang ikut ke mana pun kamu pergi.',
        ],
        exercise: {
          prompt: 'Tulis satu cara AI bisa membantu bisnismu bulan ini, dan satu skill "kuasai diri" yang ingin kamu tingkatkan.',
          placeholder: 'AI untuk: … Skill diri: …',
        },
        tool: { to: '/app/toolkit?tab=prompts', label: 'Coba AI prompt' },
      },
      {
        id: 'fp-4',
        title: 'Jangan cuma kritik — bangun alternatifnya',
        minutes: 7,
        body: [
          'Mengeluh soal sistem itu gampang. Yang langka adalah orang yang mau membangun alternatifnya. Mulai dengan tiga langkah: SADARI KETERGANTUNGAN (untuk pangan, uang, informasi, pendidikan, kesehatan — kamu bergantung pada siapa?), KURANGI yang tidak perlu, lalu BANGUN KEMAMPUAN PARALEL.',
          'Kamu tidak perlu membangun semuanya. Kamu cukup membangun bagianmu. Orang pendidikan bisa membuat kelas kecil atau learning pod. Orang pangan bisa membangun kebun komunitas atau jaringan petani lokal. Orang ekonomi bisa membangun koperasi, marketplace lokal, atau inkubator usaha mikro. Orang teknologi bisa membuat tools sederhana untuk UMKM. Orang media bisa membuat konten edukatif. Orang kesehatan bisa membangun program hidup sehat.',
          'Peran berbeda, satu arah: menghadirkan solusi yang memperkuat masyarakat. Di sinilah banyak bisnis bermakna lahir.',
        ],
        keyPoints: [
          'Kritik tanpa karya cuma menambah kebisingan.',
          'Setiap orang membangun satu kepingan solusi.',
          'Bisnis yang mengurangi ketergantungan masyarakat biasanya punya pasar yang setia.',
        ],
        exercise: {
          prompt: 'Pilih satu bidang yang paling dekat dengan skill-mu. Tulis satu "kepingan alternatif" yang bisa kamu bangun dalam bentuk bisnis kecil.',
          placeholder: 'Bidang: … Kepinganku: … Bentuk bisnisnya: …',
        },
        tool: { to: '/app/toolkit?tab=problem', label: 'Petakan di Problem Map' },
      },
    ],
  },
];
