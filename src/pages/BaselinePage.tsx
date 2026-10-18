import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getBaseline, saveBaseline, setChosenEntry } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import {
  answeredSteps, CUSTOMER_CLARITY, DEVICES, DIM_LABEL, DIM_STATUS_LABEL, ENTRIES, EXAMPLE_RELEVANCE, EXAMPLE_STATUS, EXPERIENCE,
  GOALS, HOURS, prerequisiteCheck, recommendEntry, SKILL_AREAS, STEPS, TASK_CONFIDENCE,
  type BaselineAnswers, type DimStatus, type EntryKey,
} from '../lib/baseline';
import { ErrorState, PageHeader, PageSkeleton, useToast } from '../components/ui';

const STATUS_CLS: Record<DimStatus, string> = { ok: 'bg-lime', partial: 'bg-sky', unclear: 'bg-amber-soft', gap: 'bg-paper-2' };

/* ------------------------------ Komponen input ------------------------------ */

function Choice<T extends string>({ name, legend, hint, options, value, onChange }: {
  name: string; legend: string; hint?: string; options: readonly { value: T; label: string }[]; value: T | ''; onChange: (v: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="label">{legend}</legend>
      {hint && <p className="hint -mt-1">{hint}</p>}
      <div className="grid gap-2">
        {options.map((o) => (
          <label key={o.value} className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 text-sm font-semibold focus-within:ring-2 focus-within:ring-ink ${value === o.value ? 'border-ink bg-lime' : 'border-line bg-white hover:border-ink'}`}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="h-4 w-4 accent-ink" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Multi<T extends string>({ legend, hint, options, values, onChange }: {
  legend: string; hint?: string; options: readonly { value: T; label: string }[]; values: T[]; onChange: (v: T[]) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="label">{legend}</legend>
      {hint && <p className="hint -mt-1">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = values.includes(o.value);
          return (
            <label key={o.value} className={`flex cursor-pointer items-center gap-2 rounded-full border-2 px-3 py-1.5 text-sm font-semibold focus-within:ring-2 focus-within:ring-ink ${on ? 'border-ink bg-lime' : 'border-line bg-white hover:border-ink'}`}>
              <input type="checkbox" checked={on} className="h-4 w-4 accent-ink" onChange={() => onChange(on ? values.filter((v) => v !== o.value) : [...values, o.value])} />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Text({ id, label, hint, value, max, rows = 2, onChange, placeholder }: {
  id: string; label: string; hint?: string; value: string; max: number; rows?: number; onChange: (v: string) => void; placeholder?: string;
}) {
  const over = value.length > max;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <textarea id={id} rows={rows} className="input" value={value} placeholder={placeholder} aria-invalid={over}
        aria-describedby={`${id}-hint`} onChange={(e) => onChange(e.target.value)} />
      <p id={`${id}-hint`} className={over ? 'err' : 'hint'}>{over ? `Terlalu panjang (${value.length}/${max}).` : `${hint ? `${hint} · ` : ''}${value.length}/${max}`}</p>
    </div>
  );
}

const PRIVACY = 'Jangan tulis nama, kontak, atau data rahasia pelanggan/bisnis lain. Cukup jenis bisnisnya.';

/* ------------------------------ Halaman ------------------------------ */

export default function BaselinePage() {
  const { profile } = useAuth();
  const toast = useToast();
  const { data: rec, loading, error, reload } = useAsync(() => getBaseline(profile!.uid), [profile?.uid]);
  const [answers, setAnswers] = useState<BaselineAnswers | null>(null);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'form' | 'result' | null>(null);
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState<EntryKey | null>(null);
  const [chosen, setChosen] = useState<EntryKey | null>(null);
  const [exists, setExists] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!rec) return;
    setAnswers(rec.answers);
    setStep(Math.min(rec.step, STEPS.length - 1));
    setChosen(rec.chosenEntry);
    setExists(rec.exists);
    setCompleted(rec.status === 'complete');
    setMode(rec.status === 'complete' ? 'result' : 'form');
  }, [rec]);

  const result = useMemo(() => (answers ? recommendEntry(answers) : null), [answers]);

  if (loading || (!answers && !error)) return <PageSkeleton />;
  if (error || !rec || !answers || !result || !mode) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const set = <K extends keyof BaselineAnswers>(k: K, v: BaselineAnswers[K]) => setAnswers((x) => (x ? { ...x, [k]: v } : x));
  const tooLong = [answers.goalNote, answers.skillsOther, answers.smallTask, answers.exampleDesc, answers.customerType, answers.customerProblem, answers.experienceNote, answers.constraints]
    .some((t, i) => t.length > [300, 150, 300, 400, 200, 300, 300, 300][i]);

  async function persist(nextStep: number, complete: boolean) {
    if (!profile || !answers) return false;
    if (tooLong) { toast('error', 'Ada jawaban yang terlalu panjang. Persingkat dulu.'); return false; }
    setSaving(true);
    try {
      // Sudah pernah selesai → setiap simpan ikut memperbarui hasil tersimpan agar tetap sesuai jawaban.
      await saveBaseline(profile.uid, { answers, step: nextStep, complete: complete || completed, isNew: !exists });
      setExists(true);
      if (complete) setCompleted(true);
      return true;
    } catch (e) {
      console.error('Gagal menyimpan kondisi awal'); // jawaban peserta sengaja tidak dicatat di log
      void e;
      toast('error', 'Gagal menyimpan. Periksa koneksi lalu coba lagi — jawabanmu masih ada di layar.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function next() {
    const last = step === STEPS.length - 1;
    const ok = await persist(last ? step : step + 1, last);
    if (!ok) return;
    if (last) { setMode('result'); toast('success', 'Tersimpan. Ini rekomendasi awalmu.'); }
    else setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveAndExit() {
    if (await persist(step, false)) toast('success', 'Draf tersimpan. Kamu bisa melanjutkan kapan saja.');
  }

  async function choose(entry: EntryKey | null) {
    if (!profile) return;
    setSaving(true);
    try {
      await setChosenEntry(profile.uid, entry);
      setChosen(entry);
      setPicking(null);
      toast('success', entry ? `Titik masuk diubah ke: ${ENTRIES[entry].title}. Progres lamamu tidak berubah.` : 'Kembali mengikuti rekomendasi.');
    } catch {
      toast('error', 'Gagal menyimpan pilihan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  const done = answeredSteps(answers);

  /* ------------------------------ FORM ------------------------------ */
  if (mode === 'form') {
    const s = STEPS[step];
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <PageHeader eyebrow="Kondisi awal" title={<>Mulai dari <span className="text-amber">posisimu sekarang</span>.</>}
          desc="±5 menit. Semua pertanyaan boleh dijawab “belum tahu”. Jawabanmu dipakai untuk menyarankan satu langkah berikutnya — bukan untuk menilai kemampuanmu." />

        <nav aria-label="Langkah" className="flex flex-wrap gap-1.5">
          {STEPS.map((x, i) => (
            <button key={x.key} type="button" onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined}
              className={`rounded-full border-2 px-3 py-1 text-xs font-bold ${i === step ? 'border-ink bg-ink text-paper' : done[i] ? 'border-ink bg-lime' : 'border-line bg-white'}`}>
              {i + 1}. {x.title}
            </button>
          ))}
        </nav>
        <p className="text-xs font-bold text-muted">{done.filter(Boolean).length}/{STEPS.length} langkah terjawab · tersimpan otomatis tiap klik “Simpan”</p>

        <form className="card space-y-5 p-5 sm:p-6" onSubmit={(e) => { e.preventDefault(); void next(); }} noValidate>
          <h2 className="font-display text-2xl font-extrabold">{step + 1}. {s.title}</h2>

          {s.key === 'goal' && (
            <>
              <Choice name="goal" legend="Apa tujuanmu ikut program ini?" options={GOALS} value={answers.goal} onChange={(v) => set('goal', v)} />
              <Text id="goalNote" label="Ceritakan singkat (opsional)" value={answers.goalNote} max={300} onChange={(v) => set('goalNote', v)} />
            </>
          )}

          {s.key === 'skills' && (
            <>
              <Multi legend="Skill yang menurutmu sudah kamu punya" hint="Pilih yang kamu rasa bisa — boleh kosong." options={SKILL_AREAS} values={answers.skills} onChange={(v) => set('skills', v)} />
              <Text id="skillsOther" label="Skill lain (opsional)" value={answers.skillsOther} max={150} rows={1} onChange={(v) => set('skillsOther', v)} />
              <Text id="smallTask" label="Satu pekerjaan kecil yang bisa kamu selesaikan sekarang" hint="Contoh: desain 3 postingan promo, edit 1 video 30 detik, rapikan daftar menu" value={answers.smallTask} max={300} onChange={(v) => set('smallTask', v)} />
              <Choice name="taskConfidence" legend="Seberapa yakin kamu bisa mengerjakannya?" options={TASK_CONFIDENCE} value={answers.taskConfidence} onChange={(v) => set('taskConfidence', v)} />
            </>
          )}

          {s.key === 'example' && (
            <>
              <Choice name="exampleStatus" legend="Punya contoh hasil kerja?" hint="Contoh latihan atau fiktif boleh. Jangan membuat pekerjaan gratis untuk calon pelanggan hanya demi contoh." options={EXAMPLE_STATUS} value={answers.exampleStatus} onChange={(v) => set('exampleStatus', v)} />
              {answers.exampleStatus !== 'none' && answers.exampleStatus !== '' && (
                <>
                  <Text id="exampleDesc" label="Jelaskan contohnya (opsional)" hint="Cukup deskripsi atau link publik — tidak perlu upload file" value={answers.exampleDesc} max={400} onChange={(v) => set('exampleDesc', v)} />
                  <Choice name="exampleRelevance" legend="Apakah contoh itu sesuai dengan bantuan yang ingin kamu tawarkan?" options={EXAMPLE_RELEVANCE} value={answers.exampleRelevance} onChange={(v) => set('exampleRelevance', v)} />
                </>
              )}
            </>
          )}

          {s.key === 'customer' && (
            <>
              <p className="rounded-2xl bg-amber-soft p-3 text-xs font-semibold">🔒 {PRIVACY}</p>
              <Text id="customerType" label="Jenis bisnis yang ingin kamu bantu (opsional)" hint="Contoh: warung makan, kedai kopi, toko baju online" value={answers.customerType} max={200} rows={1} onChange={(v) => set('customerType', v)} />
              <Text id="customerProblem" label="Masalah yang kamu tahu mereka alami (opsional)" hint="Contoh: foto menu di aplikasi gelap & tidak menarik" value={answers.customerProblem} max={300} onChange={(v) => set('customerProblem', v)} />
              <Choice name="customerClarity" legend="Seberapa jelas calon penerima bantuan & masalahnya?" options={CUSTOMER_CLARITY} value={answers.customerClarity} onChange={(v) => set('customerClarity', v)} />
            </>
          )}

          {s.key === 'experience' && (
            <>
              <Choice name="experience" legend="Pengalamanmu membuat penawaran atau mengerjakan untuk orang lain" options={EXPERIENCE} value={answers.experience} onChange={(v) => set('experience', v)} />
              {answers.experience !== 'none' && answers.experience !== '' && (
                <Text id="experienceNote" label="Apa yang terjadi? (opsional)" hint="Contoh: kirim 5 pesan, 1 dibalas, belum deal" value={answers.experienceNote} max={300} onChange={(v) => set('experienceNote', v)} />
              )}
            </>
          )}

          {s.key === 'practical' && (
            <>
              <Choice name="hours" legend="Waktu yang realistis untuk program ini per minggu" options={HOURS} value={answers.hours} onChange={(v) => set('hours', v)} />
              <Multi legend="Perangkat yang tersedia" options={DEVICES} values={answers.devices} onChange={(v) => set('devices', v)} />
              <Text id="constraints" label="Kendala praktis yang perlu diperhitungkan (opsional)" hint="Contoh: hanya bisa malam hari, kuota terbatas" value={answers.constraints} max={300} onChange={(v) => set('constraints', v)} />
            </>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
            <div className="flex gap-2">
              {step > 0 && <button type="button" className="btn-ghost" onClick={() => setStep(step - 1)} disabled={saving}>← Kembali</button>}
              {completed && <button type="button" className="btn-ghost" onClick={() => setMode('result')} disabled={saving}>Lihat hasil</button>}
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost" onClick={() => void saveAndExit()} disabled={saving}>Simpan draf</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Menyimpan…' : step === STEPS.length - 1 ? 'Lihat rekomendasi →' : 'Simpan & lanjut →'}
              </button>
            </div>
          </div>
        </form>
        <p className="text-xs text-muted">Jawabanmu hanya bisa dilihat olehmu dan admin GenZ Preneur untuk keperluan layanan.</p>
      </div>
    );
  }

  /* ------------------------------ HASIL ------------------------------ */
  const activeKey = chosen ?? result.entry;
  const active = ENTRIES[activeKey];
  const hasExample = answers.exampleStatus === 'own' || answers.exampleStatus === 'practice';
  const prereq = prerequisiteCheck(activeKey, result.dimensions).filter((p) => !p.ready);

  const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="card p-5"><h2 className="font-display text-lg font-extrabold">{title}</h2><div className="mt-3">{children}</div></section>
  );

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Kondisi awal · hasil" title="Langkah berikutnya untukmu"
        desc="Rekomendasi awal ini berasal dari jawabanmu sendiri — bukan sertifikasi kemampuan dan bukan penilaian mentor. Kamu bisa mengubahnya kapan saja." />

      <div className="flex flex-wrap gap-1.5 text-xs font-bold">
        <span className="rounded-full border border-ink bg-white px-2.5 py-1">📝 Dilaporkan peserta</span>
        {hasExample && <span className="rounded-full border border-ink bg-sky px-2.5 py-1">📎 Contoh tersedia (dilaporkan)</span>}
      </div>

      <section className="card-pop overflow-hidden">
        <div className={`border-b-2 border-ink p-5 ${result.tentative && !chosen ? 'bg-amber-soft' : 'bg-lime'}`}>
          <p className="text-xs font-extrabold uppercase tracking-wider">
            {chosen ? 'Titik masuk pilihanmu' : result.tentative ? 'Rekomendasi sementara' : 'Rekomendasi langkah berikutnya'}
          </p>
          <h2 className="font-display text-2xl font-extrabold">{active.title}</h2>
        </div>
        <div className="space-y-4 p-5">
          {chosen && chosen !== result.entry && (
            <p className="text-sm">Kamu memilih titik masuk sendiri. Dari jawabanmu, rekomendasinya: <strong>{ENTRIES[result.entry].title}</strong>.{' '}
              <button type="button" className="font-bold underline" onClick={() => void choose(null)} disabled={saving}>Kembali ke rekomendasi</button></p>
          )}
          {!chosen && <p className="text-sm"><strong>Alasan:</strong> {result.reason}</p>}
          {!chosen && result.tentative && result.clarify && (
            <div className="rounded-2xl border-2 border-dashed border-ink p-4 text-sm">
              <p className="font-bold">❓ Jawabanmu belum cukup jelas untuk rekomendasi yang pasti.</p>
              <p className="mt-1">{result.clarify.question}</p>
              <button type="button" className="btn-ghost mt-3 py-1.5 text-sm" onClick={() => { setStep(result.clarify!.step); setMode('form'); }}>Jawab pertanyaan ini</button>
            </div>
          )}
          {prereq.length > 0 && (
            <div className="rounded-2xl bg-paper-2 p-4 text-sm">
              <p className="font-bold">Cek cepat sebelum mulai</p>
              <p className="text-xs text-muted">Tahap ini membutuhkan keluaran tahap sebelumnya. Lengkapi dulu bagian ini — tidak ada yang otomatis dianggap selesai.</p>
              <ul className="mt-2 space-y-1">{prereq.map((p) => <li key={p.key}>→ <strong>{p.label}:</strong> {p.note}</li>)}</ul>
            </div>
          )}
          <div>
            <p className="text-sm font-bold">Mulai dari sini:</p>
            <ul className="mt-2 grid gap-2 md:grid-cols-3">
              {active.actions.map((x, i) => (
                <li key={x.label} className="flex flex-col rounded-2xl border-2 border-line bg-white p-3">
                  <p className="text-sm font-bold">{x.label}</p>
                  <p className="flex-1 text-xs text-ink/70">{x.note}</p>
                  <Link to={x.to} className={`${i === 0 ? 'btn-accent' : 'btn-ghost'} mt-3 py-1.5 text-sm`}>Buka →</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="✅ Yang sudah kamu miliki">
          {result.haves.length ? <ul className="space-y-1 text-sm">{result.haves.map((h) => <li key={h}>✦ {h}</li>)}</ul>
            : <p className="text-sm text-muted">Belum ada yang disebutkan — tidak apa-apa, semua orang mulai dari sesuatu.</p>}
        </Section>
        <Section title="🔎 Yang belum jelas / perlu diperiksa">
          {result.toCheck.length ? <ul className="space-y-1 text-sm">{result.toCheck.map((h) => <li key={h}>→ {h}</li>)}</ul>
            : <p className="text-sm text-muted">Tidak ada catatan.</p>}
        </Section>
      </div>

      <Section title="Ringkasan kondisi (dari jawabanmu)">
        <ul className="divide-y divide-line">
          {result.dimensions.map((d) => (
            <li key={d.key} className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold">{DIM_LABEL[d.key]}</p>
                <p className="text-xs text-ink/70">{d.note}</p>
              </div>
              <span className={`w-fit shrink-0 rounded-full border border-ink px-2.5 py-0.5 text-xs font-bold ${STATUS_CLS[d.status]}`}>{DIM_STATUS_LABEL[d.status]}</span>
            </li>
          ))}
        </ul>
      </Section>

      <section className="card p-5">
        <h2 className="font-display text-lg font-extrabold">Ubah jawaban atau titik masuk</h2>
        <p className="mt-1 text-sm text-muted">Mengubah titik masuk tidak menyelesaikan tahap lain dan tidak menghapus progres atau draf lamamu.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" onClick={() => { setStep(0); setMode('form'); }}>✏️ Ubah jawaban</button>
          <button type="button" className="btn-ghost" aria-expanded={picking !== null} onClick={() => setPicking(picking ? null : activeKey)}>🔀 Pilih titik masuk lain</button>
        </div>
        {picking && (
          <div className="mt-4 space-y-3">
            <fieldset className="grid gap-2 sm:grid-cols-2">
              <legend className="label">Titik masuk</legend>
              {(Object.keys(ENTRIES) as EntryKey[]).map((k) => (
                <label key={k} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 text-sm focus-within:ring-2 focus-within:ring-ink ${picking === k ? 'border-ink bg-lime' : 'border-line bg-white'}`}>
                  <input type="radio" name="entry" className="mt-0.5 h-4 w-4 accent-ink" checked={picking === k} onChange={() => setPicking(k)} />
                  <span><strong>{ENTRIES[k].title}</strong>{k === result.entry && <span className="ml-1 text-xs">(rekomendasi)</span>}</span>
                </label>
              ))}
            </fieldset>
            {prerequisiteCheck(picking, result.dimensions).some((p) => !p.ready) && (
              <p className="rounded-2xl bg-amber-soft p-3 text-xs">
                Titik ini membutuhkan: {prerequisiteCheck(picking, result.dimensions).filter((p) => !p.ready).map((p) => p.label).join(', ')}. Kamu tetap boleh memilihnya — nanti ada cek cepat untuk melengkapinya.
              </p>
            )}
            <button type="button" className="btn-primary" disabled={saving} onClick={() => void choose(picking === result.entry ? null : picking)}>
              {saving ? 'Menyimpan…' : 'Simpan pilihan'}
            </button>
          </div>
        )}
      </section>

      <p className="text-xs text-muted">
        Aturan rekomendasi {result.rulesVersion} · pertanyaan {result.questionsVersion}. Aturan sederhana dari jawabanmu — bukan AI, bukan skor kepribadian, bukan prediksi peluang.
        Assessment Industri adalah eksplorasi minat yang terpisah dan tidak mengubah rekomendasi ini.
      </p>
    </div>
  );
}
