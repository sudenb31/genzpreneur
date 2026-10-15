import { describe, expect, it } from 'vitest';
import { ALL_LESSON_IDS, MODULES } from './modules';
import { ACTION_PLAN, ALL_TASK_IDS } from './actionPlan';
import { PROMPTS } from './prompts';
import { INDUSTRIES, INDUSTRY_KEYS } from './industries';

describe('integritas konten', () => {
  it('3 modul pembelajaran dengan id pelajaran unik', () => {
    expect(MODULES.map((m) => m.benefitNo)).toEqual([1, 2, 3]);
    expect(new Set(ALL_LESSON_IDS).size).toBe(ALL_LESSON_IDS.length);
  });
  it('Action Plan 7 hari dengan id tugas unik', () => {
    expect(ACTION_PLAN.map((d) => d.day)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(ALL_TASK_IDS).size).toBe(ALL_TASK_IDS.length);
  });
  it('semua tautan internal menuju rute yang ada', () => {
    const valid = /^\/app\/(passport|assessment|outreach|toolkit(\?tab=(prompts|calculator|proposal))?|action-plan|belajar\/(mindset|sales-marketing|business-partner))$/;
    const links = [
      ...MODULES.flatMap((m) => m.lessons.map((l) => l.tool?.to).filter(Boolean)),
      ...ACTION_PLAN.flatMap((d) => d.tasks.map((t) => t.link?.to).filter(Boolean)),
    ] as string[];
    for (const l of links) expect(l).toMatch(valid);
  });
  it('prompt hanya memakai placeholder yang didukung', () => {
    for (const p of PROMPTS) for (const m of p.template.matchAll(/\{(\w+)\}/g)) expect(['industri', 'jalur', 'skill', 'kota']).toContain(m[1]);
    expect(new Set(PROMPTS.map((p) => p.id)).size).toBe(PROMPTS.length);
  });
  it('10 industri lengkap', () => {
    expect(INDUSTRY_KEYS).toHaveLength(10);
    for (const k of INDUSTRY_KEYS) expect(INDUSTRIES[k].zeroCapitalRoutes.length).toBeGreaterThanOrEqual(3);
  });
});
