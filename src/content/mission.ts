import type { FeatureKey } from '../lib/membership';

interface Resource { to: string; label: string; feature: FeatureKey }
export interface MissionStep {
  id: string; title: string; outcome: string; prompt: string; example: string;
  criteria: readonly string[]; stuck: string; resources: readonly Resource[];
}
const lesson = (id: string, label: string): Resource => ({ to: `/app/belajar/business-101?pelajaran=${id}`, label, feature: 'business101' });

/** One small offer, then one ethical field attempt. These are prompts, not guaranteed outcomes. */
export const MISSION_STEPS: readonly MissionStep[] = [
  { id: 'start', title: 'Mulai dari bekalmu', outcome: 'Batas waktu, alat, dan satu skill yang bisa dipakai sekarang.',
    prompt: 'Waktu yang bisa kupakai minggu ini:\nPerangkat dan skill yang sudah bisa kupakai:\nJenis bisnis yang bisa kuamati atau kuhubungi secara wajar:\nBatas pekerjaan yang belum sanggup kuterima:',
    example: 'Contoh ilustrasi: dua kali 45 menit, HP dan kemampuan menulis; mengamati warung dekat kampus; belum menerima desain atau pengelolaan akun.',
    criteria: ['Waktu dan alatnya benar-benar tersedia.', 'Skill bisa ditunjukkan dengan contoh sederhana.', 'Batas kemampuan dan biaya ditulis jujur.'],
    stuck: 'Pilih kemampuan paling kecil yang sudah pernah kamu pakai: merapikan tulisan, foto sederhana, atau mencatat. Jika belum ada, latihan dulu pada contoh sendiri; belum perlu menawarkan jasa.',
    resources: [lesson('b101-1', 'Baca: bisnis sebagai bantuan'), { to: '/app/passport', label: 'Passport (opsional)', feature: 'passport' }, { to: '/app/assessment', label: 'Assessment (opsional)', feature: 'assessment' }] },
  { id: 'problem', title: 'Pilih masalah pelanggan', outcome: 'Satu masalah pada satu jenis bisnis, dengan pengamatan yang bisa dijelaskan.',
    prompt: 'Jenis bisnis dan kode contoh (mis. Prospek A):\nYang benar-benar kulihat dan sumber/tanggalnya:\nDugaan dampak (belum fakta):\nPertanyaan untuk mengecek dugaan itu:',
    example: 'Contoh ilustrasi: tiga menu publik kedai A tidak punya deskripsi. Belum tahu apakah ini menyulitkan pembeli; tanyakan bagian menu yang paling sering ditanyakan.',
    criteria: ['Pengamatan dipisahkan dari dugaan.', 'Masalah cukup sempit untuk dibantu dalam waktu yang tersedia.', 'Ada pertanyaan validasi yang tidak menggiring jawaban.'],
    stuck: 'Pakai informasi publik atau percakapan berizin. Jangan menganggap foto kurang bagus pasti menurunkan penjualan. Pilih satu hal yang bisa ditanyakan ke pemilik.',
    resources: [lesson('b101-2', 'Baca: nilai bagi pelanggan'), { to: '/app/toolkit?tab=problem', label: 'Problem Map (opsional)', feature: 'toolkit' }] },
  { id: 'help', title: 'Tentukan bantuan kecil', outcome: 'Satu bantuan dengan hasil, batas pekerjaan, dan waktu pengerjaan.',
    prompt: 'Aku membantu siapa:\nPekerjaan kecil yang akan kubantu:\nHasil yang akan diterima:\nDurasi, jumlah revisi, dan yang tidak termasuk:',
    example: 'Contoh ilustrasi: merapikan deskripsi tiga menu dari informasi yang dikonfirmasi pemilik; satu dokumen, satu revisi, dua hari; tidak termasuk mengelola akun.',
    criteria: ['Hasilnya berupa sesuatu yang bisa diperiksa.', 'Sesuai skill dan waktu sendiri.', 'Jumlah, waktu, revisi, serta pengecualian jelas.'],
    stuck: 'Perkecil cakupan sampai kamu sanggup membuat contohnya. Hindari janji seperti meningkatkan omzet; janjikan pekerjaan yang bisa kamu kendalikan.',
    resources: [lesson('b101-7', 'Baca: menepati janji pekerjaan')] },
  { id: 'sample', title: 'Buat contoh hasil kerja', outcome: 'Satu contoh yang dapat ditinjau, bukan klaim pengalaman.',
    prompt: 'Contoh hasil kerja (tempel teks atau tautan yang kamu pilih):\nKebutuhan yang ingin dijawab:\nBagian yang masih ilustrasi/asumsi:\nCara meminta izin jika memakai nama, logo, atau data bisnis:',
    example: 'Contoh ilustrasi: satu deskripsi menu untuk merek rekaan. Tandai sebagai latihan; minta konfirmasi bahan/harga sebelum membuat versi untuk bisnis asli.',
    criteria: ['Contoh bisa dilihat atau dibaca oleh penerima yang diberi akses.', 'Contoh relevan dengan bantuan yang ditawarkan.', 'Ilustrasi, sumber, dan izin penggunaan dijelaskan.'],
    stuck: 'Buat versi fiktif yang diberi label latihan. Jika file terlalu besar, simpan di tempat milikmu lalu tulis tautannya; aplikasi ini menyimpan catatan/tautan, bukan mengunggah file contoh.',
    resources: [lesson('b101-2', 'Baca: menghubungkan contoh dengan kebutuhan')] },
  { id: 'offer', title: 'Susun penawaran & harga', outcome: 'Penawaran singkat dengan isi pekerjaan, dasar harga, dan batas percobaan.',
    prompt: 'Masalah yang masih perlu dikonfirmasi:\nHasil, jumlah, durasi, revisi, dan contoh:\nPerkiraan waktu x nilai waktu + biaya:\nHarga penawaran dan syarat pembayaran:\nJika uji gratis: batasnya dan apa yang ingin kupelajari:',
    example: 'Contoh ilustrasi perhitungan, bukan harga pasar: 2 jam x Rp25.000 + biaya Rp10.000 = dasar Rp60.000. Harga tetap perlu dicocokkan dengan cakupan dan respons calon pelanggan.',
    criteria: ['Harga mempunyai dasar waktu/biaya dan asumsi ditandai.', 'Isi pekerjaan serta pembayaran bisa dipahami tanpa menebak.', 'Tidak ada janji penjualan, penghasilan, atau kerja gratis tanpa batas.'],
    stuck: 'Kalkulasi manual cukup. Jangan menyamakan harga rekomendasi kalkulator dengan harga yang pasti diterima pasar. Perkecil bantuan jika waktunya terlalu besar.',
    resources: [lesson('b101-11', 'Baca: menentukan harga'), { to: '/app/toolkit?tab=hpp', label: 'HPP & Harga (opsional)', feature: 'toolkit' }, { to: '/app/toolkit?tab=proposal', label: 'Template Proposal (opsional)', feature: 'toolkit' }] },
  { id: 'approach', title: 'Siapkan pendekatan personal', outcome: 'Satu draf pesan untuk satu calon pelanggan yang relevan.',
    prompt: 'Kode calon pelanggan dan alasan relevan:\nSaluran kontak yang pantas digunakan:\nDraf pesan (pengamatan + tawaran bantuan + pertanyaan kecil):\nYang harus kuhapus sebelum dikirim (klaim, data pribadi, tekanan):',
    example: 'Contoh ilustrasi: “Halo Kak, saya lihat tiga menu publik belum ada deskripsinya. Saya sedang latihan merapikan teks menu; boleh tanya apakah bagian ini sedang dibutuhkan?” Sesuaikan dengan pengamatan nyata.',
    criteria: ['Ada alasan spesifik menghubungi orang itu.', 'Pesan jujur, singkat, dan mudah ditolak.', 'Saluran wajar, tanpa broadcast, data pribadi tak perlu, atau klaim hasil.'],
    stuck: 'Jika belum yakin tawarannya relevan, mulai dengan pertanyaan validasi. Draf tidak dikirim otomatis. Jangan mengirim berulang jika penerima menolak.',
    resources: [lesson('b101-5', 'Baca: percakapan penawaran'), { to: '/app/outreach?skenario=service_offer', label: 'Draf pendekatan (opsional)', feature: 'outreach' }] },
  { id: 'try', title: 'Coba secara etis', outcome: 'Catatan satu percobaan yang benar-benar dilakukan, atau alasan belum mencoba.',
    prompt: 'Status: belum mencoba / mencoba / berhenti:\nTanggal, saluran, dan kode prospek (tanpa nomor/email):\nYang benar-benar dikirim atau ditanyakan:\nRespons faktual: belum dibalas / ditolak / ditanya / lainnya:\nJika belum mencoba: hambatan dan langkah persiapan berikutnya:',
    example: 'Contoh ilustrasi: 12 Mei, percakapan berizin dengan Prospek A; ditanya apakah bisa selesai dua hari. Ini belum berarti pesanan atau penjualan.',
    criteria: ['Tanggal dan aktivitas dibedakan dari rencana.', 'Respons atau ketiadaan respons dicatat apa adanya.', 'Penolakan dihormati dan tidak ada pengiriman massal.'],
    stuck: 'Belum dibalas bukan bukti pasti bahwa bantuanmu buruk. Cek saluran, waktu, relevansi, dan kejelasan pesan. Jika memang patut, satu tindak lanjut sopan setelah beberapa hari; berhenti jika diminta.',
    resources: [lesson('b101-10', 'Baca: eksperimen kecil')] },
  { id: 'review', title: 'Evaluasi buktinya', outcome: 'Pemisahan fakta, tafsiran, dan satu dugaan untuk diuji berikutnya.',
    prompt: 'Aktivitas yang benar-benar dilakukan:\nBukti faktual dan izin bila menyimpan kutipan:\nYang belum bisa disimpulkan:\nSatu kemungkinan penyebab:\nSatu pertanyaan atau perubahan untuk mengujinya:',
    example: 'Contoh ilustrasi: satu pesan belum dibalas tiga hari. Belum cukup menyimpulkan tidak ada kebutuhan. Periksa apakah orang dan salurannya sesuai sebelum mengubah harga.',
    criteria: ['Tidak menganggap checklist atau balasan sebagai bukti keberhasilan bisnis.', 'Fakta dan tafsiran dipisahkan; bukti yang belum ada diakui.', 'Ada satu dugaan yang dapat diuji secara terbatas.'],
    stuck: 'Jika tidak ada percobaan, evaluasi hambatan persiapannya. Jangan mengarang hasil. Jika ditolak, catat alasan yang benar-benar disampaikan; alasan lain masih dugaan.',
    resources: [lesson('b101-10', 'Baca: ukur dan perbaiki')] },
  { id: 'improve', title: 'Perbaiki satu hal', outcome: 'Penawaran versi berikutnya dan keputusan lanjut, ubah, atau berhenti.',
    prompt: 'Keputusan: lanjut / ubah / berhenti:\nSatu bagian yang diubah beserta alasannya:\nVersi baru penawaran/pesan/contoh:\nPercobaan kecil berikutnya, waktu, dan batasnya:\nBukti yang ingin dikumpulkan:',
    example: 'Contoh ilustrasi: ubah tawaran mengelola akun menjadi merapikan tiga deskripsi menu karena waktuku terbatas; cek kebutuhan pada satu pemilik yang relevan, tanpa menjanjikan penjualan.',
    criteria: ['Perubahan menjawab bukti atau hambatan yang tercatat.', 'Percobaan berikutnya realistis dan mempunyai batas berhenti.', 'Tidak menganggap pekerjaan selesai sebagai jaminan pelanggan atau penghasilan.'],
    stuck: 'Berhenti atau mengganti jenis bantuan boleh. Jika buntu, bawa contoh dan catatan percobaan untuk meminta masukan; jangan menambah sepuluh layanan sekaligus.',
    resources: [lesson('b101-9', 'Baca: memilih arah berikutnya')] },
];

export const MISSION_PATH = '/app/action-plan';
