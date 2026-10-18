import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { getDreamPact } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import {
  dreamStatement, edgeStatement, LEVELS, lines, milestoneTimeline, PLAN_CATS, SKILL_BRANCHES, whyStatement,
} from '../lib/dreamPact';
import { ErrorState, Logo, PageSkeleton } from '../components/ui';

const PRINT_CSS = `
@page { size: A4; margin: 12mm; }
@media print {
  html, body { background: #fff !important; }
  .no-print { display: none !important; }
  .sheet { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; max-width: none !important; }
  .avoid-break { break-inside: avoid; page-break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}`;

const fmtDate = (s: string) => {
  if (!s) return '____________________';
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function DreamPactPrint() {
  const { profile } = useAuth();
  const { data: rec, loading, error, reload } = useAsync(() => getDreamPact(profile!.uid, profile!.displayName), [profile?.uid]);

  if (loading) return <div className="mx-auto max-w-3xl p-6"><PageSkeleton /></div>;
  if (error || !rec) return <div className="mx-auto max-w-xl p-6"><ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} /></div>;

  const d = rec.data;
  const startYear = d.commit.signDate ? Number(d.commit.signDate.slice(0, 4)) : new Date().getFullYear();
  let timeline: ReturnType<typeof milestoneTimeline> | null = null;
  try {
    if (d.dream.currentAge && d.dream.dreamAge) timeline = milestoneTimeline(d.dream.currentAge, d.dream.dreamAge, startYear);
  } catch { timeline = null; }
  const name = d.commit.signName || profile?.displayName || '';
  const planRows = d.plan.filter((r) => r.program.trim());

  return (
    <div className="min-h-screen bg-paper-2 py-6 print:bg-white print:py-0">
      <style>{PRINT_CSS}</style>

      <div className="no-print mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center justify-between gap-2 px-4">
        <Link to="/app/dream-pact" className="btn-ghost">← Kembali edit</Link>
        <div className="flex items-center gap-2">
          {!rec.exists && <span className="text-sm font-semibold text-danger">Dream Pact belum disimpan.</span>}
          <button type="button" className="btn-accent" onClick={() => window.print()}>🖨️ Cetak / Simpan PDF</button>
        </div>
      </div>

      <article className="sheet mx-auto max-w-[210mm] rounded-3xl border-2 border-ink bg-white p-8 text-ink shadow-[6px_6px_0_0_#111112] sm:p-10">
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b-4 border-ink pb-4">
          <div>
            <Logo />
            <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-amber-ink">Pakta Mimpi</p>
            <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight">DREAM PACT</h1>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">{name || '____________________'}</p>
            <p className="text-muted">{fmtDate(d.commit.signDate)}</p>
          </div>
        </header>

        {/* Dream */}
        <section className="avoid-break mt-6 rounded-2xl bg-ink p-5 text-paper">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-lime">🌟 Dream Statement</p>
          <p className="mt-1 font-display text-2xl font-bold leading-snug">{dreamStatement(d)}</p>
          {d.dream.rememberedAs && <p className="mt-2 text-sm text-paper/80">Ingin dikenang sebagai: <strong className="text-paper">{d.dream.rememberedAs}</strong></p>}
        </section>

        <section className="avoid-break mt-4 grid gap-4 sm:grid-cols-2 print:grid-cols-2">
          <div className="rounded-2xl border-2 border-ink p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-ink">🔥 Personal WHY</p>
            <p className="mt-1 text-sm font-semibold leading-relaxed">{whyStatement(d)}</p>
            {d.why.belief && <p className="mt-2 text-xs text-muted">Keyakinanku: {d.why.belief}</p>}
          </div>
          <div className="rounded-2xl border-2 border-ink p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-amber-ink">⚔️ Edge</p>
            <p className="mt-1 text-sm font-semibold leading-relaxed">{edgeStatement(d)}</p>
          </div>
        </section>

        {/* Milestones */}
        <section className="avoid-break mt-6">
          <h2 className="font-display text-xl font-extrabold">🗺️ Milestone Map</h2>
          <table className="mt-2 w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink text-[11px] uppercase tracking-wider">
                <th className="py-1.5 pr-2">Level</th><th className="py-1.5 pr-2">Usia</th><th className="py-1.5 pr-2">Tahun</th><th className="py-1.5">Target</th>
              </tr>
            </thead>
            <tbody>
              {[...LEVELS].reverse().map((l) => {
                const tm = timeline?.find((x) => x.key === l.key);
                return (
                  <tr key={l.key} className="border-b border-line align-top">
                    <td className="py-2 pr-2 font-bold whitespace-nowrap">{l.emoji} {l.name}</td>
                    <td className="py-2 pr-2">{tm?.age ?? '—'}</td>
                    <td className="py-2 pr-2">{tm?.year ?? '—'}</td>
                    <td className="py-2">{d.milestones[l.key] || (l.key === 'unlocked' ? d.dream.build : '') || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Skill tree */}
        <section className="avoid-break mt-6">
          <h2 className="font-display text-xl font-extrabold">🌳 Skill Tree</h2>
          <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4 print:grid-cols-4">
            {SKILL_BRANCHES.map((b) => (
              <div key={b.key} className="rounded-2xl border-2 border-ink/20 p-3">
                <p className="text-sm font-extrabold">{b.emoji} {b.name}</p>
                <ul className="mt-1 space-y-0.5 text-xs">
                  {lines(d.skillTree[b.key]).length ? lines(d.skillTree[b.key]).map((x) => <li key={x}>• {x}</li>) : <li className="text-muted">—</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Plan */}
        <section className="avoid-break mt-6">
          <h2 className="font-display text-xl font-extrabold">📅 Plan 12 Bulan</h2>
          {planRows.length === 0 ? <p className="mt-2 text-sm text-muted">Belum ada agenda.</p> : (
            <table className="mt-2 w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink text-[11px] uppercase tracking-wider">
                  <th className="py-1.5 pr-2">Kategori</th><th className="py-1.5 pr-2">Program</th><th className="py-1.5 pr-2">Target</th><th className="py-1.5">Waktu</th><th className="py-1.5 pl-2 text-center">✓</th>
                </tr>
              </thead>
              <tbody>
                {PLAN_CATS.flatMap((c) => planRows.filter((r) => r.cat === c.key).map((r, i) => (
                  <tr key={`${c.key}-${i}`} className="border-b border-line align-top">
                    <td className="py-2 pr-2 font-bold whitespace-nowrap">{c.emoji} {c.name}</td>
                    <td className="py-2 pr-2">{r.program}</td>
                    <td className="py-2 pr-2">{r.target || '—'}</td>
                    <td className="py-2">{r.month || '—'}</td>
                    <td className="py-2 pl-2 text-center"><span className="inline-block h-4 w-4 rounded border-2 border-ink" aria-hidden /></td>
                  </tr>
                )))}
              </tbody>
            </table>
          )}
        </section>

        {/* Commit */}
        <section className="avoid-break mt-6 rounded-2xl border-2 border-ink bg-lime p-5">
          <h2 className="font-display text-xl font-extrabold">✍️ Komitmenku</h2>
          <p className="mt-2 text-sm"><strong>Setiap hari:</strong> {d.commit.daily || '____________________________'}</p>
          <p className="mt-1 text-sm"><strong>Setiap minggu:</strong> {d.commit.weekly || '____________________________'}</p>
          <p className="mt-3 text-sm italic">
            Aku, <strong>{name || '____________'}</strong>, berkomitmen menjalankan rencana ini dengan jujur dan konsisten,
            menepati janji kecil setiap hari, dan memperbaikinya setiap bulan — sampai mimpi ini terwujud.
          </p>
        </section>

        <section className="avoid-break mt-8 grid grid-cols-2 gap-8 text-center text-sm">
          <div>
            <p className="text-muted">Yang berkomitmen</p>
            <div className="mt-16 border-t-2 border-ink pt-1 font-bold">{name || ' '}</div>
          </div>
          <div>
            <p className="text-muted">Accountability buddy</p>
            <div className="mt-16 border-t-2 border-ink pt-1 font-bold">{d.commit.buddy || ' '}</div>
          </div>
        </section>

        <footer className="mt-8 flex items-center justify-between border-t border-line pt-3 text-[11px] text-muted">
          <span>GenZ Preneur · Learn. Execute. Grow.</span>
          <span>Tinjau ulang Dream Pact ini setiap akhir bulan.</span>
        </footer>
      </article>
    </div>
  );
}
