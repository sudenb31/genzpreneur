import { z } from 'zod';

/**
 * Kalkulator komisi & target — perhitungan matematis deterministik.
 * Omzet, laba kotor, dan komisi dipisahkan dengan jelas.
 */
export const commissionInputSchema = z
  .object({
    price: z.number({ error: 'Isi harga jual' }).positive('Harga jual harus lebih dari 0').max(1_000_000_000),
    cost: z.number({ error: 'Isi modal/HPP (0 bila tidak tahu)' }).min(0, 'Tidak boleh negatif').max(1_000_000_000),
    commissionPct: z.number({ error: 'Isi persen komisi' }).min(0, 'Minimal 0%').max(100, 'Maksimal 100%'),
    basis: z.enum(['price', 'profit']),
    units: z.number({ error: 'Isi jumlah unit' }).int('Gunakan bilangan bulat').min(0).max(1_000_000),
    target: z.number({ error: 'Isi target (0 bila tidak ada)' }).min(0).max(10_000_000_000),
  })
  .refine((d) => d.basis === 'price' || d.cost <= d.price, { path: ['cost'], message: 'Modal melebihi harga jual — tidak ada laba untuk dibagi' });

export type CommissionInput = z.infer<typeof commissionInputSchema>;

export interface CommissionResult {
  revenue: number;            // omzet = harga × unit
  grossProfit: number;        // laba kotor = (harga − modal) × unit
  commissionPerUnit: number;
  totalCommission: number;
  ownerProfitAfterCommission: number; // laba kotor pemilik setelah membayar komisi
  unitsForTarget: number | null;      // unit yang perlu terjual agar komisi ≥ target
}

/** Pembulatan ke rupiah terdekat. */
const rp = (n: number) => Math.round(n);

export function calculateCommission(input: CommissionInput): CommissionResult {
  const { price, cost, commissionPct, basis, units, target } = commissionInputSchema.parse(input);
  const marginPerUnit = Math.max(0, price - cost);
  const base = basis === 'price' ? price : marginPerUnit;
  const commissionPerUnit = (base * commissionPct) / 100;
  const totalCommission = commissionPerUnit * units;
  const grossProfit = (price - cost) * units;
  return {
    revenue: rp(price * units),
    grossProfit: rp(grossProfit),
    commissionPerUnit: rp(commissionPerUnit),
    totalCommission: rp(totalCommission),
    ownerProfitAfterCommission: rp(grossProfit - totalCommission),
    unitsForTarget: target > 0 && commissionPerUnit > 0 ? Math.ceil(target / commissionPerUnit - 1e-9) : null,
  };
}

/* --------------------------- Template proposal --------------------------- */

export interface ProposalInput {
  myName: string;
  myContact: string;
  client: string;
  problem: string;
  service: string;
  deliverables: string; // satu per baris
  duration: string;
  price: string;
  scheme: 'fee' | 'commission' | 'pilot';
  revisions: string;
}

export function buildProposal(p: ProposalInput): string {
  const t = (s: string, fb: string) => s.trim() || fb;
  const items = p.deliverables.split('\n').map((s) => s.trim()).filter(Boolean);
  const schemeText = {
    fee: `Biaya: ${t(p.price, '[harga]')} untuk periode ${t(p.duration, '[durasi]')}. Pembayaran 50% di awal dan 50% setelah pekerjaan diserahkan (dapat disesuaikan).`,
    commission: `Skema komisi: ${t(p.price, '[persen komisi]')} dari setiap pesanan yang SUDAH LUNAS dan berasal dari saya. Tidak ada biaya di muka.`,
    pilot: `Uji coba tanpa biaya selama ${t(p.duration, '[durasi]')} dengan cakupan di atas. Setelah itu, ${t(p.client, '[klien]')} bebas memutuskan untuk melanjutkan atau tidak.`,
  }[p.scheme];
  return [
    `PROPOSAL KERJA SAMA`,
    `Untuk: ${t(p.client, '[nama bisnis]')}`,
    `Dari: ${t(p.myName, '[nama kamu]')}${p.myContact.trim() ? ` · ${p.myContact.trim()}` : ''}`,
    ``,
    `1. Latar belakang`,
    t(p.problem, '[masalah yang kamu amati]'),
    ``,
    `2. Usulan`,
    t(p.service, '[layanan yang kamu tawarkan]'),
    ``,
    `3. Yang akan dikerjakan`,
    ...(items.length ? items.map((s, i) => `   ${i + 1}. ${s}`) : ['   1. [rincian pekerjaan]']),
    ``,
    `4. Waktu & revisi`,
    `Durasi: ${t(p.duration, '[durasi]')} · Revisi: ${t(p.revisions, '[jumlah revisi]')}`,
    ``,
    `5. Skema kerja sama`,
    schemeText,
    ``,
    `6. Catatan`,
    `Saya tidak menjanjikan angka penjualan tertentu; saya berkomitmen pada pekerjaan yang tertulis di atas. Semua detail dapat didiskusikan sebelum disepakati.`,
    ``,
    `Terima kasih atas pertimbangannya.`,
    t(p.myName, '[nama kamu]'),
  ].join('\n');
}
