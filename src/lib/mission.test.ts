import { describe, expect, it } from 'vitest';
import { MISSION_STEPS } from '../content/mission';
import { MODULES } from '../content/modules';
import { encodeMissionDraft, missionExport, missionKey, missionReady, missionSummary, readMissionDraft } from './mission';

describe('work-first drafts', () => {
  it('round-trips text and self checks without treating them as validated success', () => {
    const draft = { text: 'Contoh pekerjaan\nBelum ada respons 🔎', checks: [0, 2] };
    expect(readMissionDraft(encodeMissionDraft(draft))).toEqual(draft);
    expect(missionReady(draft)).toBe(false);
  });
  it('never marks empty work ready even if all checks are present', () => {
    expect(missionReady({ text: '  ', checks: [0, 1, 2] })).toBe(false);
  });
  it('preserves unrecognized data as an unchecked draft', () => {
    expect(readMissionDraft('catatan lama')).toEqual({ text: 'catatan lama', checks: [] });
    expect(readMissionDraft('{broken')).toEqual({ text: '{broken', checks: [] });
  });
  it('filters invalid and duplicate self-check ids', () => {
    expect(readMissionDraft('{"v":1,"text":"contoh","checks":[0,0,1,2,3,"0",-1]}').checks).toEqual([0, 1, 2]);
  });
  it('rejects unknown storage keys and overlong work instead of truncating it', () => {
    expect(() => missionKey('unknown')).toThrow();
    expect(() => encodeMissionDraft({ text: 'x'.repeat(1601), checks: [] })).toThrow();
    expect(() => encodeMissionDraft({ text: '\n'.repeat(1600), checks: [] })).toThrow();
  });
  it('does not repurpose old day notes or completed tasks as work evidence', () => {
    expect(missionSummary({ d1: 'Tugas lama selesai', d7: 'Catatan lama' })).toMatchObject({ written: 0, reviewed: 0 });
  });
  it('recommends the next unreviewed draft while distinguishing writing and self assessment', () => {
    const notes = { [missionKey('start')]: encodeMissionDraft({ text: 'Waktu dua jam dan HP', checks: [0, 1, 2] }), [missionKey('problem')]: encodeMissionDraft({ text: 'Pengamatan yang perlu dicek', checks: [] }) };
    expect(missionSummary(notes)).toMatchObject({ written: 2, reviewed: 1, next: { id: 'problem' } });
  });
  it('exports only work drafts, with an explicit evidence limitation', () => {
    const result = missionExport({ d1: 'LEGACY_PRIVATE_NOTE', [missionKey('try')]: encodeMissionDraft({ text: 'Belum mencoba: masih membuat contoh', checks: [] }) });
    expect(result).toContain('Belum mencoba');
    expect(result).toContain('bukan verifikasi mentor');
    expect(result).not.toContain('LEGACY_PRIVATE_NOTE');
  });
  it('has nine unique stages, three criteria each, and valid lesson references', () => {
    expect(MISSION_STEPS).toHaveLength(9);
    expect(new Set(MISSION_STEPS.map((s) => s.id)).size).toBe(9);
    for (const s of MISSION_STEPS) {
      expect(s.criteria).toHaveLength(3);
      expect(s.stuck.length).toBeGreaterThan(40);
      for (const r of s.resources.filter((r) => r.to.startsWith('/app/belajar/'))) {
        const url = new URL(r.to, 'https://example.com');
        const mod = MODULES.find((m) => url.pathname === `/app/belajar/${m.slug}`);
        expect(mod?.lessons.some((l) => l.id === url.searchParams.get('pelajaran'))).toBe(true);
      }
    }
  });
});
