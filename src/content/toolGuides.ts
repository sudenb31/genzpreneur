/**
 * Panduan singkat untuk setiap alat di AI Business Toolkit:
 * apa ini, kapan dipakai, cara pakai langkah demi langkah, hasil, dan tips.
 */
export type ToolKey = 'prompts' | 'hpp' | 'calculator' | 'proposal' | 'problem';

export interface ToolGuide {
  emoji: string;
  title: string;
  tile: string;
  what: string;
  when: string[];
  steps: string[];
  output: string;
  tips?: string[];
}

export const TOOL_GUIDES: Record<ToolKey, ToolGuide> = {
  prompts: {
    emoji: '⚡',
    title: 'Prompt Library',
    tile: 'bg-lilac',
    what: 'Kumpulan perintah siap pakai untuk AI gratis seperti ChatGPT, Claude, atau Gemini. Data dari Passport & Assessment-mu (industri, jalur, skill, kota) otomatis masuk ke dalam prompt, jadi jawaban AI lebih nyambung dengan kondisimu.',
    when: [
      'Bingung mau mulai dari mana (cari ide, cari target, cari prospek).',
      'Butuh draf cepat: pesan penawaran, caption, naskah video, balasan komplain.',
      'Mau latihan: simulasi calon klien yang skeptis, atau minta dijelaskan istilah bisnis.',
    ],
    steps: [
      'Pilih kategori sesuai kebutuhanmu (misal "Outreach" kalau mau menghubungi calon klien).',
      'Baca baris "Pakai saat" untuk memastikan prompt-nya cocok.',
      'Klik tombol Salin.',
      'Buka ChatGPT / Claude / Gemini di tab lain, lalu tempel (paste).',
      'Ganti semua bagian [dalam kurung siku] dengan info milikmu, lalu kirim.',
      'Baca hasilnya dengan kritis, edit seperlunya, baru dipakai. Klik Simpan kalau prompt-nya mau dipakai lagi.',
    ],
    output: 'Draf, analisis, atau daftar ide yang bisa langsung kamu edit dan pakai.',
    tips: [
      'AI bisa salah dan bisa mengarang. Selalu cek fakta, angka, dan nada pesan.',
      'Jangan menempelkan data pribadi orang lain (nomor HP, alamat) ke AI.',
      'Hasil kurang pas? Balas AI dengan "lebih singkat", "lebih santai", atau "beri 3 versi lain".',
    ],
  },
  hpp: {
    emoji: '🧾',
    title: 'Kalkulator HPP & Harga Jual',
    tile: 'bg-lime',
    what: 'HPP (Harga Pokok Penjualan) adalah modal sebenarnya untuk membuat SATU produk atau menyelesaikan SATU proyek jasa — bukan cuma harga bahan, tapi juga kemasan, tenaga kerja (termasuk waktumu), dan bagian dari biaya bulanan seperti sewa & listrik. Kalkulator ini menghitung HPP-mu, lalu merekomendasikan harga jual yang sehat.',
    when: [
      'Sebelum menentukan harga jual produk atau jasa pertama.',
      'Saat merasa "laku terus tapi uangnya nggak pernah ada".',
      'Sebelum masuk marketplace/ojol (karena ada potongan komisi) atau sebelum kasih diskon.',
    ],
    steps: [
      'Pilih mode: Produk (makanan, minuman, barang) atau Jasa (desain, edit video, les, dll.).',
      'Isi bahan baku untuk SATU kali produksi (1 resep/1 batch): harga beli per kemasan, isi kemasan, dan takaran yang dipakai. Isi juga berapa unit yang dihasilkan dari 1 batch.',
      'Isi biaya yang menempel di setiap unit: cup, plastik, stiker, sedotan, dsb.',
      'Isi tenaga kerja: berapa jam untuk 1 batch dan upah per jam. Waktumu sendiri juga dihitung!',
      'Isi biaya tetap bulanan (sewa, listrik, gas, internet, langganan aplikasi) dan perkiraan jumlah terjual per bulan.',
      'Isi potongan platform (kalau jualan di marketplace/ojol), target laba, dan—kalau ada—harga yang sedang kamu pakai untuk dicek.',
    ],
    output: 'HPP per unit beserta rinciannya, harga jual rekomendasi, laba per unit, titik impas (BEP), dan proyeksi laba bulanan.',
    tips: [
      'Belum pernah hitung? Klik "Isi contoh" untuk melihat cara mengisinya, lalu ganti dengan angkamu.',
      'Takaran harus pakai satuan yang sama dengan isi kemasan (gram dengan gram, ml dengan ml).',
      'Angka perkiraan tidak apa-apa. Lebih baik perkiraan yang jujur daripada tidak menghitung sama sekali.',
    ],
  },
  calculator: {
    emoji: '🧮',
    title: 'Kalkulator Komisi',
    tile: 'bg-sky',
    what: 'Untuk kamu yang jadi sales partner, reseller, atau affiliate produk orang lain (jalur modal Rp0). Kalkulator ini menghitung berapa komisi yang kamu dapat, berapa unit yang harus terjual untuk mencapai target, dan apakah skema komisinya masih masuk akal bagi pemilik bisnis.',
    when: [
      'Sebelum menyepakati persen komisi dengan pemilik bisnis.',
      'Saat menentukan target penjualan bulanan sebagai sales partner.',
      'Saat membandingkan dua tawaran kerja sama komisi.',
    ],
    steps: [
      'Isi harga jual produk per unit.',
      'Isi modal/HPP per unit kalau tahu (tanya pemilik; isi 0 kalau tidak tahu).',
      'Isi persen komisi dan pilih komisi dihitung dari harga jual atau dari laba.',
      'Isi simulasi jumlah unit terjual dan target komisimu.',
      'Baca hasil di sebelah kanan, lalu Salin atau Simpan.',
    ],
    output: 'Omzet, laba kotor, komisi per unit, total komisimu, sisa laba pemilik, dan jumlah unit untuk mencapai target.',
    tips: [
      'Kalau sisa laba pemilik negatif, skemanya tidak sehat—pemilik tidak akan mau bertahan lama.',
      'Komisi dari laba biasanya lebih adil untuk produk dengan margin tipis.',
    ],
  },
  proposal: {
    emoji: '📄',
    title: 'Template Proposal',
    tile: 'bg-pink',
    what: 'Membuat proposal kerja sama singkat dan rapi yang siap dikirim ke calon klien lewat WhatsApp atau email—tanpa perlu desain atau Word.',
    when: [
      'Calon klien sudah tertarik dan bilang "boleh kirim penawarannya?".',
      'Setelah ngobrol/meeting dan perlu merangkum kesepakatan awal.',
    ],
    steps: [
      'Pilih skema: fee tetap, komisi, atau uji coba gratis.',
      'Isi data dirimu dan nama bisnis klien.',
      'Tulis masalah yang kamu amati di bisnis mereka (spesifik, bukan umum).',
      'Tulis layanan yang kamu usulkan dan rincian pekerjaan—satu per baris.',
      'Isi durasi, harga/komisi, dan jumlah revisi. Pratinjau di kanan langsung berubah.',
      'Salin, lalu kirim. Simpan kalau ingin dipakai lagi.',
    ],
    output: 'Teks proposal lengkap: masalah, solusi, rincian pekerjaan, harga, durasi, revisi, dan langkah berikutnya.',
    tips: [
      'Belum yakin harganya? Hitung dulu di Kalkulator HPP & Harga.',
      'Pakai prompt "Review proposal sebelum dikirim" di Prompt Library untuk mengecek ulang.',
    ],
  },
  problem: {
    emoji: '🧩',
    title: 'Problem Map',
    tile: 'bg-amber-soft',
    what: 'Alat untuk mengubah keresahan yang kamu lihat di sekitar menjadi peluang bisnis yang jelas: dari gejala di permukaan sampai langkah awal yang bisa kamu tawarkan.',
    when: [
      'Kamu resah dengan sesuatu tapi belum tahu mau bikin apa.',
      'Sebelum memilih ide bisnis, supaya yang dibangun benar-benar menyelesaikan masalah.',
      'Saat mengerjakan latihan di Kurikulum (Read The Game & Business 101).',
    ],
    steps: [
      'Beri judul singkat dan pilih zona dampaknya.',
      'Fenomena: tulis apa yang terlihat di permukaan.',
      'Masalah inti → akar masalah: gali kenapa itu terus terjadi.',
      'Dampak & siapa yang terdampak: siapa yang paling rugi.',
      'Langkah awal: bantuan kecil yang bisa kamu tawarkan sekarang.',
      'Validasi: cara mengecek dugaanmu ke orang yang mengalaminya. Lalu Salin/Simpan.',
    ],
    output: 'Peta masalah yang rapi dan siap jadi dasar penawaran atau eksperimen 7 hari.',
  },
};
