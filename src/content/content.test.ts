import { describe, expect, it } from 'vitest';
import { ALL_LESSON_IDS, MODULES } from './modules';
import { ACTION_PLAN, ALL_TASK_IDS } from './actionPlan';
import { PROMPT_CATEGORIES, PROMPTS } from './prompts';
import { INDUSTRIES, INDUSTRY_KEYS } from './industries';

describe('integritas konten', () => {
  it('10 modul dalam 4 season, slug & id pelajaran unik, urut per season', () => {
    expect(MODULES).toHaveLength(10);
    expect(new Set(MODULES.map((m) => m.slug)).size).toBe(10);
    expect(new Set(ALL_LESSON_IDS).size).toBe(ALL_LESSON_IDS.length);
    expect(ALL_LESSON_IDS).toHaveLength(49);
    const seasons = MODULES.map((m) => m.season);
    expect([...seasons].sort()).toEqual(seasons);
    for (const no of [1, 2, 3, 4]) expect(seasons).toContain(no);
    for (const m of MODULES) for (const l of m.lessons) {
      expect(l.body.length).toBeGreaterThanOrEqual(2);
      expect(l.keyPoints.length).toBeGreaterThanOrEqual(3);
      expect(l.exercise.prompt.length).toBeGreaterThan(10);
    }
  });
  it('Business 101: modul pertama, 13 pelajaran lengkap dengan mitos-fakta & kamus kilat', () => {
    expect(MODULES[0].slug).toBe('business-101');
    expect(MODULES[0].lessons).toHaveLength(13);
    for (const l of MODULES[0].lessons) {
      expect(l.mythFact?.myth.length).toBeGreaterThan(10);
      expect(l.glossary?.length).toBeGreaterThanOrEqual(3);
      expect(l.example).toBeTruthy();
    }
  });
  it('Action Plan 7 hari dengan id tugas unik', () => {
    expect(ACTION_PLAN.map((d) => d.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(ALL_TASK_IDS).size).toBe(ALL_TASK_IDS.length);
  });
  it('semua tautan internal menuju rute yang ada', () => {
    const slugs = MODULES.map((m) => m.slug).join('|');
    const valid = new RegExp(`^/app/(passport|assessment|dream-pact|kurikulum|outreach(\\?skenario=(mentor|sales_partner|service_offer))?|toolkit(\\?tab=(prompts|hpp|calculator|proposal|problem))?|action-plan|belajar/(${slugs}))$`);
    const links = [
      ...MODULES.flatMap((m) => m.lessons.map((l) => l.tool?.to).filter(Boolean)),
      ...ACTION_PLAN.flatMap((d) => d.tasks.map((t) => t.link?.to).filter(Boolean)),
    ] as string[];
    for (const l of links) expect(l).toMatch(valid);
  });
  it('prompt hanya memakai placeholder yang didukung', () => {
    for (const p of PROMPTS) for (const m of p.template.matchAll(/\{(\w+)\}/g)) expect(['industri', 'jalur', 'skill', 'kota']).toContain(m[1]);
    expect(new Set(PROMPTS.map((p) => p.id)).size).toBe(PROMPTS.length);
    expect(PROMPTS.length).toBeGreaterThanOrEqual(36);
    for (const c of PROMPT_CATEGORIES) expect(PROMPTS.some((p) => p.category === c)).toBe(true);
  });
  it('10 industri lengkap', () => {
    expect(INDUSTRY_KEYS).toHaveLength(10);
    for (const k of INDUSTRY_KEYS) expect(INDUSTRIES[k].zeroCapitalRoutes.length).toBeGreaterThanOrEqual(3);
  });
});

describe('10 jalur mulai', () => {
  it('10 jalur, key unik, tiap gaya main punya ≥3 jalur dan isi lengkap', async () => {
    const { START_PATHS, PATH_FAMILIES, pathsByFamily } = await import('./paths');
    expect(START_PATHS).toHaveLength(10);
    expect(new Set(START_PATHS.map((p) => p.key)).size).toBe(10);
    for (const fam of Object.keys(PATH_FAMILIES)) expect(pathsByFamily(fam as never).length).toBeGreaterThanOrEqual(3);
    for (const p of START_PATHS) for (const v of [p.oneLiner, p.howMoney, p.capital, p.skills, p.firstStep, p.watchOut]) expect(v.trim().length).toBeGreaterThanOrEqual(3);
  });
});
