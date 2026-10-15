import { INDUSTRIES, type IndustryKey } from '../content/industries';

export const SCENARIOS = [
  { key: 'mentor', emoji: '🧭', name: 'Minta waktu ke mentor', desc: 'Ngajak owner/praktisi ngobrol 15 menit untuk belajar dari pengalamannya.', needsOffer: false },
  { key: 'sales_partner', emoji: '🤝', name: 'Jadi sales partner (komisi)', desc: 'Menawarkan diri menjual produk bisnis orang — dibayar dari order yang lunas. Modal Rp0.', needsOffer: false },
  { key: 'service_offer', emoji: '🛠️', name: 'Tawarkan jasa ke UMKM', desc: 'Menawarkan skill-mu (konten, admin, desain, dll) ke bisnis yang sudah berjalan.', needsOffer: true },
  { key: 'free_pilot', emoji: '🧪', name: 'Uji coba gratis untuk portofolio', desc: 'Belum punya portofolio? Tawarkan percobaan singkat gratis dengan batas yang jelas.', needsOffer: true },
  { key: 'follow_up', emoji: '🔁', name: 'Follow-up sopan', desc: 'Pesan susulan 3–5 hari setelah pesan pertama belum dibalas.', needsOffer: false },
  { key: 'collab', emoji: '🎯', name: 'Kolaborasi komunitas/creator', desc: 'Mengajak komunitas atau creator bekerja sama saling menguntungkan.', needsOffer: true },
] as const;
export type ScenarioKey = (typeof SCENARIOS)[number]['key'];

export const CHANNELS = [
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'instagram', label: 'DM Instagram' },
  { key: 'email', label: 'Email' },
  { key: 'linkedin', label: 'LinkedIn' },
] as const;
export type ChannelKey = (typeof CHANNELS)[number]['key'];

export const TONES = [
  { key: 'casual', label: 'Santai (Kak)' },
  { key: 'formal', label: 'Sopan (Bapak/Ibu)' },
] as const;
export type ToneKey = (typeof TONES)[number]['key'];

export interface OutreachInput {
  scenario: ScenarioKey;
  channel: ChannelKey;
  tone: ToneKey;
  myName: string;
  myContext: string;      // contoh: "mahasiswa manajemen semester 5"
  targetName: string;     // opsional
  businessName: string;
  industry: IndustryKey;
  offer: string;          // jasa/produk yang ditawarkan (bila relevan)
  observation: string;    // hal spesifik yang kamu perhatikan dari bisnis/target
}

export interface OutreachMessage { subject?: string; body: string }

const clean = (s: string) => s.trim().replace(/\s+/g, ' ');

function greeting(i: OutreachInput): string {
  const n = clean(i.targetName);
  if (i.tone === 'casual') return n ? `Halo Kak ${n}! 👋` : 'Halo Kak! 👋';
  return n ? `Selamat siang, ${n}.` : 'Selamat siang, Bapak/Ibu.';
}

function intro(i: OutreachInput): string {
  const ctx = clean(i.myContext);
  const me = clean(i.myName) || '[nama kamu]';
  return i.tone === 'casual'
    ? `Aku ${me}${ctx ? `, ${ctx}` : ''}.`
    : `Perkenalkan, saya ${me}${ctx ? `, ${ctx}` : ''}.`;
}

function closing(i: OutreachInput): string {
  const me = clean(i.myName) || '[nama kamu]';
  return i.tone === 'casual' ? `Makasih banyak, Kak 🙏\n— ${me}` : `Terima kasih atas waktunya.\n\nSalam,\n${me}`;
}

/** Kalimat observasi spesifik — inilah yang membuat pesan tidak terasa spam. */
function observation(i: OutreachInput, biz: string): string {
  const o = clean(i.observation);
  if (!o) return i.tone === 'casual'
    ? `Aku udah lama ngikutin ${biz} dan suka sama yang dikerjain.`
    : `Saya mengikuti ${biz} dan tertarik dengan apa yang sedang dibangun.`;
  return i.tone === 'casual' ? `Aku perhatiin di ${biz}, ${o}.` : `Saya memperhatikan bahwa di ${biz}, ${o}.`;
}

export function buildMessage(i: OutreachInput): OutreachMessage {
  const biz = clean(i.businessName) || '[nama bisnis]';
  const offer = clean(i.offer) || '[jasa/produk yang kamu tawarkan]';
  const ind = INDUSTRIES[i.industry].name;
  const casual = i.tone === 'casual';
  const g = greeting(i), me = intro(i), obs = observation(i, biz), end = closing(i);
  let body = '';
  let subject = '';

  switch (i.scenario) {
    case 'mentor':
      subject = `Boleh belajar 15 menit dari pengalaman ${biz}?`;
      body = casual
        ? `${g}\n\n${me} Lagi belajar mulai bisnis di bidang ${ind}. ${obs}\n\nBoleh nggak aku minta waktu 15 menit (call atau ketemu, ngikut jadwal Kakak) buat nanya 3 hal: gimana dulu dapat pelanggan pertama, kesalahan yang paling mahal, dan saran buat yang mulai dari nol?\n\nAku nggak jualan apa-apa kok — murni pengin belajar. Kalau lagi sibuk, nggak apa-apa banget.\n\n${end}`
        : `${g}\n\n${me} Saya sedang belajar memulai usaha di bidang ${ind}. ${obs}\n\nApakah Bapak/Ibu berkenan meluangkan waktu sekitar 15 menit (daring atau tatap muka, menyesuaikan jadwal) untuk berbagi tiga hal: cara mendapatkan pelanggan pertama, kesalahan yang paling berharga pelajarannya, dan saran bagi yang memulai dari nol?\n\nSaya tidak menawarkan produk apa pun; tujuan saya murni belajar. Bila sedang padat, saya sangat memahami.\n\n${end}`;
      break;

    case 'sales_partner':
      subject = `Tawaran membantu penjualan ${biz} (skema komisi)`;
      body = casual
        ? `${g}\n\n${me} ${obs}\n\nAku pengin bantu jualin produk ${biz} ke jaringanku (teman kampus, komunitas, dan kenalan). Skemanya simpel: aku dapat komisi HANYA dari order yang sudah lunas, jadi ${biz} nggak keluar biaya di depan sama sekali.\n\nKalau Kakak tertarik, boleh aku minta info: katalog/harga, skema komisi yang biasa dipakai, dan cara order-nya? Aku juga siap ikutin aturan brand ${biz}.\n\n${end}`
        : `${g}\n\n${me} ${obs}\n\nSaya ingin menawarkan diri membantu memasarkan produk ${biz} ke jaringan saya (kampus, komunitas, dan relasi). Skema yang saya usulkan berbasis komisi dari pesanan yang sudah lunas, sehingga tidak ada biaya di muka bagi ${biz}.\n\nApabila Bapak/Ibu berkenan, saya ingin mengetahui katalog dan harga, skema komisi yang berlaku, serta alur pemesanan. Saya siap mengikuti ketentuan brand ${biz}.\n\n${end}`;
      break;

    case 'service_offer':
      subject = `Ide untuk ${biz}: ${offer}`;
      body = casual
        ? `${g}\n\n${me} ${obs}\n\nAku punya ide kecil yang mungkin bisa bantu: ${offer}. Aku udah biasa ngerjain ini dan bisa kirim contoh hasilnya dulu biar Kakak bisa nilai sendiri.\n\nBoleh aku kirim 1 contoh konkret khusus buat ${biz}? Gratis, tanpa kewajiban apa pun.\n\n${end}`
        : `${g}\n\n${me} ${obs}\n\nSaya ingin menawarkan bantuan berupa ${offer}. Sebelum membicarakan kerja sama, saya dapat mengirimkan satu contoh hasil yang disesuaikan untuk ${biz} agar Bapak/Ibu dapat menilainya terlebih dahulu.\n\nApakah saya boleh mengirimkan contoh tersebut? Tidak ada kewajiban apa pun.\n\n${end}`;
      break;

    case 'free_pilot':
      subject = `Uji coba gratis 7 hari: ${offer} untuk ${biz}`;
      body = casual
        ? `${g}\n\n${me} ${obs}\n\nAku lagi bangun portofolio di bidang ${offer}. Aku mau nawarin uji coba GRATIS selama 7 hari buat ${biz}, dengan batas jelas: [tulis batasnya, mis. 5 desain feed / 3 video].\n\nSebagai gantinya, aku cuma minta izin hasilnya aku pajang di portofolio + testimoni jujur kalau Kakak puas. Setelah 7 hari, Kakak bebas mau lanjut atau nggak.\n\nGimana, Kak?\n\n${end}`
        : `${g}\n\n${me} ${obs}\n\nSaat ini saya sedang membangun portofolio di bidang ${offer}. Saya ingin menawarkan uji coba tanpa biaya selama 7 hari untuk ${biz} dengan cakupan yang jelas: [tuliskan batasnya].\n\nSebagai gantinya, saya memohon izin menampilkan hasil pekerjaan di portofolio serta testimoni apabila Bapak/Ibu merasa puas. Setelah periode tersebut, tidak ada kewajiban untuk melanjutkan.\n\n${end}`;
      break;

    case 'follow_up':
      subject = `Menindaklanjuti pesan saya untuk ${biz}`;
      body = casual
        ? `${g}\n\nAku ${clean(i.myName) || '[nama kamu]'} yang beberapa hari lalu chat soal ${biz} 😊 Paham banget Kakak pasti sibuk.\n\nBiar gampang, cukup balas angka aja ya:\n1 — boleh, lanjut ngobrol\n2 — mungkin nanti, kabari lagi bulan depan\n3 — belum dulu, makasih\n\nApa pun jawabannya aku hargai banget 🙏`
        : `${g}\n\nSaya ${clean(i.myName) || '[nama kamu]'}, yang beberapa hari lalu menghubungi terkait ${biz}. Saya memahami Bapak/Ibu tentu memiliki banyak kesibukan.\n\nAgar memudahkan, Bapak/Ibu cukup membalas dengan angka:\n1 — bersedia melanjutkan pembicaraan\n2 — mungkin di lain waktu\n3 — belum berminat\n\nApa pun jawabannya, saya sangat menghargainya. Terima kasih.`;
      break;

    case 'collab':
      subject = `Ajakan kolaborasi dengan ${biz}`;
      body = casual
        ? `${g}\n\n${me} ${obs}\n\nAku kepikiran kolaborasi: ${offer}. Win-win-nya: ${biz} dapat [manfaat untuk mereka], aku dapat [manfaat untukmu].\n\nKalau Kakak tertarik, aku bisa siapin konsep 1 halaman dulu biar enak dibahas. Boleh?\n\n${end}`
        : `${g}\n\n${me} ${obs}\n\nSaya ingin mengusulkan kolaborasi berupa ${offer}. Manfaat bagi ${biz}: [manfaat untuk mereka]; manfaat bagi kami: [manfaat untukmu].\n\nApabila Bapak/Ibu tertarik, saya dapat menyiapkan konsep satu halaman sebagai bahan diskusi.\n\n${end}`;
      break;
  }

  // Email & LinkedIn: tanpa emoji, email memakai subject.
  if (i.channel === 'email' || i.channel === 'linkedin') {
    return { subject: i.channel === 'email' ? subject : undefined, body: body.replace(/ 👋| 😊| 🙏/g, '') };
  }
  return { body };
}

/** Prompt siap salin untuk ChatGPT/Claude/Gemini agar pesan makin personal. */
export function buildAiPrompt(i: OutreachInput): string {
  const sc = SCENARIOS.find((s) => s.key === i.scenario)!;
  const ch = CHANNELS.find((c) => c.key === i.channel)!.label;
  return [
    `Kamu adalah mentor sales yang jujur dan beretika. Bantu saya menulis pesan ${ch} dalam Bahasa Indonesia.`,
    ``,
    `Tujuan: ${sc.name} — ${sc.desc}`,
    `Saya: ${clean(i.myName) || '[nama]'}${clean(i.myContext) ? `, ${clean(i.myContext)}` : ''}`,
    `Penerima: ${clean(i.targetName) || '[nama penerima]'} dari ${clean(i.businessName) || '[nama bisnis]'} (industri ${INDUSTRIES[i.industry].name})`,
    i.offer ? `Yang saya tawarkan: ${clean(i.offer)}` : '',
    i.observation ? `Hal spesifik yang saya perhatikan dari mereka: ${clean(i.observation)}` : '',
    `Gaya bahasa: ${i.tone === 'casual' ? 'santai tapi sopan, sapaan "Kak"' : 'sopan formal, sapaan "Bapak/Ibu"'}`,
    ``,
    `Aturan:`,
    `- Maksimal ${i.channel === 'email' ? '150' : '90'} kata${i.channel === 'email' ? ', sertakan subject' : ''}.`,
    `- Buka dengan hal spesifik tentang mereka, bukan tentang saya.`,
    `- Satu ajakan yang jelas dan mudah dijawab.`,
    `- Jangan melebih-lebihkan, jangan menjanjikan hasil, jangan memakai klaim palsu.`,
    `- Beri 3 variasi: pendek, sedang, dan yang paling personal.`,
  ].filter(Boolean).join('\n');
}

/** Tautan WhatsApp — pengguna sendiri yang memilih kontak & menekan kirim. */
export function whatsappLink(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export const OBJECTIONS = [
  { q: '"Kamu kan belum punya pengalaman."', a: 'Betul, karena itu saya tawarkan uji coba singkat dengan batas yang jelas. Bapak/Ibu bisa menilai dari hasil, bukan dari janji.' },
  { q: '"Kita sudah punya vendor/admin."', a: 'Siap, tidak perlu mengganti. Kalau suatu saat butuh cadangan atau tambahan untuk momen ramai, saya boleh disimpan kontaknya?' },
  { q: '"Harganya kemahalan."', a: 'Boleh saya tahu kisaran anggarannya? Saya bisa sesuaikan cakupan kerjanya supaya pas, tanpa menurunkan kualitas yang sudah disepakati.' },
  { q: '"Nanti saya kabari ya."', a: 'Siap. Supaya tidak lupa, boleh saya follow-up hari [tanggal]? Kalau ternyata belum cocok, cukup balas "belum" saja.' },
  { q: '"Komisinya berapa?" (saat jadi sales partner)', a: 'Saya ikut skema yang biasa berlaku di sini. Yang penting bagi saya: komisi dihitung dari order lunas dan aturannya tertulis.' },
] as const;

export const OUTREACH_RULES = [
  'Kirim satu per satu, personal. Jangan broadcast massal — itu spam dan merusak nama baikmu.',
  'Riset 5 menit sebelum chat: lihat IG, Google Maps, atau review mereka. Masukkan 1 hal spesifik.',
  'Maksimal 1 follow-up per minggu, maksimal 2 kali. Setelah itu, lepaskan dengan baik.',
  'Jangan pernah meminta uang di depan untuk dirimu atau menalangi uang orang lain.',
  'Catat semua yang kamu hubungi: nama, tanggal, balasan, langkah berikutnya.',
] as const;
