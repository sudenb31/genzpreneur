import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { PROMPTS, type PromptTemplate } from '../content/prompts';
import { INDUSTRIES } from '../content/industries';
import { TRACKS } from '../content/assessment';
import { SKILLS } from '../lib/passport';
import { getAssessment, getPassport, saveItem } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import { buildProposal, calculateCommission, commissionInputSchema, type ProposalInput } from '../lib/commission';
import { formatRupiah } from '../config/site';
import { buildProblemMap, IMPACT_ZONES, PROBLEM_STEPS, type ProblemMapInput } from '../lib/problemMap';
import { CopyButton, PageHeader, PageSkeleton, useToast } from '../components/ui';

const TABS = [
  { key: 'prompts', label: '⚡ Prompt Library' },
  { key: 'calculator', label: '🧮 Kalkulator Komisi' },
  { key: 'proposal', label: '📄 Template Proposal' },
  { key: 'problem', label: '🧩 Problem Map' },
] as const;
type Tab = (typeof TABS)[number]['key'];

export default function ToolkitPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const tab: Tab = TABS.some((t) => t.key === raw) ? (raw as Tab) : 'prompts';

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Benefit #4 · AI Business Toolkit" title={<>Kerja lebih cepat, <span className="text-amber">tetap jujur</span>.</>}
        desc="Prompt siap pakai untuk ChatGPT/Claude/Gemini, kalkulator komisi yang akurat, dan template proposal — semuanya gratis dipakai." />
      <div role="tablist" aria-label="Alat" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {TABS.map((t) => (
          <button key={t.key} role="tab" type="button" aria-selected={tab === t.key} onClick={() => setParams({ tab: t.key }, { replace: true })}
            className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold ${tab === t.key ? 'border-ink bg-ink text-paper' : 'border-line bg-white hover:border-ink'}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'prompts' && <PromptLibrary />}
      {tab === 'calculator' && <CommissionCalculator />}
      {tab === 'proposal' && <ProposalBuilder />}
      {tab === 'problem' && <ProblemMapTool />}
    </div>
  );
}

/* ------------------------------ Prompt library ------------------------------ */

function PromptLibrary() {
  const { profile } = useAuth();
  const toast = useToast();
  const { data, loading } = useAsync(async () => {
    const [passport, assessment] = await Promise.all([
      getPassport(profile!.uid, profile!.displayName),
      getAssessment(profile!.uid),
    ]);
    return { passport: passport.data, assessment };
  }, [profile?.uid]);
  const [cat, setCat] = useState<'Semua' | PromptTemplate['category']>('Semua');
  const [savingId, setSavingId] = useState<string | null>(null);

  const vars = useMemo(() => {
    const p = data?.passport;
    const skills = p ? SKILLS.filter((s) => (p.skills.levels[s.key] ?? 0) >= 2).map((s) => s.label) : [];
    const a = data?.assessment;
    return {
      industri: a ? INDUSTRIES[a.topIndustries[0]].name : '[industri]',
      jalur: a ? TRACKS[a.track].name : '[jalur]',
      skill: skills.length ? skills.join(', ') : p?.skills.otherSkills || '[skill kamu]',
      kota: p?.personal.city || '[kota]',
    };
  }, [data]);

  const fill = (t: string) => t.replace(/\{(industri|jalur|skill|kota)\}/g, (_, k: keyof typeof vars) => vars[k]);
  const cats = ['Semua', ...Array.from(new Set(PROMPTS.map((p) => p.category)))] as const;
  const list = PROMPTS.filter((p) => cat === 'Semua' || p.category === cat);

  async function save(p: PromptTemplate) {
    if (!profile) return;
    setSavingId(p.id);
    try {
      await saveItem(profile.uid, 'prompt', p.title, fill(p.template));
      toast('success', 'Prompt tersimpan.');
    } catch {
      toast('error', 'Gagal menyimpan.');
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-paper-2 p-4 text-sm">
        <strong>Terisi otomatis:</strong> industri <em>{vars.industri}</em> · jalur <em>{vars.jalur}</em> · skill <em>{vars.skill}</em> · kota <em>{vars.kota}</em>.
        <span className="text-muted"> Lengkapi Passport & Assessment supaya prompt makin personal. Bagian [dalam kurung siku] diisi sendiri.</span>
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Kategori">
        {cats.map((c) => (
          <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${cat === c ? 'bg-amber text-ink' : 'bg-white text-ink/70 hover:text-ink'}`}>{c}</button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <article key={p.id} className="card flex flex-col p-5">
            <span className="w-fit rounded-full bg-lilac px-2.5 py-0.5 text-[11px] font-extrabold">{p.category}</span>
            <h3 className="mt-2 font-display text-lg font-extrabold">{p.title}</h3>
            <p className="text-xs text-muted">Pakai saat: {p.useWhen}</p>
            <pre className="mt-3 max-h-48 flex-1 overflow-auto whitespace-pre-wrap rounded-2xl bg-paper p-3 font-sans text-xs leading-relaxed">{fill(p.template)}</pre>
            <div className="mt-3 flex gap-2">
              <CopyButton text={fill(p.template)} className="btn-accent py-2" />
              <button type="button" className="btn-ghost py-2" disabled={savingId === p.id} onClick={() => void save(p)}>{savingId === p.id ? 'Menyimpan…' : 'Simpan'}</button>
            </div>
          </article>
        ))}
      </div>
      <p className="text-xs text-muted">AI bisa salah. Selalu cek ulang fakta, angka, dan nada pesan sebelum dikirim ke orang lain.</p>
    </div>
  );
}

/* ---------------------------- Commission calculator ---------------------------- */

function CommissionCalculator() {
  const { profile } = useAuth();
  const toast = useToast();
  const [f, setF] = useState({ price: '150000', cost: '90000', commissionPct: '10', basis: 'price' as 'price' | 'profit', units: '20', target: '500000' });
  const num = (s: string) => (s.trim() === '' ? NaN : Number(s));
  const parsed = commissionInputSchema.safeParse({
    price: num(f.price), cost: num(f.cost), commissionPct: num(f.commissionPct), basis: f.basis, units: num(f.units), target: num(f.target),
  });
  const result = parsed.success ? calculateCommission(parsed.data) : null;
  const errs: Record<string, string> = {};
  if (!parsed.success) for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;

  const field = (k: 'price' | 'cost' | 'commissionPct' | 'units' | 'target', label: string, hint: string, suffix?: string) => (
    <div>
      <label htmlFor={`c-${k}`} className="label">{label}</label>
      <div className="relative">
        <input id={`c-${k}`} type="number" inputMode="decimal" min={0} className="input pr-12" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errs[k]} />
        {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted">{suffix}</span>}
      </div>
      {errs[k] ? <p className="err">{errs[k]}</p> : <p className="hint">{hint}</p>}
    </div>
  );

  const summary = result && parsed.success
    ? `Simulasi komisi\nHarga jual: ${formatRupiah(parsed.data.price)} · Modal: ${formatRupiah(parsed.data.cost)} · Komisi ${parsed.data.commissionPct}% dari ${parsed.data.basis === 'price' ? 'harga jual' : 'laba'}\n${parsed.data.units} unit → omzet ${formatRupiah(result.revenue)}, laba kotor ${formatRupiah(result.grossProfit)}, komisimu ${formatRupiah(result.totalCommission)}${result.unitsForTarget ? `\nTarget ${formatRupiah(parsed.data.target)} → perlu ${result.unitsForTarget} unit` : ''}`
    : '';

  async function save() {
    if (!profile || !summary) return;
    try { await saveItem(profile.uid, 'calc', 'Simulasi komisi', summary); toast('success', 'Simulasi tersimpan.'); }
    catch { toast('error', 'Gagal menyimpan.'); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {field('price', 'Harga jual per unit', 'Harga yang dibayar pembeli', 'Rp')}
          {field('cost', 'Modal / HPP per unit', 'Isi 0 bila tidak tahu', 'Rp')}
          {field('commissionPct', 'Komisi', 'Persen yang kamu terima', '%')}
          <fieldset>
            <legend className="label">Komisi dihitung dari</legend>
            <div className="flex gap-2">
              {(['price', 'profit'] as const).map((b) => (
                <button key={b} type="button" aria-pressed={f.basis === b} onClick={() => setF({ ...f, basis: b })}
                  className={`flex-1 rounded-2xl border-2 px-3 py-3 text-sm font-bold ${f.basis === b ? 'border-ink bg-lime' : 'border-line bg-white'}`}>
                  {b === 'price' ? 'Harga jual' : 'Laba'}
                </button>
              ))}
            </div>
          </fieldset>
          {field('units', 'Unit terjual', 'Simulasi jumlah penjualan')}
          {field('target', 'Target komisimu', 'Isi 0 bila tidak ada', 'Rp')}
        </div>
      </section>
      <section className="card-pop p-5" aria-live="polite">
        <h3 className="font-display text-lg font-extrabold">Hasil</h3>
        {result ? (
          <>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['Omzet', result.revenue, 'Harga × unit'],
                ['Laba kotor', result.grossProfit, '(Harga − modal) × unit'],
                ['Komisi / unit', result.commissionPerUnit, ''],
                ['Total komisimu', result.totalCommission, ''],
              ].map(([k, v, d]) => (
                <div key={k as string} className={`rounded-2xl p-3 ${k === 'Total komisimu' ? 'bg-lime' : 'bg-paper'}`}>
                  <dt className="text-xs font-bold text-muted">{k}</dt>
                  <dd className="font-display text-xl font-extrabold">{formatRupiah(v as number)}</dd>
                  {d && <dd className="text-[11px] text-muted">{d}</dd>}
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm">Laba pemilik setelah membayar komisi: <strong>{formatRupiah(result.ownerProfitAfterCommission)}</strong>
              {result.ownerProfitAfterCommission < 0 && <span className="font-bold text-danger"> — rugi! Skema ini tidak masuk akal bagi pemilik.</span>}</p>
            {result.unitsForTarget !== null && (
              <p className="mt-2 rounded-2xl bg-amber-soft p-3 text-sm font-semibold">🎯 Untuk komisi {formatRupiah(parsed.success ? parsed.data.target : 0)} kamu perlu menjual <strong>{result.unitsForTarget} unit</strong>.</p>
            )}
            <div className="mt-4 flex gap-2">
              <CopyButton text={summary} className="btn-accent py-2" />
              <button type="button" className="btn-ghost py-2" onClick={() => void save()}>Simpan</button>
            </div>
            <p className="mt-3 text-xs text-muted">Simulasi matematis, bukan prediksi penjualan. Omzet ≠ laba ≠ komisi.</p>
          </>
        ) : <p className="mt-4 text-sm text-muted">Lengkapi isian yang ditandai untuk melihat hasil.</p>}
      </section>
    </div>
  );
}

/* ------------------------------ Proposal builder ------------------------------ */

function ProposalBuilder() {
  const { profile } = useAuth();
  const toast = useToast();
  const [p, setP] = useState<ProposalInput>({
    myName: profile?.displayName ?? '', myContact: '', client: '', problem: '', service: '',
    deliverables: '', duration: '1 bulan', price: '', scheme: 'fee', revisions: '2 kali',
  });
  const text = useMemo(() => buildProposal(p), [p]);
  const set = <K extends keyof ProposalInput>(k: K, v: ProposalInput[K]) => setP((s) => ({ ...s, [k]: v }));

  async function save() {
    if (!profile) return;
    try { await saveItem(profile.uid, 'proposal', `Proposal · ${p.client.trim() || 'tanpa nama'}`, text); toast('success', 'Proposal tersimpan.'); }
    catch { toast('error', 'Gagal menyimpan.'); }
  }

  const input = (k: keyof ProposalInput, label: string, ph: string, area = false) => (
    <div>
      <label htmlFor={`p-${k}`} className="label">{label}</label>
      {area
        ? <textarea id={`p-${k}`} rows={3} className="input" placeholder={ph} value={p[k] as string} maxLength={600} onChange={(e) => set(k, e.target.value as never)} />
        : <input id={`p-${k}`} className="input" placeholder={ph} value={p[k] as string} maxLength={120} onChange={(e) => set(k, e.target.value as never)} />}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card space-y-4 p-5">
        <fieldset>
          <legend className="label">Skema</legend>
          <div className="flex flex-wrap gap-2">
            {([['fee', 'Fee tetap'], ['commission', 'Komisi'], ['pilot', 'Uji coba gratis']] as const).map(([k, l]) => (
              <button key={k} type="button" aria-pressed={p.scheme === k} onClick={() => set('scheme', k)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-bold ${p.scheme === k ? 'border-ink bg-lime' : 'border-line bg-white'}`}>{l}</button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          {input('myName', 'Nama kamu', 'Nama lengkap')}
          {input('myContact', 'Kontak', 'WA / email')}
          {input('client', 'Nama bisnis klien', 'Kopi Senja')}
          {input('duration', 'Durasi', '1 bulan')}
          {input('price', p.scheme === 'commission' ? 'Persen komisi' : 'Harga', p.scheme === 'commission' ? '10% dari harga jual' : 'Rp750.000')}
          {input('revisions', 'Revisi', '2 kali')}
        </div>
        {input('problem', 'Masalah yang kamu amati', 'Menu di aplikasi ojol belum ada foto…', true)}
        {input('service', 'Layanan yang kamu usulkan', 'Foto menu + update 3x seminggu…', true)}
        <div>
          <label htmlFor="p-deliverables" className="label">Rincian pekerjaan (satu per baris)</label>
          <textarea id="p-deliverables" rows={4} className="input" maxLength={800} placeholder={'Foto 10 menu terlaris\n12 posting feed\nLaporan singkat akhir bulan'}
            value={p.deliverables} onChange={(e) => set('deliverables', e.target.value)} />
        </div>
      </section>
      <section className="card-pop flex flex-col p-5">
        <h3 className="font-display text-lg font-extrabold">Pratinjau</h3>
        <pre className="mt-3 flex-1 overflow-auto whitespace-pre-wrap rounded-2xl bg-paper p-4 font-sans text-sm leading-relaxed">{text}</pre>
        <div className="mt-4 flex gap-2">
          <CopyButton text={text} className="btn-accent" />
          <button type="button" className="btn-ghost" onClick={() => void save()}>Simpan</button>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------ Problem Map ------------------------------ */

function ProblemMapTool() {
  const { profile } = useAuth();
  const toast = useToast();
  const [p, setP] = useState<ProblemMapInput>({
    title: '', phenomenon: '', coreProblem: '', rootCause: '', impact: '', affected: '', firstStep: '', zone: 'economy', validation: '',
  });
  const text = useMemo(() => buildProblemMap(p), [p]);
  const filled = PROBLEM_STEPS.filter((s) => p[s.key].trim()).length;

  async function save() {
    if (!profile) return;
    try { await saveItem(profile.uid, 'problem', `Problem Map · ${p.title.trim() || p.phenomenon.trim().slice(0, 40) || 'tanpa judul'}`, text); toast('success', 'Problem Map tersimpan.'); }
    catch { toast('error', 'Gagal menyimpan.'); }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card space-y-4 p-5">
        <p className="text-sm text-ink/70">Dari keresahan → peluang. Isi berurutan dan gali sampai akar. Pelajari dulu di modul <Link className="font-bold underline" to="/app/belajar/read-the-game">Read The Game</Link>.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pm-title" className="label">Judul</label>
            <input id="pm-title" className="input" maxLength={80} value={p.title} placeholder="UMKM kuliner sepi di aplikasi" onChange={(e) => setP({ ...p, title: e.target.value })} />
          </div>
          <div>
            <label htmlFor="pm-zone" className="label">Zona dampak</label>
            <select id="pm-zone" className="input" value={p.zone} onChange={(e) => setP({ ...p, zone: e.target.value as ProblemMapInput['zone'] })}>
              {IMPACT_ZONES.map((z) => <option key={z.key} value={z.key}>{z.emoji} {z.name}</option>)}
            </select>
          </div>
        </div>
        {PROBLEM_STEPS.map((s, i) => (
          <div key={s.key}>
            <label htmlFor={`pm-${s.key}`} className="label">{i + 1}. {s.label} <span className="font-normal text-muted">— {s.q}</span></label>
            <textarea id={`pm-${s.key}`} rows={2} className="input" maxLength={300} placeholder={s.ph} value={p[s.key]} onChange={(e) => setP({ ...p, [s.key]: e.target.value })} />
          </div>
        ))}
      </section>
      <section className="card-pop flex flex-col p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-extrabold">Hasil</h3>
          <span className="chip">{filled}/{PROBLEM_STEPS.length}</span>
        </div>
        <pre className="mt-3 flex-1 overflow-auto whitespace-pre-wrap rounded-2xl bg-paper p-4 font-sans text-sm leading-relaxed">{text}</pre>
        {p.firstStep.trim() && (
          <p className="mt-3 rounded-2xl bg-lime p-3 text-sm font-semibold">💡 Langkah awalmu bisa jadi penawaran pertama. Lanjutkan ke Outreach Studio untuk menawarkannya.</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton text={text} className="btn-accent" />
          <button type="button" className="btn-ghost" onClick={() => void save()}>Simpan</button>
          <Link className="btn-ghost" to="/app/outreach?skenario=service_offer">Tawarkan →</Link>
        </div>
      </section>
    </div>
  );
}
