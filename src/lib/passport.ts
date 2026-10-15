import { z } from 'zod';

/* ------------------------------------------------------------------ */
/*  Opsi pilihan (label Bahasa Indonesia, value Bahasa Inggris)        */
/* ------------------------------------------------------------------ */

export const AGE_RANGES = [
  { value: '17_or_below', label: '17 tahun ke bawah' },
  { value: '18_20', label: '18–20 tahun' },
  { value: '21_23', label: '21–23 tahun' },
  { value: '24_27', label: '24–27 tahun' },
  { value: '28_plus', label: '28 tahun ke atas' },
] as const;

export const STATUSES = [
  { value: 'student', label: 'Mahasiswa' },
  { value: 'fresh_graduate', label: 'Fresh graduate' },
  { value: 'employee', label: 'Karyawan / profesional' },
  { value: 'entrepreneur', label: 'Sudah berwirausaha' },
  { value: 'other', label: 'Lainnya' },
] as const;

export const BUSINESS_EXPERIENCE = [
  { value: 'none', label: 'Belum pernah' },
  { value: 'tried', label: 'Pernah mencoba jualan / proyek kecil' },
  { value: 'side', label: 'Punya usaha sampingan' },
  { value: 'running', label: 'Menjalankan usaha aktif' },
] as const;

export const SKILLS = [
  { key: 'sales', label: 'Sales' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'communication', label: 'Komunikasi' },
  { key: 'design', label: 'Desain' },
  { key: 'contentCreation', label: 'Content creation' },
  { key: 'writing', label: 'Menulis' },
  { key: 'dataAnalytics', label: 'Data & analitik' },
  { key: 'aiTools', label: 'AI tools' },
  { key: 'projectManagement', label: 'Project management' },
] as const;

export const SKILL_LEVELS = [
  { value: 0, label: 'Belum' },
  { value: 1, label: 'Dasar' },
  { value: 2, label: 'Menengah' },
  { value: 3, label: 'Mahir' },
] as const;

export const DEVICES = [
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'laptop', label: 'Laptop / PC' },
  { value: 'stable_internet', label: 'Internet stabil' },
] as const;

export const BUDGETS = [
  { value: 'zero', label: 'Rp0 — mulai tanpa modal' },
  { value: 'under_500k', label: 'Di bawah Rp500 ribu' },
  { value: '500k_2m', label: 'Rp500 ribu – Rp2 juta' },
  { value: 'above_2m', label: 'Di atas Rp2 juta' },
] as const;

export const WORK_MODES = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
  { value: 'hybrid', label: 'Keduanya' },
] as const;

export const CUSTOMER_EXPERIENCE = [
  { value: 'none', label: 'Belum pernah melayani pelanggan' },
  { value: 'some', label: 'Pernah, sesekali' },
  { value: 'regular', label: 'Rutin (kerja / usaha)' },
] as const;

export const INTERESTS = [
  { value: 'b2b_sales', label: 'B2B sales' },
  { value: 'social_media_marketing', label: 'Social media marketing' },
  { value: 'digital_services', label: 'Jasa digital' },
  { value: 'creative_services', label: 'Jasa kreatif' },
  { value: 'affiliate_marketing', label: 'Affiliate marketing' },
  { value: 'product_business', label: 'Bisnis produk' },
  { value: 'service_business', label: 'Bisnis jasa' },
] as const;

type Values<T extends readonly { value: unknown }[]> = T[number]['value'];
const enumOf = <T extends readonly { value: string }[]>(opts: T) =>
  z.enum(opts.map((o) => o.value) as [Values<T>, ...Values<T>[]]);

/* ------------------------------------------------------------------ */
/*  Skema validasi (dipakai di form & sebelum menulis ke Firestore)    */
/* ------------------------------------------------------------------ */

const optionalText = (max: number) => z.string().trim().max(max, `Maksimal ${max} karakter`).default('');

const skillLevel = z.number().int().min(0).max(3);

export const personalSchema = z.object({
  fullName: z.string().trim().min(2, 'Nama minimal 2 karakter').max(80, 'Maksimal 80 karakter'),
  ageRange: enumOf(AGE_RANGES).or(z.literal('')).default(''),
  status: enumOf(STATUSES).or(z.literal('')).default(''),
  fieldOfWork: optionalText(80),
  city: optionalText(60),
  businessExperience: enumOf(BUSINESS_EXPERIENCE).or(z.literal('')).default(''),
  programGoal: optionalText(500),
});

export const skillsSchema = z.object({
  levels: z.record(z.enum(SKILLS.map((s) => s.key) as [string, ...string[]]), skillLevel).default({}),
  otherSkills: optionalText(200),
});

export const resourcesSchema = z.object({
  hoursPerWeek: z
    .number({ error: 'Isi dengan angka' })
    .int('Gunakan bilangan bulat')
    .min(0, 'Tidak boleh negatif')
    .max(80, 'Maksimal 80 jam per minggu')
    .nullable()
    .default(null),
  devices: z.array(enumOf(DEVICES)).max(DEVICES.length).default([]),
  startBudget: enumOf(BUDGETS).or(z.literal('')).default(''),
  workMode: enumOf(WORK_MODES).or(z.literal('')).default(''),
  customerExperience: enumOf(CUSTOMER_EXPERIENCE).or(z.literal('')).default(''),
});

export const interestsSchema = z.object({
  selected: z.array(enumOf(INTERESTS)).max(INTERESTS.length).default([]),
  otherInterests: optionalText(200),
});

const optionalCount = (max: number, unit: string) =>
  z
    .number({ error: 'Isi dengan angka' })
    .int('Gunakan bilangan bulat')
    .min(0, 'Tidak boleh negatif')
    .max(max, `Maksimal ${max} ${unit}`)
    .nullable()
    .default(null);

export const goalsSchema = z.object({
  skillTarget: optionalText(300),
  weeklyActivityTarget: optionalCount(100, 'aktivitas'),
  weeklyProspectTarget: optionalCount(500, 'calon mitra'),
  portfolioTarget: optionalText(300),
  /** Aspirasi pribadi, BUKAN janji sistem. */
  monthlyIncomeAspiration: z
    .number({ error: 'Isi dengan angka' })
    .int()
    .min(0, 'Tidak boleh negatif')
    .max(1_000_000_000, 'Angka terlalu besar')
    .nullable()
    .default(null),
});

export const passportSchema = z.object({
  personal: personalSchema,
  skills: skillsSchema,
  resources: resourcesSchema,
  interests: interestsSchema,
  goals: goalsSchema,
});

export type Passport = z.infer<typeof passportSchema>;
export type PassportSection = keyof Passport;

export const SECTION_LABEL: Record<PassportSection, string> = {
  personal: 'Profil pribadi',
  skills: 'Skill',
  resources: 'Sumber daya',
  interests: 'Minat bisnis',
  goals: 'Target',
};

export function emptyPassport(fullName = ''): Passport {
  return {
    personal: {
      fullName,
      ageRange: '',
      status: '',
      fieldOfWork: '',
      city: '',
      businessExperience: '',
      programGoal: '',
    },
    skills: { levels: {}, otherSkills: '' },
    resources: { hoursPerWeek: null, devices: [], startBudget: '', workMode: '', customerExperience: '' },
    interests: { selected: [], otherInterests: '' },
    goals: {
      skillTarget: '',
      weeklyActivityTarget: null,
      weeklyProspectTarget: null,
      portfolioTarget: '',
      monthlyIncomeAspiration: null,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Kelengkapan — dihitung deterministik, bukan oleh AI                */
/* ------------------------------------------------------------------ */

/** Daftar syarat minimum agar satu bagian dianggap lengkap. */
export function sectionCompletion(p: Passport): Record<PassportSection, boolean> {
  const ratedSkills = Object.values(p.skills.levels).filter((v) => typeof v === 'number').length;
  return {
    personal:
      p.personal.fullName.trim().length >= 2 &&
      !!p.personal.ageRange &&
      !!p.personal.status &&
      !!p.personal.businessExperience &&
      p.personal.programGoal.trim().length > 0,
    skills: ratedSkills === SKILLS.length,
    resources:
      p.resources.hoursPerWeek !== null &&
      p.resources.devices.length > 0 &&
      !!p.resources.startBudget &&
      !!p.resources.workMode &&
      !!p.resources.customerExperience,
    interests: p.interests.selected.length > 0 || p.interests.otherInterests.trim().length > 0,
    goals:
      p.goals.skillTarget.trim().length > 0 &&
      p.goals.weeklyActivityTarget !== null &&
      p.goals.weeklyProspectTarget !== null,
  };
}

export function completionPercent(p: Passport): number {
  const done = Object.values(sectionCompletion(p)).filter(Boolean).length;
  return Math.round((done / 5) * 100);
}

/**
 * Menormalkan data dari Firestore (yang bisa saja dibuat oleh versi
 * aplikasi lama) menjadi Passport yang valid. Field yang tidak dikenal
 * dibuang; field yang rusak dikembalikan ke nilai kosong.
 */
export function normalizePassport(raw: unknown, fallbackName = ''): Passport {
  const base = emptyPassport(fallbackName);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const pick = <K extends PassportSection>(key: K, schema: z.ZodType<Passport[K]>): Passport[K] => {
    const parsed = schema.safeParse({ ...(base[key] as object), ...((r[key] as object) ?? {}) });
    return parsed.success ? parsed.data : base[key];
  };
  const personal = pick('personal', personalSchema as z.ZodType<Passport['personal']>);
  return {
    personal: personal.fullName ? personal : { ...personal, fullName: fallbackName },
    skills: pick('skills', skillsSchema as z.ZodType<Passport['skills']>),
    resources: pick('resources', resourcesSchema as z.ZodType<Passport['resources']>),
    interests: pick('interests', interestsSchema as z.ZodType<Passport['interests']>),
    goals: pick('goals', goalsSchema as z.ZodType<Passport['goals']>),
  };
}

/** Ubah error Zod menjadi peta "path → pesan" untuk ditampilkan di form. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!out[path]) out[path] = issue.message;
  }
  return out;
}
