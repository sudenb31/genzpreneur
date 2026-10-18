import { z } from 'zod';

/**
 * KONDISI AWAL & TITIK MASUK
 *
 * Tujuan: membantu peserta mengetahui langkah berikutnya yang relevan untuk menyiapkan
 * BANTUAN KECIL bagi bisnis yang sudah berjalan — berdasarkan jawabannya sendiri.
 *
 * Dipisahkan dengan sengaja dari:
 *  - Assessment (eksplorasi minat/arah bisnis — src/lib/assessment.ts), dan
 *  - Progres pekerjaan (Action Plan, progress/{uid}).
 *
 * Aturan sederhana & transparan (bukan AI, bukan skor kepribadian, bukan persentase peluang).
 * Hasil = rekomendasi awal dari jawaban peserta, BUKAN sertifikasi atau penilaian mentor.
 */

export const QUESTIONS_VERSION = 'v1';
export const RULES_VERSION = 'r1';

/* ------------------------------- Pilihan jawaban ------------------------------- */

export const GOALS = [
  { value: 'first_income', label: 'Mulai dapat pemasukan pertama dari skill yang kupunya' },
  { value: 'test_help', label: 'Mencoba menawarkan bantuan ke bisnis yang sudah jalan' },
  { value: 'learn_basics', label: 'Belajar dasar bisnis dulu' },
  { value: 'grow_existing', label: 'Merapikan jasa/usaha kecil yang sudah kujalankan' },
  { value: 'unsure', label: 'Belum tahu' },
] as const;

export const SKILL_AREAS = [
  { value: 'design', label: 'Desain grafis' },
  { value: 'content', label: 'Konten & sosmed' },
  { value: 'video', label: 'Edit video' },
  { value: 'writing', label: 'Menulis / copywriting' },
  { value: 'photo', label: 'Foto produk' },
  { value: 'admin', label: 'Admin & data (spreadsheet)' },
  { value: 'sales', label: 'Jualan / komunikasi' },
  { value: 'teaching', label: 'Mengajar / les' },
  { value: 'tech', label: 'Website / teknis' },
] as const;

export const TASK_CONFIDENCE = [
  { value: 'done_before', label: 'Bisa — pernah mengerjakannya' },
  { value: 'not_tried', label: 'Sepertinya bisa, tapi belum pernah mencoba' },
  { value: 'not_sure', label: 'Belum yakin' },
  { value: 'none', label: 'Belum bisa menyebutkan pekerjaan kecil' },
] as const;

export const EXAMPLE_STATUS = [
  { value: 'own', label: 'Ada — hasil kerjaku sendiri' },
  { value: 'practice', label: 'Ada — contoh latihan / fiktif' },
  { value: 'none', label: 'Belum punya' },
] as const;

export const EXAMPLE_RELEVANCE = [
  { value: 'relevant', label: 'Sesuai dengan bantuan yang ingin kutawarkan' },
  { value: 'not_relevant', label: 'Belum sesuai' },
  { value: 'unsure', label: 'Belum tahu' },
] as const;

export const CUSTOMER_CLARITY = [
  { value: 'clear', label: 'Sudah tahu jenis bisnis & masalahnya' },
  { value: 'type_only', label: 'Tahu jenis bisnisnya, masalahnya belum jelas' },
  { value: 'unsure', label: 'Belum tahu' },
] as const;

export const EXPERIENCE = [
  { value: 'none', label: 'Belum pernah' },
  { value: 'drafted_offer', label: 'Pernah menyusun penawaran, tapi belum dikirim' },
  { value: 'offered', label: 'Pernah menawarkan ke orang/bisnis lain' },
  { value: 'worked', label: 'Pernah mengerjakan untuk orang lain (dibayar atau tidak)' },
] as const;

export const HOURS = [
  { value: 'lt2', label: 'Kurang dari 2 jam' },
  { value: '2_5', label: '2–5 jam' },
  { value: '5_10', label: '5–10 jam' },
  { value: 'gt10', label: 'Lebih dari 10 jam' },
  { value: 'unsure', label: 'Belum tahu' },
] as const;

export const DEVICES = [
  { value: 'phone', label: 'HP' },
  { value: 'laptop', label: 'Laptop / komputer' },
  { value: 'internet', label: 'Internet yang cukup stabil' },
] as const;

type V<T extends readonly { value: string }[]> = T[number]['value'];
const en = <T extends readonly { value: string }[]>(o: T) => z.enum(o.map((x) => x.value) as [V<T>, ...V<T>[]]);
const txt = (max: number) => z.string().trim().max(max, `Maksimal ${max} karakter`).default('');
const pick = <T extends readonly { value: string }[]>(o: T) => en(o).or(z.literal('')).default('');

/** Semua jawaban opsional supaya bisa disimpan sebagai draf kapan saja. */
export const answersSchema = z.object({
  goal: pick(GOALS),
  goalNote: txt(300),
  skills: z.array(en(SKILL_AREAS)).max(SKILL_AREAS.length).default([]),
  skillsOther: txt(150),
  smallTask: txt(300),
  taskConfidence: pick(TASK_CONFIDENCE),
  exampleStatus: pick(EXAMPLE_STATUS),
  exampleDesc: txt(400),
  exampleRelevance: pick(EXAMPLE_RELEVANCE),
  customerType: txt(200),
  customerProblem: txt(300),
  customerClarity: pick(CUSTOMER_CLARITY),
  experience: pick(EXPERIENCE),
  experienceNote: txt(300),
  hours: pick(HOURS),
  devices: z.array(en(DEVICES)).max(DEVICES.length).default([]),
  constraints: txt(300),
});

export type BaselineAnswers = z.infer<typeof answersSchema>;
export const emptyAnswers = (): BaselineAnswers => answersSchema.parse({});

export function normalizeAnswers(raw: unknown): BaselineAnswers {
  const r = answersSchema.safeParse(raw ?? {});
  if (r.success) return r.data;
  // Data lama/rusak: ambil field yang valid saja, jangan buang semuanya.
  const base = emptyAnswers();
  const src = (raw ?? {}) as Record<string, unknown>;
  for (const k of Object.keys(base) as (keyof BaselineAnswers)[]) {
    const one = answersSchema.shape[k].safeParse(src[k]);
    if (one.success) (base as Record<string, unknown>)[k] = one.data;
  }
  return base;
}

/* ------------------------------- Langkah formulir ------------------------------- */

export const STEPS = [
  { key: 'goal', title: 'Tujuanmu', fields: ['goal', 'goalNote'] },
  { key: 'skills', title: 'Skill & pekerjaan kecil', fields: ['skills', 'skillsOther', 'smallTask', 'taskConfidence'] },
  { key: 'example', title: 'Contoh hasil', fields: ['exampleStatus', 'exampleDesc', 'exampleRelevance'] },
  { key: 'customer', title: 'Calon penerima bantuan', fields: ['customerType', 'customerProblem', 'customerClarity'] },
  { key: 'experience', title: 'Pengalaman mencoba', fields: ['experience', 'experienceNote'] },
  { key: 'practical', title: 'Waktu & kendala', fields: ['hours', 'devices', 'constraints'] },
] as const;

/* ------------------------------- Aturan rekomendasi ------------------------------- */

export type DimStatus = 'ok' | 'partial' | 'unclear' | 'gap';
export type DimKey = 'work' | 'problem' | 'example' | 'offer' | 'tried' | 'constraints';
export type EntryKey = 'A' | 'B' | 'C' | 'D' | 'E';

export const DIM_LABEL: Record<DimKey, string> = {
  work: 'Kemampuan menghasilkan pekerjaan',
  problem: 'Kejelasan masalah & calon penerima',
  example: 'Kesiapan contoh kerja',
  offer: 'Kesiapan penawaran',
  tried: 'Pengalaman mencoba',
  constraints: 'Kendala pelaksanaan',
};

export const DIM_STATUS_LABEL: Record<DimStatus, string> = {
  ok: 'Sudah ada',
  partial: 'Sebagian',
  unclear: 'Belum jelas',
  gap: 'Belum ada',
};

export interface Dimension { key: DimKey; status: DimStatus; note: string }

export interface Recommendation {
  entry: EntryKey;
  /** true bila jawaban tidak cukup atau bertentangan — hasil hanya sementara. */
  tentative: boolean;
  clarify: { question: string; step: number } | null;
  dimensions: Dimension[];
  haves: string[];
  toCheck: string[];
  reason: string;
  rulesVersion: string;
  questionsVersion: string;
}

const hasText = (s: string) => s.trim().length >= 3;

export function assessDimensions(a: BaselineAnswers): Dimension[] {
  const work: Dimension = (() => {
    switch (a.taskConfidence) {
      case 'done_before':
        return hasText(a.smallTask)
          ? { key: 'work', status: 'ok', note: 'Kamu menyebutkan pekerjaan kecil yang pernah kamu kerjakan.' }
          : { key: 'work', status: 'partial', note: 'Kamu merasa bisa, tapi pekerjaan kecilnya belum dituliskan.' };
      case 'not_tried': return { key: 'work', status: 'partial', note: 'Kamu merasa bisa, tapi belum pernah mencoba mengerjakannya.' };
      case 'not_sure': return { key: 'work', status: 'unclear', note: 'Kamu belum yakin bisa mengerjakan pekerjaan kecil.' };
      case 'none': return { key: 'work', status: 'gap', note: 'Belum ada pekerjaan kecil yang bisa disebutkan.' };
      default: return { key: 'work', status: 'unclear', note: 'Belum dijawab.' };
    }
  })();

  const problem: Dimension = (() => {
    switch (a.customerClarity) {
      case 'clear':
        return hasText(a.customerType) && hasText(a.customerProblem)
          ? { key: 'problem', status: 'ok', note: 'Jenis bisnis dan masalahnya sudah kamu tuliskan.' }
          : { key: 'problem', status: 'partial', note: 'Kamu merasa sudah jelas, tapi jenis bisnis atau masalahnya belum dituliskan.' };
      case 'type_only': return { key: 'problem', status: 'partial', note: 'Jenis bisnisnya sudah ada, masalahnya belum jelas.' };
      case 'unsure': return { key: 'problem', status: 'gap', note: 'Calon penerima bantuan dan masalahnya belum ditentukan.' };
      default: return { key: 'problem', status: 'unclear', note: 'Belum dijawab.' };
    }
  })();

  const example: Dimension = (() => {
    if (a.exampleStatus === 'none') return { key: 'example', status: 'gap', note: 'Belum ada contoh hasil.' };
    if (a.exampleStatus === '') return { key: 'example', status: 'unclear', note: 'Belum dijawab.' };
    const kind = a.exampleStatus === 'own' ? 'hasil kerjamu sendiri' : 'contoh latihan/fiktif';
    if (a.exampleRelevance === 'relevant') return { key: 'example', status: 'ok', note: `Ada ${kind} yang menurutmu sesuai dengan bantuan yang ingin ditawarkan.` };
    if (a.exampleRelevance === 'not_relevant') return { key: 'example', status: 'partial', note: `Ada ${kind}, tapi belum sesuai dengan bantuan yang ingin ditawarkan.` };
    return { key: 'example', status: 'unclear', note: `Ada ${kind}, tapi belum jelas apakah sesuai.` };
  })();

  const offer: Dimension = (() => {
    switch (a.experience) {
      case 'offered': case 'worked': return { key: 'offer', status: 'ok', note: 'Kamu pernah menawarkan atau mengerjakan untuk orang lain.' };
      case 'drafted_offer': return { key: 'offer', status: 'partial', note: 'Kamu pernah menyusun penawaran, tapi belum mengirimnya.' };
      case 'none': return { key: 'offer', status: 'gap', note: 'Belum pernah menyusun penawaran.' };
      default: return { key: 'offer', status: 'unclear', note: 'Belum dijawab.' };
    }
  })();

  const tried: Dimension = (() => {
    switch (a.experience) {
      case 'worked': return { key: 'tried', status: 'ok', note: 'Kamu pernah mengerjakan untuk orang lain.' };
      case 'offered': return { key: 'tried', status: 'ok', note: 'Kamu pernah mencoba menawarkan.' };
      case 'drafted_offer': case 'none': return { key: 'tried', status: 'gap', note: 'Belum ada percobaan menawarkan.' };
      default: return { key: 'tried', status: 'unclear', note: 'Belum dijawab.' };
    }
  })();

  const constraints: Dimension = (() => {
    const issues: string[] = [];
    if (a.hours === 'lt2') issues.push('waktu kurang dari 2 jam per minggu');
    if (a.devices.length === 0) issues.push('perangkat belum dipilih');
    if (hasText(a.constraints)) issues.push('ada kendala yang kamu tuliskan');
    if (a.hours === '' || a.hours === 'unsure') return { key: 'constraints', status: 'unclear', note: 'Waktu per minggu belum jelas.' };
    return issues.length
      ? { key: 'constraints', status: 'partial', note: `Perlu diperhatikan: ${issues.join(', ')}.` }
      : { key: 'constraints', status: 'ok', note: 'Waktu dan perangkat dasar tersedia.' };
  })();

  return [work, problem, example, offer, tried, constraints];
}

/** Indeks langkah formulir untuk pertanyaan klarifikasi. */
const STEP_OF: Record<string, number> = { goal: 0, skills: 1, example: 2, customer: 3, experience: 4, practical: 5 };

export function recommendEntry(a: BaselineAnswers): Recommendation {
  const dims = assessDimensions(a);
  const d = Object.fromEntries(dims.map((x) => [x.key, x])) as Record<DimKey, Dimension>;

  let entry: EntryKey;
  let reason: string;
  let tentative = false;
  let clarify: Recommendation['clarify'] = null;

  // 1) Jawaban bertentangan → tetap beri rekomendasi, tapi SEMENTARA + satu pertanyaan klarifikasi.
  const triedSomething = a.experience === 'offered' || a.experience === 'worked';
  if (triedSomething && a.taskConfidence === 'none') {
    tentative = true;
    clarify = { question: 'Kamu pernah menawarkan atau mengerjakan untuk orang lain, tapi belum bisa menyebutkan pekerjaan kecil. Pekerjaan apa yang waktu itu kamu tawarkan atau kerjakan?', step: STEP_OF.skills };
  } else if (a.exampleStatus === 'own' && a.taskConfidence === 'none') {
    tentative = true;
    clarify = { question: 'Kamu punya contoh hasil kerja sendiri, tapi belum bisa menyebutkan pekerjaan kecil. Pekerjaan apa yang menghasilkan contoh itu?', step: STEP_OF.skills };
  }

  // 2) Aturan utama (urutan penting: yang paling jauh di alur dicek lebih dulu).
  if (triedSomething && d.work.status !== 'gap') {
    entry = 'E';
    reason = 'Kamu sudah pernah menawarkan atau mengerjakan untuk orang lain. Langkah paling bernilai sekarang adalah mengevaluasi percobaan itu dan memilih satu bagian untuk diperbaiki.';
  } else if (d.work.status === 'gap' || d.work.status === 'unclear') {
    entry = 'A';
    reason = 'Kamu belum bisa menyebutkan pekerjaan kecil atau belum yakin bisa mengerjakannya. Mulai dari menentukan satu pekerjaan kecil dan membuat contoh sederhana.';
  } else if (d.example.status === 'ok') {
    entry = 'D';
    reason = 'Kamu sudah punya contoh yang menurutmu relevan. Langkah berikutnya adalah merapikan ruang lingkup, penawaran, harga, dan cara pendekatan.';
  } else if (d.problem.status === 'ok') {
    entry = 'C';
    reason = 'Bantuan dan calon penerimanya sudah cukup jelas, tapi contoh yang relevan belum ada. Buat satu contoh sebelum menawarkan.';
  } else {
    entry = 'B';
    reason = 'Kamu sudah punya skill, tapi calon penerima atau masalahnya belum jelas. Mulai dari memilih satu masalah pelanggan dan menentukan bantuanmu.';
  }

  // 3) Jawaban tidak cukup → sementara + satu pertanyaan (bila belum ada pertanyaan dari kontradiksi).
  if (!clarify) {
    if (a.taskConfidence === '') {
      tentative = true;
      clarify = { question: 'Pekerjaan kecil apa yang bisa kamu selesaikan sekarang, dan seberapa yakin kamu bisa mengerjakannya?', step: STEP_OF.skills };
    } else if (entry === 'D' && d.problem.status !== 'ok') {
      tentative = true;
      clarify = { question: 'Contohmu untuk jenis bisnis apa, dan masalah apa yang dibantu?', step: STEP_OF.customer };
    } else if (entry === 'B' && a.customerClarity === '') {
      tentative = true;
      clarify = { question: 'Apakah kamu sudah tahu jenis bisnis yang ingin kamu bantu?', step: STEP_OF.customer };
    } else if (d.work.status === 'partial' && !hasText(a.smallTask) && entry !== 'A') {
      tentative = true;
      clarify = { question: 'Tuliskan satu pekerjaan kecil yang bisa kamu selesaikan (contoh: "desain 3 postingan promo").', step: STEP_OF.skills };
    }
  }

  const haves: string[] = [];
  if (a.skills.length || hasText(a.skillsOther)) haves.push('Skill yang kamu sebutkan sendiri');
  if (hasText(a.smallTask)) haves.push(`Pekerjaan kecil: "${a.smallTask.trim()}"`);
  if (a.exampleStatus === 'own' || a.exampleStatus === 'practice') haves.push(a.exampleStatus === 'own' ? 'Contoh hasil kerja sendiri (dilaporkan)' : 'Contoh latihan/fiktif (dilaporkan)');
  if (hasText(a.customerType)) haves.push(`Calon penerima: ${a.customerType.trim()}`);
  if (a.experience === 'drafted_offer' || triedSomething) haves.push(EXPERIENCE.find((x) => x.value === a.experience)!.label);

  const toCheck = dims.filter((x) => x.status !== 'ok').map((x) => `${DIM_LABEL[x.key]}: ${x.note}`);

  return { entry, tentative, clarify, dimensions: dims, haves, toCheck, reason, rulesVersion: RULES_VERSION, questionsVersion: QUESTIONS_VERSION };
}

/* ------------------------------- Titik masuk → pekerjaan yang ADA ------------------------------- */

export interface EntryInfo {
  key: EntryKey;
  title: string;
  short: string;
  /** Prasyarat dari tahap sebelumnya: dimensi yang sebaiknya minimal "partial". */
  needs: DimKey[];
  actions: { to: string; label: string; note: string }[];
}

/**
 * Hanya menautkan fitur yang benar-benar ada di aplikasi.
 * Platform TIDAK menyediakan pelatihan skill teknis (desain, edit video, dll.).
 */
export const ENTRIES: Record<EntryKey, EntryInfo> = {
  A: {
    key: 'A', title: 'Siapkan skill & contoh sederhana', short: 'Persiapan skill',
    needs: [],
    actions: [
      { to: '/app/belajar/find-your-edge', label: 'Modul Find Your Edge', note: 'Petakan skill yang paling dekat dengan bantuan yang bisa ditawarkan.' },
      { to: '/app/toolkit?tab=prompts', label: 'Prompt "Rencana belajar 14 hari"', note: 'Susun latihan harian dari sumber gratis (kategori Belajar). Platform ini tidak menyediakan kursus skill teknis.' },
      { to: '/app/action-plan', label: 'Action Plan · Hari 4 (buat contoh)', note: 'Buat satu contoh sederhana — boleh fiktif, jangan kerja gratis untuk calon pelanggan.' },
    ],
  },
  B: {
    key: 'B', title: 'Pilih masalah pelanggan & tentukan bantuan', short: 'Pilih masalah',
    needs: ['work'],
    actions: [
      { to: '/app/toolkit?tab=problem', label: 'Problem Map', note: 'Ubah satu keresahan menjadi masalah yang jelas dan langkah awal.' },
      { to: '/app/action-plan', label: 'Action Plan · Hari 2 (pilih jalur & riset)', note: 'Pilih satu jalur dan satu jenis calon penerima.' },
      { to: '/app/belajar/business-101', label: 'Business 101 · Value', note: 'Pahami apa yang sebenarnya dibeli orang.' },
    ],
  },
  C: {
    key: 'C', title: 'Buat contoh yang relevan', short: 'Buat contoh',
    needs: ['work', 'problem'],
    actions: [
      { to: '/app/action-plan', label: 'Action Plan · Hari 4 (siapkan bukti)', note: 'Buat satu contoh untuk masalah yang sudah kamu pilih. Boleh pakai data fiktif/publik.' },
      { to: '/app/toolkit?tab=prompts', label: 'Prompt kategori Konten / Audit Bisnis', note: 'Bantu menyusun draf contoh — tetap periksa sendiri hasilnya.' },
    ],
  },
  D: {
    key: 'D', title: 'Rapikan ruang lingkup, penawaran, harga & pendekatan', short: 'Penawaran & harga',
    needs: ['work', 'problem', 'example'],
    actions: [
      { to: '/app/toolkit?tab=hpp', label: 'Kalkulator HPP & Harga', note: 'Tentukan harga dari biaya, waktu, dan nilai hasil.' },
      { to: '/app/toolkit?tab=proposal', label: 'Template Proposal', note: 'Tuliskan ruang lingkup, revisi, dan durasi dengan jelas.' },
      { to: '/app/outreach', label: 'Outreach Studio', note: 'Siapkan pesan pendekatan yang personal — satu per satu, bukan broadcast.' },
    ],
  },
  E: {
    key: 'E', title: 'Evaluasi percobaan & pilih yang diperbaiki', short: 'Evaluasi',
    needs: ['work', 'tried'],
    actions: [
      { to: '/app/action-plan', label: 'Action Plan · Hari 7 (review)', note: 'Hitung yang dihubungi, dibalas, dan lanjut ngobrol; tulis satu perbaikan.' },
      { to: '/app/belajar/business-101', label: 'Business 101 · Mesin belajar', note: 'Rancang percobaan kecil berikutnya dan angka yang diukur.' },
      { to: '/app/toolkit?tab=prompts', label: 'Prompt "Diagnosis 5 organ bisnis"', note: 'Temukan bagian yang paling perlu diperbaiki (kategori Audit Bisnis).' },
    ],
  },
};

/** Pemeriksaan singkat prasyarat saat peserta memilih titik masuk sendiri. */
export function prerequisiteCheck(entry: EntryKey, dims: Dimension[]) {
  const by = Object.fromEntries(dims.map((x) => [x.key, x])) as Record<DimKey, Dimension>;
  return ENTRIES[entry].needs.map((k) => ({
    key: k,
    label: DIM_LABEL[k],
    ready: by[k].status === 'ok' || by[k].status === 'partial',
    note: by[k].note,
  }));
}

/** Seberapa lengkap jawaban (untuk menampilkan "draf"), BUKAN skor kemampuan. */
export function answeredSteps(a: BaselineAnswers): boolean[] {
  return [
    a.goal !== '',
    a.taskConfidence !== '' || a.skills.length > 0,
    a.exampleStatus !== '',
    a.customerClarity !== '',
    a.experience !== '',
    a.hours !== '',
  ];
}
