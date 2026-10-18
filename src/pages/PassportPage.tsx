import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { usePassport } from '../lib/usePassport';
import { deletePassport, exportJson, getAssessment, savePassport, updateDisplayName } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import PassportSummary from '../components/PassportSummary';
import {
  AGE_RANGES, BUDGETS, BUSINESS_EXPERIENCE, CUSTOMER_EXPERIENCE, DEVICES, INTERESTS, SECTION_LABEL,
  SKILL_LEVELS, SKILLS, STATUSES, WORK_MODES, completionPercent, emptyPassport, fieldErrors,
  passportSchema, sectionCompletion, type Passport, type PassportSection,
} from '../lib/passport';
import { ConfirmDialog, ErrorState, PageSkeleton, ProgressBar, useToast } from '../components/ui';

const SECTIONS = Object.keys(SECTION_LABEL) as PassportSection[];

/* ---------------------------- Field helpers ---------------------------- */

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error ? <p className="err" id={`${id}-err`}>{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

function Select<T extends string>({ id, value, options, onChange }: { id: string; value: T | ''; options: readonly { value: T; label: string }[]; onChange: (v: T | '') => void }) {
  return (
    <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value as T | '')}>
      <option value="">— Pilih —</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function ChipGroup<T extends string>({ legend, values, options, onChange }: { legend: string; values: T[]; options: readonly { value: T; label: string }[]; onChange: (v: T[]) => void }) {
  return (
    <fieldset>
      <legend className="label">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = values.includes(o.value);
          return (
            <button key={o.value} type="button" aria-pressed={on}
              onClick={() => onChange(on ? values.filter((v) => v !== o.value) : [...values, o.value])}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${on ? 'border-ink bg-ink text-paper' : 'border-line bg-white hover:bg-paper-2'}`}>
              {on ? '✓ ' : ''}{o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const numOrNull = (v: string): number | null => (v.trim() === '' ? null : Number(v));

/* -------------------------------- Page -------------------------------- */

export default function PassportPage() {
  const { profile, refreshProfile } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const { loading, error, record, reload } = usePassport(profile?.uid, profile?.displayName ?? '');

  const [draft, setDraft] = useState<Passport | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: assessment } = useAsync(() => getAssessment(profile!.uid).catch(() => null), [profile?.uid]);
  // Mode tampilan: ringkasan (default bila Passport sudah pernah disimpan) atau form edit.
  const [editing, setEditing] = useState<boolean | null>(null);

  const paramSection = params.get('bagian') as PassportSection | null;
  const active: PassportSection = paramSection && SECTIONS.includes(paramSection) ? paramSection : 'personal';
  const setActive = (s: PassportSection) => setParams({ bagian: s }, { replace: true });
  const openEditor = () => { setEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  useEffect(() => { if (record) setDraft(record.data); }, [record]);

  // Perbaikan akun lama: nama di akun kosong padahal Passport sudah berisi nama → sinkronkan sekali.
  useEffect(() => {
    const name = record?.exists ? record.data.personal.fullName.trim() : '';
    if (!profile || !name || (profile.displayName ?? '').trim()) return;
    updateDisplayName(profile.uid, name).then(refreshProfile).catch((e) => console.error(e));
  }, [record, profile, refreshProfile]);

  const dirty = useMemo(() => !!draft && !!record && JSON.stringify(draft) !== JSON.stringify(record.data), [draft, record]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  if (loading || (!draft && !error)) return <PageSkeleton />;
  if (error || !record || !draft) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const update = <K extends PassportSection>(section: K, patch: Partial<Passport[K]>) =>
    setDraft((d) => (d ? { ...d, [section]: { ...d[section], ...patch } } : d));

  const sections = sectionCompletion(draft);
  const pct = completionPercent(draft);
  const err = (path: string) => errors[path];

  async function save() {
    if (!profile || !draft || !record) return;
    const parsed = passportSchema.safeParse(draft);
    if (!parsed.success) {
      const fe = fieldErrors(parsed.error);
      setErrors(fe);
      const firstSection = Object.keys(fe)[0]?.split('.')[0] as PassportSection | undefined;
      if (firstSection && firstSection !== active) setActive(firstSection);
      toast('error', 'Ada isian yang perlu diperbaiki.');
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      await savePassport(profile.uid, parsed.data, !record.exists);
      // Sinkronkan nama di akun (sidebar, sapaan) dengan nama di Passport.
      const name = parsed.data.personal.fullName.trim();
      if (name && name !== (profile.displayName ?? '').trim()) {
        try { await updateDisplayName(profile.uid, name); await refreshProfile(); } catch (e) { console.error(e); }
      }
      await reload();
      setEditing(false);
      setParams({}, { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast('success', 'Passport tersimpan. Ini rangkumanmu 👇');
    } catch (e) {
      console.error(e);
      toast('error', 'Gagal menyimpan. Periksa koneksi lalu coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    if (!profile) return;
    setDeleting(true);
    try {
      await deletePassport(profile.uid);
      setDraft(emptyPassport(profile.displayName));
      await reload();
      toast('success', 'Data Passport sudah dihapus permanen.');
      setConfirmDelete(false);
    } catch (e) {
      console.error(e);
      toast('error', 'Gagal menghapus data. Coba lagi.');
    } finally {
      setDeleting(false);
    }
  }

  const welcome = (location.state as { welcome?: boolean } | null)?.welcome && !record.exists;
  // Tanpa pilihan eksplisit: tampilkan ringkasan bila sudah pernah disimpan dan tidak datang dari link "?bagian=".
  const showSummary = editing === null ? record.exists && !paramSection : !editing;

  if (showSummary) {
    return (
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Entrepreneur Passport</p>
            <h1 className="h-page">Rangkuman profil entrepreneur-mu</h1>
            <p className="mt-1 max-w-xl text-sm text-muted">Dihitung otomatis dari isian Passport-mu. Ubah isian kapan saja — rangkuman ikut berubah.</p>
          </div>
          <div className="w-full sm:w-64"><ProgressBar value={pct} label="Kelengkapan" /></div>
        </header>
        <PassportSummary
          passport={record.data}
          completion={completionPercent(record.data)}
          assessment={assessment ? { topIndustries: assessment.topIndustries, topProfiles: assessment.topProfiles } : null}
          onEdit={openEditor}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-ink">Entrepreneur Passport</p>
          <h1 className="h-page">Profil entrepreneur-mu</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">Diisi sekali, dipakai di semua tools. Hanya kamu yang bisa mengubah data ini.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-64">
          <ProgressBar value={pct} label="Kelengkapan" />
          {record.exists && (
            <button type="button" className="text-left text-sm font-semibold underline" onClick={() => { setEditing(false); setParams({}, { replace: true }); if (record) setDraft(record.data); }}>
              ← Kembali ke rangkuman{dirty ? ' (batalkan perubahan)' : ''}
            </button>
          )}
        </div>
      </header>

      {welcome && (
        <div role="status" className="rounded-xl border border-ok/30 bg-ok-soft px-4 py-3 text-sm text-ok">
          Akun berhasil dibuat. Mulai dengan melengkapi Passport — sekitar 5 menit.
        </div>
      )}

      <div role="tablist" aria-label="Bagian Passport" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {SECTIONS.map((s) => (
          <button key={s} role="tab" type="button" aria-selected={active === s} onClick={() => setActive(s)}
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${active === s ? 'bg-ink text-paper' : 'border border-line bg-white hover:bg-paper-2'}`}>
            <span aria-hidden className={`h-2 w-2 rounded-full ${sections[s] ? 'bg-ok' : 'bg-line'}`} />
            {SECTION_LABEL[s]}
          </button>
        ))}
      </div>

      <form className="card space-y-5 p-6" onSubmit={(e) => { e.preventDefault(); void save(); }} noValidate>
        {active === 'personal' && (
          <>
            <Field id="fullName" label="Nama lengkap *" error={err('personal.fullName')}>
              <input id="fullName" className="input" value={draft.personal.fullName} onChange={(e) => update('personal', { fullName: e.target.value })} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="ageRange" label="Rentang usia *"><Select id="ageRange" value={draft.personal.ageRange} options={AGE_RANGES} onChange={(v) => update('personal', { ageRange: v })} /></Field>
              <Field id="status" label="Status saat ini *"><Select id="status" value={draft.personal.status} options={STATUSES} onChange={(v) => update('personal', { status: v })} /></Field>
              <Field id="fieldOfWork" label="Bidang studi / pekerjaan" hint="Opsional" error={err('personal.fieldOfWork')}>
                <input id="fieldOfWork" className="input" value={draft.personal.fieldOfWork} onChange={(e) => update('personal', { fieldOfWork: e.target.value })} />
              </Field>
              <Field id="city" label="Kota domisili" hint="Opsional, cukup nama kota" error={err('personal.city')}>
                <input id="city" className="input" value={draft.personal.city} onChange={(e) => update('personal', { city: e.target.value })} />
              </Field>
            </div>
            <Field id="businessExperience" label="Pengalaman bisnis *">
              <Select id="businessExperience" value={draft.personal.businessExperience} options={BUSINESS_EXPERIENCE} onChange={(v) => update('personal', { businessExperience: v })} />
            </Field>
            <Field id="programGoal" label="Apa yang ingin kamu capai dari program ini? *" error={err('personal.programGoal')} hint={`${draft.personal.programGoal.length}/500`}>
              <textarea id="programGoal" rows={4} className="input" value={draft.personal.programGoal} onChange={(e) => update('personal', { programGoal: e.target.value })} />
            </Field>
          </>
        )}

        {active === 'skills' && (
          <>
            <p className="text-sm text-muted">Nilai dirimu sendiri dengan jujur. Ini bukan tes — tujuannya menentukan titik mulai belajar.</p>
            <div className="divide-y divide-line rounded-xl border border-line">
              {SKILLS.map((s) => (
                <fieldset key={s.key} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <legend className="float-left text-sm font-medium sm:float-none">{s.label}</legend>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILL_LEVELS.map((l) => {
                      const on = draft.skills.levels[s.key] === l.value;
                      return (
                        <button key={l.value} type="button" aria-pressed={on}
                          onClick={() => update('skills', { levels: { ...draft.skills.levels, [s.key]: l.value } })}
                          className={`rounded-md px-2.5 py-1 text-xs font-semibold ${on ? 'bg-amber text-ink' : 'border border-line bg-white text-muted hover:bg-paper-2'}`}>
                          {l.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <Field id="otherSkills" label="Skill lainnya" hint="Opsional, pisahkan dengan koma" error={err('skills.otherSkills')}>
              <input id="otherSkills" className="input" value={draft.skills.otherSkills} onChange={(e) => update('skills', { otherSkills: e.target.value })} />
            </Field>
          </>
        )}

        {active === 'resources' && (
          <>
            <Field id="hours" label="Waktu tersedia per minggu (jam) *" error={err('resources.hoursPerWeek')}>
              <input id="hours" type="number" inputMode="numeric" min={0} max={80} className="input sm:w-40"
                value={draft.resources.hoursPerWeek ?? ''} onChange={(e) => update('resources', { hoursPerWeek: numOrNull(e.target.value) })} />
            </Field>
            <ChipGroup legend="Perangkat yang dimiliki *" values={draft.resources.devices} options={DEVICES} onChange={(v) => update('resources', { devices: v })} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="budget" label="Anggaran untuk memulai *"><Select id="budget" value={draft.resources.startBudget} options={BUDGETS} onChange={(v) => update('resources', { startBudget: v })} /></Field>
              <Field id="workMode" label="Preferensi kerja *"><Select id="workMode" value={draft.resources.workMode} options={WORK_MODES} onChange={(v) => update('resources', { workMode: v })} /></Field>
            </div>
            <Field id="custExp" label="Pengalaman melayani pelanggan *">
              <Select id="custExp" value={draft.resources.customerExperience} options={CUSTOMER_EXPERIENCE} onChange={(v) => update('resources', { customerExperience: v })} />
            </Field>
          </>
        )}

        {active === 'interests' && (
          <>
            <ChipGroup legend="Bidang yang menarik buatmu *" values={draft.interests.selected} options={INTERESTS} onChange={(v) => update('interests', { selected: v })} />
            <Field id="otherInterests" label="Minat lainnya" hint="Opsional" error={err('interests.otherInterests')}>
              <input id="otherInterests" className="input" value={draft.interests.otherInterests} onChange={(e) => update('interests', { otherInterests: e.target.value })} />
            </Field>
          </>
        )}

        {active === 'goals' && (
          <>
            <Field id="skillTarget" label="Skill yang ingin dikuasai *" error={err('goals.skillTarget')}>
              <textarea id="skillTarget" rows={3} className="input" value={draft.goals.skillTarget} onChange={(e) => update('goals', { skillTarget: e.target.value })} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="weeklyActivity" label="Target aktivitas per minggu *" hint="Contoh: 5 sesi belajar/praktik" error={err('goals.weeklyActivityTarget')}>
                <input id="weeklyActivity" type="number" inputMode="numeric" min={0} className="input"
                  value={draft.goals.weeklyActivityTarget ?? ''} onChange={(e) => update('goals', { weeklyActivityTarget: numOrNull(e.target.value) })} />
              </Field>
              <Field id="weeklyProspect" label="Target calon mitra dihubungi per minggu *" error={err('goals.weeklyProspectTarget')}>
                <input id="weeklyProspect" type="number" inputMode="numeric" min={0} className="input"
                  value={draft.goals.weeklyProspectTarget ?? ''} onChange={(e) => update('goals', { weeklyProspectTarget: numOrNull(e.target.value) })} />
              </Field>
            </div>
            <Field id="portfolioTarget" label="Target portofolio" hint="Opsional" error={err('goals.portfolioTarget')}>
              <input id="portfolioTarget" className="input" value={draft.goals.portfolioTarget} onChange={(e) => update('goals', { portfolioTarget: e.target.value })} />
            </Field>
            <Field id="income" label="Aspirasi penghasilan per bulan (Rp)" error={err('goals.monthlyIncomeAspiration')}
              hint="Opsional. Ini aspirasi pribadimu — bukan target atau janji dari GenZ Preneur.">
              <input id="income" type="number" inputMode="numeric" min={0} step={50000} className="input sm:w-60"
                value={draft.goals.monthlyIncomeAspiration ?? ''} onChange={(e) => update('goals', { monthlyIncomeAspiration: numOrNull(e.target.value) })} />
            </Field>
          </>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <div className="flex gap-2">
            {SECTIONS.indexOf(active) > 0 && (
              <button type="button" className="btn-ghost" onClick={() => setActive(SECTIONS[SECTIONS.indexOf(active) - 1])}>← Sebelumnya</button>
            )}
            {SECTIONS.indexOf(active) < SECTIONS.length - 1 && (
              <button type="button" className="btn-ghost" onClick={() => setActive(SECTIONS[SECTIONS.indexOf(active) + 1])}>Berikutnya →</button>
            )}
          </div>
          <button type="submit" className="btn-primary" disabled={saving || (!dirty && record.exists)}>
            {saving ? 'Menyimpan…' : dirty || !record.exists ? 'Simpan Passport' : 'Tersimpan'}
          </button>
        </div>
      </form>

      <section className="card p-6">
        <h2 className="font-semibold">Data milikmu</h2>
        <p className="mt-1 text-sm text-muted">
          {record.updatedAt ? `Terakhir disimpan ${record.updatedAt.toLocaleString('id-ID')}.` : 'Belum pernah disimpan.'} Kamu bisa mengekspor atau menghapus data ini kapan saja.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="btn-ghost" disabled={!record.exists}
            onClick={() => exportJson(`passport-${new Date().toISOString().slice(0, 10)}.json`, { exportedAt: new Date().toISOString(), email: profile?.email, passport: record.data })}>
            Ekspor (JSON)
          </button>
          <button type="button" className="btn-danger" disabled={!record.exists} onClick={() => setConfirmDelete(true)}>Hapus data Passport</button>
        </div>
      </section>

      {dirty && (
        <div className="fixed inset-x-4 bottom-4 z-20 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-paper shadow-xl lg:left-[260px]">
          <span>Ada perubahan yang belum disimpan.</span>
          <button type="button" className="btn-accent py-1.5" onClick={() => void save()} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Hapus data Passport?"
        description="Semua isian Passport akan dihapus permanen dan tidak bisa dikembalikan. Akunmu tetap aktif."
        confirmLabel="Ya, hapus permanen"
        danger
        busy={deleting}
        onConfirm={() => void doDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
