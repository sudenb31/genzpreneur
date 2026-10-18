/**
 * DATA UJI — semua skenario di bawah fiktif, hanya untuk menguji aturan.
 * Bukan hasil peserta sungguhan.
 */
import { describe, expect, it } from 'vitest';
import {
  answeredSteps, emptyAnswers, normalizeAnswers, prerequisiteCheck, recommendEntry, ENTRIES, RULES_VERSION, QUESTIONS_VERSION,
  type BaselineAnswers,
} from './baseline';

const a = (over: Partial<BaselineAnswers>): BaselineAnswers => ({ ...emptyAnswers(), ...over });

describe('aturan titik masuk r1 (data uji fiktif)', () => {
  it('A: belum bisa menyebutkan pekerjaan kecil', () => {
    const r = recommendEntry(a({ taskConfidence: 'none', experience: 'none', exampleStatus: 'none', customerClarity: 'unsure', hours: '2_5' }));
    expect(r.entry).toBe('A');
    expect(r.tentative).toBe(false);
  });
  it('A: belum yakin mampu', () => {
    expect(recommendEntry(a({ taskConfidence: 'not_sure', experience: 'none' })).entry).toBe('A');
  });
  it('B: punya skill, pelanggan/masalah belum jelas', () => {
    const r = recommendEntry(a({ skills: ['design'], smallTask: 'desain 3 postingan promo', taskConfidence: 'done_before', customerClarity: 'unsure', exampleStatus: 'none', experience: 'none', hours: '5_10' }));
    expect(r.entry).toBe('B');
    expect(r.tentative).toBe(false);
  });
  it('C: bantuan & pelanggan jelas, belum ada contoh', () => {
    const r = recommendEntry(a({ smallTask: 'foto menu', taskConfidence: 'done_before', customerClarity: 'clear', customerType: 'warung makan', customerProblem: 'foto menu di aplikasi gelap', exampleStatus: 'none', experience: 'none', hours: '2_5' }));
    expect(r.entry).toBe('C');
  });
  it('D: sudah punya contoh relevan', () => {
    const r = recommendEntry(a({ smallTask: 'foto menu', taskConfidence: 'done_before', customerClarity: 'clear', customerType: 'kedai kopi', customerProblem: 'foto produk kurang menarik', exampleStatus: 'practice', exampleRelevance: 'relevant', experience: 'none', hours: '5_10' }));
    expect(r.entry).toBe('D');
    expect(r.tentative).toBe(false);
  });
  it('E: sudah pernah menawarkan/mengerjakan', () => {
    expect(recommendEntry(a({ smallTask: 'edit video', taskConfidence: 'done_before', experience: 'offered', hours: '2_5' })).entry).toBe('E');
    expect(recommendEntry(a({ smallTask: 'edit video', taskConfidence: 'not_tried', experience: 'worked', hours: '2_5' })).entry).toBe('E');
  });
  it('jawaban kosong → hasil SEMENTARA dengan satu pertanyaan klarifikasi', () => {
    const r = recommendEntry(emptyAnswers());
    expect(r.tentative).toBe(true);
    expect(r.clarify?.question.length).toBeGreaterThan(10);
    expect(r.entry).toBe('A');
  });
  it('kontradiksi: pernah mengerjakan tapi belum bisa menyebutkan pekerjaan → sementara + pertanyaan', () => {
    const r = recommendEntry(a({ taskConfidence: 'none', experience: 'worked' }));
    expect(r.tentative).toBe(true);
    expect(r.clarify?.question).toMatch(/pernah/);
    expect(r.clarify?.step).toBe(1);
  });
  it('kontradiksi: punya contoh sendiri tapi belum bisa menyebutkan pekerjaan', () => {
    const r = recommendEntry(a({ taskConfidence: 'none', exampleStatus: 'own', exampleRelevance: 'relevant', experience: 'none' }));
    expect(r.tentative).toBe(true);
  });
  it('D tanpa kejelasan pelanggan → sementara, tanya jenis bisnis', () => {
    const r = recommendEntry(a({ smallTask: 'desain', taskConfidence: 'done_before', exampleStatus: 'own', exampleRelevance: 'relevant', customerClarity: 'unsure', experience: 'none' }));
    expect(r.entry).toBe('D');
    expect(r.tentative).toBe(true);
    expect(r.clarify?.step).toBe(3);
  });
  it('mengklaim "sudah jelas" tanpa menuliskan masalah tidak dianggap jelas penuh', () => {
    const r = recommendEntry(a({ smallTask: 'desain', taskConfidence: 'done_before', customerClarity: 'clear', exampleStatus: 'none', experience: 'none' }));
    expect(r.dimensions.find((d) => d.key === 'problem')!.status).toBe('partial');
    expect(r.entry).toBe('B');
  });
  it('kendala dicatat tanpa mengubah titik masuk', () => {
    const r = recommendEntry(a({ smallTask: 'desain', taskConfidence: 'done_before', customerClarity: 'unsure', experience: 'none', hours: 'lt2', devices: [] }));
    expect(r.entry).toBe('B');
    expect(r.dimensions.find((d) => d.key === 'constraints')!.status).toBe('partial');
  });
  it('tidak ada label/persentase; versi tercatat', () => {
    const r = recommendEntry(a({ taskConfidence: 'done_before', smallTask: 'x y z' }));
    expect(JSON.stringify(r)).not.toMatch(/%|lemah|unggul|peluang sukses/i);
    expect(r.rulesVersion).toBe(RULES_VERSION);
    expect(r.questionsVersion).toBe(QUESTIONS_VERSION);
  });
});

describe('pendukung', () => {
  it('pemeriksaan prasyarat saat memilih titik lain', () => {
    const dims = recommendEntry(a({ taskConfidence: 'none' })).dimensions;
    const chk = prerequisiteCheck('D', dims);
    expect(chk.map((c) => c.key)).toEqual(['work', 'problem', 'example']);
    expect(chk.every((c) => !c.ready)).toBe(true);
    expect(prerequisiteCheck('A', dims)).toEqual([]);
  });
  it('data lama/rusak tidak membuang jawaban yang masih valid', () => {
    const n = normalizeAnswers({ goal: 'learn_basics', skills: ['design', 'tidak-ada'], hours: 'aneh', smallTask: 'foto' });
    expect(n.goal).toBe('learn_basics');
    expect(n.smallTask).toBe('foto');
    expect(n.hours).toBe('');
  });
  it('langkah terjawab untuk resume', () => {
    expect(answeredSteps(a({ goal: 'unsure', taskConfidence: 'none' }))).toEqual([true, true, false, false, false, false]);
  });
  it('setiap titik masuk hanya menautkan rute yang ada', () => {
    const valid = /^\/app\/(action-plan|outreach|toolkit\?tab=(prompts|problem|hpp|proposal)|belajar\/(find-your-edge|business-101))$/;
    for (const e of Object.values(ENTRIES)) for (const x of e.actions) expect(x.to).toMatch(valid);
  });
});
