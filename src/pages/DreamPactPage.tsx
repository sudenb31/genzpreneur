import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getDreamPact, saveDreamPact } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import { fieldErrors } from '../lib/passport';
import {
  dreamPactProgress, dreamPactSchema, dreamStatement, edgeStatement, LEVELS, milestoneTimeline, MONTHS,
  PLAN_CATS, SKILL_BRANCHES, whyStatement, type DreamPact, type PlanRow,
} from '../lib/dreamPact';
import { ErrorState, PageHeader, PageSkeleton, ProgressBar, useToast } from '../components/ui';

const STEPS = [
  { key: 'why', label: '1. Why', emoji: '🔥' },
  { key: 'edge', label: '2. Edge', emoji: '⚔️' },
  { key: 'dream', label: '3. Dream', emoji: '🌟' },
  { key: 'milestones', label: '4. Milestone', emoji: '🗺️' },
  { key: 'skillTree', label: '5. Skill Tree', emoji: '🌳' },
  { key: 'plan', label: '6. Plan 12 Bulan', emoji: '📅' },
  { key: 'commit', label: '7. Commit', emoji: '✍️' },
] as const;
type StepKey = (typeof STEPS)[number]['key'];

function F({ id, label, hint, err, children }: { id: string; label: string; hint?: string; err?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {err ? <p className="err">{err}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

function Statement({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border-2 border-ink bg-ink p-5 text-paper">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-lime">{title}</p>
      <p className="mt-2 font-display text-xl font-bold leading-snug">{text}</p>
    </div>
  );
}

export default function DreamPactPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { data: record, loading, error, reload } = useAsync(() => getDreamPact(profile!.uid, profile!.displayName), [profile?.uid]);
  const [d, setD] = useState<DreamPact | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const stepParam = params.get('langkah') as StepKey | null;
  const step: StepKey = stepParam && STEPS.some((s) => s.key === stepParam) ? stepParam : 'why';
  const go = (s: StepKey) => { setParams({ langkah: s }, { replace: true }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  useEffect(() => { if (record) setD(record.data); }, [record]);
  const dirty = useMemo(() => !!d && !!record && JSON.stringify(d) !== JSON.stringify(record.data), [d, record]);
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  if (loading || (!d && !error)) return <PageSkeleton />;
  if (error || !record || !d) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const set = <K extends keyof DreamPact>(k: K, patch: Partial<DreamPact[K]>) =>
    setD((x) => (x ? { ...x, [k]: { ...(x[k] as object), ...patch } } : x));
  const setPlan = (plan: PlanRow[]) => setD((x) => (x ? { ...x, plan } : x));
  const num = (s: string) => (s.trim() === '' ? null : Number(s));
  const { pct, parts } = dreamPactProgress(d);
  const year = new Date().getFullYear();
  let timeline: ReturnType<typeof milestoneTimeline> | null = null;
  try {
    if (d.dream.currentAge && d.dream.dreamAge) timeline = milestoneTimeline(d.dream.currentAge, d.dream.dreamAge, year);
  } catch { timeline = null; }

  async function save(then?: () => void) {
    if (!profile || !d || !record) return;
    const parsed = dreamPactSchema.safeParse(d);
    if (!parsed.success) {
      const fe = fieldErrors(parsed.error);
      setErrors(fe);
      const first = Object.keys(fe)[0]?.split('.')[0] as StepKey | undefined;
      if (first && STEPS.some((s) => s.key === first)) go(first);
      toast('error', 'Ada isian yang perlu diperbaiki.');
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await saveDreamPact(profile.uid, parsed.data, !record.exists);
      await reload();
      toast('success', 'Dream Pact tersimpan 🔥');
      then?.();
    } catch (e) {
      console.error(e);
      toast('error', 'Gagal menyimpan. Periksa koneksi lalu coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  const idx = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="space-y-6 pb-24">
      <PageHeader eyebrow="Final Boss · Dream Pact" title={<>Kontrak Mimpi <span className="text-amber">kamu</span>.</>}
        desc="Komitmen tertulis untuk mimpi bisnismu: alasan, kekuatan, mimpi, milestone, dan janji harian. Selesaikan, cetak, lalu tempel di tempat yang paling sering kamu lihat."
        right={<div className="w-full sm:w-60"><ProgressBar value={pct} label="Kelengkapan" /></div>} />

      <div role="tablist" aria-label="Langkah Dream Pact" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {STEPS.map((s) => (
          <button key={s.key} role="tab" type="button" aria-selected={step === s.key} onClick={() => go(s.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-sm font-bold ${
              step === s.key ? 'border-ink bg-ink text-paper' : parts[s.key] ? 'border-ink bg-lime' : 'border-line bg-white hover:border-ink'}`}>
            <span aria-hidden>{parts[s.key] ? '✓' : s.emoji}</span>{s.label}
          </button>
        ))}
      </div>

      <section className="card-pop space-y-5 p-6">
        {step === 'why' && (
          <>
            <div>
              <h2 className="font-display text-2xl font-extrabold">🔥 Personal WHY</h2>
              <p className="text-sm text-ink/70">Alasan yang bikin kamu tetap jalan saat capek. Pelajari dulu di modul <Link className="font-bold underline" to="/app/belajar/why-engine">Why Engine</Link>.</p>
            </div>
            <F id="w-concern" label="Keresahan — masalah apa yang secara pribadi bikin kamu gelisah?" err={errors['why.concern']}>
              <textarea id="w-concern" rows={2} className="input" value={d.why.concern} onChange={(e) => set('why', { concern: e.target.value })} placeholder="Banyak UMKM di sekitarku tutup karena nggak bisa jualan online…" />
            </F>
            <F id="w-belief" label="Keyakinan — apa yang kamu percaya benar tentang masalah itu?" err={errors['why.belief']}>
              <textarea id="w-belief" rows={2} className="input" value={d.why.belief} onChange={(e) => set('why', { belief: e.target.value })} placeholder="Usaha kecil layak naik kelas kalau dibantu dengan tepat…" />
            </F>
            <div className="grid gap-4 sm:grid-cols-2">
              <F id="w-people" label="Siapa yang kamu layani? *" err={errors['why.people']}>
                <input id="w-people" className="input" value={d.why.people} onChange={(e) => set('why', { people: e.target.value })} placeholder="UMKM keluarga di kotaku" />
              </F>
              <F id="w-action" label="Kontribusi yang kamu jalankan *" err={errors['why.action']}>
                <input id="w-action" className="input" value={d.why.action} onChange={(e) => set('why', { action: e.target.value })} placeholder="membantu mereka berjualan online dengan rapi" />
              </F>
            </div>
            <F id="w-impact" label="Dampak yang ingin kamu hadirkan *" err={errors['why.impact']}>
              <input id="w-impact" className="input" value={d.why.impact} onChange={(e) => set('why', { impact: e.target.value })} placeholder="mereka bertahan dan bisa membuka lapangan kerja" />
            </F>
            <Statement title="Personal WHY-mu" text={whyStatement(d)} />
          </>
        )}

        {step === 'edge' && (
          <>
            <div>
              <h2 className="font-display text-2xl font-extrabold">⚔️ Edge — senjata utamamu</h2>
              <p className="text-sm text-ink/70">Kekuatan apa yang kamu pakai untuk mewujudkan WHY? Lihat modul <Link className="font-bold underline" to="/app/belajar/find-your-edge">Find Your Edge</Link>.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <F id="e-strength" label="Kekuatan utama *" hint="Main Weapon-mu"><input id="e-strength" className="input" value={d.edge.strength} onChange={(e) => set('edge', { strength: e.target.value })} placeholder="komunikasi & visual" /></F>
              <F id="e-mastery" label="Keahlian yang terus kamu asah"><input id="e-mastery" className="input" value={d.edge.mastery} onChange={(e) => set('edge', { mastery: e.target.value })} placeholder="desain konten & copywriting" /></F>
              <F id="e-role" label="Peran yang kamu ambil *"><input id="e-role" className="input" value={d.edge.role} onChange={(e) => set('edge', { role: e.target.value })} placeholder="marketing partner UMKM" /></F>
              <F id="e-problem" label="Masalah yang kamu bantu selesaikan"><input id="e-problem" className="input" value={d.edge.problem} onChange={(e) => set('edge', { problem: e.target.value })} placeholder="jualan online yang sepi dan tidak konsisten" /></F>
            </div>
            <Statement title="Edge Statement" text={edgeStatement(d)} />
          </>
        )}

        {step === 'dream' && (
          <>
            <div>
              <h2 className="font-display text-2xl font-extrabold">🌟 Dream Statement</h2>
              <p className="text-sm text-ink/70">Mimpi yang ditulis jadi tujuan. Tujuan yang diberi waktu jadi rencana.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <F id="d-age" label="Usiamu sekarang *" err={errors['dream.currentAge']}>
                <input id="d-age" type="number" inputMode="numeric" min={13} max={80} className="input" value={d.dream.currentAge ?? ''} onChange={(e) => set('dream', { currentAge: num(e.target.value) })} />
              </F>
              <F id="d-dage" label="Di usia berapa mimpimu tercapai? *" err={errors['dream.dreamAge']}>
                <input id="d-dage" type="number" inputMode="numeric" min={14} max={100} className="input" value={d.dream.dreamAge ?? ''} onChange={(e) => set('dream', { dreamAge: num(e.target.value) })} />
              </F>
            </div>
            <F id="d-build" label="Apa yang kamu bangun? *"><input id="d-build" className="input" value={d.dream.build} onChange={(e) => set('dream', { build: e.target.value })} placeholder="agensi marketing yang membina 1.000 UMKM" /></F>
            <div className="grid gap-4 sm:grid-cols-2">
              <F id="d-who" label="Siapa yang merasakan manfaatnya? *"><input id="d-who" className="input" value={d.dream.who} onChange={(e) => set('dream', { who: e.target.value })} placeholder="UMKM dan anak muda di Indonesia" /></F>
              <F id="d-feel" label="Apa yang mereka rasakan?"><input id="d-feel" className="input" value={d.dream.feel} onChange={(e) => set('dream', { feel: e.target.value })} placeholder="usaha yang naik kelas dan pekerjaan yang layak" /></F>
            </div>
            <F id="d-remember" label="Kalau namamu disebut suatu hari, kamu ingin dikenang sebagai…"><input id="d-remember" className="input" value={d.dream.rememberedAs} onChange={(e) => set('dream', { rememberedAs: e.target.value })} placeholder="orang yang membuat UMKM berani go digital" /></F>
            <Statement title="Dream Statement" text={dreamStatement(d)} />
          </>
        )}

        {step === 'milestones' && (
          <>
            <div>
              <h2 className="font-display text-2xl font-extrabold">🗺️ Milestone Map</h2>
              <p className="text-sm text-ink/70">Hitung mundur dari mimpimu. Usia & tahun dihitung otomatis dari langkah Dream.</p>
            </div>
            {!timeline && (
              <p className="rounded-2xl bg-amber-soft px-4 py-3 text-sm font-semibold text-amber-ink">
                Isi usiamu sekarang dan usia target di langkah <button type="button" className="underline" onClick={() => go('dream')}>Dream</button> supaya tahun tiap level muncul.
              </p>
            )}
            <ol className="space-y-3">
              {[...LEVELS].reverse().map((l) => {
                const tm = timeline?.find((x) => x.key === l.key);
                return (
                  <li key={l.key} className="rounded-3xl border-2 border-ink/15 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-display text-lg font-extrabold"><span aria-hidden>{l.emoji}</span> {l.name}</p>
                      {tm && <span className="chip bg-lime">Usia {tm.age} · {tm.year}</span>}
                    </div>
                    <label htmlFor={`m-${l.key}`} className="mt-1 block text-xs text-muted">{l.hint}</label>
                    <input id={`m-${l.key}`} className="input mt-2" value={d.milestones[l.key]} onChange={(e) => set('milestones', { [l.key]: e.target.value })}
                      placeholder={l.key === 'unlocked' ? (d.dream.build || 'Dream Statement tercapai') : 'Target konkret di level ini'} />
                  </li>
                );
              })}
            </ol>
          </>
        )}

        {step === 'skillTree' && (
          <>
            <div>
              <h2 className="font-display text-2xl font-extrabold">🌳 Skill Tree</h2>
              <p className="text-sm text-ink/70">Kurikulum pribadimu. Satu item per baris. Keempat cabang harus terisi.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {SKILL_BRANCHES.map((b) => (
                <F key={b.key} id={`s-${b.key}`} label={`${b.emoji} ${b.name} — ${b.desc}`}>
                  <textarea id={`s-${b.key}`} rows={5} className="input" value={d.skillTree[b.key]} placeholder={b.ph}
                    onChange={(e) => set('skillTree', { [b.key]: e.target.value })} />
                </F>
              ))}
            </div>
          </>
        )}

        {step === 'plan' && (
          <>
            <div>
              <h2 className="font-display text-2xl font-extrabold">📅 Plan 12 Bulan</h2>
              <p className="text-sm text-ink/70">Bagi agendamu ke Level Up, Cuan, dan Impact. Lebih baik sedikit tapi selesai.</p>
            </div>
            {errors.plan && <p className="err">{errors.plan}</p>}
            <div className="space-y-3">
              {d.plan.map((r, i) => (
                <div key={i} className="grid gap-2 rounded-3xl border-2 border-ink/15 p-3 sm:grid-cols-[130px_1fr_1fr_150px_auto] sm:items-center">
                  <label className="sr-only" htmlFor={`p-cat-${i}`}>Kategori</label>
                  <select id={`p-cat-${i}`} className="input py-2.5" value={r.cat} onChange={(e) => setPlan(d.plan.map((x, j) => (j === i ? { ...x, cat: e.target.value as PlanRow['cat'] } : x)))}>
                    {PLAN_CATS.map((c) => <option key={c.key} value={c.key}>{c.emoji} {c.name}</option>)}
                  </select>
                  <label className="sr-only" htmlFor={`p-prog-${i}`}>Program</label>
                  <input id={`p-prog-${i}`} className="input py-2.5" placeholder="Program (mis. kursus digital marketing)" value={r.program} maxLength={100}
                    onChange={(e) => setPlan(d.plan.map((x, j) => (j === i ? { ...x, program: e.target.value } : x)))} />
                  <label className="sr-only" htmlFor={`p-tgt-${i}`}>Target</label>
                  <input id={`p-tgt-${i}`} className="input py-2.5" placeholder="Target terukur" value={r.target} maxLength={100}
                    onChange={(e) => setPlan(d.plan.map((x, j) => (j === i ? { ...x, target: e.target.value } : x)))} />
                  <label className="sr-only" htmlFor={`p-mon-${i}`}>Bulan</label>
                  <select id={`p-mon-${i}`} className="input py-2.5" value={r.month} onChange={(e) => setPlan(d.plan.map((x, j) => (j === i ? { ...x, month: e.target.value } : x)))}>
                    <option value="">Bulan…</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                    <option value="Sepanjang tahun">Sepanjang tahun</option>
                  </select>
                  <button type="button" className="btn-ghost px-3 py-2" aria-label={`Hapus agenda ${i + 1}`} disabled={d.plan.length <= 1}
                    onClick={() => setPlan(d.plan.filter((_, j) => j !== i))}>✕</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn-ghost" disabled={d.plan.length >= 15}
              onClick={() => setPlan([...d.plan, { cat: 'levelup', program: '', target: '', month: '' }])}>+ Tambah agenda</button>
          </>
        )}

        {step === 'commit' && (
          <>
            <div>
              <h2 className="font-display text-2xl font-extrabold">✍️ Commit</h2>
              <p className="text-sm text-ink/70">Janji kecil yang konsisten mengalahkan semangat besar yang sesaat.</p>
            </div>
            <F id="c-daily" label="Janji harian *" hint="Aksi kecil yang kamu lakukan setiap hari"><input id="c-daily" className="input" value={d.commit.daily} onChange={(e) => set('commit', { daily: e.target.value })} placeholder="1 jam belajar/berkarya + 1 pesan outreach" /></F>
            <F id="c-weekly" label="Janji mingguan"><input id="c-weekly" className="input" value={d.commit.weekly} onChange={(e) => set('commit', { weekly: e.target.value })} placeholder="Hubungi 10 calon klien & review progres tiap Minggu malam" /></F>
            <div className="grid gap-4 sm:grid-cols-3">
              <F id="c-buddy" label="Accountability buddy" hint="Teman yang menagih janjimu"><input id="c-buddy" className="input" value={d.commit.buddy} onChange={(e) => set('commit', { buddy: e.target.value })} /></F>
              <F id="c-name" label="Nama yang bertanda tangan *"><input id="c-name" className="input" value={d.commit.signName} onChange={(e) => set('commit', { signName: e.target.value })} /></F>
              <F id="c-date" label="Tanggal komitmen *"><input id="c-date" type="date" className="input" value={d.commit.signDate} onChange={(e) => set('commit', { signDate: e.target.value })} /></F>
            </div>
            <div className="rounded-3xl bg-lime p-5 text-sm">
              <p className="font-extrabold">Ikrar Dream Pact</p>
              <p className="mt-1">Aku berkomitmen menjalankan rencana ini dengan jujur dan konsisten, menepati janji kecil setiap hari, dan memperbaikinya setiap bulan — sampai mimpi ini terwujud.</p>
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-5">
          {idx > 0 && <button type="button" className="btn-ghost" onClick={() => go(STEPS[idx - 1].key)}>← Sebelumnya</button>}
          {idx < STEPS.length - 1 && <button type="button" className="btn-ghost" onClick={() => go(STEPS[idx + 1].key)}>Berikutnya →</button>}
          <button type="button" className="btn-primary ml-auto" disabled={saving || (!dirty && record.exists)} onClick={() => void save()}>
            {saving ? 'Menyimpan…' : dirty || !record.exists ? 'Simpan' : 'Tersimpan'}
          </button>
        </div>
      </section>

      <section className="card-pop flex flex-col gap-3 bg-amber p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-extrabold">🖨️ Cetak Dream Pact-mu</h2>
          <p className="text-sm">Versi A4 dengan kolom tanda tangan — print atau simpan sebagai PDF.</p>
        </div>
        <button type="button" className="btn-primary shrink-0" disabled={saving}
          onClick={() => (dirty || !record.exists ? void save(() => navigate('/cetak/dream-pact')) : navigate('/cetak/dream-pact'))}>
          {dirty ? 'Simpan & cetak' : 'Buka versi cetak'}
        </button>
      </section>

      {dirty && (
        <div className="save-reminder fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border-2 border-ink bg-ink px-4 py-3 text-sm text-paper shadow-[4px_4px_0_0_#ff5a1f] lg:left-[264px]">
          <span>Ada perubahan yang belum disimpan.</span>
          <button type="button" className="btn-accent py-1.5" onClick={() => void save()} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
        </div>
      )}
    </div>
  );
}
