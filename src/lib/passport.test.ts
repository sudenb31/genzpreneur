import { describe, expect, it } from 'vitest';
import {
  completionPercent, emptyPassport, normalizePassport, passportSchema, sectionCompletion, SKILLS, type Passport,
} from './passport';

function full(): Passport {
  const p = emptyPassport('Rani Putri');
  p.personal = { ...p.personal, ageRange: '21_23', status: 'student', businessExperience: 'none', programGoal: 'Belajar jualan B2B' };
  p.skills.levels = Object.fromEntries(SKILLS.map((s) => [s.key, 1]));
  p.resources = { hoursPerWeek: 10, devices: ['smartphone'], startBudget: 'zero', workMode: 'online', customerExperience: 'some' };
  p.interests.selected = ['b2b_sales'];
  p.goals = { ...p.goals, skillTarget: 'Pitching', weeklyActivityTarget: 5, weeklyProspectTarget: 10 };
  return p;
}

describe('completion', () => {
  it('kosong = 0%', () => {
    expect(completionPercent(emptyPassport('Rani'))).toBe(0);
  });

  it('lengkap = 100%', () => {
    const p = full();
    expect(Object.values(sectionCompletion(p)).every(Boolean)).toBe(true);
    expect(completionPercent(p)).toBe(100);
  });

  it('skill dianggap lengkap hanya jika semua skill dinilai', () => {
    const p = full();
    delete (p.skills.levels as Record<string, number>).sales;
    expect(sectionCompletion(p).skills).toBe(false);
    expect(completionPercent(p)).toBe(80);
  });

  it('nilai 0 jam per minggu tetap dihitung terisi', () => {
    const p = full();
    p.resources.hoursPerWeek = 0;
    expect(sectionCompletion(p).resources).toBe(true);
  });
});

describe('validasi skema', () => {
  it('menerima passport valid', () => {
    expect(passportSchema.safeParse(full()).success).toBe(true);
  });

  it('menolak nama terlalu pendek', () => {
    const p = full();
    p.personal.fullName = 'A';
    const r = passportSchema.safeParse(p);
    expect(r.success).toBe(false);
  });

  it('menolak jam negatif dan > 80', () => {
    const p = full();
    p.resources.hoursPerWeek = -1;
    expect(passportSchema.safeParse(p).success).toBe(false);
    p.resources.hoursPerWeek = 81;
    expect(passportSchema.safeParse(p).success).toBe(false);
  });

  it('menolak level skill di luar 0–3 dan skill tak dikenal', () => {
    const p = full();
    (p.skills.levels as Record<string, number>).sales = 4;
    expect(passportSchema.safeParse(p).success).toBe(false);
    const q = full();
    (q.skills.levels as Record<string, number>).hacking = 2;
    expect(passportSchema.safeParse(q).success).toBe(false);
  });

  it('menolak nilai enum yang tidak dikenal', () => {
    const p = full() as unknown as { personal: { status: string } };
    p.personal.status = 'astronaut';
    expect(passportSchema.safeParse(p).success).toBe(false);
  });
});

describe('normalizePassport', () => {
  it('null → passport kosong dengan nama fallback', () => {
    const p = normalizePassport(null, 'Budi');
    expect(p.personal.fullName).toBe('Budi');
    expect(completionPercent(p)).toBe(0);
  });

  it('membuang field asing dan memulihkan bagian yang rusak', () => {
    const raw = { ...full(), evil: true, resources: { hoursPerWeek: 'banyak' } };
    const p = normalizePassport(raw, 'X') as unknown as Record<string, unknown>;
    expect(p.evil).toBeUndefined();
    expect((p.resources as Passport['resources']).hoursPerWeek).toBeNull();
    expect((p.personal as Passport['personal']).fullName).toBe('Rani Putri');
  });
});
