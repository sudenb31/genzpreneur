import { useState } from 'react';
import { useAccess } from '../auth/AccessProvider';
import { availableTrial, PLAN_INFO } from '../lib/membership';
import { startSelfTrial } from '../lib/data';

const PERKS: Record<'boost' | 'impact', string> = {
  boost: 'Alat Bisnis (HPP & harga, proposal), Cari Pelanggan, dan Season 2–3',
  impact: 'Simulasi Founder lengkap (30 skenario), Season 4, dan playbook tim',
};

/**
 * Kartu "Coba paket berikutnya gratis" — muncul otomatis untuk pemilik Spark/Boost
 * yang belum pernah memakai trial-nya. Sekali klik, trial berjalan; server yang mencatat.
 */
export function TrialOffer({ compact = false }: { compact?: boolean }) {
  const access = useAccess();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState('');
  if (!access || access.loading || access.isAdmin) return null;
  const offer = availableTrial(access.membership, new Date());
  if (!offer) return null;
  const info = PLAN_INFO[offer.plan];

  async function start() {
    setBusy(true); setError('');
    try {
      await startSelfTrial();
      await access?.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memulai trial.');
    } finally {
      setBusy(false); setConfirm(false);
    }
  }

  return (
    <section aria-labelledby="trial-offer-title" className={`card-pop bg-lime ${compact ? 'p-5' : 'p-6'}`}>
      <p className="chip bg-white">🎁 Gratis · sekali per akun</p>
      <h2 id="trial-offer-title" className="mt-3 font-display text-2xl font-extrabold leading-tight">
        Coba {info.emoji} {info.name} {offer.days} hari, gratis.
      </h2>
      <p className="mt-2 text-base">Buka {PERKS[offer.plan]}. Tanpa bayar, tanpa tagihan otomatis. Saat trial selesai, fiturnya terkunci lagi dan progresmu tetap aman.</p>
      {error && <p role="alert" className="mt-3 rounded-2xl bg-white p-3 text-sm font-semibold">⚠️ {error}</p>}
      {confirm ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">Mulai sekarang? Hitung mundur {offer.days} hari langsung berjalan.</span>
          <button type="button" className="btn-accent" disabled={busy} onClick={start}>{busy ? 'Memulai…' : 'Ya, mulai trial'}</button>
          <button type="button" className="btn-ghost" disabled={busy} onClick={() => setConfirm(false)}>Nanti dulu</button>
        </div>
      ) : (
        <button type="button" className="btn-accent mt-4" onClick={() => setConfirm(true)}>Coba {info.name} {offer.days} hari →</button>
      )}
    </section>
  );
}
