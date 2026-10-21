import { ENTRY_PATH, ENTRY_PREREQUISITES, entryMissionStage, type StageId } from '../lib/entry';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useAccess } from '../auth/AccessProvider';
import { MISSION_PATH, MISSION_STEPS } from '../content/mission';
import { getProgress, saveMissionArtifact } from '../lib/data';
import { MISSION_TEXT_LIMIT, missionExport, missionKey, missionReady, missionSummary, readMissionDraft } from '../lib/mission';
import { useAsync } from '../lib/useAsync';
import { ConfirmDialog, ErrorState, PageHeader, PageSkeleton, useToast } from '../components/ui';

export default function MissionPage() {
  const { profile } = useAuth();
  const access = useAccess();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { data: progress, setData: setProgress, loading, error, reload } = useAsync(() => getProgress(profile!.uid), [profile?.uid]);
  const step = MISSION_STEPS.find((s) => s.id === (params.get('tahap') ?? entryMissionStage(progress?.notes ?? {}))) ?? MISSION_STEPS[0];
  const index = MISSION_STEPS.indexOf(step);
  const raw = progress?.notes[missionKey(step.id)];
  const persisted = useMemo(() => readMissionDraft(raw), [raw]);
  const [draft, setDraft] = useState(persisted);
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [pendingTo, setPendingTo] = useState<string | null>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(persisted);
  useEffect(() => { setDraft(persisted); setSaveError(''); }, [step.id, persisted]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    const protect = (e: MouseEvent) => {
      if (e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const anchor = e.target instanceof Element ? e.target.closest('a') : null;
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin || url.hash && url.pathname === window.location.pathname && url.search === window.location.search) return;
      e.preventDefault(); e.stopPropagation();
      if (!busy) setPendingTo(`${url.pathname}${url.search}${url.hash}`);
    };
    window.addEventListener('beforeunload', warn);
    document.addEventListener('click', protect, true);
    return () => { window.removeEventListener('beforeunload', warn); document.removeEventListener('click', protect, true); };
  }, [dirty, busy]);

  if (loading || access.loading) return <PageSkeleton />;
  if (error || !progress) return <ErrorState message={error ?? 'Hasil kerja belum dapat dimuat.'} onRetry={reload} />;
  const summary = missionSummary(progress.notes);
  const move = (to: string) => { navigate(to); window.scrollTo({ top: 0 }); };
  const requestMove = (to: string) => { if (busy) return; if (dirty) setPendingTo(to); else move(to); };
  async function save() {
    if (!profile) return;
    setBusy(true); setSaveError('');
    try {
      const encoded = await saveMissionArtifact(profile.uid, step.id, draft);
      setProgress((p) => p && { ...p, notes: { ...p.notes, [missionKey(step.id)]: encoded } });
      toast('success', 'Hasil kerja tersimpan di akunmu.');
    } catch {
      setSaveError('Belum berhasil menyimpan. Draf tetap ada di layar. Ringkas bila terlalu panjang, periksa koneksi, lalu coba lagi.');
    } finally { setBusy(false); }
  }
  function download() {
    if (!progress) return;
    const url = URL.createObjectURL(new Blob([missionExport(progress.notes)], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'misi-pertama-hasil-kerja.txt'; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Misi Pertama · satu bantuan, satu percobaan" title={<>Bikin sesuatu yang <span className="headline-marker">bisa dicoba.</span></>}
        desc="Mulai dari skill yang sudah kamu punya. Siapkan bantuan kecil untuk bisnis yang sudah berjalan, coba secara etis, lalu perbaiki. Passport dan assessment boleh menyusul."
        right={<div className="rounded-xl border-2 border-ink bg-white px-4 py-3 text-sm"><strong>{summary.written}/{MISSION_STEPS.length}</strong> hasil kerja tersimpan<p className="mt-1 text-xs text-muted">Isi catatan, bukan ukuran keberhasilan bisnis.</p></div>} />
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <p className="max-w-2xl leading-relaxed text-muted">Tidak ada batas wajib tujuh hari. Pilih tahap sesuai kebutuhan. Penilaian kriteria diisi sendiri dan belum diverifikasi mentor.</p>
        <button type="button" className="btn-ghost" disabled={dirty || busy || !summary.written} onClick={download}>Unduh hasil tersimpan ↓</button>
      </div>
      <p className="text-sm"><Link className="font-bold underline" to={ENTRY_PATH}>Tinjau kondisi awal / pilih titik masuk lain ↗</Link> · Minat, saran awal, dan progres pekerjaan disimpan terpisah.</p>
      <div className="mission-layout grid gap-5 lg:grid-cols-[225px_minmax(0,1fr)]">
        <nav aria-label="Tahap Misi Pertama" className="mission-stages grid grid-cols-3 gap-2 lg:sticky lg:top-20 lg:flex lg:flex-col lg:self-start">
          {MISSION_STEPS.map((s, i) => {
            const saved = readMissionDraft(progress.notes[missionKey(s.id)]);
            return <button key={s.id} type="button" disabled={busy} aria-current={s.id === step.id ? 'step' : undefined} onClick={() => requestMove(`${MISSION_PATH}?tahap=${s.id}`)} className="mission-stage"><span className="mission-number" aria-hidden>{i + 1}</span><span>{s.title}<span className="mt-1 block text-xs font-medium">{!saved.text.trim() ? 'Belum ada draf' : missionReady(saved) ? 'Kriteria dicentang sendiri' : 'Draf tersimpan'}</span></span></button>;
          })}
        </nav>
        <section className="card min-w-0 space-y-5 p-5 sm:p-7" aria-labelledby="mission-title">
          <div><p className="eyebrow">Tahap {index + 1} / {MISSION_STEPS.length}</p><h2 id="mission-title" className="mt-2 font-display text-2xl font-extrabold">{step.title}</h2><p className="mt-2 text-sm leading-relaxed"><strong>Hasil yang dibuat:</strong> {step.outcome}</p></div>
          {(ENTRY_PREREQUISITES[step.id as StageId]?.length ?? 0) > 0 && <details className="rounded-xl border border-line bg-lilac/20 p-4"><summary className="cursor-pointer text-sm font-bold">Cek singkat bekal untuk tahap ini</summary><p className="mt-3 text-xs leading-relaxed">Bisa berasal dari pekerjaan di luar aplikasi. Jika belum ada, buka tahap terkait atau ringkas bekalnya di hasil kerja tahap ini. Tidak wajib mencentang atau menyelesaikan ulang tahap sebelumnya.</p><ul className="mt-3 space-y-2 text-sm">{ENTRY_PREREQUISITES[step.id as StageId]!.map(id=>{const needed=MISSION_STEPS.find(s=>s.id===id)!;return <li key={id}><Link className="font-bold underline" to={`${MISSION_PATH}?tahap=${id}`}>{needed.title} ↗</Link><span> · {readMissionDraft(progress.notes[missionKey(id)]).text.trim() ? 'Ada draf; periksa isinya' : 'Belum ada draf di aplikasi'}</span><p className="mt-1 text-xs text-muted">{needed.outcome}</p></li>;})}</ul></details>}
          <details className="rounded-xl border-2 border-ink bg-sky/40 p-4"><summary className="cursor-pointer text-sm font-bold">Lihat contoh ilustrasi</summary><p className="mt-3 text-sm leading-relaxed">{step.example}</p></details>
          <div>
            <label htmlFor="mission-draft" className="label">Hasil kerjamu</label>
            <p id="mission-help" className="mb-3 text-xs leading-relaxed text-muted">Gunakan pertanyaan di bawah sebagai kerangka. Tempel teks atau tautan; file contoh disimpan di tempat milikmu. Gunakan kode prospek, bukan nomor/email atau data pribadi pelanggan.</p>
            <textarea id="mission-draft" aria-describedby="mission-help mission-save-status" rows={10} maxLength={MISSION_TEXT_LIMIT} disabled={busy} className="input" placeholder={step.prompt} value={draft.text} onChange={(e) => setDraft({ text: e.target.value, checks: [] })} />
            <p id="mission-save-status" className="hint" aria-live="polite">{draft.text.length}/{MISSION_TEXT_LIMIT} · {dirty ? 'Perubahan belum disimpan.' : raw ? 'Versi ini tersimpan di akunmu.' : 'Belum ada hasil tersimpan untuk tahap ini.'}</p>
          </div>
          <fieldset className="rounded-2xl border-2 border-ink bg-lime/30 p-4"><legend className="px-2 text-sm font-extrabold">Cek sendiri sebelum lanjut</legend><p className="mb-3 text-xs leading-relaxed text-muted">Ini penilaianmu atas hasil kerja, bukan verifikasi sistem. Mengubah teks akan mengosongkan centang agar kamu menilainya lagi.</p>{step.criteria.map((c, i) => <label key={c} className="mb-3 flex min-h-10 cursor-pointer items-start gap-3 text-sm last:mb-0"><input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-ink" disabled={busy || !draft.text.trim()} checked={draft.checks.includes(i)} onChange={() => setDraft((d) => ({ ...d, checks: d.checks.includes(i) ? d.checks.filter((x) => x !== i) : [...d.checks, i] }))} /><span>{c}</span></label>)}</fieldset>
          {saveError && <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm text-danger">{saveError}</p>}
          <div className="flex flex-wrap items-center gap-3"><button type="button" className="btn-accent" disabled={busy || !dirty} onClick={() => void save()}>{busy ? 'Menyimpan…' : 'Simpan hasil kerja'}</button><p className="text-xs text-muted">Draf boleh disimpan tanpa mencentang semua kriteria.</p></div>
          <details className="rounded-xl border border-line bg-paper p-4"><summary className="cursor-pointer text-sm font-bold">Lagi buntu? Coba ini</summary><p className="mt-3 text-sm leading-relaxed">{step.stuck}</p></details>
          <div className="border-t border-line pt-4"><h3 className="text-sm font-extrabold">Bantuan sesuai kebutuhan</h3><p className="mt-1 text-xs text-muted">Kerangka di atas bisa dikerjakan manual. Alat tambahan bukan syarat untuk lanjut.</p><div className="mt-3 flex flex-wrap gap-2">{step.resources.map((r) => access.can(r.feature) ? <Link key={r.to} to={r.to} className="btn-ghost text-xs">{r.label} ↗</Link> : <span key={r.to} className="rounded-lg border border-line bg-paper px-3 py-2 text-xs text-muted">🔒 {r.label} · akses paket</span>)}</div></div>
          <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-4">{index > 0 ? <button type="button" className="btn-ghost" disabled={busy} onClick={() => requestMove(`${MISSION_PATH}?tahap=${MISSION_STEPS[index - 1].id}`)}>← Sebelumnya</button> : <span />}<button type="button" className="btn-primary" disabled={busy} onClick={() => requestMove(`${MISSION_PATH}?tahap=${MISSION_STEPS[index + 1]?.id ?? 'problem'}`)}>{index < MISSION_STEPS.length - 1 ? 'Tahap berikutnya →' : 'Ulangi dengan temuan baru →'}</button></div>
        </section>
      </div>
      <p className="text-xs text-muted">Targetnya pekerjaan dan percobaan yang bisa kamu kendalikan. Mendapat pelanggan atau penghasilan tidak dijamin. <Link className="font-bold underline" to="/app/action-plan/arsip">Buka checklist & catatan tujuh hari versi lama</Link>.</p>
      <ConfirmDialog open={pendingTo !== null} title="Hasil kerja belum disimpan" description="Kembali untuk menyimpan drafmu. Jika tetap pindah, perubahan sejak penyimpanan terakhir akan dibuang." confirmLabel="Pindah tanpa menyimpan" cancelLabel="Kembali ke draf" onCancel={() => setPendingTo(null)} onConfirm={() => { if (pendingTo) move(pendingTo); setPendingTo(null); }} />
    </div>
  );
}
