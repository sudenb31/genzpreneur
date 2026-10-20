import type { SimArea, SimDecisionFull, SimExecution, SimOption } from './types';

/** Penulisan opsi ringkas: o(label, [kas, reputasi, tim], hasil, best?). Kas dalam juta rupiah. */
export function o(label: string, [kas, reputasi, tim]: [number, number, number], result: string, best = false): SimOption {
  return best ? { label, effect: { kas, reputasi, tim }, result, best: true } : { label, effect: { kas, reputasi, tim }, result };
}

/** Langkah eksekusi ringkas: x(siapa, tugas). */
export const x = (siapa: string, tugas: string) => ({ siapa, tugas });

/** Keputusan lengkap ringkas: d(area, judul, situasi, [opsi×3], pelajaran, [langkah eksekusi]). */
export function d(area: SimArea, title: string, situation: string, options: [SimOption, SimOption, SimOption], lesson: string, execution: SimExecution): SimDecisionFull {
  return { area, title, situation, options, lesson, execution };
}
