import { useState } from 'react';
import { TOOL_GUIDES, type ToolKey } from '../content/toolGuides';

const STORAGE_KEY = 'gzp.toolGuideHidden';

function readHidden(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, boolean>;
  } catch {
    return {};
  }
}

/** Panduan "apa ini & cara pakai" di atas setiap alat. Bisa disembunyikan (diingat per perangkat). */
export default function ToolIntro({ tool }: { tool: ToolKey }) {
  const g = TOOL_GUIDES[tool];
  const [hidden, setHidden] = useState<Record<string, boolean>>(readHidden);
  const isHidden = !!hidden[tool];

  function toggle() {
    const next = { ...hidden, [tool]: !isHidden };
    setHidden(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* penyimpanan tidak tersedia */ }
  }

  return (
    <section className="card overflow-hidden" aria-labelledby={`guide-${tool}`}>
      <div className={`flex flex-wrap items-center gap-4 border-b border-line bg-paper p-5`}>
        <span className="text-2xl" aria-hidden>{g.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold uppercase tracking-wider">Panduan alat</p>
          <h2 id={`guide-${tool}`} className="font-display text-xl font-extrabold">{g.title}</h2>
        </div>
        <button type="button" className="btn-ghost w-full bg-white py-1.5 text-sm sm:w-auto" onClick={toggle} aria-expanded={!isHidden} aria-controls={`guide-body-${tool}`}>
          {isHidden ? 'Tampilkan panduan' : 'Sembunyikan panduan'}
        </button>
      </div>

      {!isHidden && (
        <div id={`guide-body-${tool}`} className="grid gap-5 p-5 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold">🤔 Apa ini?</h3>
              <p className="mt-1 text-sm text-ink/80">{g.what}</p>
            </div>
            <div>
              <h3 className="text-sm font-extrabold">🕒 Kapan dipakai?</h3>
              <ul className="mt-1 space-y-1 text-sm text-ink/80">{g.when.map((w) => <li key={w}>→ {w}</li>)}</ul>
            </div>
            <div className="rounded-2xl bg-paper p-3">
              <h3 className="text-sm font-extrabold">🎁 Hasilnya</h3>
              <p className="mt-1 text-sm text-ink/80">{g.output}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold">🪜 Cara pakai</h3>
              <ol className="mt-2 space-y-2">
                {g.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-sm">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-xs font-extrabold text-lime">{i + 1}</span>
                    <span className="text-ink/80">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            {g.tips && (
              <div className="rounded-2xl border-2 border-dashed border-ink p-3">
                <h3 className="text-sm font-extrabold">💡 Tips</h3>
                <ul className="mt-1 space-y-1 text-sm text-ink/80">{g.tips.map((t) => <li key={t}>✦ {t}</li>)}</ul>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
