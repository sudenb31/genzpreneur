import { MISSION_STEPS } from '../content/mission';

export const MISSION_TEXT_LIMIT = 1600;
export interface MissionDraft { text: string; checks: number[] }
export const missionKey = (id: string) => {
  if (!MISSION_STEPS.some((s) => s.id === id)) throw new Error('Tahap misi tidak dikenal.');
  return `work-v1-${id}`;
};
export function readMissionDraft(raw: string | undefined): MissionDraft {
  if (!raw) return { text: '', checks: [] };
  try {
    const v = JSON.parse(raw);
    if (v?.v === 1 && typeof v.text === 'string' && Array.isArray(v.checks)) {
      return { text: v.text, checks: [...new Set<number>(v.checks.filter((x: unknown): x is number => Number.isInteger(x) && Number(x) >= 0 && Number(x) < 3))] };
    }
  } catch { /* Preserve an unrecognized draft as text instead of discarding it. */ }
  return { text: raw, checks: [] };
}
export function encodeMissionDraft(draft: MissionDraft): string {
  if (draft.text.length > MISSION_TEXT_LIMIT) throw new Error(`Maksimal ${MISSION_TEXT_LIMIT} karakter. Ringkas atau simpan tautan ke dokumenmu.`);
  const checks = [...new Set(draft.checks.filter((x) => Number.isInteger(x) && x >= 0 && x < 3))];
  const encoded = JSON.stringify({ v: 1, text: draft.text, checks });
  if (encoded.length > 2000) throw new Error('Catatan terlalu panjang untuk disimpan.');
  return encoded;
}
export const missionReady = (draft: MissionDraft) => !!draft.text.trim() && [0, 1, 2].every((i) => draft.checks.includes(i));
export function missionSummary(notes: Record<string, string>) {
  const drafts = MISSION_STEPS.map((s) => readMissionDraft(notes[missionKey(s.id)]));
  return {
    written: drafts.filter((d) => !!d.text.trim()).length,
    reviewed: drafts.filter(missionReady).length,
    next: MISSION_STEPS.find((_, i) => !missionReady(drafts[i])) ?? MISSION_STEPS[MISSION_STEPS.length - 1],
  };
}
export function missionExport(notes: Record<string, string>) {
  return ['MISI PERTAMA — CATATAN HASIL KERJA',
    'Penilaian kriteria diisi sendiri. Catatan ini bukan verifikasi mentor atau bukti keberhasilan bisnis.',
    ...MISSION_STEPS.map((step, i) => {
      const draft = readMissionDraft(notes[missionKey(step.id)]);
      return `\n${i + 1}. ${step.title}\n${draft.text || '(Belum ada hasil tersimpan)'}\nPenilaian sendiri: ${missionReady(draft) ? 'semua kriteria dicentang' : 'belum lengkap'}`;
    }),
  ].join('\n\n');
}
