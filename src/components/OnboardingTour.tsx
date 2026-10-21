import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLAN_INFO, FEATURE_MIN, type FeatureKey, type PlanKey } from '../lib/membership';

/**
 * Tur singkat untuk peserta baru (semua paket).
 * Langkah 0 = sambutan. Langkah 1–5 menyorot menu di sidebar (atribut data-tour di NavLink).
 * Di layar kecil (sidebar tersembunyi) kartu tampil di tengah tanpa sorotan.
 */
export interface TourStep {
  target?: string;
  emoji: string;
  title: string;
  body: string;
  feature?: FeatureKey;
  go?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    emoji: '👋',
    title: 'Selamat datang di GenZ Preneur!',
    body: 'Di sini kamu belajar mengubah skill yang sudah kamu punya jadi jasa pertamamu: temukan bisnis yang butuh bantuan, buat contoh kerja, susun harga, lalu tawarkan. Ikuti 5 langkah singkat ini supaya tidak bingung harus mulai dari mana.',
  },
  {
    target: '/app/action-plan', emoji: '✅', title: '1. Mulai dari Misi Pertama',
    body: 'Ini jalur utamamu: 9 tahap dari memilih satu masalah bisnis sampai penawaran siap dikirim. Kerjakan satu tahap per hari, drafmu tersimpan otomatis.',
    feature: 'actionPlan', go: '/app/action-plan',
  },
  {
    target: '/app/kurikulum', emoji: '📚', title: '2. Belajar saat butuh',
    body: 'Materi pendukung per season. Tidak perlu ditonton semua dulu, buka saat kamu macet di salah satu tahap Misi Pertama.',
    go: '/app/kurikulum',
  },
  {
    target: '/app/simulasi', emoji: '🎮', title: '3. Latihan jadi founder',
    body: 'Simulasi Founder: jalankan bisnis 90 hari lewat 10 keputusan, lengkap dengan laporan per bulan dan job desk tim. Level 1 gratis di 10 industri.',
    feature: 'simulatorTeaser', go: '/app/simulasi',
  },
  {
    target: '/app/toolkit', emoji: '⚡', title: '4. Pakai alat bisnis',
    body: 'Alat Bisnis (hitung HPP & harga, proposal) dan Cari Pelanggan (draf pesan ke calon klien) mempercepat Misi Pertamamu.',
    feature: 'toolkit', go: '/app/toolkit',
  },
  {
    target: '/app/pengaturan', emoji: '🎟️', title: '5. Cek paket & tukar kode',
    body: 'Di Akun & Paket kamu bisa melihat paketmu. Sudah beli lewat GoAkal? Tukarkan kode dari emailmu di menu Tukar Voucher. Tur ini bisa dibuka lagi dari Dashboard kapan saja.',
    go: '/app/pengaturan',
  },
];

const RANK: PlanKey[] = ['none', 'spark', 'boost', 'impact'];

export const tourKey = (uid: string) => `gzp-tour-done:${uid}`;

export function hasSeenTour(uid: string): boolean {
  try { return localStorage.getItem(tourKey(uid)) === '1'; } catch { return true; }
}

function markSeen(uid: string) {
  try { localStorage.setItem(tourKey(uid), '1'); } catch { /* opsional */ }
}

/** Event global supaya tombol "Lihat tur" di Dashboard bisa membuka ulang tur. */
export const OPEN_TOUR_EVENT = 'gzp:open-tour';
export function openTour() { window.dispatchEvent(new Event(OPEN_TOUR_EVENT)); }

function visibleTarget(to?: string): HTMLElement | null {
  if (!to) return null;
  const els = [...document.querySelectorAll<HTMLElement>(`[data-tour="${to}"]`)];
  return els.find((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && el.offsetParent !== null; }) ?? null;
}

export function OnboardingTour({ uid, plan, isAdmin }: { uid: string; plan: PlanKey; isAdmin: boolean }) {
  const nav = useNavigate();
  const [open, setOpen] = useState(() => !hasSeenTour(uid));
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const s = TOUR_STEPS[step];
  const last = step === TOUR_STEPS.length - 1;

  useEffect(() => {
    const onOpen = () => { setStep(0); setOpen(true); };
    window.addEventListener(OPEN_TOUR_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_TOUR_EVENT, onOpen);
  }, []);

  const measure = useCallback(() => {
    const el = visibleTarget(s?.target);
    if (el) { el.scrollIntoView({ block: 'nearest' }); setRect(el.getBoundingClientRect()); } else setRect(null);
  }, [s?.target]);

  useLayoutEffect(() => {
    if (!open) return;
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open, measure]);

  function close() { markSeen(uid); setOpen(false); }

  if (!open || !s) return null;

  const need = s.feature ? FEATURE_MIN[s.feature] : null;
  const locked = !!need && !isAdmin && RANK.indexOf(plan) < RANK.indexOf(need);

  const card = (
    <div role="dialog" aria-modal="true" aria-labelledby="tour-title" className="tour-card card-pop w-[min(92vw,420px)] bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="chip bg-lime">{step === 0 ? 'Tur singkat · 1 menit' : `Langkah ${step} dari ${TOUR_STEPS.length - 1}`}</span>
        <button type="button" className="text-sm font-bold underline" onClick={close}>Lewati</button>
      </div>
      <p className="mt-4 text-4xl" aria-hidden>{s.emoji}</p>
      <h2 id="tour-title" className="mt-2 font-display text-2xl font-extrabold leading-tight">{s.title}</h2>
      <p className="mt-2 text-base leading-relaxed">{s.body}</p>
      {locked && need && (
        <p className="mt-3 rounded-2xl bg-amber-soft p-3 text-sm">
          🔒 Fitur ini ada di <strong>{PLAN_INFO[need].emoji} {PLAN_INFO[need].name}</strong>. Paketmu sekarang {PLAN_INFO[plan].name}.
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5" aria-hidden>
          {TOUR_STEPS.map((_, i) => <span key={i} className={`h-2 w-3.5 rounded-full border border-ink ${i <= step ? 'bg-ink' : 'bg-white'}`} />)}
        </div>
        <div className="flex gap-2">
          {step > 0 && <button type="button" className="btn-ghost whitespace-nowrap px-3 py-2" onClick={() => setStep(step - 1)}>Kembali</button>}
          {last ? (
            <button type="button" className="btn-accent whitespace-nowrap px-4 py-2" onClick={() => { close(); nav('/app/action-plan'); }}>Mulai Misi Pertama →</button>
          ) : (
            <button type="button" className="btn-accent whitespace-nowrap px-4 py-2" onClick={() => setStep(step + 1)}>{step === 0 ? 'Mulai tur →' : 'Lanjut →'}</button>
          )}
        </div>
      </div>
    </div>
  );

  // Posisi kartu: di kanan sorotan (desktop), atau di tengah layar.
  const pad = 6;
  const cardStyle = rect
    ? { position: 'fixed' as const, top: Math.max(16, Math.min(rect.top - 20, window.innerHeight - 380)), left: Math.min(rect.right + 24, window.innerWidth - 440) }
    : undefined;

  return (
    <div className="tour-root" aria-live="polite">
      {rect ? (
        <div aria-hidden className="tour-spot" style={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }} />
      ) : (
        <div aria-hidden className="tour-backdrop" />
      )}
      {rect ? <div style={cardStyle} className="z-[61]">{card}</div> : <div className="tour-center">{card}</div>}
    </div>
  );
}
