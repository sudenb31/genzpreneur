import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { saveItem } from '../lib/data';
import { formatRupiah } from '../config/site';
import { calculateHpp, emptyHppInput, HPP_EXAMPLES, hppInputSchema, type HppInput, type PriceCheck } from '../lib/hpp';
import { CopyButton, useToast } from './ui';

/* Form disimpan sebagai teks supaya kolom boleh kosong saat diketik. */
type Mode = 'product' | 'service';
interface MatRow { name: string; buyPrice: string; buyQty: string; unit: string; useQty: string }
interface CostRow { name: string; amount: string }
interface Form {
  mode: Mode;
  batchYield: string;
  materials: MatRow[];
  perUnitCosts: CostRow[];
  laborHoursPerBatch: string;
  wagePerHour: string;
  fixedCosts: CostRow[];
  unitsPerMonth: string;
  platformFeePct: string;
  perTransactionCost: string;
  targetMarginPct: string;
  checkPrice: string;
}

const s = (n: number | null) => (n === null ? '' : String(n));
function toForm(i: HppInput): Form {
  return {
    mode: i.mode,
    batchYield: s(i.batchYield),
    materials: i.materials.map((m) => ({ name: m.name, buyPrice: s(m.buyPrice), buyQty: s(m.buyQty), unit: m.unit, useQty: s(m.useQty) })),
    perUnitCosts: i.perUnitCosts.map((c) => ({ name: c.name, amount: s(c.amount) })),
    laborHoursPerBatch: s(i.laborHoursPerBatch),
    wagePerHour: s(i.wagePerHour),
    fixedCosts: i.fixedCosts.map((c) => ({ name: c.name, amount: s(c.amount) })),
    unitsPerMonth: s(i.unitsPerMonth),
    platformFeePct: s(i.platformFeePct),
    perTransactionCost: s(i.perTransactionCost),
    targetMarginPct: s(i.targetMarginPct),
    checkPrice: s(i.checkPrice),
  };
}
const n = (v: string) => (v.trim() === '' ? NaN : Number(v));
/** Baris yang benar-benar kosong diabaikan; kolom angka opsional dianggap 0. */
const n0 = (v: string) => (v.trim() === '' ? 0 : Number(v));
function fromForm(f: Form) {
  const rowEmpty = (o: CostRow) => o.name.trim() === '' && o.amount.trim() === '';
  return {
    mode: f.mode,
    batchYield: f.mode === 'service' ? 1 : n(f.batchYield),
    // Baris bahan dianggap kosong bila nama, harga, dan takaran belum diisi (isi kemasan boleh terisi default).
    materials: f.materials
      .filter((m) => !(m.name.trim() === '' && m.buyPrice.trim() === '' && m.useQty.trim() === ''))
      .map((m) => ({ name: m.name, buyPrice: n(m.buyPrice), buyQty: n(m.buyQty), unit: m.unit, useQty: n(m.useQty) })),
    perUnitCosts: f.perUnitCosts.filter((c) => !rowEmpty(c)).map((c) => ({ name: c.name, amount: n(c.amount) })),
    laborHoursPerBatch: n0(f.laborHoursPerBatch),
    wagePerHour: n0(f.wagePerHour),
    fixedCosts: f.fixedCosts.filter((c) => !rowEmpty(c)).map((c) => ({ name: c.name, amount: n(c.amount) })),
    unitsPerMonth: n(f.unitsPerMonth),
    platformFeePct: n0(f.platformFeePct),
    perTransactionCost: n0(f.perTransactionCost),
    targetMarginPct: n(f.targetMarginPct),
    checkPrice: f.checkPrice.trim() === '' ? null : Number(f.checkPrice),
  };
}

const SLICE_BG: Record<string, string> = { material: 'bg-lime', packaging: 'bg-sky', labor: 'bg-lilac', overhead: 'bg-pink' };
const STATUS: Record<PriceCheck['status'], { label: string; cls: string; note: string }> = {
  loss: { label: 'RUGI', cls: 'bg-pink', note: 'Harga ini tidak menutup biaya penuh. Setiap unit terjual menggerus uangmu.' },
  thin: { label: 'MARGIN TIPIS', cls: 'bg-amber-soft', note: 'Masih untung, tapi sangat tipis (< 15%). Sedikit kenaikan bahan atau diskon bisa membuatmu rugi.' },
  healthy: { label: 'SEHAT', cls: 'bg-lime', note: 'Harga ini menutup semua biaya dan menyisakan laba yang layak.' },
};

function Step({ no, title, desc, children }: { no: number; title: string; desc: string; children: ReactNode }) {
  return (
    <section className="card space-y-4 p-5">
      <div className="flex gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-display text-sm font-extrabold text-lime">{no}</span>
        <div>
          <h3 className="font-display text-lg font-extrabold leading-tight">{title}</h3>
          <p className="text-sm text-muted">{desc}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function HppCalculator() {
  const { profile } = useAuth();
  const toast = useToast();
  const [f, setF] = useState<Form>(() => toForm(HPP_EXAMPLES.product.input));
  const [exampleNote, setExampleNote] = useState<string | null>(HPP_EXAMPLES.product.title);

  const svc = f.mode === 'service';
  const unitWord = svc ? 'proyek' : 'unit';
  const parsed = useMemo(() => hppInputSchema.safeParse(fromForm(f)), [f]);
  const r = parsed.success ? calculateHpp(parsed.data) : null;
  const errs: Record<string, string> = {};
  if (!parsed.success) for (const i of parsed.error.issues) errs[i.path.join('.')] ??= i.message;
  const errList = Object.values(errs);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((x) => ({ ...x, [k]: v }));
  const setMat = (i: number, patch: Partial<MatRow>) => set('materials', f.materials.map((m, j) => (j === i ? { ...m, ...patch } : m)));
  const setCost = (k: 'perUnitCosts' | 'fixedCosts', i: number, patch: Partial<CostRow>) => set(k, f[k].map((c, j) => (j === i ? { ...c, ...patch } : c)));

  function loadExample(mode: Mode) {
    setF(toForm(HPP_EXAMPLES[mode].input));
    setExampleNote(HPP_EXAMPLES[mode].title);
  }
  function clear(mode: Mode) {
    setF(toForm(emptyHppInput(mode)));
    setExampleNote(null);
  }
  function switchMode(mode: Mode) {
    if (mode === f.mode) return;
    loadExample(mode);
  }

  const numInput = (id: string, value: string, onChange: (v: string) => void, opts: { suffix?: string; label?: string; err?: string; placeholder?: string } = {}) => (
    <div className="relative">
      <input id={id} type="number" inputMode="decimal" min={0} aria-label={opts.label} placeholder={opts.placeholder}
        className={`input ${opts.suffix ? 'pr-12' : ''}`} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!opts.err} />
      {opts.suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted">{opts.suffix}</span>}
    </div>
  );

  const summary = r && parsed.success ? [
    `HPP & Harga — ${exampleNote ?? (svc ? 'jasa' : 'produk')}`,
    `Bahan ${formatRupiah(r.materialPerUnit)} + kemasan/lain ${formatRupiah(r.packagingPerUnit)} + tenaga kerja ${formatRupiah(r.laborPerUnit)} = HPP variabel ${formatRupiah(r.variableCost)}/${unitWord}`,
    `Overhead ${formatRupiah(r.overheadPerUnit)}/${unitWord} (biaya tetap ${formatRupiah(r.fixedPerMonth)}/bln ÷ ${parsed.data.unitsPerMonth} ${unitWord})`,
    `Biaya penuh: ${formatRupiah(r.fullCost)}/${unitWord}`,
    `Harga rekomendasi (target laba ${parsed.data.targetMarginPct}%${parsed.data.platformFeePct ? `, potongan platform ${parsed.data.platformFeePct}%` : ''}): ${formatRupiah(r.recommendedPrice)}`,
    r.check ? `Cek harga ${formatRupiah(r.check.price)}: laba ${formatRupiah(r.check.profitPerUnit)}/${unitWord} (${r.check.marginPct}%), BEP ${r.check.bepUnits ?? '—'} ${unitWord}/bln, proyeksi laba ${formatRupiah(r.check.monthlyProfit)}/bln — ${STATUS[r.check.status].label}` : '',
  ].filter(Boolean).join('\n') : '';

  async function save() {
    if (!profile || !summary) return;
    try { await saveItem(profile.uid, 'calc', `HPP · ${exampleNote ?? (svc ? 'jasa' : 'produk')}`, summary); toast('success', 'Hasil HPP tersimpan.'); }
    catch { toast('error', 'Gagal menyimpan.'); }
  }

  const priceCard = (title: string, c: PriceCheck, highlight: boolean) => (
    <div className={`rounded-3xl border-2 border-ink p-4 ${highlight ? 'bg-lime' : 'bg-white'}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-extrabold uppercase tracking-wider">{title}</p>
        <span className={`rounded-full border-2 border-ink px-2 py-0.5 text-[10px] font-extrabold ${STATUS[c.status].cls}`}>{STATUS[c.status].label}</span>
      </div>
      <p className="mt-1 font-display text-3xl font-extrabold">{formatRupiah(c.price)}</p>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <div><dt className="text-xs text-ink/60">Diterima bersih</dt><dd className="font-bold">{formatRupiah(c.netReceived)}</dd></div>
        <div><dt className="text-xs text-ink/60">Laba / {unitWord}</dt><dd className="font-bold">{formatRupiah(c.profitPerUnit)} ({c.marginPct}%)</dd></div>
        <div><dt className="text-xs text-ink/60">Titik impas (BEP)</dt><dd className="font-bold">{c.bepUnits !== null ? `${c.bepUnits} ${unitWord}/bln` : 'tidak tercapai'}</dd></div>
        <div><dt className="text-xs text-ink/60">≈ per hari</dt><dd className="font-bold">{c.bepPerDay !== null ? `${c.bepPerDay} ${unitWord}` : '—'}</dd></div>
        <div className="col-span-2"><dt className="text-xs text-ink/60">Proyeksi laba sebulan ({parsed.success ? parsed.data.unitsPerMonth : 0} {unitWord} terjual)</dt>
          <dd className={`font-display text-lg font-extrabold ${c.monthlyProfit < 0 ? 'text-danger' : ''}`}>{formatRupiah(c.monthlyProfit)}</dd></div>
      </dl>
      <p className="mt-2 text-xs text-ink/70">{STATUS[c.status].note}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Mode & contoh */}
      <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex gap-2" role="group" aria-label="Jenis usaha">
          {([['product', '📦 Produk'], ['service', '🛠️ Jasa']] as const).map(([k, l]) => (
            <button key={k} type="button" aria-pressed={f.mode === k} onClick={() => switchMode(k)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold ${f.mode === k ? 'border-ink bg-ink text-paper' : 'border-line bg-white hover:border-ink'}`}>{l}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-ghost py-1.5 text-sm" onClick={() => loadExample(f.mode)}>✨ Isi contoh</button>
          <button type="button" className="btn-ghost py-1.5 text-sm" onClick={() => clear(f.mode)}>🧹 Kosongkan</button>
        </div>
        {exampleNote && (
          <p className="w-full rounded-2xl bg-amber-soft px-3 py-2 text-xs font-semibold">
            Sedang menampilkan contoh: <strong>{exampleNote}</strong>. Ganti angkanya dengan milikmu, atau klik "Kosongkan" untuk mulai dari nol.
          </p>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* ------------------------------ FORM ------------------------------ */}
        <div className="space-y-5">
          <Step no={1} title={svc ? 'Bahan & aset habis pakai per proyek' : 'Bahan baku untuk 1 batch'}
            desc={svc
              ? 'Hal yang kamu beli dan habis untuk satu proyek (foto stok, font berbayar, bahan cetak). Kosongkan bila tidak ada.'
              : 'Tulis semua bahan untuk SATU kali produksi (1 resep). Harga & isi = sesuai kemasan yang kamu beli; "dipakai" = takaran untuk 1 batch, dengan satuan yang sama.'}>
            {!svc && (
              <div className="max-w-xs">
                <label htmlFor="h-yield" className="label">1 batch menghasilkan berapa unit?</label>
                {numInput('h-yield', f.batchYield, (v) => set('batchYield', v), { suffix: 'unit', err: errs.batchYield })}
                {errs.batchYield ? <p className="err">{errs.batchYield}</p> : <p className="hint">Contoh: 1 resep = 20 cup</p>}
              </div>
            )}
            <div className="space-y-3">
              {f.materials.map((m, i) => {
                const per = (() => {
                  const bp = Number(m.buyPrice), bq = Number(m.buyQty), uq = Number(m.useQty);
                  return bq > 0 && bp >= 0 && uq >= 0 && m.buyPrice !== '' && m.useQty !== '' ? (bp / bq) * uq : null;
                })();
                return (
                  <div key={i} className="rounded-2xl border-2 border-line bg-paper p-3">
                    <div className="flex items-center gap-2">
                      <input className="input flex-1" aria-label={`Nama bahan ${i + 1}`} placeholder={svc ? 'Nama aset (mis. foto stok)' : 'Nama bahan (mis. susu UHT)'}
                        value={m.name} maxLength={60} onChange={(e) => setMat(i, { name: e.target.value })} />
                      <button type="button" className="btn-ghost px-3 py-2 text-sm" aria-label={`Hapus bahan ${i + 1}`}
                        onClick={() => set('materials', f.materials.filter((_, j) => j !== i))}>✕</button>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <div>
                        <span className="text-[11px] font-bold text-muted">Harga beli</span>
                        {numInput(`m-bp-${i}`, m.buyPrice, (v) => setMat(i, { buyPrice: v }), { suffix: 'Rp', label: 'Harga beli', err: errs[`materials.${i}.buyPrice`] })}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-muted">Isi kemasan</span>
                        {numInput(`m-bq-${i}`, m.buyQty, (v) => setMat(i, { buyQty: v }), { label: 'Isi kemasan', err: errs[`materials.${i}.buyQty`] })}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-muted">Satuan</span>
                        <input className="input" aria-label="Satuan" placeholder="g / ml / pcs" maxLength={10} value={m.unit} onChange={(e) => setMat(i, { unit: e.target.value })} />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-muted">Dipakai / {svc ? 'proyek' : 'batch'}</span>
                        {numInput(`m-uq-${i}`, m.useQty, (v) => setMat(i, { useQty: v }), { label: 'Takaran dipakai', err: errs[`materials.${i}.useQty`] })}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      {per !== null
                        ? <>= {formatRupiah(Math.round(per))} per {svc ? 'proyek' : 'batch'}{m.unit && ` (${formatRupiah(Number(m.buyPrice) / Number(m.buyQty))}/${m.unit})`}</>
                        : 'Isi harga, isi kemasan, dan takaran untuk melihat biayanya.'}
                    </p>
                  </div>
                );
              })}
              <button type="button" className="btn-ghost w-full py-2 text-sm" disabled={f.materials.length >= 30}
                onClick={() => set('materials', [...f.materials, { name: '', buyPrice: '', buyQty: '', unit: '', useQty: '' }])}>+ Tambah {svc ? 'aset' : 'bahan'}</button>
            </div>
          </Step>

          <Step no={2} title={svc ? 'Biaya lain per proyek' : 'Kemasan & biaya per unit'}
            desc={svc ? 'Biaya yang muncul setiap mengerjakan satu proyek: transport, kuota, cetak, dsb.' : 'Biaya yang menempel di SETIAP unit: cup, tutup, sedotan, plastik, stiker, kartu ucapan.'}>
            <CostRows rows={f.perUnitCosts} errPrefix="perUnitCosts" errs={errs} placeholder={svc ? 'mis. Transport meeting' : 'mis. Cup + tutup'} suffix={`Rp/${unitWord}`}
              onChange={(i, p) => setCost('perUnitCosts', i, p)} onRemove={(i) => set('perUnitCosts', f.perUnitCosts.filter((_, j) => j !== i))}
              onAdd={() => set('perUnitCosts', [...f.perUnitCosts, { name: '', amount: '' }])} />
          </Step>

          <Step no={3} title="Tenaga kerja (termasuk kamu!)"
            desc="Waktu adalah biaya. Kalau waktumu tidak dihitung, artinya kamu bekerja gratis — dan harga jadi terlalu murah saat nanti perlu bayar orang lain.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="h-hours" className="label">Jam kerja per {svc ? 'proyek' : 'batch'}</label>
                {numInput('h-hours', f.laborHoursPerBatch, (v) => set('laborHoursPerBatch', v), { suffix: 'jam', err: errs.laborHoursPerBatch })}
                <p className="hint">{svc ? 'Termasuk briefing, mengerjakan, revisi' : 'Persiapan, produksi, beres-beres'}</p>
              </div>
              <div>
                <label htmlFor="h-wage" className="label">Upah per jam</label>
                {numInput('h-wage', f.wagePerHour, (v) => set('wagePerHour', v), { suffix: 'Rp', err: errs.wagePerHour })}
                <p className="hint">Patokan: upah yang wajar kalau kamu menyuruh orang lain</p>
              </div>
            </div>
          </Step>

          <Step no={4} title="Biaya tetap bulanan (overhead)"
            desc="Biaya yang tetap dibayar walau sedang sepi: sewa, listrik, gas, internet, langganan aplikasi, penyusutan alat. Biaya ini dibagi ke setiap unit yang terjual.">
            <CostRows rows={f.fixedCosts} errPrefix="fixedCosts" errs={errs} placeholder="mis. Sewa lapak" suffix="Rp/bln"
              onChange={(i, p) => setCost('fixedCosts', i, p)} onRemove={(i) => set('fixedCosts', f.fixedCosts.filter((_, j) => j !== i))}
              onAdd={() => set('fixedCosts', [...f.fixedCosts, { name: '', amount: '' }])} />
            <div className="max-w-xs">
              <label htmlFor="h-units" className="label">Perkiraan {unitWord} terjual per bulan</label>
              {numInput('h-units', f.unitsPerMonth, (v) => set('unitsPerMonth', v), { suffix: unitWord, err: errs.unitsPerMonth })}
              {errs.unitsPerMonth ? <p className="err">{errs.unitsPerMonth}</p> : <p className="hint">Pakai perkiraan yang realistis, jangan yang paling optimis</p>}
            </div>
            <p className="text-xs text-muted">💡 Penyusutan alat = harga alat ÷ umur pakai (bulan). Contoh: blender Rp1,2 juta dipakai 24 bulan = Rp50 ribu/bulan.</p>
          </Step>

          <Step no={5} title="Cara jualan & target laba" desc="Potongan platform dan target laba menentukan harga jual yang sehat.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="h-fee" className="label">Potongan platform / marketplace</label>
                {numInput('h-fee', f.platformFeePct, (v) => set('platformFeePct', v), { suffix: '%', err: errs.platformFeePct })}
                <p className="hint">Komisi ojol/marketplace. Isi 0 bila jual langsung. Cek angka terbaru di aplikasinya.</p>
              </div>
              <div>
                <label htmlFor="h-tx" className="label">Biaya per transaksi</label>
                {numInput('h-tx', f.perTransactionCost, (v) => set('perTransactionCost', v), { suffix: 'Rp', err: errs.perTransactionCost })}
                <p className="hint">Biaya admin/QRIS/ongkir yang kamu tanggung. Isi 0 bila tidak ada.</p>
              </div>
              <div>
                <label htmlFor="h-margin" className="label">Target laba bersih</label>
                {numInput('h-margin', f.targetMarginPct, (v) => set('targetMarginPct', v), { suffix: '%', err: errs.targetMarginPct })}
                {errs.targetMarginPct ? <p className="err">{errs.targetMarginPct}</p> : <p className="hint">Persen dari harga jual. Umumnya 20–40% untuk usaha kecil.</p>}
              </div>
              <div>
                <label htmlFor="h-check" className="label">Harga yang mau dicek (opsional)</label>
                {numInput('h-check', f.checkPrice, (v) => set('checkPrice', v), { suffix: 'Rp' })}
                <p className="hint">Harga yang sedang/akan kamu pakai.</p>
              </div>
            </div>
          </Step>
        </div>

        {/* ------------------------------ HASIL ------------------------------ */}
        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start" aria-live="polite">
          {!r ? (
            <div className="card-pop p-5">
              <h3 className="font-display text-lg font-extrabold">Hasil</h3>
              <p className="mt-2 text-sm text-muted">Ada isian yang perlu dicek dulu:</p>
              <ul className="mt-2 space-y-1 text-sm text-danger">{errList.slice(0, 5).map((e) => <li key={e}>• {e}</li>)}</ul>
            </div>
          ) : (
            <>
              <section className="card-pop p-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted">HPP per {unitWord}</p>
                <div className="mt-1 flex flex-wrap items-end gap-x-6 gap-y-2">
                  <div>
                    <p className="font-display text-4xl font-extrabold">{formatRupiah(r.fullCost)}</p>
                    <p className="text-xs text-muted">biaya penuh (termasuk overhead)</p>
                  </div>
                  <div>
                    <p className="font-display text-xl font-extrabold">{formatRupiah(r.variableCost)}</p>
                    <p className="text-xs text-muted">HPP variabel (bahan + kemasan + tenaga)</p>
                  </div>
                </div>

                <div className="mt-4 flex h-5 overflow-hidden rounded-full border-2 border-ink" role="img"
                  aria-label={r.slices.map((x) => `${x.label} ${x.pct}%`).join(', ')}>
                  {r.slices.filter((x) => x.pct > 0).map((x) => (
                    <div key={x.key} className={`${SLICE_BG[x.key]} border-r-2 border-ink last:border-r-0`} style={{ width: `${x.pct}%` }} />
                  ))}
                </div>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {r.slices.map((x) => (
                    <li key={x.key} className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2"><span className={`h-3 w-3 rounded-sm border border-ink ${SLICE_BG[x.key]}`} />{x.label}</span>
                      <span className="font-bold">{formatRupiah(x.perUnit)} <span className="text-xs font-semibold text-muted">· {x.pct}%</span></span>
                    </li>
                  ))}
                </ul>

                {r.materialLines.length > 0 && (
                  <details className="mt-3 rounded-2xl bg-paper p-3 text-sm">
                    <summary className="cursor-pointer font-bold">Rincian bahan</summary>
                    <table className="mt-2 w-full text-left text-xs">
                      <thead><tr className="text-muted"><th className="py-1 font-semibold">Bahan</th><th className="font-semibold">/{svc ? 'proyek' : 'batch'}</th><th className="font-semibold">/{unitWord}</th></tr></thead>
                      <tbody>
                        {r.materialLines.map((m, i) => (
                          <tr key={i} className="border-t border-line"><td className="py-1">{m.name}</td><td>{formatRupiah(m.perBatch)}</td><td>{formatRupiah(m.perUnit)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                )}
              </section>

              {priceCard('Harga jual rekomendasi', r.recommended, true)}
              <p className="-mt-2 px-1 text-xs text-muted">
                Rumus: (biaya penuh {parsed.success && parsed.data.perTransactionCost > 0 ? '+ biaya per transaksi ' : ''}) ÷ (100% − potongan platform − target laba), dibulatkan ke atas.
              </p>

              {r.check && priceCard('Cek harga kamu', r.check, false)}

              <div className="card p-4">
                <div className="flex flex-wrap gap-2">
                  <CopyButton text={summary} className="btn-accent py-2" />
                  <button type="button" className="btn-ghost py-2" onClick={() => void save()}>Simpan</button>
                  <Link to="/app/toolkit?tab=proposal" className="btn-ghost py-2">Pakai di proposal →</Link>
                </div>
                <p className="mt-3 text-xs text-muted">
                  Simulasi matematis dari angka yang kamu isi (asumsi 30 hari/bulan), bukan prediksi penjualan. Bandingkan juga dengan harga pasar sebelum memutuskan —
                  pelajari di <Link to="/app/belajar/business-101" className="font-bold underline">Business 101</Link>.
                </p>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function CostRows({ rows, errPrefix, errs, placeholder, suffix, onChange, onRemove, onAdd }: {
  rows: CostRow[]; errPrefix: string; errs: Record<string, string>; placeholder: string; suffix: string;
  onChange: (i: number, p: Partial<CostRow>) => void; onRemove: (i: number) => void; onAdd: () => void;
}) {
  return (
    <div className="space-y-2">
      {rows.map((c, i) => (
        <div key={i} className="flex items-start gap-2">
          <input className="input flex-1" aria-label={`Nama biaya ${i + 1}`} placeholder={placeholder} maxLength={60} value={c.name} onChange={(e) => onChange(i, { name: e.target.value })} />
          <div className="relative w-40 shrink-0">
            <input type="number" inputMode="decimal" min={0} aria-label={`Jumlah biaya ${i + 1}`} className="input pr-16" value={c.amount}
              onChange={(e) => onChange(i, { amount: e.target.value })} aria-invalid={!!errs[`${errPrefix}.${i}.amount`]} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted">{suffix}</span>
          </div>
          <button type="button" className="btn-ghost px-3 py-2 text-sm" aria-label={`Hapus biaya ${i + 1}`} onClick={() => onRemove(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="btn-ghost w-full py-2 text-sm" disabled={rows.length >= 20} onClick={onAdd}>+ Tambah baris</button>
    </div>
  );
}
