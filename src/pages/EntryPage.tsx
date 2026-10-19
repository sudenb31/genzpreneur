import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getProgress, saveEntry } from '../lib/data';
import { emptyEntry, ENTRY_KEY, readEntry, recommendEntry, type EntryAnswers, type StageId } from '../lib/entry';
import { ENTRY_SECTIONS } from '../content/entryQuestions';
import { MISSION_STEPS } from '../content/mission';
import { useAsync } from '../lib/useAsync';
import EntrySummary from '../components/EntrySummary';
import { ErrorState, PageHeader, PageSkeleton } from '../components/ui';

export default function EntryPage() {
  const { profile } = useAuth();
  const { data, setData, loading, error, reload } = useAsync(() => getProgress(profile!.uid), [profile?.uid]);
  const raw = data?.notes[ENTRY_KEY];
  const persisted = useMemo(() => readEntry(raw), [raw]);
  const [draft, setDraft] = useState(emptyEntry);
  const [section, setSection] = useState(0);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [choice, setChoice] = useState<StageId>('start');
  const dirty = JSON.stringify(draft) !== JSON.stringify(persisted ?? emptyEntry());
  useEffect(() => { setDraft(persisted ?? emptyEntry()); setChoice(persisted?.selectedStage ?? (persisted ? recommendEntry(persisted.answers).stage : 'start')); }, [persisted]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    const protect = (e: MouseEvent) => {
      if (e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a') : null;
      if (a && a.target !== '_blank' && !window.confirm('Ada perubahan belum disimpan. Tetap keluar tanpa menyimpan?')) { e.preventDefault(); e.stopPropagation(); }
    };
    window.addEventListener('beforeunload', warn); document.addEventListener('click', protect, true);
    return () => { window.removeEventListener('beforeunload', warn); document.removeEventListener('click', protect, true); };
  }, [dirty]);
  if (loading) return <PageSkeleton />;
  if (error || !data) return <ErrorState message={error ?? 'Kondisi awal belum dapat dimuat.'} onRetry={reload} />;
  if (raw && !persisted) return <div className="card p-6"><h1 className="h-page">Data kondisi awal belum bisa dibaca</h1><p className="mt-3">Format data berbeda atau rusak. Data tidak ditimpa. Hubungi admin untuk memeriksa versi aplikasi.</p><Link className="btn-ghost mt-4" to="/app/action-plan">Tetap lanjut Misi Pertama →</Link></div>;
  function edit(key: keyof EntryAnswers, value: string) { setDraft(d => ({ ...d, selectedStage: null, answers: { ...d.answers, [key]: value } })); setMessage(''); setSaveError(''); }
  async function save(showResult = false, selectedStage = draft.selectedStage) {
    if (!profile) return;
    setBusy(true); setSaveError(''); setMessage('');
    try {
      const encoded = await saveEntry(profile.uid, { ...draft, selectedStage });
      setData(p => p && ({ ...p, notes: { ...p.notes, [ENTRY_KEY]: encoded } }));
      setMessage('Kondisi awal tersimpan. Kamu bisa kembali untuk melanjutkan atau mengubah jawaban.');
      if (showResult) { setEditing(false); window.scrollTo({ top: 0 }); }
    } catch { setSaveError('Belum berhasil menyimpan. Jawaban tetap ada di layar; periksa koneksi dan coba lagi.'); }
    finally { setBusy(false); }
  }
  const formMode = editing || !persisted;
  const rec = recommendEntry(draft.answers);
  const target = draft.selectedStage ?? rec.stage;
  return <div className="space-y-6">
    <PageHeader eyebrow="Kondisi Awal · opsional" title={<>Mulai dari <span className="headline-marker">kondisimu sekarang.</span></>} desc="Pisahkan minat, bekal untuk mengerjakan bantuan, dan progres pekerjaan. Boleh belum tahu; tidak perlu melengkapi semuanya untuk membuka Misi." />
    <div className="flex flex-wrap gap-3 text-sm"><Link to="/app/action-plan" className="btn-ghost">Lanjutkan Misi tanpa mengisi →</Link><Link to="/app/assessment" className="btn-ghost">Eksplorasi minat (assessment terpisah) ↗</Link></div>
    <p className="rounded-xl bg-sky/40 p-4 text-sm">Jangan memasukkan identitas, kontak, rahasia pelanggan atau data sensitif. Pemilik akun dan admin berwenang dapat membaca catatan ini. Tidak dikirim ke Heybinder atau dinilai AI. Bukti kerja opsional; tidak ada upload file.</p>
    {formMode ? <form onSubmit={(e: FormEvent) => { e.preventDefault(); void save(true); }} className="card space-y-5 p-5 sm:p-7">
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Bagian kondisi awal">{ENTRY_SECTIONS.map((s,i)=><button type="button" key={s.title} disabled={busy} className="btn-ghost text-xs aria-[current=step]:bg-lime" aria-current={section===i ? 'step' : undefined} onClick={()=>setSection(i)}>{i+1}. {s.title}</button>)}</nav>
      <h2 className="text-xl font-extrabold">{ENTRY_SECTIONS[section].title}</h2>
      <fieldset disabled={busy} className="space-y-5"><legend className="sr-only">{ENTRY_SECTIONS[section].title}</legend>{ENTRY_SECTIONS[section].questions.map(q=><div key={q.key}><label className="label" htmlFor={`entry-${q.key}`}>{q.label}</label>{q.hint && <p className="hint mb-2" id={`hint-${q.key}`}>{q.hint}</p>}{q.options ? <select id={`entry-${q.key}`} className="input" value={draft.answers[q.key]} onChange={e=>edit(q.key,e.target.value)}>{q.options.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select> : <textarea id={`entry-${q.key}`} className="input" rows={3} maxLength={q.key==='example'?500:300} aria-describedby={q.hint ? `hint-${q.key}` : undefined} value={draft.answers[q.key]} onChange={e=>edit(q.key,e.target.value)} />}</div>)}</fieldset>
      <p className="text-xs text-muted" aria-live="polite">{dirty ? 'Perubahan belum disimpan.' : persisted ? 'Jawaban ini tersimpan.' : 'Belum ada kondisi awal tersimpan.'} Jawaban belum tahu boleh disimpan. Mengubah jawaban mengembalikan titik masuk ke saran aturan, tanpa mengubah progres Misi.</p>
      <div className="flex flex-wrap gap-3"><button type="button" disabled={busy} className="btn-ghost" onClick={()=>void save()}>Simpan draf kondisi awal</button><button type="submit" disabled={busy} className="btn-accent">{busy?'Menyimpan…':'Simpan & lihat saran'}</button></div>
      <div className="flex justify-between gap-3"><button type="button" className="btn-ghost" disabled={busy || section===0} onClick={()=>setSection(s=>s-1)}>← Bagian sebelumnya</button><button type="button" className="btn-ghost" disabled={busy || section===ENTRY_SECTIONS.length-1} onClick={()=>setSection(s=>s+1)}>Bagian berikutnya →</button></div>
    </form> : <section className="card space-y-5 p-5 sm:p-7"><EntrySummary record={draft} />
      {rec.question && <button type="button" className="btn-ghost" onClick={()=>{setSection(rec.editSection ?? 0);setEditing(true);}}>Perjelas jawaban terkait</button>}
      <Link className="btn-accent" to={`/app/action-plan?tahap=${target}`}>Buka pekerjaan: {MISSION_STEPS.find(s=>s.id===target)?.title} →</Link>
      {rec.branch==='A' && <p className="text-sm">Materi Business 101 membantu memahami bantuan dan nilai pelanggan, bukan pelatihan teknis skill dari nol. <Link className="font-bold underline" to="/app/belajar/business-101?pelajaran=b101-2">Baca materi yang tersedia ↗</Link></p>}
      <button type="button" className="btn-ghost" onClick={()=>setEditing(true)}>Ubah jawaban / lanjutkan pengisian</button>
      <details className="rounded-xl border border-line p-4"><summary className="cursor-pointer font-bold">Pilih titik masuk lain</summary><label htmlFor="entry-stage" className="label mt-4">Tahap pilihanmu</label><select id="entry-stage" className="input" value={choice} disabled={busy} onChange={e=>setChoice(e.target.value as StageId)}>{MISSION_STEPS.map(s=><option value={s.id} key={s.id}>{s.title}</option>)}</select><div className="mt-3 flex flex-wrap gap-2"><button type="button" className="btn-primary" disabled={busy} onClick={()=>void save(false,choice)}>Simpan pilihan titik masuk</button><button type="button" className="btn-ghost" disabled={busy} onClick={()=>void save(false,null)}>Gunakan saran aturan lagi</button></div><p className="mt-3 text-xs text-muted">Ini tidak menandai tahap sebelumnya selesai. Periksa bekal yang dibutuhkan ketika membuka pekerjaan.</p></details>
    </section>}
    {saveError && <p className="err" role="alert">{saveError}</p>}{message && <p role="status" className="rounded-xl bg-ok-soft p-4 text-sm">{message}</p>}
  </div>;
}
