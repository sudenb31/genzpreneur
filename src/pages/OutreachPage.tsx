import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { INDUSTRIES, INDUSTRY_KEYS, type IndustryKey } from '../content/industries';
import { getAssessment, saveItem } from '../lib/data';
import { isIndustryKey } from '../lib/assessment';
import {
  buildAiPrompt, buildMessage, CHANNELS, OBJECTIONS, OUTREACH_RULES, SCENARIOS, TONES, whatsappLink,
  type OutreachInput, type ScenarioKey,
} from '../lib/outreach';
import { CopyButton, PageHeader, useToast } from '../components/ui';

const isScenario = (v: string | null): v is ScenarioKey => !!v && SCENARIOS.some((s) => s.key === v);

export default function OutreachPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const [params] = useSearchParams();
  const qIndustry = params.get('industri');
  const qScenario = params.get('skenario');

  const [input, setInput] = useState<OutreachInput>({
    scenario: isScenario(qScenario) ? qScenario : 'service_offer',
    channel: 'whatsapp',
    tone: 'casual',
    myName: profile?.displayName ?? '',
    myContext: '',
    targetName: '',
    businessName: '',
    industry: isIndustryKey(qIndustry) ? qIndustry : 'fashion',
    offer: '',
    observation: '',
  });
  const [view, setView] = useState<'message' | 'prompt'>('message');
  const [saving, setSaving] = useState(false);

  // Isi industri otomatis dari hasil Assessment bila tidak ada di URL.
  useEffect(() => {
    if (!profile || isIndustryKey(qIndustry)) return;
    getAssessment(profile.uid).then((a) => {
      if (a?.topIndustries[0]) setInput((s) => ({ ...s, industry: a.topIndustries[0] }));
    }).catch(() => {});
  }, [profile, qIndustry]);

  const set = <K extends keyof OutreachInput>(k: K, v: OutreachInput[K]) => setInput((s) => ({ ...s, [k]: v }));
  const msg = useMemo(() => buildMessage(input), [input]);
  const prompt = useMemo(() => buildAiPrompt(input), [input]);
  const scenario = SCENARIOS.find((s) => s.key === input.scenario)!;
  const fullText = msg.subject ? `Subject: ${msg.subject}\n\n${msg.body}` : msg.body;
  const output = view === 'message' ? fullText : prompt;
  const missing = !input.businessName.trim() || !input.myName.trim();

  async function save() {
    if (!profile) return;
    setSaving(true);
    try {
      await saveItem(profile.uid, view === 'message' ? 'outreach' : 'prompt',
        `${scenario.name} · ${input.businessName.trim() || 'tanpa nama bisnis'}`, output);
      toast('success', 'Tersimpan di menu Tersimpan.');
    } catch (e) {
      console.error(e);
      toast('error', 'Gagal menyimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Pendekatan personal · Outreach Studio" title={<>Siapkan pesan yang <span className="text-amber">relevan</span>.</>}
        desc="Mulai dari pengamatan, contoh, dan penawaranmu. Pesan ini adalah draf; kamu memeriksa dan mengirimnya sendiri, tanpa broadcast." />

      <Link to="/app/action-plan?tahap=approach" className="btn-ghost">← Buka tahap pendekatan di Misi Pertama</Link>
      {/* Skenario */}
      <section aria-labelledby="sc-h">
        <h2 id="sc-h" className="mb-3 font-display text-lg font-extrabold">1. Mau ngapain?</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SCENARIOS.map((s) => {
            const on = input.scenario === s.key;
            return (
              <button key={s.key} type="button" aria-pressed={on} onClick={() => set('scenario', s.key)}
                className={`rounded-3xl border-2 p-4 text-left transition ${on ? 'border-ink bg-lime shadow-[3px_3px_0_0_#111112]' : 'border-line bg-white hover:border-ink'}`}>
                <span className="text-2xl" aria-hidden>{s.emoji}</span>
                <p className="mt-1 font-bold">{s.name}</p>
                <p className="mt-0.5 text-xs text-ink/70">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <section className="card space-y-4 p-5" aria-labelledby="form-h">
          <h2 id="form-h" className="font-display text-lg font-extrabold">2. Isi detailnya</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="o-ch" className="label">Kirim lewat</label>
              <select id="o-ch" className="input" value={input.channel} onChange={(e) => set('channel', e.target.value as OutreachInput['channel'])}>
                {CHANNELS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="o-tone" className="label">Gaya bahasa</label>
              <select id="o-tone" className="input" value={input.tone} onChange={(e) => set('tone', e.target.value as OutreachInput['tone'])}>
                {TONES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="o-me" className="label">Nama kamu *</label>
              <input id="o-me" className="input" value={input.myName} maxLength={60} onChange={(e) => set('myName', e.target.value)} />
            </div>
            <div>
              <label htmlFor="o-ctx" className="label">Kamu siapa? (singkat)</label>
              <input id="o-ctx" className="input" placeholder="mahasiswa manajemen semester 5" value={input.myContext} maxLength={80} onChange={(e) => set('myContext', e.target.value)} />
            </div>
            <div>
              <label htmlFor="o-biz" className="label">Nama bisnis / orang tujuan *</label>
              <input id="o-biz" className="input" placeholder="Kopi Senja" value={input.businessName} maxLength={80} onChange={(e) => set('businessName', e.target.value)} />
            </div>
            <div>
              <label htmlFor="o-tn" className="label">Nama yang disapa</label>
              <input id="o-tn" className="input" placeholder="Rina (opsional)" value={input.targetName} maxLength={60} onChange={(e) => set('targetName', e.target.value)} />
            </div>
          </div>
          <div>
            <label htmlFor="o-ind" className="label">Industri</label>
            <select id="o-ind" className="input" value={input.industry} onChange={(e) => set('industry', e.target.value as IndustryKey)}>
              {INDUSTRY_KEYS.map((k) => <option key={k} value={k}>{INDUSTRIES[k].emoji} {INDUSTRIES[k].name}</option>)}
            </select>
          </div>
          {scenario.needsOffer && (
            <div>
              <label htmlFor="o-offer" className="label">Yang kamu tawarkan</label>
              <input id="o-offer" className="input" placeholder={INDUSTRIES[input.industry].firstOffer} value={input.offer} maxLength={160} onChange={(e) => set('offer', e.target.value)} />
            </div>
          )}
          <div>
            <label htmlFor="o-obs" className="label">Hal spesifik yang kamu perhatikan 🔍</label>
            <textarea id="o-obs" rows={2} className="input" maxLength={200}
              placeholder="menu di GoFood belum ada fotonya, padahal ulasannya bagus-bagus"
              value={input.observation} onChange={(e) => set('observation', e.target.value)} />
            <p className="hint">Kalimat inilah yang bikin pesanmu dibalas. Tanpa ini, pesan terasa seperti spam.</p>
          </div>
        </section>

        {/* Output */}
        <section className="card-pop flex flex-col p-5" aria-labelledby="out-h">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="out-h" className="font-display text-lg font-extrabold">3. Hasilnya</h2>
            <div role="tablist" className="flex rounded-full border-2 border-ink p-0.5 text-xs font-bold">
              <button role="tab" type="button" aria-selected={view === 'message'} onClick={() => setView('message')}
                className={`rounded-full px-3 py-1.5 ${view === 'message' ? 'bg-ink text-paper' : ''}`}>Pesan siap kirim</button>
              <button role="tab" type="button" aria-selected={view === 'prompt'} onClick={() => setView('prompt')}
                className={`rounded-full px-3 py-1.5 ${view === 'prompt' ? 'bg-ink text-paper' : ''}`}>Prompt AI</button>
            </div>
          </div>
          {missing && <p className="mt-3 rounded-2xl bg-amber-soft px-3 py-2 text-xs font-semibold text-amber-ink">Isi nama kamu dan nama bisnis supaya pesannya lengkap.</p>}
          <pre className="mt-3 max-h-[460px] flex-1 overflow-auto whitespace-pre-wrap rounded-2xl bg-paper p-4 font-sans text-sm leading-relaxed">{output}</pre>
          {view === 'prompt' && <p className="mt-2 text-xs text-muted">Salin lalu tempel ke ChatGPT, Claude, atau Gemini untuk 3 variasi yang lebih personal.</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton text={output} className="btn-accent" label="Salin" />
            {view === 'message' && input.channel === 'whatsapp' && (
              <a className="btn-ghost" href={whatsappLink(msg.body)} target="_blank" rel="noopener noreferrer">Buka di WhatsApp</a>
            )}
            <button type="button" className="btn-ghost" onClick={() => void save()} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</button>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-display text-lg font-extrabold">🛡️ Aturan main outreach</h2>
          <ul className="mt-3 space-y-2 text-sm">{OUTREACH_RULES.map((r) => <li key={r} className="flex gap-2"><span aria-hidden>✦</span>{r}</li>)}</ul>
        </section>
        <section className="card p-5">
          <h2 className="font-display text-lg font-extrabold">💬 Kalau dijawab begini…</h2>
          <div className="mt-3 space-y-2">
            {OBJECTIONS.map((o) => (
              <details key={o.q} className="group rounded-2xl border-2 border-line p-3 open:border-ink">
                <summary className="cursor-pointer list-none text-sm font-bold">{o.q}</summary>
                <p className="mt-2 text-sm text-ink/80">{o.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
