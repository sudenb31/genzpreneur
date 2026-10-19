import { Link } from 'react-router-dom';
import type { Passport } from '../lib/passport';
import { formatRupiah } from '../config/site';
import { LABELS, READINESS, labelOf, nextSteps, summarizePassport } from '../lib/passportSummary';
import { WEALTH_PROFILES, type ProfileKey } from '../content/wealthProfiles';
import { INDUSTRIES, type IndustryKey } from '../content/industries';
import { ProgressBar } from './ui';

interface Props {
  passport: Passport;
  completion: number;
  assessment: { topIndustries: IndustryKey[]; topProfiles: ProfileKey[] } | null;
  onEdit: () => void;
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2 text-sm last:border-0">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-semibold">{v || '—'}</dd>
    </div>
  );
}

export default function PassportSummary({ passport: p, completion, assessment, onEdit }: Props) {
  const s = summarizePassport(p);
  const lvl = READINESS[s.level];
  const steps = nextSteps(p, s, !!assessment);
  const profile = assessment?.topProfiles[0] ? WEALTH_PROFILES[assessment.topProfiles[0]] : null;
  const firstName = p.personal.fullName.trim().split(/\s+/)[0] || 'Bos';

  return (
    <div className="space-y-6">
      {completion < 100 && (
        <div role="status" className="card flex flex-wrap items-center justify-between gap-3 bg-paper-2 p-4 text-sm">
          <span>Isian {completion}% lengkap. Lengkapi jika berguna; kamu tetap boleh mulai Misi Pertama.</span>
          <button type="button" className="btn-ghost py-1.5" onClick={onEdit}>Lengkapi</button>
        </div>
      )}

      <details><summary className="mb-3 cursor-pointer text-sm font-bold">Indeks isian opsional · bukan ukuran kesiapan bisnis</summary>
      {/* Indeks lama dipertahankan untuk refleksi, bukan tujuan belajar. */}
      <section className="card-pop overflow-hidden">
        <div className={`flex flex-wrap items-center gap-5 border-b-2 border-ink p-6 ${lvl.tile}`}>
          <span className="text-6xl" aria-hidden>{lvl.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-wider">Rangkuman Passport · {firstName}</p>
            <h2 className="font-display text-3xl font-extrabold">Ringkasan bekal: {lvl.name}</h2>
            <p className="mt-1 text-sm text-ink/80">{lvl.desc}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-5xl font-extrabold" data-testid="readiness">{s.readiness}</p>
            <p className="text-xs font-semibold">dari 100</p>
          </div>
        </div>
        <div className="grid gap-3 p-6 sm:grid-cols-2">
          {s.parts.map((x) => (
            <ProgressBar key={x.key} value={Math.round((x.score / x.max) * 100)} label={`${x.label} (${x.score}/${x.max})`} />
          ))}
          <p className="text-xs text-muted sm:col-span-2">
            Indeks ini dihitung dari bobot isian yang ditentukan produk dan belum divalidasi sebagai ukuran kesiapan. Bukan tes bakat, penentu akses, atau prediksi penghasilan.
          </p>
        </div>
      </section>

      </details>
      {/* Langkah berikutnya */}
      <section className="card-pop bg-ink p-6 text-paper">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-lime">Abis ini ngapain?</p>
        <h2 className="font-display text-2xl font-extrabold">Langkah berikutnya buatmu</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {steps.map((st, i) => (
            <li key={st.to} className="flex flex-col gap-2 rounded-2xl bg-paper p-4 text-ink">
              <p className="font-display text-lg font-extrabold"><span className="text-amber">{i + 1}.</span> {st.title}</p>
              <p className="flex-1 text-sm text-ink/75">{st.why}</p>
              <Link to={st.to} className={i === 0 ? 'btn-accent self-start' : 'btn-ghost self-start'}>{st.cta} →</Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Skill */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-display text-lg font-extrabold">💪 Senjata utamamu</h3>
          {s.strengths.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {s.strengths.map((x) => <li key={x.key} className="chip bg-lime">{x.label} · {labelOf(LABELS.SKILL_LEVELS, x.level)}</li>)}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Belum ada skill di level Menengah. Wajar di awal — pilih 1 skill untuk dilatih 30 hari ke depan.</p>
          )}
          {p.skills.otherSkills && <p className="mt-3 text-sm"><strong>Lainnya:</strong> {p.skills.otherSkills}</p>}
        </div>
        <div className="card p-5">
          <h3 className="font-display text-lg font-extrabold">🎯 Area latihan</h3>
          {s.gaps.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {s.gaps.map((x) => <li key={x.key} className="chip">{x.label} · {labelOf(LABELS.SKILL_LEVELS, x.level)}</li>)}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted">Semua skill minimal Menengah. Saatnya cari partner yang melengkapi, bukan belajar semuanya sendiri.</p>
          )}
          <p className="mt-3 text-xs text-muted">Tips 80/20: kuasai 1–2 skill yang paling dekat ke uang (biasanya sales & komunikasi), sisanya cari partner.</p>
        </div>
      </section>

      {/* Data ringkas */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card p-5">
          <h3 className="font-display text-lg font-extrabold">🪪 Profil</h3>
          <dl className="mt-2">
            <Row k="Nama" v={p.personal.fullName} />
            <Row k="Usia" v={labelOf(LABELS.AGE_RANGES, p.personal.ageRange)} />
            <Row k="Status" v={labelOf(LABELS.STATUSES, p.personal.status)} />
            <Row k="Bidang" v={p.personal.fieldOfWork} />
            <Row k="Kota" v={p.personal.city} />
            <Row k="Pengalaman bisnis" v={labelOf(LABELS.BUSINESS_EXPERIENCE, p.personal.businessExperience)} />
          </dl>
        </div>
        <div className="card p-5">
          <h3 className="font-display text-lg font-extrabold">🧰 Sumber daya</h3>
          <dl className="mt-2">
            <Row k="Waktu" v={p.resources.hoursPerWeek != null ? `${p.resources.hoursPerWeek} jam/minggu` : ''} />
            <Row k="Perangkat" v={p.resources.devices.map((d) => labelOf(LABELS.DEVICES, d)).join(', ')} />
            <Row k="Modal awal" v={labelOf(LABELS.BUDGETS, p.resources.startBudget)} />
            <Row k="Mode kerja" v={labelOf(LABELS.WORK_MODES, p.resources.workMode)} />
            <Row k="Melayani pelanggan" v={labelOf(LABELS.CUSTOMER_EXPERIENCE, p.resources.customerExperience)} />
          </dl>
        </div>
        <div className="card p-5">
          <h3 className="font-display text-lg font-extrabold">🚩 Target</h3>
          <dl className="mt-2">
            <Row k="Aktivitas" v={p.goals.weeklyActivityTarget != null ? `${p.goals.weeklyActivityTarget}/minggu` : ''} />
            <Row k="Calon mitra dihubungi" v={p.goals.weeklyProspectTarget != null ? `${p.goals.weeklyProspectTarget}/minggu` : ''} />
            <Row k="Aspirasi cuan" v={p.goals.monthlyIncomeAspiration != null ? `${formatRupiah(p.goals.monthlyIncomeAspiration)}/bln` : ''} />
          </dl>
          {p.goals.skillTarget && <p className="mt-3 text-sm"><strong>Skill target:</strong> {p.goals.skillTarget}</p>}
          {p.goals.portfolioTarget && <p className="mt-1 text-sm"><strong>Portofolio:</strong> {p.goals.portfolioTarget}</p>}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-display text-lg font-extrabold">✨ Minat bisnis</h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {p.interests.selected.length
              ? p.interests.selected.map((x) => <li key={x} className="chip bg-sky">{labelOf(LABELS.INTERESTS, x)}</li>)
              : <li className="text-sm text-muted">Belum dipilih.</li>}
          </ul>
          {p.interests.otherInterests && <p className="mt-3 text-sm"><strong>Lainnya:</strong> {p.interests.otherInterests}</p>}
          {p.personal.programGoal && (
            <blockquote className="mt-4 rounded-2xl bg-paper-2 p-4 text-sm italic">“{p.personal.programGoal}”</blockquote>
          )}
        </div>
        <div className="card p-5">
          <h3 className="font-display text-lg font-extrabold">🧭 Hasil assessment</h3>
          {assessment ? (
            <>
              <p className="mt-2 text-sm">Top industri: <strong>{assessment.topIndustries.map((k) => `${INDUSTRIES[k].emoji} ${INDUSTRIES[k].name}`).join(' · ')}</strong></p>
              {profile ? (
                <p className="mt-2 text-sm">Profil Cuan: <strong>{profile.emoji} Si {profile.name}</strong> — {profile.oneLiner}</p>
              ) : (
                <p className="mt-2 text-sm text-muted">Profil Cuan belum ada — ulangi assessment versi baru.</p>
              )}
              <Link to="/app/assessment" className="btn-ghost mt-4 inline-flex">Lihat hasil lengkap →</Link>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted">Belum dikerjakan. Gabungkan Passport + Assessment untuk tahu bisnis yang paling cocok.</p>
              <Link to="/app/assessment" className="btn-accent mt-4 inline-flex">Mulai assessment →</Link>
            </>
          )}
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={onEdit}>✏️ Edit Passport</button>
      </div>
    </div>
  );
}
