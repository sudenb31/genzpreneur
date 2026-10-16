import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { isAdminRole, ROLE_LABEL } from '../lib/roles';
import { Logo, useToast } from './ui';
import { TrialBanner, useAccess } from '../auth/AccessProvider';
import { PLAN_INFO, type FeatureKey } from '../lib/membership';

/** Hanya menu yang SUDAH berfungsi yang ditampilkan. */
const NAV_GROUPS = [
  {
    label: 'Mulai',
    items: [
      { to: '/app', label: 'Dashboard', icon: '🏠', end: true },
      { to: '/app/passport', label: 'Entrepreneur Passport', icon: '🪪' },
      { to: '/app/assessment', label: 'Assessment Industri', icon: '🧭' },
    ],
  },
  {
    label: 'Benefit Program',
    items: [
      { to: '/app/kurikulum', label: 'Kurikulum (4 Season)', icon: '📚' },
      { to: '/app/toolkit', label: 'AI Business Toolkit', icon: '⚡', feature: 'toolkit' as FeatureKey },
      { to: '/app/action-plan', label: 'Action Plan 7 Hari', icon: '✅', feature: 'actionPlan' as FeatureKey },
      { to: '/app/dream-pact', label: 'Dream Pact', icon: '🌟', feature: 'dreamPact' as FeatureKey },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/app/outreach', label: 'Outreach Studio', icon: '💬', feature: 'outreach' as FeatureKey },
      { to: '/app/tersimpan', label: 'Tersimpan', icon: '📌' },
      { to: '/app/pengaturan', label: 'Pengaturan', icon: '⚙️' },
    ],
  },
];

const ADMIN_NAV = [
  { to: '/app/admin/peserta', label: 'Peserta & Paket', icon: '🎟️' },
  { to: '/app/admin/daftar-tunggu', label: 'Daftar Tunggu', icon: '📝' },
  { to: '/app/admin/pengguna', label: 'Pengguna & Role', icon: '👥' },
  { to: '/app/admin/audit', label: 'Audit Log', icon: '🧾' },
];

export default function AppLayout() {
  const { profile, logout } = useAuth();
  const access = useAccess();
  const nav = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
      isActive ? 'border-2 border-ink bg-lime text-ink shadow-[2px_2px_0_0_#111112]' : 'border-2 border-transparent text-ink/75 hover:bg-paper-2'
    }`;

  async function doLogout() {
    try {
      await logout();
      nav('/', { replace: true });
    } catch {
      toast('error', 'Gagal keluar. Coba lagi.');
    }
  }

  const sidebar = (
    <nav aria-label="Navigasi utama" className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <NavLink to="/" className="px-1" onClick={() => setOpen(false)}><Logo /></NavLink>
      {NAV_GROUPS.map((g) => (
        <div key={g.label} className="space-y-1">
          <p className="px-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{g.label}</p>
          {g.items.map((n) => (
            <NavLink key={n.to} to={n.to} end={'end' in n ? n.end : undefined} className={linkCls} onClick={() => setOpen(false)}>
              <span aria-hidden className="w-5 text-center">{n.icon}</span>{n.label}
              {'feature' in n && n.feature && !access.loading && !access.can(n.feature) && <span className="ml-auto text-xs" aria-label="terkunci">🔒</span>}
            </NavLink>
          ))}
        </div>
      ))}
      {isAdminRole(profile?.role) && (
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Command Center</p>
          {ADMIN_NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkCls} onClick={() => setOpen(false)}>
              <span aria-hidden className="w-5 text-center">{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </div>
      )}
      <div className="mt-auto rounded-3xl border-2 border-ink bg-white p-3 shadow-[3px_3px_0_0_#111112]">
        <p className="truncate text-sm font-bold">{profile?.displayName || 'Entrepreneur'}</p>
        <p className="truncate text-xs text-muted">{profile?.email}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="inline-block rounded-full bg-amber px-2.5 py-0.5 text-xs font-extrabold text-ink">{profile ? ROLE_LABEL[profile.role] : ''}</span>
          {!access.loading && <span className={`inline-block rounded-full border border-ink px-2.5 py-0.5 text-xs font-extrabold ${PLAN_INFO[access.plan].tile}`}>{PLAN_INFO[access.plan].emoji} {PLAN_INFO[access.plan].name}{access.trial === 'active' || access.trial === 'ending' ? ' (trial)' : ''}</span>}
        </div>
        <button type="button" onClick={doLogout} className="btn-ghost mt-3 w-full py-2">Keluar</button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r-2 border-ink/10 bg-paper lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button type="button" className="btn-ghost px-4 py-2" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
          {open ? 'Tutup' : 'Menu'}
        </button>
      </header>
      {open && (
        <div id="mobile-nav" className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[290px] bg-paper shadow-xl">{sidebar}</aside>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
        <TrialBanner />
        <Outlet />
      </main>
    </div>
  );
}
