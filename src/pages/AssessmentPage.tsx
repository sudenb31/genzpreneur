import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { QUESTIONS, SECTION_INFO, TRACKS } from '../content/assessment';
import { PROFILE_DISCLAIMER, PROFILE_KEYS, WEALTH_PROFILES, type ProfileKey } from '../content/wealthProfiles';
import { INDUSTRIES } from '../content/industries';
import { PATH_FAMILIES, pathsByFamily } from '../content/paths';
import { getAssessment, saveAssessment, type AssessmentRecord } from '../lib/data';
import { isComplete, scoreAssessment, type Answers } from '../lib/assessment';
import { useAsync } from '../lib/useAsync';
import { ErrorState, PageHeader, PageSkeleton, ProgressBar, useToast } from '../components/ui';

const MEDALS = ['🥇', '🥈', '🥉'];
const TILE = ['bg-lime', 'bg-sky', 'bg-lilac'];

export default function AssessmentPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const { data: saved, setData: setSaved, loading, error, reload } = useAsync(() => getAssessment(profile!.uid), [profile?.uid]);
  const [mode, setMode] = useState<'auto' | 'quiz'>('auto');
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  if (loading) return <PageSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const showResult = mode === 'auto' && saved;
  const showIntro = mode === 'auto' && !saved;

  function start() {
    setAnswers({});
    setStep(0);
    setMode('quiz');
  }

  async function finish(final: Answers) {
    if (!profile || !isComplete(final)) return;
    const r = scoreAssessment(final);
    setSaving(true);
    try {
      await saveAssessment(profile.uid, r);
      const rec: AssessmentRecord = { ...r, attempts: (saved?.attempts ?? 0) + 1, completedAt: new Date() };
      setSaved(rec);
      setMode('auto');
      toast('success', 'Hasil assessment tersimpan!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
      toast('error', 'Hasil gagal disimpan. Periksa koneksi lalu coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  /* ------------------------------ Intro ------------------------------ */
  if (showIntro) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Temukan Jalurmu · Assessment" title={<>Cari arah untuk <span className="text-amber">dicoba</span>.</>}
          desc={`${QUESTIONS.length} pertanyaan (±8 menit) dalam 2 bagian. Hasilnya: 3 industri untuk dipertimbangkan, jalur mulai, cara mulai modal Rp0, dan Profil Cuan-mu — lengkap dengan contoh tokoh dunia & tokoh Muslim.`} />
        <div className="grid gap-4 sm:grid-cols-2">
          {(['industry', 'profile'] as const).map((sec) => (
            <div key={sec} className="card p-5">
              <p className="text-3xl" aria-hidden>{SECTION_INFO[sec].emoji}</p>
              <h2 className="mt-2 font-display text-lg font-extrabold">{SECTION_INFO[sec].name}</h2>
              <p className="text-sm text-muted">{SECTION_INFO[sec].desc} · {QUESTIONS.filter((q) => q.section === sec).length} soal</p>
            </div>
          ))}
        </div>
        <div className="card-pop grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <ul className="space-y-2 text-sm">
            <li>✦ Jawab jujur — nggak ada jawaban benar atau salah.</li>
            <li>✦ Pilih yang paling mendekati, walau nggak 100% pas.</li>
            <li>✦ Bisa diulang kapan saja.</li>
          </ul>
          <button type="button" className="btn-accent px-7 py-3 text-base" onClick={start}>Mulai sekarang →</button>
        </div>
        <Link to="/app/action-plan" className="btn-ghost">Langsung praktik di Misi Pertama →</Link>
        <p className="text-xs text-muted">Ini alat bantu refleksi untuk memilih titik mulai, bukan tes psikologi terstandar dan bukan jaminan keberhasilan di industri tertentu.</p>
      </div>
    );
  }

  /* ------------------------------- Quiz ------------------------------ */
  if (!showResult) {
    const q = QUESTIONS[step];
    const pct = Math.round((step / QUESTIONS.length) * 100);
    const choose = (optId: string) => {
      const next = { ...answers, [q.id]: optId };
      setAnswers(next);
      if (step < QUESTIONS.length - 1) setTimeout(() => setStep(step + 1), 160);
    };
    const last = step === QUESTIONS.length - 1;
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="chip">{SECTION_INFO[q.section].emoji} {SECTION_INFO[q.section].name}</span>
            <p className="eyebrow mt-2">Pertanyaan {step + 1} dari {QUESTIONS.length}</p>
          </div>
          {saved && <button type="button" className="text-sm font-semibold text-muted underline" onClick={() => setMode('auto')}>Batal</button>}
        </div>
        <ProgressBar value={pct} label="Progres" />
        {q.section === 'profile' && QUESTIONS[step - 1]?.section === 'industry' && (
          <div className="card bg-lilac p-4 text-sm">
            <strong>Bagian A selesai! 🎉</strong> Sekarang Bagian B: Profil Cuan — bukan soal bisnis apa, tapi <em>cara alamimu</em> menciptakan nilai.
          </div>
        )}
        <fieldset className="card-pop p-6">
          <legend className="sr-only">{q.text}</legend>
          <h2 className="font-display text-2xl font-extrabold leading-tight">{q.text}</h2>
          {q.hint && <p className="mt-1 text-sm text-muted">{q.hint}</p>}
          <div className="mt-5 grid gap-2.5">
            {q.options.map((o, i) => {
              const on = answers[q.id] === o.id;
              return (
                <button key={o.id} type="button" aria-pressed={on} onClick={() => choose(o.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${on ? 'border-ink bg-lime shadow-[3px_3px_0_0_#111112]' : 'border-line bg-white hover:border-ink'}`}>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-xs font-extrabold ${on ? 'border-ink bg-ink text-lime' : 'border-line text-muted'}`}>{String.fromCharCode(65 + i)}</span>
                  {o.label}
                </button>
              );
            })}
          </div>
        </fieldset>
        <div className="flex justify-between gap-2">
          <button type="button" className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Kembali</button>
          {last ? (
            <button type="button" className="btn-accent" disabled={!isComplete(answers) || saving} onClick={() => void finish(answers)}>
              {saving ? 'Menghitung…' : 'Lihat hasilku ✨'}
            </button>
          ) : (
            <button type="button" className="btn-primary" disabled={!answers[q.id]} onClick={() => setStep(step + 1)}>Lanjut →</button>
          )}
        </div>
      </div>
    );
  }

  /* ------------------------------ Result ----------------------------- */
  const r = saved!;
  const track = TRACKS[r.track];
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Hasil Assessment" title="Ini saran refleksi dari jawabanmu"
        desc={r.completedAt ? `Diperbarui ${r.completedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}` : undefined}
        right={<button type="button" className="btn-ghost" onClick={start}>Ulangi assessment</button>} />

      <section className="card-pop flex flex-col gap-4 bg-ink p-6 text-paper sm:flex-row sm:items-center">
        <span className="text-5xl" aria-hidden>{track.emoji}</span>
        <div className="flex-1">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-lime">Gaya main untuk dipertimbangkan · {PATH_FAMILIES[r.track].emoji} {PATH_FAMILIES[r.track].title}</p>
          <h2 className="font-display text-3xl font-extrabold">{track.name}</h2>
          <p className="mt-1 text-paper/75">{track.desc}</p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold">Jalur mulai yang bisa kamu coba</h2>
          <p className="text-sm text-muted">Turunan konkret dari gaya main {PATH_FAMILIES[r.track].title}. Pilih satu jika relevan; buat contoh dan uji kebutuhannya, tanpa tenggat wajib.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pathsByFamily(r.track).map((p) => (
            <article key={p.key} className="card flex flex-col p-5">
              <p className="text-3xl" aria-hidden>{p.emoji}</p>
              <h3 className="mt-1 font-display text-lg font-extrabold">{p.name}</h3>
              <p className="text-sm text-ink/75">{p.oneLiner}</p>
              <dl className="mt-3 space-y-1 text-xs">
                <div><dt className="inline font-bold">💸 Cuan: </dt><dd className="inline text-ink/75">{p.howMoney}</dd></div>
                <div><dt className="inline font-bold">🪙 Modal: </dt><dd className="inline text-ink/75">{p.capital}</dd></div>
                <div><dt className="inline font-bold">🧰 Skill: </dt><dd className="inline text-ink/75">{p.skills}</dd></div>
              </dl>
              <p className="mt-3 rounded-2xl bg-lime/60 p-3 text-xs"><strong>Langkah pertama:</strong> {p.firstStep}</p>
              <p className="mt-2 flex-1 text-xs text-amber-ink"><strong>⚠️ Hati-hati:</strong> {p.watchOut}</p>
            </article>
          ))}
        </div>
      </section>

      <ProfileResult scores={r.profileScores} top={r.topProfiles} onRetake={start} />

      <section className="space-y-5">
        <h2 className="font-display text-2xl font-extrabold">Top 3 industri untukmu</h2>
        {r.topIndustries.map((key, i) => {
          const ind = INDUSTRIES[key];
          const score = r.industryScores[key] ?? 0;
          return (
            <article key={key} className="card-pop overflow-hidden">
              <div className={`flex flex-wrap items-center gap-4 border-b-2 border-ink p-5 ${TILE[i]}`}>
                <span className="text-4xl" aria-hidden>{ind.emoji}</span>
                <div className="flex-1">
                  <p className="text-xs font-extrabold uppercase tracking-wider">{MEDALS[i]} Peringkat {i + 1}</p>
                  <h3 className="font-display text-2xl font-extrabold">{ind.name}</h3>
                  <p className="text-sm text-ink/75">{ind.tagline}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-extrabold">{score}%</p>
                  <p className="text-xs font-semibold">kecocokan</p>
                </div>
              </div>
              <div className="grid gap-5 p-5 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-extrabold">💸 Cara mulai modal Rp0</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-ink/80">{ind.zeroCapitalRoutes.map((x) => <li key={x}>→ {x}</li>)}</ul>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold">🎯 Calon klien pertama</h4>
                  <ul className="mt-2 flex flex-wrap gap-1.5">{ind.firstTargets.map((x) => <li key={x} className="rounded-full bg-paper-2 px-2.5 py-1 text-xs font-semibold">{x}</li>)}</ul>
                  <h4 className="mt-4 text-sm font-extrabold">🧰 Skill yang dipakai</h4>
                  <p className="mt-1 text-sm text-ink/80">{ind.skills.join(' · ')}</p>
                </div>
                <div className="rounded-2xl bg-paper p-4 md:col-span-2">
                  <p className="text-sm"><strong>Penawaran pertama:</strong> {ind.firstOffer}</p>
                  <p className="mt-2 text-sm text-amber-ink"><strong>⚠️ Hati-hati:</strong> {ind.watchOut}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-line p-5 pt-4">
                <Link to={`/app/outreach?industri=${key}&skenario=sales_partner`} className="btn-accent">Buat pesan outreach →</Link>
                <Link to="/app/toolkit?tab=prompts" className="btn-ghost">Riset dengan AI prompt</Link>
              </div>
            </article>
          );
        })}
      </section>

      <section className="card p-6">
        <h2 className="font-display text-xl font-extrabold">Skor lengkap</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {Object.values(INDUSTRIES)
            .sort((a, b) => (r.industryScores[b.key] ?? 0) - (r.industryScores[a.key] ?? 0))
            .map((ind) => <li key={ind.key}><ProgressBar value={r.industryScores[ind.key] ?? 0} label={`${ind.emoji} ${ind.name}`} /></li>)}
        </ul>
        <p className="mt-5 text-xs text-muted">Skor dihitung dari bobot jawabanmu (bukan AI dan bukan tes psikologi). Gunakan sebagai titik mulai, lalu uji langsung di lapangan.</p>
      </section>

      <section className="card-pop flex flex-col gap-3 bg-lime p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-extrabold">Langkah berikutnya</h2>
          <p className="text-sm">Pilih satu masalah dan bantuan kecil di Misi Pertama. Hasil assessment belum membuktikan kebutuhan pelanggan.</p>
        </div>
        <Link to="/app/action-plan" className="btn-primary">Buka Misi Pertama →</Link>
      </section>
    </div>
  );
}

/* --------------------------- Profil Cuan ---------------------------- */
function ProfileResult({ scores, top, onRetake }: { scores: Record<string, number>; top: ProfileKey[]; onRetake: () => void }) {
  if (top.length === 0) {
    return (
      <section className="card-pop flex flex-col gap-3 bg-lilac p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Baru! 💰 Profil Cuan</p>
          <h2 className="font-display text-xl font-extrabold">Hasilmu dari versi lama — belum ada Profil Cuan</h2>
          <p className="text-sm">Assessment sekarang punya {QUESTIONS.length} soal, termasuk 8 Profil Cuan dengan contoh tokoh dunia & tokoh Muslim. Ulangi untuk melihatnya.</p>
        </div>
        <button type="button" className="btn-primary" onClick={onRetake}>Ulangi assessment →</button>
      </section>
    );
  }
  const main = WEALTH_PROFILES[top[0]];
  const second = top[1] ? WEALTH_PROFILES[top[1]] : null;
  return (
    <section className="space-y-5">
      <div>
        <p className="eyebrow">💰 Profil Cuan</p>
        <h2 className="font-display text-2xl font-extrabold">Cara alamimu menciptakan kekayaan</h2>
      </div>

      <article className="card-pop overflow-hidden">
        <div className={`flex flex-wrap items-center gap-4 border-b-2 border-ink p-6 ${main.tile}`}>
          <span className="text-5xl" aria-hidden>{main.emoji}</span>
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-wider">Profil utama · {main.alias}</p>
            <h3 className="font-display text-3xl font-extrabold">Si {main.name}</h3>
            <p className="text-sm text-ink/80">{main.oneLiner}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-extrabold">{scores[main.key] ?? 0}%</p>
            <p className="text-xs font-semibold">kecocokan</p>
          </div>
        </div>
        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <h4 className="text-sm font-extrabold">🏆 Cara kamu menang</h4>
            <p className="mt-1 text-sm text-ink/80">{main.howYouWin}</p>
          </div>
          <div>
            <h4 className="text-sm font-extrabold">💪 Kekuatan</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-ink/80">{main.strengths.map((x) => <li key={x}>✦ {x}</li>)}</ul>
          </div>
          <div>
            <h4 className="text-sm font-extrabold">⚠️ Jebakan yang perlu diwaspadai</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-ink/80">{main.watchOut.map((x) => <li key={x}>→ {x}</li>)}</ul>
          </div>
          <div className="rounded-2xl bg-paper p-4 md:col-span-2">
            <p className="text-sm"><strong>🤝 Peranmu di tim:</strong> {main.teamRole}</p>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-sm font-extrabold">🚀 Mulai dari sini (modal kecil)</h4>
            <ul className="mt-2 space-y-1.5 text-sm text-ink/80">{main.startHere.map((x) => <li key={x}>→ {x}</li>)}</ul>
          </div>
        </div>

        <div className="grid gap-5 border-t-2 border-ink p-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-extrabold">🌍 Contoh tokoh dunia</h4>
            <ul className="mt-2 flex flex-wrap gap-1.5">{main.globalFigures.map((x) => <li key={x} className="rounded-full bg-paper-2 px-2.5 py-1 text-xs font-semibold">{x}</li>)}</ul>
          </div>
          <div>
            <h4 className="text-sm font-extrabold">🕌 Teladan dari generasi Muslim terdahulu</h4>
            <ul className="mt-2 space-y-2 text-sm">
              {main.muslimFigures.map((f) => <li key={f.name}><strong>{f.name}</strong> — <span className="text-ink/80">{f.why}</span></li>)}
            </ul>
          </div>
        </div>
      </article>

      {second && (
        <article className="card flex flex-wrap items-start gap-4 p-5">
          <span className={`grid h-14 w-14 place-items-center rounded-2xl border-2 border-ink text-3xl ${second.tile}`} aria-hidden>{second.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Profil kedua · {scores[second.key] ?? 0}%</p>
            <h3 className="font-display text-xl font-extrabold">Si {second.name}</h3>
            <p className="text-sm text-ink/80">{second.oneLiner}</p>
            <p className="mt-2 text-xs text-muted">Contoh: {second.globalFigures.join(', ')} · {second.muslimFigures.map((f) => f.name).join(', ')}</p>
          </div>
        </article>
      )}

      <div className="card p-6">
        <h3 className="font-display text-lg font-extrabold">Skor 8 Profil Cuan</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[...PROFILE_KEYS]
            .sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0))
            .map((k) => <li key={k}><ProgressBar value={scores[k] ?? 0} label={`${WEALTH_PROFILES[k].emoji} ${WEALTH_PROFILES[k].name}`} /></li>)}
        </ul>
        <p className="mt-5 text-xs text-muted">{PROFILE_DISCLAIMER}</p>
      </div>
    </section>
  );
}
