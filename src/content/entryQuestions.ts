import type { EntryAnswers } from '../lib/entry';
export interface EntryQuestion { key: keyof EntryAnswers; label: string; hint?: string; options?: readonly (readonly [string, string])[] }
const unsure = ['unknown', 'Belum tahu'] as const;
export const ENTRY_SECTIONS: { title: string; questions: EntryQuestion[] }[] = [
  { title: 'Tujuan & kemampuan', questions: [
    { key: 'goal', label: 'Apa yang ingin kamu kerjakan lewat program ini?', hint: 'Boleh tulis belum tahu. Tidak perlu menyebut target pendapatan.' },
    { key: 'skills', label: 'Skill apa yang dirasa sudah kamu miliki?', hint: 'Misalnya merapikan tulisan. Boleh belum tahu.' },
    { key: 'task', label: 'Pekerjaan kecil apa yang bisa kamu selesaikan sekarang?', hint: 'Sebut hasil yang bisa dilihat; bukan hanya nama bidang.' },
    { key: 'ability', label: 'Seberapa yakin bisa mengerjakan pekerjaan itu sendiri?', options: [unsure, ['not_yet', 'Belum yakin / belum bisa'], ['can', 'Bisa mengerjakannya sekarang']] },
  ] },
  { title: 'Penerima & contoh', questions: [
    { key: 'recipient', label: 'Jenis bisnis siapa yang ingin kamu bantu?', hint: 'Jenis bisnis atau kode contoh saja; jangan nama atau kontak pelanggan.' },
    { key: 'problem', label: 'Masalah apa yang benar-benar kamu ketahui?', hint: 'Pisahkan pengamatan dari dugaan. Boleh tulis belum tahu.' },
    { key: 'problemKnown', label: 'Apakah penerima dan masalahnya sudah cukup jelas?', options: [unsure, ['not_yet', 'Belum jelas; masih dugaan'], ['yes', 'Sudah bisa menyebutkan penerima dan masalah']] },
    { key: 'exampleStatus', label: 'Apakah ada contoh hasil kerja?', options: [unsure, ['none', 'Belum punya contoh'], ['available', 'Ada contoh']] },
    { key: 'exampleRelevant', label: 'Apakah contoh itu relevan dengan bantuan ini?', options: [unsure, ['no', 'Belum relevan / belum ada contoh'], ['yes', 'Menurut saya relevan']] },
    { key: 'example', label: 'Ceritakan satu contoh atau tempel tautannya (opsional)', hint: 'Boleh contoh fiktif/publik dengan sumber. Tidak perlu kerja gratis untuk calon pelanggan. Tautan tidak dibuka atau dinilai otomatis.' },
  ] },
  { title: 'Penawaran & pengalaman', questions: [
    { key: 'offer', label: 'Bagaimana kondisi penawaranmu?', options: [unsure, ['not_yet', 'Belum disiapkan'], ['draft', 'Ada draf; cakupan/harga belum jelas'], ['ready', 'Sudah menulis cakupan, harga, waktu dan revisi']] },
    { key: 'experience', label: 'Pernah menawarkan atau mengerjakan untuk orang lain?', options: [unsure, ['never', 'Belum pernah'], ['offered', 'Pernah menawarkan; termasuk belum dibalas/ditolak'], ['delivered', 'Pernah mengerjakan']] },
    { key: 'experienceSame', label: 'Apakah pengalaman itu terkait bantuan yang ingin kamu kerjakan sekarang?', options: [unsure, ['no', 'Berbeda / belum pernah mencoba'], ['yes', 'Ya, terkait bantuan ini']] },
  ] },
  { title: 'Waktu & kendala', questions: [
    { key: 'time', label: 'Waktu yang bisa dipakai pekan ini?', options: [unsure, ['none', 'Belum ada waktu'], ['under1', 'Kurang dari satu jam'], ['1to3', 'Satu sampai tiga jam'], ['more3', 'Lebih dari tiga jam']] },
    { key: 'devices', label: 'Perangkat apa yang bisa kamu gunakan?', hint: 'Misalnya HP bersama atau laptop; boleh belum tahu.' },
    { key: 'constraints', label: 'Kendala praktis apa yang perlu dipertimbangkan?', hint: 'Misalnya koneksi terbatas atau jadwal berubah. Cukup dampaknya; tidak perlu cerita kondisi pribadi sensitif.' },
  ] },
];
