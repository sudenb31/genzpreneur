import type { Lesson, LearningModule } from './modules';

/**
 * BUSINESS 101 — Peta Dunia Bisnis.
 * Disusun orisinal untuk GenZ Preneur. Konsep dasar bisnis yang umum diajarkan
 * di sekolah bisnis (lima bagian bisnis, STP, margin kontribusi, titik impas,
 * bottleneck, lima tekanan persaingan, design thinking, BATNA, dsb.) — dengan
 * inspirasi dari "The Personal MBA" (Josh Kaufman) dan "The Visual MBA"
 * (Jason Barron). Penjelasan, analogi, contoh angka, dan latihan ditulis
 * ulang untuk konteks Gen Z Indonesia — bukan terjemahan atau kutipan buku.
 */
const BASE: LearningModule = {
  slug: 'business-101',
  season: 1,
  emoji: '🗺️',
  color: 'amber-soft',
  title: 'Business 101: Peta Dunia Bisnis',
  tagline: 'Sales, marketing, branding, harga, cuan — akhirnya nyambung semua.',
  lessons: [
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-1',
      title: 'Bisnis itu sebenarnya apa sih? (5 organ bisnis)',
      minutes: 7,
      body: [
        'Lupakan dulu definisi buku pelajaran. Versi paling jujurnya: bisnis adalah cara kamu membantu orang lain secara berulang, dan mereka mau membayar untuk bantuan itu — dengan jumlah yang cukup supaya kamu bisa terus melakukannya.',
        'Setiap bisnis, dari warung seblak sampai startup unicorn, punya 5 "organ" yang sama. (1) BIKIN NILAI — menemukan apa yang orang butuhkan/inginkan lalu membuatnya. (2) MARKETING — membuat orang yang tepat tahu dan tertarik. (3) SALES — mengubah orang yang tertarik jadi orang yang bayar. (4) DELIVERY — memberikan apa yang kamu janjikan, sesuai (atau melebihi) harapan. (5) DUIT — memastikan uang yang masuk lebih besar dari yang keluar, supaya bisnisnya hidup.',
        'Seperti tubuh, kalau satu organ mati, semuanya ikut tumbang. Produk bagus tapi nggak ada yang tahu? Mati di organ 2. Ramai yang nanya tapi nggak ada yang beli? Mati di organ 3. Laku tapi pelanggan kecewa? Mati di organ 4. Laku terus tapi duitnya nggak pernah ada? Mati di organ 5.',
        'Modul ini membedah kelima organ itu satu per satu, plus tiga hal yang membuat bisnis bertahan lama: branding, strategi, dan kemampuan belajar cepat.',
      ],
      keyPoints: [
        'Bisnis = bantu orang secara berulang + dibayar + cukup untung untuk lanjut.',
        '5 organ: bikin nilai → marketing → sales → delivery → duit.',
        'Saat bisnis seret, cari organ mana yang "sakit" — jangan asal tambah promosi.',
        'Kalau nggak ada yang bayar, itu hobi atau kegiatan sosial — sah, tapi beda dengan bisnis.',
      ],
      mythFact: {
        myth: '"Bisnis itu soal punya ide brilian dan modal gede."',
        fact: 'Ide itu murah. Yang mahal adalah eksekusi kelima organ secara konsisten — dan banyak bisnis dimulai dari jasa dengan modal waktu dan skill.',
      },
      glossary: [
        { term: 'Value (nilai)', meaning: 'Manfaat yang dirasakan pembeli — bukan harga atau biaya produksinya.' },
        { term: 'Revenue / omzet', meaning: 'Semua uang yang masuk dari penjualan, sebelum dikurangi biaya apa pun.' },
        { term: 'Profit / laba', meaning: 'Sisa uang setelah semua biaya dibayar. Ini yang bikin bisnis bertahan.' },
        { term: 'Customer', meaning: 'Orang yang membayar. Kalau belum bayar, namanya masih calon (prospek).' },
      ],
      example: {
        title: 'Bedah bisnis jasa desain feed IG',
        text: 'Bikin nilai: template feed rapi untuk UMKM kuliner. Marketing: posting before–after di TikTok. Sales: DM penawaran + paket harga jelas. Delivery: kirim 9 desain dalam 3 hari + 1x revisi. Duit: harga Rp300 ribu, biaya Canva Pro + kuota Rp50 ribu, sisanya laba. Kalau order banyak tapi revisi tak ada habisnya → organ delivery yang perlu diperbaiki.',
      },
      exercise: {
        prompt: 'Pilih satu bisnis yang sering kamu beli (kafe, toko online, jasa). Bedah kelima organnya: bagaimana mereka bikin nilai, marketing, sales, delivery, dan dari mana duitnya. Organ mana yang paling kuat? Mana yang paling lemah?',
        placeholder: 'Bisnis: … Nilai: … Marketing: … Sales: … Delivery: … Duit: … Terkuat/terlemah: …',
      },
    },
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-2',
      title: 'Value: orang sebenarnya beli apa?',
      minutes: 7,
      body: [
        'Nggak ada orang yang bangun tidur lalu berpikir "aku mau beli produk". Orang ingin sesuatu berubah dalam hidupnya: lebih hemat waktu, lebih cakep, lebih dihargai, lebih aman, lebih seru. Produkmu cuma kendaraannya. Orang nggak beli bor — mereka beli lubang di dinding, atau lebih dalam lagi: rak yang rapi supaya kamarnya enak dipamerin.',
        'Ada lima "tombol" dasar yang bikin orang tergerak membeli: PUNYA (ingin memiliki atau mengumpulkan sesuatu), TERHUBUNG (ingin diterima, dicintai, jadi bagian dari circle), TAHU (ingin paham, penasaran, naik level), AMAN (ingin melindungi diri, uang, keluarga, reputasi), dan RASA (ingin sensasi, hiburan, pengalaman baru). Produk yang menekan lebih dari satu tombol biasanya lebih gampang laku.',
        'Sebelum membangun apa pun, cek pasarnya dengan 5 pertanyaan cepat: (1) Seberapa MENDESAK masalahnya? (2) Seberapa BANYAK orang yang membeli hal serupa? (3) Seberapa MAMPU dan MAU mereka membayar? (4) Seberapa MAHAL/SUSAH mendapatkan satu pembeli? (5) Seberapa MAHAL/SUSAH mengantarkan hasilnya? Ide yang menang di kelima pertanyaan ini jarang ada — tapi ide yang kalah di semuanya pasti berat.',
      ],
      keyPoints: [
        'Jual perubahannya (hasil akhir), bukan fiturnya.',
        '5 tombol pembelian: Punya, Terhubung, Tahu, Aman, Rasa.',
        'Cek pasar: mendesak? banyak? mampu bayar? mudah didapat? mudah diantar?',
        'Masalah yang mendesak mengalahkan ide yang keren.',
      ],
      mythFact: {
        myth: '"Kalau produknya bagus, pasti ada yang beli."',
        fact: 'Produk bagus untuk masalah yang tidak dirasakan orang tetap tidak laku. Yang laku adalah solusi untuk masalah yang mereka sadari dan ingin selesaikan sekarang.',
      },
      glossary: [
        { term: 'Pain point', meaning: 'Hal yang bikin calon pembeli kesel, rugi, atau capek.' },
        { term: 'Value proposition', meaning: 'Satu kalimat: kamu bantu siapa, dari masalah apa, menuju hasil apa.' },
        { term: 'Market (pasar)', meaning: 'Sekumpulan orang yang punya masalah sama DAN mau bayar untuk solusinya.' },
      ],
      example: {
        title: 'Jasa titip makan siang di kantor',
        text: 'Fitur: "kami antar makanan". Perubahan yang dijual: "istirahatmu 1 jam penuh, bukan habis 40 menit antre." Tombol: Rasa (makan enak) + Aman (nggak telat balik kerja) + Terhubung (pesan bareng satu tim). Cek pasar: mendesak tiap hari ✔, banyak karyawan ✔, mampu bayar ongkir kecil ✔, gampang dicari di satu gedung ✔, delivery butuh tenaga ✖ → perlu sistem batch.',
      },
      exercise: {
        prompt: 'Tulis value proposition untuk satu ide bisnismu: "Aku membantu [siapa] yang [masalah] supaya [hasil]." Lalu nilai idemu 1–5 di lima pertanyaan cek pasar.',
        placeholder: 'Aku membantu … yang … supaya … | Mendesak: _/5 Banyak: _/5 Mampu bayar: _/5 Mudah didapat: _/5 Mudah diantar: _/5',
      },
      tool: { to: '/app/toolkit?tab=problem', label: 'Bedah masalahnya di Problem Map' },
    },
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-3',
      title: 'Marketing vs Sales vs Branding — bedanya apa?',
      minutes: 6,
      body: [
        'Tiga kata ini sering dipakai campur aduk, padahal tugasnya beda. Pakai analogi PDKT biar langsung kebayang.',
        'MARKETING = bikin dia notice dan penasaran sama kamu. Kamu muncul di tempat yang tepat, posting hal yang relevan, dan bikin dia mikir "eh, menarik juga". Tujuannya PERHATIAN dan MINAT. SALES = momen ngajak jalan / nembak. Kamu ngobrol langsung, jawab keraguannya, dan mengajak dia mengambil keputusan. Tujuannya KEPUTUSAN dan TRANSAKSI. BRANDING = reputasimu di tongkrongan — apa yang orang bilang tentang kamu saat kamu nggak ada di ruangan. Tujuannya KEPERCAYAAN dan INGATAN jangka panjang.',
        'Ketiganya saling menguatkan. Branding yang kuat bikin marketing lebih murah (orang sudah percaya duluan) dan sales lebih cepat (keraguan lebih sedikit). Marketing tanpa sales = ramai like, sepi transfer. Sales tanpa branding = tiap kali harus meyakinkan dari nol. Branding tanpa marketing = reputasi bagus yang nggak ada yang tahu.',
        'Kalau modal waktu terbatas: di awal, prioritaskan SALES (dapat pembeli pertama), lalu MARKETING (cari pembeli berikutnya dengan lebih efisien), sambil menjaga BRANDING lewat cara kamu melayani setiap pembeli.',
      ],
      keyPoints: [
        'Marketing → perhatian & minat. Sales → keputusan & transaksi. Branding → kepercayaan & ingatan.',
        'Ramai engagement tapi nggak ada yang bayar = masalah sales, bukan marketing.',
        'Branding dibangun dari pengalaman pelanggan, bukan dari logo.',
        'Urutan untuk pemula: sales dulu, lalu marketing, branding dijaga sejak hari pertama.',
      ],
      mythFact: {
        myth: '"Followers banyak = bisnis sukses."',
        fact: 'Followers adalah hasil marketing. Bisnis baru hidup kalau ada sales (orang bayar) dan delivery (orang puas lalu balik lagi).',
      },
      glossary: [
        { term: 'Awareness', meaning: 'Tahap orang baru "tahu kamu ada".' },
        { term: 'Lead', meaning: 'Orang yang sudah menunjukkan minat (nanya, DM, isi form).' },
        { term: 'Closing', meaning: 'Momen calon pembeli bilang "oke, aku ambil" dan membayar.' },
        { term: 'Brand', meaning: 'Kesan dan janji yang menempel di kepala orang tentang bisnismu.' },
      ],
      example: {
        title: 'Satu bisnis, tiga peran',
        text: 'Thrift shop online. Marketing: konten "outfit Rp100 ribu ke kampus" di TikTok. Sales: balas DM cepat, kirim foto detail cacat barang, tawarkan bundling 2 item. Branding: selalu jujur soal kondisi barang + packing rapi + catatan terima kasih tulisan tangan → orang bilang "di sini aman, nggak tipu-tipu".',
      },
      exercise: {
        prompt: 'Untuk ide bisnismu, tulis satu aksi konkret untuk masing-masing: marketing (cara bikin notice), sales (cara mengajak membeli), dan branding (kesan yang mau kamu tinggalkan).',
        placeholder: 'Marketing: … Sales: … Branding (orang harus bilang aku itu …): …',
      },
    },
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-4',
      title: 'Marketing: rebut perhatian orang yang TEPAT',
      minutes: 8,
      body: [
        'Aturan pertama marketing: kamu tidak sedang bicara ke semua orang. Kalau pesanmu ditujukan untuk semua orang, ujung-ujungnya tidak ada yang merasa itu untuk dirinya. Makanya marketer pakai tiga langkah STP.',
        'SEGMENTASI — bagi pasar ke kelompok-kelompok yang masalahnya mirip (misal: mahasiswa rantau, ibu muda, owner kedai kopi). TARGETING — pilih satu kelompok yang paling butuh, paling mampu bayar, dan paling bisa kamu jangkau. POSITIONING — tentukan kamu mau dikenal sebagai "yang paling apa" di kepala kelompok itu: paling cepat? paling murah? paling ngerti anak kos? paling premium?',
        'Untuk mencari kalimat marketing yang nendang, pakai "tangga alasan". Tanya pembeli yang paling puas: Apa yang kamu suka? (fitur) → Kenapa itu penting? (manfaat) → Terus efeknya ke kamu apa? (manfaat personal) → Kenapa itu berarti buatmu? (nilai hidup). Kalimat iklan terbaik biasanya ada di anak tangga ketiga dan keempat — bukan di fitur.',
        'Terakhir, ingat bahwa perhatian itu langka. Konten pertama 2 detik (hook) menentukan apakah orang berhenti scroll. Setelah itu baru minat, keinginan, dan ajakan bertindak.',
      ],
      keyPoints: [
        'STP: Segmentasi → Targeting → Positioning.',
        'Pilih satu target spesifik. Niche dulu, melebar nanti.',
        'Positioning = "yang paling ___" di kepala target.',
        'Kalimat iklan terkuat bicara soal efek personal, bukan spesifikasi.',
      ],
      mythFact: {
        myth: '"Makin luas targetnya, makin banyak yang beli."',
        fact: 'Target luas bikin pesan jadi hambar. Target sempit bikin orang merasa "ini aku banget" — dan itu yang bikin mereka bertindak.',
      },
      glossary: [
        { term: 'Niche', meaning: 'Kelompok pasar kecil dan spesifik yang kamu layani dengan sangat baik.' },
        { term: 'Hook', meaning: 'Kalimat/visual pembuka yang bikin orang berhenti scroll.' },
        { term: 'CTA (call to action)', meaning: 'Ajakan jelas: "DM kata MENU", "klik link", "pesan sekarang".' },
        { term: 'Funnel', meaning: 'Jalur dari orang asing → tertarik → nanya → beli → langganan.' },
      ],
      example: {
        title: 'Tangga alasan: jasa les coding SMA',
        text: 'Fitur: "kelas 1-on-1 Python". → Manfaat: "bisa bikin project sendiri". → Manfaat personal: "punya portofolio buat daftar kuliah IT". → Nilai: "orang tua bangga, aku yakin sama masa depanku". Hook yang dipakai: "Portofolio coding pertamamu sebelum lulus SMA — biar daftar kuliah IT nggak modal nilai doang."',
      },
      exercise: {
        prompt: 'Lakukan STP untuk ide bisnismu: tulis 3 segmen yang mungkin, pilih 1 target, lalu tulis positioning-mu dalam satu kalimat "Untuk [target], kami adalah [kategori] yang paling [keunggulan]".',
        placeholder: 'Segmen: 1) … 2) … 3) … | Target: … | Positioning: Untuk …, kami adalah … yang paling …',
      },
      tool: { to: '/app/toolkit?tab=prompts', label: 'Riset target pakai AI prompt' },
    },
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-5',
      title: 'Sales: dari "tertarik" jadi "transfer"',
      minutes: 8,
      body: [
        'Sales bukan soal maksa atau ngomong manis. Sales adalah membantu orang mengambil keputusan yang tepat buat dirinya — dengan jujur. Kadang keputusan terbaiknya justru "belum sekarang", dan itu juga hasil yang baik karena kepercayaan tetap terjaga.',
        'Setiap calon pembeli punya timbangan di kepalanya: di satu sisi MANFAAT yang ia bayangkan, di sisi lain HARGA + RISIKO + REPOT. Tugasmu: perbesar sisi manfaat (tunjukkan bukti dan hasil), dan perkecil sisi risiko (garansi, uji coba, testimoni asli, proses yang jelas).',
        'Hampir semua penolakan masuk ke empat kotak: HARGA ("kemahalan"), WAKTU ("nanti dulu"), PERCAYA ("beneran bagus nggak?"), dan BUTUH ("kayaknya aku nggak perlu"). Jangan langsung debat — tanya dulu untuk tahu kotak mana yang sebenarnya, karena "kemahalan" sering artinya "aku belum yakin ini worth it".',
        'Soal harga: orang menilai harga dengan pembanding. Kalau kamu tidak memberi pembanding, mereka akan pakai pembanding sendiri (biasanya yang paling murah di marketplace). Bantu mereka membandingkan dengan biaya masalahnya: "Rp300 ribu vs omzet yang hilang tiap minggu karena menu nggak menarik."',
      ],
      keyPoints: [
        'Sales = membantu orang memutuskan, bukan memaksa.',
        'Timbangan pembeli: manfaat vs (harga + risiko + repot).',
        '4 kotak penolakan: harga, waktu, percaya, butuh — tanya dulu sebelum menjawab.',
        'Selalu beri pembanding harga yang adil: biaya masalahnya, bukan harga kompetitor termurah.',
      ],
      mythFact: {
        myth: '"Sales itu bakat. Aku introvert, jadi nggak bisa jualan."',
        fact: 'Sales adalah skill yang bisa dilatih: mendengar, bertanya, dan menjelaskan dengan jelas. Banyak introvert justru unggul karena lebih banyak mendengarkan.',
      },
      glossary: [
        { term: 'Prospek', meaning: 'Calon pembeli yang cocok dengan target dan mungkin butuh.' },
        { term: 'Objection', meaning: 'Alasan menolak atau ragu dari calon pembeli.' },
        { term: 'Risk reversal', meaning: 'Memindahkan risiko dari pembeli ke kamu, misal garansi atau bayar setelah jadi.' },
        { term: 'Follow-up', meaning: 'Menghubungi lagi dengan sopan setelah penawaran pertama. Banyak deal terjadi di sini.' },
      ],
      example: {
        title: 'Menjawab "kemahalan" dengan bertanya',
        text: 'Calon klien: "Rp500 ribu kemahalan." Kamu: "Boleh aku tahu, yang bikin ragu itu nominalnya, atau belum yakin hasilnya bakal ngaruh ke penjualan?" → "Belum yakin hasilnya." (kotak PERCAYA, bukan HARGA). Solusi: "Gimana kalau aku kerjakan 3 desain dulu. Kalau cocok baru lanjut paket penuh."',
      },
      exercise: {
        prompt: 'Tulis 4 penolakan yang paling mungkin kamu dengar untuk ide bisnismu (satu per kotak: harga, waktu, percaya, butuh) dan jawaban jujur untuk masing-masing.',
        placeholder: 'Harga: "…" → jawabanku: … | Waktu: … | Percaya: … | Butuh: …',
      },
      tool: { to: '/app/outreach?skenario=sales_partner', label: 'Latihan pesan di Outreach Studio' },
    },
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-6',
      title: 'Branding: janji yang kamu tepati berulang kali',
      minutes: 7,
      body: [
        'Brand bukan logo, warna, atau slogan. Itu semua cuma "kemasan" yang membantu orang mengenali. Brand yang sebenarnya adalah kesan yang tertinggal di kepala dan hati orang setelah berinteraksi denganmu.',
        'Rumus sederhananya: BRAND = JANJI × BUKTI × KONSISTENSI. Janji: apa yang kamu klaim akan berikan. Bukti: hasil nyata yang orang lihat dan rasakan. Konsistensi: janji dan bukti itu terjadi setiap kali, bukan sesekali. Kalau satu faktornya nol, hasilnya nol — janji besar tanpa bukti justru merusak brand.',
        'Brand yang kuat juga punya ALASAN di baliknya. Orang lebih mudah terikat pada "kenapa kamu melakukan ini" daripada "apa yang kamu jual". Jadikan alasan itu sebagai pagar keputusan: setiap mau bikin produk, promo, atau kolaborasi, tanya "ini sejalan dengan alasan kita nggak?" Kalau tidak, skip.',
        'Personal brand bekerja dengan cara yang sama. Pilih tiga frasa yang ingin orang ingat tentang dirimu (misal: "cepat tanggap", "jujur soal harga", "ngerti anak muda"), lalu pastikan perilakumu sehari-hari membuktikannya. Tanyakan teman: "kesan kalian ke aku apa?" — kalau jawabannya beda dari yang kamu mau, perbaiki perilakunya, bukan caption-nya.',
      ],
      keyPoints: [
        'Brand = kesan yang tertinggal, bukan logo.',
        'Brand = Janji × Bukti × Konsistensi. Satu nol, semuanya nol.',
        'Punya "alasan" yang jelas → jadi pagar untuk semua keputusan.',
        'Personal brand: pilih 3 frasa, buktikan lewat perilaku, cek ke orang lain.',
      ],
      mythFact: {
        myth: '"Branding itu mahal — harus bikin logo dan website keren dulu."',
        fact: 'Branding termurah dan terkuat adalah pengalaman pelanggan: balas cepat, tepat janji, jujur saat ada masalah. Logo bisa menyusul.',
      },
      glossary: [
        { term: 'Touchpoint', meaning: 'Setiap titik orang bertemu bisnismu: konten, DM, packing, after-sales.' },
        { term: 'Brand voice', meaning: 'Gaya bicara bisnismu — santai, formal, lucu, tegas — yang konsisten.' },
        { term: 'Brand promise', meaning: 'Janji utama yang selalu kamu tepati ke pelanggan.' },
        { term: 'Word of mouth', meaning: 'Rekomendasi dari mulut ke mulut — iklan paling dipercaya.' },
      ],
      example: {
        title: 'Brand jasa servis HP mahasiswa',
        text: 'Janji: "jujur soal kerusakan, nggak ganti part kalau nggak perlu." Bukti: kirim video saat bongkar HP + rincian biaya sebelum dikerjakan. Konsistensi: dilakukan ke semua pelanggan, bahkan yang servis Rp50 ribu. Hasilnya: orang bilang "kalau HP rusak, ke dia aja, nggak bakal ditipu" — itulah brand-nya.',
      },
      exercise: {
        prompt: 'Tulis brand statement untuk dirimu atau bisnismu: "Aku/kami ingin dikenal sebagai [frasa 1], [frasa 2], dan [frasa 3], supaya [manfaat bagi pelanggan]." Lalu tulis satu bukti nyata yang bisa kamu tunjukkan untuk tiap frasa.',
        placeholder: 'Aku ingin dikenal sebagai …, …, dan …, supaya … | Bukti: 1) … 2) … 3) …',
      },
      tool: { to: '/app/dream-pact', label: 'Hubungkan dengan WHY di Dream Pact' },
    },
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-7',
      title: 'Delivery: nepatin janji tanpa tepar',
      minutes: 7,
      body: [
        'Setelah orang membayar, permainan baru dimulai. Delivery (operasional) adalah semua proses yang membuat janjimu benar-benar terjadi. Pelanggan yang puas akan beli lagi dan merekomendasikanmu — ini marketing paling murah yang ada.',
        'Kepuasan pelanggan = HASIL dikurangi HARAPAN. Kalau hasil sesuai harapan, mereka biasa saja. Kalau di bawah, mereka kecewa. Kalau sedikit di atas, mereka senang. Jadi kelola harapan dari awal: janjikan yang realistis, lalu beri sedikit kejutan (bonus kecil, kirim lebih cepat, catatan personal).',
        'Petakan prosesmu dari order masuk sampai pelanggan menerima hasil. Lalu cari BOTTLENECK — langkah paling lambat yang menahan semuanya. Kapasitas bisnismu tidak ditentukan oleh langkah tercepat, tapi oleh langkah paling lambat itu. Percepat bottleneck dulu, baru yang lain.',
        'Kalau satu langkah dilakukan berulang, tuliskan sebagai SOP (checklist sederhana). SOP membuatmu tidak lupa, hasilnya konsisten, dan suatu hari bisa diserahkan ke orang lain — itulah awal bisnis yang bisa tumbuh tanpa kamu kerjakan semuanya sendiri.',
      ],
      keyPoints: [
        'Kepuasan = hasil − harapan. Janji realistis + kejutan kecil.',
        'Bottleneck = langkah paling lambat; itu yang menentukan kapasitasmu.',
        'Hitung kapasitas sebelum menerima order banyak.',
        'Pekerjaan berulang → jadikan SOP/checklist.',
      ],
      mythFact: {
        myth: '"Terima order sebanyak-banyaknya dulu, urusan ngerjain belakangan."',
        fact: 'Order melebihi kapasitas = telat, kualitas turun, review buruk. Lebih baik tolak sopan atau buka waiting list daripada merusak brand.',
      },
      glossary: [
        { term: 'Operasional', meaning: 'Semua proses untuk membuat dan mengantar produk/jasa.' },
        { term: 'Bottleneck', meaning: 'Titik macet: langkah paling lambat dalam proses.' },
        { term: 'Kapasitas', meaning: 'Jumlah maksimal yang bisa kamu hasilkan per satuan waktu.' },
        { term: 'SOP', meaning: 'Langkah kerja baku yang ditulis supaya hasil konsisten.' },
        { term: 'Lead time', meaning: 'Waktu dari pelanggan pesan sampai hasil diterima.' },
      ],
      example: {
        title: 'Hitung kapasitas jasa edit video',
        text: 'Proses per video: briefing 15 menit → edit 90 menit → revisi 45 menit → kirim 10 menit = ±2,7 jam. Waktumu 15 jam/minggu → kapasitas ±5 video/minggu. Bottleneck: edit. Solusi: bikin template intro-outro dan preset warna → edit turun ke 60 menit → kapasitas naik jadi ±7 video tanpa nambah jam kerja.',
      },
      exercise: {
        prompt: 'Petakan proses delivery ide bisnismu dari order masuk sampai selesai (tulis tiap langkah + perkiraan waktunya). Tandai bottleneck-nya dan hitung kapasitas per minggu sesuai jam yang kamu punya.',
        placeholder: 'Langkah: 1) … (… menit) 2) … | Bottleneck: … | Jam per minggu: … → kapasitas: … order',
      },
      tool: { to: '/app/passport', label: 'Cek jam per minggu di Passport' },
    },
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-8',
      title: 'Duit: omzet ≠ untung ≠ cash',
      minutes: 9,
      body: [
        'Tiga hal ini sering dikira sama, padahal beda. OMZET adalah semua uang dari penjualan. UNTUNG (laba) adalah omzet dikurangi semua biaya. CASH adalah uang yang benar-benar ada di tanganmu hari ini. Bisnis bisa omzetnya besar tapi rugi, atau untung di atas kertas tapi kehabisan cash karena pelanggan belum bayar.',
        'Pisahkan dua jenis biaya. BIAYA TETAP tidak berubah walau penjualan naik-turun (sewa lapak, langganan aplikasi, gaji tetap). BIAYA VARIABEL naik setiap kamu menjual satu unit (bahan baku, kemasan, ongkir, fee marketplace). Harga jual dikurangi biaya variabel per unit = MARGIN KONTRIBUSI, yaitu uang per unit yang "berkontribusi" menutup biaya tetap.',
        'Dari sini kamu bisa menghitung TITIK IMPAS (BEP): biaya tetap ÷ margin kontribusi per unit = jumlah unit yang harus terjual supaya tidak rugi. Di bawah angka itu kamu rugi, di atasnya baru untung. Ini angka paling penting sebelum memulai bisnis apa pun.',
        'Untuk menambah pendapatan, hanya ada empat tuas: tambah JUMLAH pelanggan, tambah NILAI per transaksi (bundling, upsell), tambah FREKUENSI beli ulang, atau NAIKKAN HARGA. Satu lagi yang sering terlupa: uang hari ini lebih berharga daripada uang yang sama tahun depan — jadi utamakan pembayaran di muka (DP) dan jangan biarkan piutang menumpuk.',
      ],
      keyPoints: [
        'Omzet ≠ untung ≠ cash. Pantau ketiganya.',
        'Margin kontribusi = harga − biaya variabel per unit.',
        'BEP (unit) = biaya tetap ÷ margin kontribusi.',
        '4 tuas pendapatan: jumlah pelanggan, nilai transaksi, frekuensi, harga.',
        'Pisahkan rekening pribadi dan bisnis sejak hari pertama.',
      ],
      mythFact: {
        myth: '"Yang penting laku dulu, untung belakangan."',
        fact: 'Kalau setiap unit dijual di bawah biaya variabelnya, makin laku justru makin rugi. Hitung margin sebelum promo besar-besaran.',
      },
      glossary: [
        { term: 'HPP', meaning: 'Harga pokok penjualan — biaya langsung untuk membuat satu produk.' },
        { term: 'Margin', meaning: 'Persentase untung dari harga jual.' },
        { term: 'BEP', meaning: 'Break even point — titik di mana tidak untung dan tidak rugi.' },
        { term: 'Cashflow', meaning: 'Aliran uang masuk dan keluar. Bisnis mati karena cash habis, bukan karena rugi di laporan.' },
        { term: 'Piutang', meaning: 'Uang yang belum dibayar pelanggan kepadamu.' },
      ],
      example: {
        title: 'Hitung BEP es teh jumbo',
        text: 'Harga jual Rp5.000/gelas. Biaya variabel: teh, gula, es, cup, sedotan = Rp2.000 → margin kontribusi Rp3.000. Biaya tetap: sewa lapak Rp900.000/bulan. BEP = 900.000 ÷ 3.000 = 300 gelas/bulan = 10 gelas/hari. Jual 20 gelas/hari (600/bulan) → untung (600 − 300) × Rp3.000 = Rp900.000/bulan, belum termasuk nilai waktumu sendiri.',
      },
      exercise: {
        prompt: 'Hitung untuk ide bisnismu: harga jual per unit, biaya variabel per unit, margin kontribusi, biaya tetap per bulan, dan BEP (unit per bulan dan per hari). Realistis nggak angkanya?',
        placeholder: 'Harga: Rp… | Biaya variabel: Rp… | Margin: Rp… | Biaya tetap: Rp…/bln | BEP: … unit/bln = … unit/hari',
      },
      tool: { to: '/app/toolkit?tab=pricing', label: 'Hitung BEP di Kalkulator Harga' },
    },
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-9',
      title: 'Strategi: kenapa orang pilih kamu, bukan yang lain?',
      minutes: 8,
      body: [
        'Strategi adalah pilihan tentang di mana kamu bermain dan bagaimana kamu menang. Bagian tersulitnya justru memilih apa yang TIDAK kamu kerjakan. Bisnis kecil yang mencoba bersaing di semua hal biasanya kalah di semua hal.',
        'Sebelum masuk sebuah pasar, lihat lima tekanan yang menentukan seberapa gampang cari untung di sana: (1) PERSAINGAN — berapa banyak dan seberapa sengit pemain yang ada. (2) PENDATANG BARU — seberapa gampang orang lain ikut-ikutan. (3) PENGGANTI — adakah cara lain bagi pelanggan untuk menyelesaikan masalahnya (misal bikin sendiri pakai AI). (4) KUASA PEMBELI — seberapa gampang pelanggan pindah atau menekan harga. (5) KUASA PEMASOK — seberapa tergantung kamu pada satu pemasok/platform.',
        'Lalu cek posisimu dengan SWOT: Strength (kekuatan internal), Weakness (kelemahan internal), Opportunity (peluang di luar), Threat (ancaman di luar). Gunakan kekuatan untuk menangkap peluang; tutup kelemahan yang membuatmu rentan terhadap ancaman.',
        'Keunggulan yang tahan lama biasanya memenuhi empat syarat: BERNILAI bagi pelanggan, LANGKA (tidak semua orang punya), SULIT DITIRU, dan kamu TERORGANISIR untuk memanfaatkannya. Untuk Gen Z yang baru mulai, keunggulan paling realistis sering kali adalah: kedekatan dengan komunitas tertentu, kecepatan, pemahaman tren digital, dan reputasi personal.',
      ],
      keyPoints: [
        'Strategi = memilih di mana bermain dan bagaimana menang — termasuk apa yang tidak dikerjakan.',
        '5 tekanan pasar: pesaing, pendatang baru, pengganti, kuasa pembeli, kuasa pemasok.',
        'SWOT: kekuatan & kelemahan (dalam), peluang & ancaman (luar).',
        'Keunggulan tahan lama: bernilai, langka, sulit ditiru, dan siap dimanfaatkan.',
      ],
      mythFact: {
        myth: '"Kalau belum ada kompetitornya, berarti peluang emas."',
        fact: 'Bisa jadi peluang, bisa jadi tidak ada pasarnya. Adanya kompetitor justru bukti ada orang yang mau bayar — tinggal cari celah untuk berbeda.',
      },
      glossary: [
        { term: 'Diferensiasi', meaning: 'Hal yang membuatmu berbeda secara berarti dari pilihan lain.' },
        { term: 'Kompetitor langsung', meaning: 'Menjual hal yang sama ke target yang sama.' },
        { term: 'Substitusi', meaning: 'Cara lain menyelesaikan masalah yang sama (bukan produk serupa).' },
        { term: 'Moat', meaning: 'Parit pelindung bisnis: sesuatu yang membuat pesaing susah merebut pelangganmu.' },
      ],
      example: {
        title: 'SWOT jasa admin medsos untuk UMKM',
        text: 'S: paham tren TikTok, bisa desain. W: belum punya portofolio. O: banyak warung belum aktif di medsos. T: pengganti berupa template gratis + AI. Strategi: fokus ke satu niche (kedai kopi), jual hasil (bukan sekadar desain): "konten yang bikin orang mampir" — sesuatu yang tidak diberikan template gratis.',
      },
      exercise: {
        prompt: 'Buat SWOT singkat untuk ide bisnismu, lalu tulis satu kalimat jawaban: "Kenapa orang harus memilih aku dibanding alternatif lain (termasuk bikin sendiri atau pakai AI)?"',
        placeholder: 'S: … W: … O: … T: … | Orang pilih aku karena …',
      },
      tool: { to: '/app/assessment', label: 'Lihat industri & Profil Cuan-mu' },
    },
    /* ------------------------------------------------------------------ */
    {
      id: 'b101-10',
      title: 'Mesin belajar: tes kecil, ukur, perbaiki',
      minutes: 8,
      body: [
        'Semua yang kamu pelajari di modul ini adalah dugaan sampai diuji di dunia nyata. Entrepreneur yang bertahan bukan yang paling pintar menebak, tapi yang paling cepat belajar dari hasil tebakannya.',
        'Pakai siklus 5 langkah ini: PAHAMI (ngobrol dengan calon pembeli, rasakan masalahnya), RUMUSKAN (tulis masalah intinya dalam satu kalimat), CARI IDE (sebanyak mungkin solusi, jangan langsung dinilai), BIKIN VERSI KECIL (prototipe atau penawaran paling sederhana yang bisa dijual), lalu UJI ke orang sungguhan. Hasilnya dibawa kembali ke langkah awal. Ulangi.',
        'Agar belajarmu nyata, ukur satu-dua angka saja per eksperimen. Misal: dari 20 pesan outreach, berapa yang membalas? Dari yang membalas, berapa yang membeli? Angka kecil yang jujur lebih berguna daripada perasaan "kayaknya rame".',
        'Bonus skill: negosiasi. Sebelum bernegosiasi (dengan klien, mitra, atau pemasok), tentukan dulu rencana cadanganmu kalau kesepakatan gagal. Semakin bagus rencana cadanganmu, semakin tenang kamu bernegosiasi — dan semakin kecil kemungkinan kamu menerima kesepakatan yang merugikan.',
      ],
      keyPoints: [
        'Ide = dugaan. Uji secepat dan semurah mungkin.',
        'Siklus: pahami → rumuskan → cari ide → bikin versi kecil → uji → ulangi.',
        'Ukur 1–2 angka per eksperimen: balasan, konversi, beli ulang.',
        'Negosiasi: siapkan rencana cadangan sebelum duduk di meja.',
      ],
      mythFact: {
        myth: '"Gagal itu memalukan, jadi tunggu sampai sempurna baru launch."',
        fact: 'Eksperimen kecil yang gagal itu murah dan memberi data. Yang mahal adalah membangun sesuatu besar-besaran yang ternyata tidak dibutuhkan siapa pun.',
      },
      glossary: [
        { term: 'MVP', meaning: 'Minimum viable product — versi paling sederhana yang sudah bisa diuji/dijual.' },
        { term: 'Konversi', meaning: 'Persentase orang yang pindah ke tahap berikutnya (misal dari nanya → beli).' },
        { term: 'KPI', meaning: 'Angka kunci yang kamu pantau untuk tahu bisnis sehat atau tidak.' },
        { term: 'BATNA', meaning: 'Rencana cadangan terbaik kalau negosiasi gagal.' },
        { term: 'Iterasi', meaning: 'Memperbaiki sedikit demi sedikit berdasarkan hasil uji.' },
      ],
      example: {
        title: 'Eksperimen 7 hari: jasa foto menu',
        text: 'Hipotesis: kedai kecil mau bayar Rp150 ribu untuk 10 foto menu pakai HP. Versi kecil: 3 contoh foto + 1 pesan penawaran. Uji: kirim ke 20 kedai. Hasil: 6 membalas (30%), 2 membeli (10% dari total). Pelajaran: yang membalas paling banyak minta "sekalian caption". Iterasi minggu depan: paket foto + caption Rp200 ribu.',
      },
      exercise: {
        prompt: 'Rancang satu eksperimen 7 hari untuk ide bisnismu: apa hipotesisnya, versi kecil apa yang akan kamu tawarkan, ke berapa orang, dan angka apa yang akan kamu ukur. Tulis juga rencana cadanganmu kalau hasilnya nol.',
        placeholder: 'Hipotesis: … | Versi kecil: … | Diuji ke: … orang | Angka yang diukur: … | Rencana cadangan: …',
      },
      tool: { to: '/app/action-plan', label: 'Jalankan lewat Action Plan 7 Hari' },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Pelajaran tambahan (id baru agar progres peserta lama tetap aman)  */
/* ------------------------------------------------------------------ */
const EXTRA_LESSONS: Lesson[] = [
  {
    id: 'b101-11',
    title: 'Nentuin harga tanpa galau',
    minutes: 8,
    body: [
      'Harga adalah keputusan bisnis paling cepat berdampak: naik Rp5.000 per transaksi bisa mengubah bisnis dari ngos-ngosan jadi sehat, tanpa tambah pelanggan satu pun. Tapi kebanyakan pemula pasang harga dengan satu cara: lihat yang termurah di marketplace, lalu ikut lebih murah. Itu resep capek.',
      'Pakai tiga sudut pandang sekaligus. LANTAI = biaya: harga tidak boleh di bawah biaya variabel ditambah nilai waktumu. PASAR = pembanding: berapa harga alternatif yang dilihat pelanggan (bukan cuma yang termurah). LANGIT-LANGIT = nilai: seberapa besar hasil atau penghematan yang pelanggan dapat. Harga yang sehat ada di antara pasar dan langit-langit — dan tidak pernah di bawah lantai.',
      'Waktumu juga biaya. Hitung "harga per jam" dirimu: target penghasilan per bulan ÷ jam kerja per bulan. Kalau target Rp2 juta dengan 40 jam kerja, waktumu bernilai Rp50 ribu per jam. Jasa yang makan 3 jam tapi dijual Rp75 ribu artinya kamu "membayar" pelanggan.',
      'Dua trik yang jujur dan ampuh: (1) Jual PAKET, bukan per jam — orang membeli hasil, dan paket membuat perbandingan lebih mudah. (2) Beri TIGA PILIHAN (dasar, utama, lengkap). Kebanyakan orang memilih tengah, dan paket lengkap membuat paket utama terasa masuk akal. Satu peringatan: hati-hati dengan diskon. Kalau margin-mu 40% lalu kamu diskon 20%, margin tinggal 20% — kamu harus menjual DUA KALI lipat hanya untuk mendapat untung yang sama.',
    ],
    keyPoints: [
      'Lantai (biaya + waktumu) → pasar (pembanding) → langit-langit (nilai bagi pelanggan).',
      'Harga per jam dirimu = target penghasilan ÷ jam kerja.',
      'Jual paket hasil, bukan jam. Tawarkan 3 pilihan.',
      'Diskon memakan margin jauh lebih cepat dari yang terlihat.',
    ],
    mythFact: {
      myth: '"Biar laku, harus paling murah."',
      fact: 'Paling murah adalah posisi yang paling gampang direbut orang lain — dan bikin kamu capek tanpa sisa. Lebih aman jadi pilihan yang paling jelas hasilnya untuk target tertentu.',
    },
    glossary: [
      { term: 'Cost-plus', meaning: 'Harga = biaya + persentase untung yang kamu tentukan.' },
      { term: 'Value-based pricing', meaning: 'Harga ditentukan dari besarnya hasil/manfaat bagi pelanggan.' },
      { term: 'Anchoring', meaning: 'Harga pembanding pertama yang dilihat orang, yang memengaruhi penilaian harga berikutnya.' },
      { term: 'Bundling', meaning: 'Menggabungkan beberapa produk/jasa jadi satu paket.' },
      { term: 'Upsell', meaning: 'Menawarkan versi yang lebih lengkap ke orang yang sudah mau membeli.' },
    ],
    example: {
      title: 'Harga jasa desain feed IG',
      text: 'Lantai: Canva + kuota Rp20 ribu per proyek, kerja 4 jam × Rp50 ribu = Rp220 ribu. Pasar: freelancer lain Rp150–500 ribu untuk 9 desain. Langit-langit: kalau feed rapi menambah 5 pesanan/minggu bagi kedai, nilainya jutaan per bulan. Paket: DASAR 6 desain Rp250 ribu · UTAMA 9 desain + caption Rp400 ribu · LENGKAP 12 desain + caption + jadwal posting Rp650 ribu.',
    },
    exercise: {
      prompt: 'Hitung harga untuk penawaranmu: lantai (biaya + jam × harga per jam dirimu), harga pasar (3 pembanding), dan langit-langit (nilai bagi pelanggan). Lalu susun 3 paket: dasar, utama, lengkap.',
      placeholder: 'Lantai: Rp… | Pasar: Rp…–Rp… | Nilai bagi pelanggan: … | Dasar: … Rp… | Utama: … Rp… | Lengkap: … Rp…',
    },
    tool: { to: '/app/toolkit?tab=pricing', label: 'Hitung harga & 3 paket di Kalkulator Harga' },
  },
  {
    id: 'b101-12',
    title: 'Pencatatan duit: biar cuan nggak "hilang entah ke mana"',
    minutes: 7,
    body: [
      'Banyak bisnis kecil sebenarnya untung, tapi pemiliknya merasa nggak pernah pegang uang. Penyebabnya hampir selalu sama: uang bisnis dan uang pribadi tercampur, dan tidak ada catatan. Uang jajan, bensin, dan modal belanja stok keluar dari dompet yang sama — lalu di akhir bulan semuanya terasa "habis".',
      'Mulai dari tiga aturan. (1) PISAHKAN: pakai satu rekening atau e-wallet khusus bisnis. Semua uang masuk dari pelanggan ke sana, semua belanja bisnis keluar dari sana. (2) CATAT HARI ITU JUGA: tanggal, masuk/keluar, jumlah, kategori (bahan, ongkir, iklan, alat), dan keterangan. Simpan bukti — screenshot transfer sudah cukup. (3) GAJI DIRIMU SENDIRI: ambil jumlah tetap dari bisnis secara terjadwal, jangan ambil "seperlunya" kapan saja.',
      'Seminggu sekali, luangkan 15 menit untuk "rapat duit" dengan dirimu sendiri: total masuk, total keluar, sisa, dan tiga pengeluaran terbesar. Sebulan sekali, hitung untung sederhana: PENJUALAN − BIAYA BARANG/BAHAN − BIAYA OPERASIONAL = LABA. Dari sini kamu tahu bulan ini benar-benar untung atau cuma ramai.',
      'Sebelum membelanjakan laba, sisihkan dulu untuk tiga pos: modal putar (stok/bahan berikutnya), dana cadangan (untuk bulan sepi atau alat rusak), dan baru sisanya untuk dinikmati atau dikembangkan. Persentasenya bebas kamu atur sesuai kondisi — yang penting urutannya: sisihkan dulu, belanja kemudian.',
    ],
    keyPoints: [
      'Pisahkan rekening/e-wallet bisnis dan pribadi.',
      'Catat setiap transaksi di hari yang sama + simpan buktinya.',
      'Gaji dirimu dengan jumlah tetap, bukan ambil seenaknya.',
      'Rapat duit 15 menit per minggu; hitung laba sederhana per bulan.',
      'Sisihkan modal putar & cadangan sebelum laba dibelanjakan.',
    ],
    mythFact: {
      myth: '"Bisnisku masih kecil, belum perlu dicatat."',
      fact: 'Justru saat kecil kebiasaan ini paling mudah dibangun. Bisnis yang tidak dicatat tidak bisa diperbaiki, karena kamu tidak tahu bagian mana yang bocor.',
    },
    glossary: [
      { term: 'Pemasukan', meaning: 'Uang yang masuk ke bisnis — dari penjualan, DP, atau pelunasan.' },
      { term: 'Pengeluaran', meaning: 'Uang yang keluar untuk keperluan bisnis.' },
      { term: 'Modal putar', meaning: 'Uang yang dipakai lagi untuk belanja bahan/stok berikutnya.' },
      { term: 'Dana cadangan', meaning: 'Uang yang disisihkan untuk keadaan darurat atau bulan sepi.' },
      { term: 'Laporan laba rugi', meaning: 'Ringkasan: penjualan dikurangi semua biaya dalam satu periode.' },
    ],
    example: {
      title: 'Catatan seminggu thrift shop online',
      text: 'Masuk: 14 item terjual Rp1.260.000. Keluar: belanja bal Rp600.000, laundry Rp90.000, packing Rp45.000, iklan Rp50.000 = Rp785.000. Sisa: Rp475.000. Pengeluaran terbesar: belanja bal. Keputusan: sisihkan Rp300.000 untuk bal minggu depan (modal putar), Rp75.000 cadangan, Rp100.000 gaji diri. Tanpa catatan, uang Rp475.000 itu biasanya sudah habis untuk jajan di hari Rabu.',
    },
    exercise: {
      prompt: 'Siapkan sistem pencatatanmu hari ini: rekening/e-wallet mana yang jadi khusus bisnis, di mana kamu mencatat (spreadsheet/aplikasi/buku), kategori pengeluaran apa saja, kapan jadwal "rapat duit" mingguanmu, dan berapa gaji tetap untuk dirimu.',
      placeholder: 'Rekening bisnis: … | Catat di: … | Kategori: … | Rapat duit setiap: … jam … | Gaji diriku: Rp…/minggu',
    },
    tool: { to: '/app/toolkit?tab=prompts', label: 'Ambil prompt template catatan keuangan' },
  },
  {
    id: 'b101-13',
    title: 'Pelanggan balik lagi: cuan paling murah',
    minutes: 7,
    body: [
      'Mendapatkan pelanggan baru itu mahal: butuh konten, iklan, outreach, dan waktu meyakinkan dari nol. Pelanggan lama sudah percaya, sudah tahu kualitasmu, dan tinggal diingatkan. Bisnis yang sehat bukan yang paling banyak pelanggan barunya, tapi yang pelanggannya terus kembali.',
      'Cara menghitung pentingnya: NILAI PELANGGAN = rata-rata belanja × berapa kali beli per tahun × berapa tahun dia bertahan. Pelanggan es kopi Rp20 ribu yang beli 2x seminggu selama setahun bernilai ±Rp2 juta — bukan Rp20 ribu. Bandingkan dengan BIAYA MENDAPATKAN satu pelanggan. Selama nilai pelanggan jauh lebih besar dari biaya mendapatkannya, bisnismu bisa tumbuh.',
      'Lima kebiasaan yang membuat orang kembali: (1) CEK SETELAH BELI — tanya 2–3 hari kemudian apakah semuanya oke. (2) BERI ALASAN KEMBALI — langganan, kartu stamp, paket bulanan, atau info produk baru yang relevan. (3) TANGANI KOMPLAIN DENGAN CEPAT — pelanggan yang masalahnya diselesaikan dengan baik sering jadi lebih loyal daripada yang tidak pernah bermasalah. (4) MINTA TESTIMONI & REFERRAL di momen mereka paling senang — selalu yang asli dan dengan izin mereka. (5) SIMPAN DAFTAR PELANGGAN — nama, kontak, apa yang dibeli, kapan terakhir beli.',
      'Ukur satu angka: TINGKAT BELI ULANG — dari semua pembeli bulan lalu, berapa persen yang membeli lagi bulan ini. Kalau angkanya naik, bisnismu makin kuat walau tidak menambah iklan.',
    ],
    keyPoints: [
      'Menjaga pelanggan lama jauh lebih murah daripada mencari yang baru.',
      'Nilai pelanggan = rata-rata belanja × frekuensi × lama bertahan.',
      'Cek setelah beli, beri alasan kembali, selesaikan komplain dengan cepat.',
      'Minta testimoni & referral yang asli, dengan izin, di momen paling puas.',
      'Pantau tingkat beli ulang setiap bulan.',
    ],
    mythFact: {
      myth: '"Yang penting terus cari pembeli baru."',
      fact: 'Ember bocor tidak penuh walau terus diisi. Kalau pembeli tidak pernah kembali, masalahnya ada di produk atau pelayanan — bukan di kurangnya promosi.',
    },
    glossary: [
      { term: 'Retensi', meaning: 'Kemampuan bisnis membuat pelanggan tetap kembali.' },
      { term: 'LTV', meaning: 'Lifetime value — total belanja satu pelanggan selama dia jadi pelangganmu.' },
      { term: 'CAC', meaning: 'Customer acquisition cost — biaya untuk mendapatkan satu pelanggan baru.' },
      { term: 'Repeat order', meaning: 'Pembelian ulang dari pelanggan yang sama.' },
      { term: 'Referral', meaning: 'Pelanggan merekomendasikanmu ke orang lain.' },
    ],
    example: {
      title: 'Kartu stamp kedai es teh',
      text: 'Beli 10 gratis 1. Biaya satu gelas gratis Rp2.000 (biaya variabel), dan pelanggan yang mengumpulkan stamp rata-rata belanja Rp50.000 per 10 kunjungan. Artinya "diskon" efektifnya cuma 4% — jauh lebih hemat daripada promo potongan harga 20% untuk semua orang, dan membuat orang memilih kedaimu dibanding kedai sebelah.',
    },
    exercise: {
      prompt: 'Hitung nilai pelanggan untuk bisnismu (rata-rata belanja × frekuensi × lama bertahan). Lalu pilih 2 dari 5 kebiasaan retensi yang akan kamu jalankan, dan tulis pesan "cek setelah beli" yang akan kamu kirim ke pelanggan.',
      placeholder: 'Nilai pelanggan: Rp… × …x/tahun × … tahun = Rp… | Kebiasaan yang kupilih: 1) … 2) … | Pesan cek setelah beli: "…"',
    },
    tool: { to: '/app/outreach', label: 'Tulis pesan follow-up di Outreach Studio' },
  },
];

/** Urutan belajar: harga setelah sales, retensi setelah delivery, pencatatan setelah duit. */
const ORDER = ['b101-1', 'b101-2', 'b101-3', 'b101-4', 'b101-5', 'b101-11', 'b101-6', 'b101-7', 'b101-13', 'b101-8', 'b101-12', 'b101-9', 'b101-10'];
const ALL = new Map([...BASE.lessons, ...EXTRA_LESSONS].map((l) => [l.id, l]));

export const BUSINESS_101: LearningModule = {
  ...BASE,
  lessons: ORDER.map((id) => {
    const l = ALL.get(id);
    if (!l) throw new Error(`Pelajaran ${id} tidak ditemukan`);
    return l;
  }),
};
