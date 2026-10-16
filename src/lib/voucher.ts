import type { PlanKey } from './membership';

/** Kode voucher: huruf besar, angka, dan tanda hubung. 4–32 karakter. */
export const VOUCHER_RE = /^[A-Z0-9-]{4,32}$/;
export const normalizeCode = (c: string) => c.trim().toUpperCase().replace(/\s+/g, '');

/** Tanpa karakter yang mudah tertukar (0/O, 1/I/L). */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function randomCode(prefix: string, length = 8, rand: (n: number) => number = cryptoInt): string {
  let s = '';
  for (let i = 0; i < length; i++) s += ALPHABET[rand(ALPHABET.length)];
  const p = normalizeCode(prefix).replace(/[^A-Z0-9]/g, '').slice(0, 12);
  return p ? `${p}-${s}` : s;
}

function cryptoInt(n: number): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
}

/** Buat N kode unik (tanpa duplikat dalam satu batch). */
export function generateCodes(prefix: string, count: number, length = 8): string[] {
  const set = new Set<string>();
  while (set.size < count) set.add(randomCode(prefix, length));
  return [...set];
}

export interface Voucher {
  code: string;
  plan: Exclude<PlanKey, 'none'>;
  maxUses: number;
  uses: number;
  active: boolean;
  expiresAt: Date | null;
  batch: string;
  note: string;
  createdAt: Date | null;
}

export type VoucherProblem = 'not_found' | 'inactive' | 'expired' | 'used_up' | 'not_higher' | null;

const RANK: Record<PlanKey, number> = { none: 0, spark: 1, boost: 2, impact: 3 };

/** Cek apakah voucher bisa ditukar oleh peserta dengan paket saat ini. Server tetap memeriksa ulang. */
export function voucherProblem(v: Voucher | null, currentPlan: PlanKey, now: Date): VoucherProblem {
  if (!v) return 'not_found';
  if (!v.active) return 'inactive';
  if (v.expiresAt && now >= v.expiresAt) return 'expired';
  if (v.uses >= v.maxUses) return 'used_up';
  if (RANK[v.plan] <= RANK[currentPlan]) return 'not_higher';
  return null;
}

export const VOUCHER_PROBLEM_TEXT: Record<Exclude<VoucherProblem, null>, string> = {
  not_found: 'Kode voucher tidak ditemukan. Cek lagi penulisannya (huruf besar/kecil tidak berpengaruh).',
  inactive: 'Kode voucher ini sudah dinonaktifkan. Hubungi tim GenZ Preneur.',
  expired: 'Kode voucher ini sudah kedaluwarsa.',
  used_up: 'Kuota pemakaian kode voucher ini sudah habis.',
  not_higher: 'Paketmu sekarang sudah setara atau lebih tinggi dari isi voucher ini.',
};
