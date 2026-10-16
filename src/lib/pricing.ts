import { z } from 'zod';

/**
 * Kalkulator Harga & BEP — perhitungan deterministik (bukan AI).
 * Mendukung pelajaran Business 101: "Nentuin harga tanpa galau" & "Duit".
 */
const money = (label: string) => z.number({ error: `Isi ${label}` }).min(0, 'Tidak boleh negatif').max(10_000_000_000, 'Angka terlalu besar');

export const pricingInputSchema = z.object({
  price: z.number({ error: 'Isi harga jual' }).positive('Harga jual harus lebih dari 0').max(10_000_000_000),
  variableCost: money('biaya variabel per unit'),
  fixedCost: money('biaya tetap per bulan'),
  hoursPerUnit: z.number({ error: 'Isi jam kerja per unit (0 bila tidak dihitung)' }).min(0).max(500),
  targetIncome: money('target penghasilan per bulan'),
  hoursPerMonth: z.number({ error: 'Isi jam kerja per bulan' }).min(0).max(744, 'Maksimal 744 jam (sebulan penuh)'),
  discountPct: z.number({ error: 'Isi persen diskon (0 bila tidak ada)' }).min(0).max(100, 'Maksimal 100%'),
});

export type PricingInput = z.infer<typeof pricingInputSchema>;

export interface PricingPackage { tier: 'Dasar' | 'Utama' | 'Lengkap'; price: number; belowFloor: boolean }

export interface PricingResult {
  /** Margin kontribusi per unit = harga − biaya variabel. */
  margin: number;
  marginPct: number;
  /** Unit per bulan agar tidak rugi; null bila margin ≤ 0. */
  bepUnits: number | null;
  bepPerDay: number | null;
  /** Nilai waktumu per jam = target penghasilan ÷ jam kerja; null bila jam = 0. */
  hourlyRate: number | null;
  /** Harga lantai = biaya variabel + (jam per unit × nilai per jam). */
  floorPrice: number;
  belowFloor: boolean;
  discountedPrice: number;
  discountedMargin: number;
  /** Berapa kali lipat penjualan agar laba sama setelah diskon; null bila margin habis. */
  discountVolumeMultiplier: number | null;
  packages: PricingPackage[];
}

/** Bulatkan ke angka "enak dilihat": < Rp100rb ke ribuan, sisanya ke kelipatan Rp5rb. */
export function roundNice(n: number): number {
  if (n <= 0) return 0;
  const step = n < 100_000 ? 1_000 : 5_000;
  return Math.round(n / step) * step;
}

const DAYS_PER_MONTH = 30;

export function calculatePricing(input: PricingInput): PricingResult {
  const d = pricingInputSchema.parse(input);
  const margin = d.price - d.variableCost;
  const marginPct = Math.round((margin / d.price) * 1000) / 10;
  const bepUnits = margin > 0 ? (d.fixedCost === 0 ? 0 : Math.ceil(d.fixedCost / margin - 1e-9)) : null;
  const bepPerDay = bepUnits === null ? null : Math.ceil(bepUnits / DAYS_PER_MONTH - 1e-9);
  const hourlyRate = d.hoursPerMonth > 0 ? Math.round(d.targetIncome / d.hoursPerMonth) : null;
  const floorPrice = Math.round(d.variableCost + d.hoursPerUnit * (hourlyRate ?? 0));

  const discountedPrice = Math.round(d.price * (1 - d.discountPct / 100));
  const discountedMargin = discountedPrice - d.variableCost;
  const discountVolumeMultiplier =
    margin > 0 && discountedMargin > 0 ? Math.round((margin / discountedMargin) * 100) / 100 : null;

  const tiers: [PricingPackage['tier'], number][] = [['Dasar', 0.65], ['Utama', 1], ['Lengkap', 1.6]];
  const packages = tiers.map(([tier, k]) => {
    const price = roundNice(d.price * k);
    // Isi paket diasumsikan sebanding dengan harganya, jadi lantainya ikut diskalakan.
    return { tier, price, belowFloor: price < Math.round(floorPrice * k) };
  });

  return {
    margin: Math.round(margin),
    marginPct,
    bepUnits,
    bepPerDay,
    hourlyRate,
    floorPrice,
    belowFloor: d.price < floorPrice,
    discountedPrice,
    discountedMargin: Math.round(discountedMargin),
    discountVolumeMultiplier,
    packages,
  };
}
