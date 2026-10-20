import type { SimOption } from './types';

/** Penulisan opsi ringkas: o(label, [kas, reputasi, tim], hasil, best?). Kas dalam juta rupiah. */
export function o(label: string, [kas, reputasi, tim]: [number, number, number], result: string, best = false): SimOption {
  return best ? { label, effect: { kas, reputasi, tim }, result, best: true } : { label, effect: { kas, reputasi, tim }, result };
}
