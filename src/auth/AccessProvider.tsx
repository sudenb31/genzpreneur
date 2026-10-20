import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { getAccessConfig, getMembership } from '../lib/data';
import { isAdminRole } from '../lib/roles';
import {
  canUse, effectivePlan, FEATURE_LABEL, FEATURE_MIN, formatRemaining, PLAN_INFO, trialMsLeft, trialState,
  type FeatureKey, type Membership, type PlanKey, type TrialState,
} from '../lib/membership';

interface AccessState {
  loading: boolean;
  membership: Membership | null;
  gatingEnabled: boolean;
  isAdmin: boolean;
  plan: PlanKey;
  trial: TrialState;
  trialLeftMs: number;
  can: (f: FeatureKey) => boolean;
  reload: () => Promise<void>;
}

const AccessContext = createContext<AccessState | null>(null);

/**
 * Hak akses fitur berdasarkan paket & trial.
 * CATATAN JUJUR: materi saat ini dikirim bersama kode aplikasi, jadi penguncian ini
 * mengatur TAMPILAN. Data paket & trial sendiri dijaga Security Rules (hanya admin
 * yang bisa mengubah). Perlindungan materi berbayar di server direncanakan Sprint 3.
 */
export function AccessProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [gatingEnabled, setGating] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(async () => {
    if (!profile) { setLoading(false); return; }
    setLoading(true);
    try {
      const [m, cfg] = await Promise.all([
        getMembership(profile.email).catch(() => null),
        getAccessConfig().catch(() => ({ gatingEnabled: false })),
      ]);
      setMembership(m);
      setGating(cfg.gatingEnabled);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => { void load(); }, [load]);
  // Hitung ulang tiap menit supaya trial yang habis langsung terkunci tanpa reload.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo<AccessState>(() => {
    const isAdmin = isAdminRole(profile?.role);
    const plan = effectivePlan(membership, now);
    return {
      loading,
      membership,
      gatingEnabled,
      isAdmin,
      plan,
      trial: trialState(membership, now),
      trialLeftMs: trialMsLeft(membership, now),
      can: (f) => canUse(f, { gatingEnabled, isAdmin, plan }),
      reload: load,
    };
  }, [loading, membership, gatingEnabled, profile?.role, now, load]);

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

/** Versi lunak: null jika dipakai di luar <AccessProvider> (mis. di tes komponen). */
export function useMaybeAccess(): AccessState | null {
  return useContext(AccessContext);
}

export function useAccess(): AccessState {
  const ctx = useContext(AccessContext);
  if (!ctx) throw new Error('useAccess harus dipakai di dalam <AccessProvider>.');
  return ctx;
}

/** Kartu "terkunci" yang menjelaskan fitur ada di paket mana. */
export function LockedFeature({ feature }: { feature: FeatureKey }) {
  const { plan, membership } = useAccess();
  const need = PLAN_INFO[FEATURE_MIN[feature]];
  return (
    <div className="card-pop mx-auto max-w-xl space-y-4 p-8 text-center">
      <p className="text-5xl" aria-hidden>🔒</p>
      <h1 className="font-display text-2xl font-extrabold">{FEATURE_LABEL[feature]} ada di {need.emoji} {need.name}</h1>
      <p className="text-sm text-ink/75">
        Paketmu sekarang: <strong>{PLAN_INFO[plan].emoji} {PLAN_INFO[plan].name}</strong>.
        {membership?.trial && trialState(membership, new Date()) === 'expired' && <> Trial {PLAN_INFO[membership.trial.plan].name}-mu sudah berakhir.</>}
      </p>
      <p className="text-sm text-muted">Sudah beli paket? Tukarkan kode vouchermu. Mau mencoba trial? Hubungi tim GenZ Preneur — progres dan data kamu tetap aman.</p>
      <div className="flex flex-wrap justify-center gap-2">
        <Link to="/voucher" className="btn-accent">🎟️ Tukar voucher</Link>
        <Link to="/#harga" className="btn-ghost">Lihat paket</Link>
        <Link to="/app" className="btn-ghost">Ke dashboard</Link>
      </div>
    </div>
  );
}

export function RequireFeature({ feature, children }: { feature: FeatureKey; children: ReactNode }) {
  const { loading, can } = useAccess();
  if (loading) return null;
  return can(feature) ? <>{children}</> : <LockedFeature feature={feature} />;
}

/** Banner hitung mundur trial di atas setiap halaman aplikasi. */
export function TrialBanner() {
  const { membership, trial, trialLeftMs, gatingEnabled } = useAccess();
  if (!membership?.trial || trial === 'none') return null;
  const name = PLAN_INFO[membership.trial.plan];
  if (trial === 'expired') {
    // Tampilkan hanya bila trial lebih tinggi dari paket berbayar (belum upgrade).
    const ranks = ['none', 'spark', 'boost', 'impact'];
    if (ranks.indexOf(membership.plan) >= ranks.indexOf(membership.trial.plan)) return null;
    return (
      <div role="status" className="mb-5 rounded-2xl border-2 border-ink bg-pink px-4 py-3 text-sm font-semibold">
        ⏰ Trial {name.emoji} {name.name} sudah berakhir{gatingEnabled ? ' — fiturnya terkunci kembali' : ''}. Suka? Hubungi tim GenZ Preneur untuk upgrade.
      </div>
    );
  }
  return (
    <div role="status" className={`mb-5 flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-ink px-4 py-3 text-sm font-semibold ${trial === 'ending' ? 'bg-amber-soft' : 'bg-sky'}`}>
      <span>🎁 Trial {name.emoji} {name.name} aktif — sisa <strong>{formatRemaining(trialLeftMs)}</strong></span>
      <span className="text-xs font-medium text-ink/70">Berakhir {membership.trial.endsAt.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
    </div>
  );
}
