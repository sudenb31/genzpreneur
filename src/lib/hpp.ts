import { z } from 'zod';

/**
 * Kalkulator HPP (Harga Pokok Penjualan) & Harga Jual — deterministik.
 *
 * Alur hitung:
 *  1. Bahan baku per batch  = Σ (harga beli ÷ isi kemasan × takaran dipakai)
 *  2. Bahan per unit        = bahan per batch ÷ hasil per batch
 *  3. Kemasan per unit      = Σ biaya per unit
 *  4. Tenaga kerja per unit = (jam per batch × upah per jam) ÷ hasil per batch
 *  5. HPP variabel / unit   = 2 + 3 + 4
 *  6. Overhead per unit     = Σ biaya tetap per bulan ÷ estimasi unit terjual per bulan
 *  7. Biaya penuh / unit    = 5 + 6
 *  8. Harga rekomendasi     = (biaya penuh + biaya per transaksi) ÷ (1 − potongan platform − target laba)
 */

const num = (label: string, max = 10_000_000_000) =>
  z.number({ error: `Isi ${label}` }).min(0, `${label[0].toUpperCase()}${label.slice(1)} tidak boleh negatif`).max(max, 'Angka terlalu besar');

export const materialSchema = z.object({
  name: z.string().trim().max(60).default(''),
  buyPrice: num('harga beli'),
  buyQty: z.number({ error: 'Isi isi kemasan' }).positive('Isi kemasan harus lebih dari 0').max(10_000_000),
  unit: z.string().trim().max(10).default(''),
  useQty: num('takaran dipakai', 10_000_000),
});
export type Material = z.infer<typeof materialSchema>;

export const costLineSchema = z.object({
  name: z.string().trim().max(60).default(''),
  amount: num('biaya'),
});
export type CostLine = z.infer<typeof costLineSchema>;

export const hppInputSchema = z
  .object({
    mode: z.enum(['product', 'service']),
    batchYield: z.number({ error: 'Isi hasil per batch' }).positive('Hasil per batch minimal 1').max(1_000_000),
    materials: z.array(materialSchema).max(30),
    perUnitCosts: z.array(costLineSchema).max(20),
    laborHoursPerBatch: num('jam kerja per batch', 10_000),
    wagePerHour: num('upah per jam'),
    fixedCosts: z.array(costLineSchema).max(20),
    unitsPerMonth: z.number({ error: 'Isi estimasi unit terjual per bulan' }).positive('Estimasi penjualan minimal 1 per bulan').max(10_000_000),
    platformFeePct: z.number({ error: 'Isi potongan platform (0 bila tidak ada)' }).min(0).max(90, 'Maksimal 90%'),
    perTransactionCost: num('biaya per transaksi'),
    targetMarginPct: z.number({ error: 'Isi target laba' }).min(0).max(90, 'Maksimal 90%'),
    checkPrice: z.number().min(0).max(10_000_000_000).nullable(),
  })
  .refine((d) => d.platformFeePct + d.targetMarginPct < 95, {
    path: ['targetMarginPct'],
    message: 'Potongan platform + target laba terlalu besar (harus di bawah 95%)',
  });

export type HppInput = z.infer<typeof hppInputSchema>;

export interface CostSlice { key: 'material' | 'packaging' | 'labor' | 'overhead'; label: string; perUnit: number; pct: number }

export interface PriceCheck {
  price: number;
  /** Uang yang benar-benar diterima per unit setelah potongan platform & biaya transaksi. */
  netReceived: number;
  profitPerUnit: number;
  marginPct: number;
  /** Kontribusi per unit = diterima bersih − HPP variabel. */
  contribution: number;
  /** Unit per bulan agar biaya tetap tertutup; null bila kontribusi ≤ 0. */
  bepUnits: number | null;
  bepPerDay: number | null;
  monthlyRevenue: number;
  monthlyProfit: number;
  status: 'loss' | 'thin' | 'healthy';
}

export interface HppResult {
  materialPerBatch: number;
  materialPerUnit: number;
  packagingPerUnit: number;
  laborPerUnit: number;
  variableCost: number;
  fixedPerMonth: number;
  overheadPerUnit: number;
  fullCost: number;
  slices: CostSlice[];
  materialLines: { name: string; perBatch: number; perUnit: number }[];
  recommendedPrice: number;
  recommended: PriceCheck;
  check: PriceCheck | null;
}

const r0 = (n: number) => Math.round(n);
const pct1 = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 1000) / 10);

/** Bulatkan ke atas ke angka harga yang wajar: < 10rb → ratusan, < 100rb → 500-an, sisanya ribuan. */
export function roundPriceUp(n: number): number {
  if (n <= 0) return 0;
  const step = n < 10_000 ? 100 : n < 100_000 ? 500 : 1_000;
  return Math.ceil(n / step - 1e-9) * step;
}

const DAYS = 30;

function checkPrice(price: number, d: HppInput, variableCost: number, fullCost: number, fixedPerMonth: number): PriceCheck {
  const netReceived = price * (1 - d.platformFeePct / 100) - d.perTransactionCost;
  const profitPerUnit = netReceived - fullCost;
  const contribution = netReceived - variableCost;
  const bepUnits = contribution > 0 ? (fixedPerMonth === 0 ? 0 : Math.ceil(fixedPerMonth / contribution - 1e-9)) : null;
  const marginPct = pct1(profitPerUnit, price);
  return {
    price: r0(price),
    netReceived: r0(netReceived),
    profitPerUnit: r0(profitPerUnit),
    marginPct,
    contribution: r0(contribution),
    bepUnits,
    bepPerDay: bepUnits === null ? null : Math.ceil(bepUnits / DAYS - 1e-9),
    monthlyRevenue: r0(price * d.unitsPerMonth),
    monthlyProfit: r0(contribution * d.unitsPerMonth - fixedPerMonth),
    status: profitPerUnit < 0 ? 'loss' : marginPct < 15 ? 'thin' : 'healthy',
  };
}

export function calculateHpp(input: HppInput): HppResult {
  const d = hppInputSchema.parse(input);

  const materialLines = d.materials.map((m) => {
    const perBatch = (m.buyPrice / m.buyQty) * m.useQty;
    return { name: m.name || 'Bahan', perBatch: r0(perBatch), perUnit: r0(perBatch / d.batchYield), raw: perBatch };
  });
  const materialPerBatchRaw = materialLines.reduce((a, m) => a + m.raw, 0);
  const materialPerUnit = materialPerBatchRaw / d.batchYield;
  const packagingPerUnit = d.perUnitCosts.reduce((a, c) => a + c.amount, 0);
  const laborPerUnit = (d.laborHoursPerBatch * d.wagePerHour) / d.batchYield;
  const variableCost = materialPerUnit + packagingPerUnit + laborPerUnit;
  const fixedPerMonth = d.fixedCosts.reduce((a, c) => a + c.amount, 0);
  const overheadPerUnit = fixedPerMonth / d.unitsPerMonth;
  const fullCost = variableCost + overheadPerUnit;

  const slices: CostSlice[] = [
    { key: 'material', label: d.mode === 'service' ? 'Bahan & alat habis pakai' : 'Bahan baku', perUnit: r0(materialPerUnit), pct: pct1(materialPerUnit, fullCost) },
    { key: 'packaging', label: d.mode === 'service' ? 'Biaya lain per proyek' : 'Kemasan & biaya per unit', perUnit: r0(packagingPerUnit), pct: pct1(packagingPerUnit, fullCost) },
    { key: 'labor', label: 'Tenaga kerja', perUnit: r0(laborPerUnit), pct: pct1(laborPerUnit, fullCost) },
    { key: 'overhead', label: 'Biaya tetap (overhead)', perUnit: r0(overheadPerUnit), pct: pct1(overheadPerUnit, fullCost) },
  ];

  const divisor = 1 - (d.platformFeePct + d.targetMarginPct) / 100;
  const recommendedPrice = roundPriceUp((fullCost + d.perTransactionCost) / divisor);

  return {
    materialPerBatch: r0(materialPerBatchRaw),
    materialPerUnit: r0(materialPerUnit),
    packagingPerUnit: r0(packagingPerUnit),
    laborPerUnit: r0(laborPerUnit),
    variableCost: r0(variableCost),
    fixedPerMonth: r0(fixedPerMonth),
    overheadPerUnit: r0(overheadPerUnit),
    fullCost: r0(fullCost),
    slices,
    materialLines: materialLines.map(({ name, perBatch, perUnit }) => ({ name, perBatch, perUnit })),
    recommendedPrice,
    recommended: checkPrice(recommendedPrice, d, variableCost, fullCost, fixedPerMonth),
    check: d.checkPrice && d.checkPrice > 0 ? checkPrice(d.checkPrice, d, variableCost, fullCost, fixedPerMonth) : null,
  };
}

/* ------------------------------ Contoh siap pakai ------------------------------ */

export const HPP_EXAMPLES: Record<'product' | 'service', { title: string; input: HppInput }> = {
  product: {
    title: 'Es kopi susu gula aren (1 resep = 20 cup)',
    input: {
      mode: 'product',
      batchYield: 20,
      materials: [
        { name: 'Biji kopi', buyPrice: 120000, buyQty: 1000, unit: 'g', useQty: 360 },
        { name: 'Susu UHT', buyPrice: 19000, buyQty: 1000, unit: 'ml', useQty: 3000 },
        { name: 'Gula aren cair', buyPrice: 45000, buyQty: 1000, unit: 'ml', useQty: 500 },
        { name: 'Es batu', buyPrice: 10000, buyQty: 5, unit: 'kg', useQty: 4 },
      ],
      perUnitCosts: [
        { name: 'Cup + tutup', amount: 900 },
        { name: 'Sedotan', amount: 150 },
        { name: 'Stiker logo', amount: 250 },
      ],
      laborHoursPerBatch: 1,
      wagePerHour: 20000,
      fixedCosts: [
        { name: 'Sewa lapak', amount: 600000 },
        { name: 'Listrik & gas', amount: 150000 },
        { name: 'Penyusutan alat', amount: 100000 },
      ],
      unitsPerMonth: 600,
      platformFeePct: 0,
      perTransactionCost: 0,
      targetMarginPct: 25,
      checkPrice: 15000,
    },
  },
  service: {
    title: 'Jasa desain 9 feed Instagram (per proyek)',
    input: {
      mode: 'service',
      batchYield: 1,
      materials: [{ name: 'Foto stok / aset berbayar', buyPrice: 30000, buyQty: 10, unit: 'aset', useQty: 3 }],
      perUnitCosts: [{ name: 'Kuota & transport meeting', amount: 15000 }],
      laborHoursPerBatch: 5,
      wagePerHour: 35000,
      fixedCosts: [
        { name: 'Canva Pro', amount: 95000 },
        { name: 'Internet', amount: 150000 },
      ],
      unitsPerMonth: 6,
      platformFeePct: 0,
      perTransactionCost: 0,
      targetMarginPct: 30,
      checkPrice: 250000,
    },
  },
};

export function emptyHppInput(mode: 'product' | 'service'): HppInput {
  return {
    mode,
    batchYield: mode === 'service' ? 1 : 10,
    materials: [{ name: '', buyPrice: 0, buyQty: 1, unit: '', useQty: 0 }],
    perUnitCosts: [{ name: '', amount: 0 }],
    laborHoursPerBatch: 0,
    wagePerHour: 0,
    fixedCosts: [{ name: '', amount: 0 }],
    unitsPerMonth: mode === 'service' ? 4 : 100,
    platformFeePct: 0,
    perTransactionCost: 0,
    targetMarginPct: 25,
    checkPrice: null,
  };
}
