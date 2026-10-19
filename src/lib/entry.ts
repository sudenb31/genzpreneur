import { z } from 'zod';
import { MISSION_STEPS } from '../content/mission';
import { missionKey, missionReady, readMissionDraft, missionSummary } from './mission';

export const ENTRY_KEY = 'entry-map-v1';
export const ENTRY_PATH = '/app/kondisi-awal';
export const ENTRY_VERSION = 1;
export const RULE_VERSION = 1;
const text = z.string().max(300);
export const entryAnswersSchema = z.object({
  goal: text, skills: text, task: text,
  ability: z.enum(['unknown', 'not_yet', 'can']),
  recipient: text, problem: text, problemKnown: z.enum(['unknown', 'not_yet', 'yes']),
  example: z.string().max(500), exampleStatus: z.enum(['unknown', 'none', 'available']), exampleRelevant: z.enum(['unknown', 'no', 'yes']),
  offer: z.enum(['unknown', 'not_yet', 'draft', 'ready']),
  experience: z.enum(['unknown', 'never', 'offered', 'delivered']), experienceSame: z.enum(['unknown', 'no', 'yes']),
  time: z.enum(['unknown', 'none', 'under1', '1to3', 'more3']), devices: text, constraints: text,
}).strict();
export type EntryAnswers = z.infer<typeof entryAnswersSchema>;
export const STAGE_IDS = ['start', 'problem', 'help', 'sample', 'offer', 'approach', 'try', 'review', 'improve'] as const;
export type StageId = typeof STAGE_IDS[number];
export const entryRecordSchema = z.object({ questionVersion: z.literal(1), ruleVersion: z.literal(1), answers: entryAnswersSchema, selectedStage: z.enum(STAGE_IDS).nullable() }).strict();
export type EntryRecord = z.infer<typeof entryRecordSchema>;
export const emptyEntry = (): EntryRecord => ({ questionVersion: ENTRY_VERSION, ruleVersion: RULE_VERSION, selectedStage: null, answers: {
  goal: '', skills: '', task: '', ability: 'unknown', recipient: '', problem: '', problemKnown: 'unknown', example: '', exampleStatus: 'unknown', exampleRelevant: 'unknown', offer: 'unknown', experience: 'unknown', experienceSame: 'unknown', time: 'unknown', devices: '', constraints: '',
} });
export function readEntry(raw: string | undefined): EntryRecord | null {
  if (!raw) return null;
  try { const result = entryRecordSchema.safeParse(JSON.parse(raw)); return result.success ? result.data : null; } catch { return null; }
}
export function encodeEntry(record: EntryRecord) {
  const result = entryRecordSchema.parse(record);
  const encoded = JSON.stringify(result);
  if (encoded.length > 8000) throw new Error('Ringkas jawaban sebelum menyimpan.');
  return encoded;
}
export const knownText = (value: string) => !!value.trim() && !/^(belum tahu|tidak tahu|belum pernah|belum ada|tidak ada|belum|[-—?])\.?$/i.test(value.trim());
export interface EntryRecommendation { branch: 'A' | 'B' | 'C' | 'D' | 'E'; stage: StageId; title: string; reason: string; question?: string; editSection?: number }
export function recommendEntry(a: EntryAnswers): EntryRecommendation {
  const experienced = a.experience === 'offered' || a.experience === 'delivered';
  if (a.experience === 'never' && a.experienceSame === 'yes') return { branch: 'E', stage: 'review', title: 'Perjelas apakah sudah pernah mencoba', reason: 'Jawaban belum pernah dan pernah mencoba bantuan terkait belum selaras. Belum cukup informasi untuk menetapkan titik masuk.', question: 'Apakah sudah ada percobaan nyata untuk bantuan ini, atau baru rencana?', editSection: 2 };
  if (a.exampleStatus !== 'available' && a.exampleRelevant === 'yes') return { branch: 'C', stage: 'sample', title: 'Perjelas status contoh', reason: 'Contoh dinyatakan relevan, tetapi statusnya belum menyatakan tersedia. Saran ini masih sementara.', question: 'Apakah contoh itu sudah ada saat ini atau baru akan dibuat?', editSection: 1 };
  if (experienced && a.experienceSame === 'unknown') return { branch: 'E', stage: 'review', title: 'Periksa kaitan percobaanmu', reason: 'Ada pengalaman, tetapi belum jelas apakah terkait bantuan yang ingin kamu kerjakan sekarang. Ini saran sementara.', question: 'Apakah pengalaman itu berkaitan dengan bantuan yang ingin kamu kerjakan sekarang?', editSection: 2 };
  if (experienced && a.experienceSame === 'yes') {
    if (a.ability !== 'can' || !knownText(a.task)) return { branch: 'E', stage: 'review', title: 'Perjelas pengalaman dan kemampuan saat ini', reason: 'Kamu melaporkan pengalaman terkait, tetapi pekerjaan yang sanggup dilakukan sekarang belum jelas. Jangan anggap pengalaman lama sebagai bukti kemampuan saat ini.', question: 'Pekerjaan kecil apa yang sekarang sanggup kamu ulangi dari pengalaman itu?', editSection: 0 };
    return { branch: 'E', stage: 'review', title: 'Evaluasi percobaan yang sudah dilakukan', reason: 'Kamu melaporkan pernah menawarkan atau mengerjakan bantuan terkait. Mulai dari fakta percobaan, lalu tentukan bagian yang perlu diperbaiki.' };
  }
  if (a.ability !== 'can' || !knownText(a.task)) return { branch: 'A', stage: 'start', title: 'Siapkan satu kemampuan dan contoh latihan', reason: 'Pekerjaan kecil yang sanggup kamu selesaikan belum cukup jelas. Latih satu pekerjaan sederhana dengan contoh milik sendiri atau fiktif; tidak perlu mengerjakan gratis untuk calon pelanggan.', ...(a.ability === 'unknown' || a.ability === 'can' ? { question: 'Pekerjaan kecil apa yang sudah bisa kamu selesaikan sendiri saat ini?', editSection: 0 } : {}) };
  if (a.problemKnown === 'yes' && (!knownText(a.recipient) || !knownText(a.problem))) return { branch: 'B', stage: 'problem', title: 'Perjelas penerima dan masalahnya', reason: 'Kamu menyatakan masalah sudah diketahui, tetapi penerima atau pengamatannya belum dituliskan. Rekomendasi ini masih sementara.', question: 'Siapa jenis penerima bantuan dan masalah konkret apa yang kamu ketahui?', editSection: 1 };
  if (a.problemKnown !== 'yes' || !knownText(a.recipient) || !knownText(a.problem)) return { branch: 'B', stage: 'problem', title: 'Pilih masalah dan bantuan kecil', reason: 'Pekerjaan yang dapat dilakukan sudah disebutkan, tetapi calon penerima dan masalahnya belum jelas. Pisahkan pengamatan dari dugaan sebelum menentukan bantuan.' };
  if (a.exampleStatus === 'available' && a.exampleRelevant === 'unknown') return { branch: 'C', stage: 'sample', title: 'Periksa relevansi contoh', reason: 'Contoh dilaporkan tersedia, tetapi belum jelas apakah menunjukkan bantuan untuk masalah yang dipilih.', question: 'Apakah contohmu menunjukkan bantuan untuk masalah yang baru kamu tulis?', editSection: 1 };
  if (a.exampleStatus !== 'available' || a.exampleRelevant !== 'yes') return { branch: 'C', stage: 'sample', title: 'Buat satu contoh yang relevan', reason: 'Bantuan dan calon penerima sudah tergambar, tetapi contoh relevan belum dilaporkan. Pakai contoh fiktif atau publik dengan sumber yang jelas.' };
  return { branch: 'D', stage: a.offer === 'ready' ? 'approach' : 'offer', title: a.offer === 'ready' ? 'Periksa penawaran dan pendekatan personal' : 'Susun cakupan, penawaran dan harga', reason: a.offer === 'ready' ? 'Contoh relevan dan penawaran dilaporkan tersedia. Periksa cakupan, dasar harga, revisi serta saluran pendekatan sebelum mencoba.' : 'Contoh relevan dilaporkan tersedia. Selanjutnya perjelas hasil, batas pekerjaan, biaya, harga dan pembayaran.' };
}
export function entryDimensions(a: EntryAnswers) {
  return [
    ['Kemampuan menghasilkan pekerjaan', a.ability === 'can' && knownText(a.task) ? a.task : a.ability === 'not_yet' ? 'Belum yakin bisa mengerjakan sendiri' : 'Belum jelas'],
    ['Masalah dan calon penerima', a.problemKnown === 'yes' && knownText(a.recipient) && knownText(a.problem) ? `${a.recipient}: ${a.problem}` : 'Masih perlu dipilih atau dikonfirmasi'],
    ['Contoh kerja', a.exampleStatus === 'available' ? `Dilaporkan tersedia; relevansi ${a.exampleRelevant === 'yes' ? 'dinyatakan sesuai' : a.exampleRelevant === 'no' ? 'dinyatakan belum sesuai' : 'belum dipastikan'}` : 'Belum tersedia atau belum diketahui'],
    ['Penawaran', a.offer === 'ready' ? 'Dilaporkan sudah disiapkan; belum diperiksa' : a.offer === 'draft' ? 'Masih draf' : 'Belum disiapkan atau belum diketahui'],
    ['Pengalaman mencoba', a.experience === 'never' ? 'Belum pernah' : a.experience === 'unknown' ? 'Belum jelas' : `${a.experience === 'offered' ? 'Pernah menawarkan' : 'Pernah mengerjakan'}; kaitan dengan bantuan ini ${a.experienceSame === 'yes' ? 'dinyatakan terkait' : a.experienceSame === 'no' ? 'berbeda' : 'belum jelas'}`],
    ['Kendala pelaksanaan', `${a.time === 'none' ? 'Waktu belum tersedia. ' : a.time === 'unknown' ? 'Waktu belum diketahui. ' : ''}${a.constraints || 'Belum ada kendala yang dituliskan.'} ${a.devices ? `Perangkat: ${a.devices}` : 'Perangkat belum dituliskan.'}`],
  ];
}
/** Resume existing work first. Entry advice never completes or replaces any work draft. */
export function entryMissionStage(notes: Record<string, string>): StageId {
  const entry = readEntry(notes[ENTRY_KEY]);
  const work = missionSummary(notes);
  const selected = entry?.selectedStage;
  if (selected) return selected;
  const unfinished = MISSION_STEPS.find(s => {
    const d = readMissionDraft(notes[missionKey(s.id)]); return d.text.trim() && !missionReady(d);
  });
  if (unfinished) return unfinished.id as StageId;
  if (work.written) return work.next.id as StageId;
  return entry ? recommendEntry(entry.answers).stage : 'start';
}
export const ENTRY_PREREQUISITES: Partial<Record<StageId, StageId[]>> = {
  problem: ['start'], help: ['problem'], sample: ['help'], offer: ['help', 'sample'], approach: ['offer'], try: ['offer', 'approach'], review: ['try'], improve: ['review'],
};
