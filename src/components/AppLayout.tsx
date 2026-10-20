import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { isAdminRole, ROLE_LABEL } from '../lib/roles';
import { Logo, useToast } from './ui';
import { TrialBanner, useAccess } from '../auth/AccessProvider';
import { PLAN_INFO, type FeatureKey } from '../lib/membership';

const NAV_GROUPS = [
  { label: 'Ruang utamamu', items: [
    { to: '/app', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/app/action-plan', label: 'Misi Pertama', icon: '✅', feature: 'actionPlan' as FeatureKey },
    { to: '/app/kurikulum', label: 'Belajar', icon: '📚' },
    { to: '/app/simulasi', label: 'Simulasi Founder', icon: '🎮' },
    { to: '/app/toolkit', label: 'Alat Bisnis', icon: '⚡', feature: 'toolkit' as FeatureKey },
    { to: '/app/outreach', label: 'Cari Pelanggan', icon: '💬', feature: 'outreach' as FeatureKey },
  ] },
  { label: 'Kenali & arahkan diri', items: [
    { to: '/app/kondisi-awal', label: 'Kondisi Awal · Titik Masuk', icon: '🧩' },
    { to: '/app/passport', label: 'Passport · Profil Usaha', icon: '🪪' },
    { to: '/app/assessment', label: 'Temukan Jalurmu', icon: '🧭' },
    { to: '/app/dream-pact', label: 'Dream Pact · Kontrak Mimpi', icon: '🌟', feature: 'dreamPact' as FeatureKey },
  ] },
  { label: 'Akun & hasil kerja', items: [
    { to: '/app/tersimpan', label: 'Tersimpan', icon: '📌' },
    { to: '/voucher', label: 'Tukar Voucher', icon: '🎟️' },
    { to: '/app/pengaturan', label: 'Akun & Paket', icon: '⚙️' },
  ] },
];
const ADMIN_NAV = [
  { to: '/app/admin/peserta', label: 'Peserta & Paket', icon: '👤' },
  { to: '/app/admin/voucher', label: 'Voucher', icon: '🎟️' },
  { to: '/app/admin/daftar-tunggu', label: 'Daftar Tunggu', icon: '📚' },
  { to: '/app/admin/pengguna', label: 'Pengguna & Role', icon: '👥' },
  { to: '/app/admin/audit', label: 'Audit Log', icon: '🧾' },
];
const MOBILE_NAV = [
  { to: '/app', label: 'Beranda', icon: '🏠', end: true },
  { to: '/app/action-plan', label: 'Misi', icon: '🛠️', end: false },
  { to: '/app/toolkit', label: 'Alat', icon: '⚡', end: false },
  { to: '/app/pengaturan', label: 'Akun', icon: '👤', end: false },
];

export default function AppLayout() {
  const { profile, logout } = useAuth();
  const access = useAccess();
  const nav = useNavigate();
  const toast = useToast();
  const location = useLocation();
  const area = location.pathname.includes('/admin/') ? 'admin' : location.pathname.includes('/belajar/') || location.pathname.endsWith('/kurikulum') ? 'learn' : location.pathname.endsWith('/toolkit') ? 'tools' : location.pathname.endsWith('/action-plan') ? 'action' : location.pathname.endsWith('/assessment') || location.pathname.endsWith('/passport') ? 'profile' : location.pathname.endsWith('/dream-pact') ? 'dream' : 'home';
  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem('genz-sidebar-collapsed') === 'true'; }
    catch { return false; }
  });
  function toggleSidebar() {
    setSidebarCollapsed((previous) => {
      const next = !previous;
      try { localStorage.setItem('genz-sidebar-collapsed', String(next)); } catch { /* Preference storage is optional. */ }
      return next;
    });
  }
  const dialog = useRef<HTMLDialogElement>(null);
  const page = [...NAV_GROUPS.flatMap((g) => g.items), ...ADMIN_NAV].find((n) => n.to === location.pathname)?.label
    ?? (location.pathname.startsWith('/app/belajar/') ? 'Ruang Belajar' : 'Dashboard');

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
    document.title = `${page} · GenZ Preneur`;
  }, [location.pathname, page]);
  useEffect(() => {
    const el = dialog.current;
    if (open && el && !el.open) el.showModal();
    if (!open && el?.open) el.close();
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const linkCls = ({ isActive }: { isActive: boolean }) => `workspace-nav-link ${isActive ? 'is-active' : ''}`;
  async function doLogout() {
    try { await logout(); nav('/', { replace: true }); }
    catch { toast('error', 'Gagal keluar. Coba lagi.'); }
  }
  const sidebar = (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <div className="flex items-center justify-between gap-2">
        <Link to="/app" aria-label="GenZ Preneur — Dashboard" onClick={() => setOpen(false)}><Logo /></Link>
        <button type="button" className="btn-ghost px-3 lg:hidden" onClick={() => setOpen(false)} aria-label="Tutup menu">✕</button>
      </div>
      <nav aria-label="Semua menu" className="space-y-6">
        {NAV_GROUPS.map((g) => (
          <div key={g.label} className="space-y-1">
            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted">{g.label}</p>
            {g.items.map((n) => (
              <NavLink key={n.to} to={n.to} end={'end' in n ? n.end : undefined} className={linkCls} onClick={() => setOpen(false)}>
                <span aria-hidden className="nav-icon">{n.icon}</span><span>{n.label}</span>
                {'feature' in n && n.feature && !access.loading && !access.can(n.feature) && <span className="ml-auto text-xs" aria-label="terkunci">🔒</span>}
              </NavLink>
            ))}
          </div>
        ))}
        {isAdminRole(profile?.role) && (
          <div className="space-y-1 border-t border-line pt-5">
            <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted">Command Center</p>
            {ADMIN_NAV.map((n) => <NavLink key={n.to} to={n.to} className={linkCls} onClick={() => setOpen(false)}><span aria-hidden className="w-5 text-center">{n.icon}</span>{n.label}</NavLink>)}
          </div>
        )}
      </nav>
      <div className="sidebar-account mt-auto rounded-2xl border border-line bg-white p-4">
        <p className="truncate text-sm font-bold">{profile?.displayName || 'Entrepreneur'}</p>
        <p className="mt-1 truncate text-xs text-muted">{profile?.email}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {isAdminRole(profile?.role) && <span className="rounded-full bg-paper-2 px-2 py-1 text-[10px] font-bold">{profile ? ROLE_LABEL[profile.role] : ''}</span>}
          {!access.loading && <span className="rounded-full bg-amber-soft px-2.5 py-1 text-xs font-bold">{access.isAdmin ? '♾️ Akses penuh' : `${PLAN_INFO[access.plan].name}${access.trial === 'active' || access.trial === 'ending' ? ' · trial' : ''}`}</span>}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
          <Link to="/" className="font-semibold text-muted underline" onClick={() => setOpen(false)}>Situs utama ↗</Link>
          <button type="button" onClick={() => void doLogout()} className="min-h-9 px-2 font-semibold text-muted hover:text-danger">Keluar</button>
        </div>
      </div>
    </div>
  );

  return (
    <div data-area={area} className={`workspace min-h-screen ${sidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
      <a href="#workspace-content" className="skip-link">Lewati ke isi halaman</a>
      <div className="workspace-sidebar-slot" inert={sidebarCollapsed} aria-hidden={sidebarCollapsed}>
        <aside id="desktop-nav" className="workspace-sidebar h-dvh border-r border-line bg-paper">{sidebar}</aside>
      </div>
      <div className="min-w-0">
        <header className="workspace-topbar">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" className="sidebar-toggle btn-ghost hidden h-11 w-11 shrink-0 items-center justify-center p-0 lg:inline-flex" onClick={toggleSidebar} aria-label={sidebarCollapsed ? 'Buka sidebar' : 'Tutup sidebar'} title={sidebarCollapsed ? 'Buka sidebar' : 'Tutup sidebar'} aria-expanded={!sidebarCollapsed} aria-controls="desktop-nav">
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <Link to="/app" className="lg:hidden" aria-label="Buka Dashboard"><Logo /></Link>
            <div className="hidden items-center gap-2 text-sm lg:flex">
              <Link to="/app" className="text-muted hover:text-ink">Dashboard</Link>
              {location.pathname !== '/app' && <><span aria-hidden className="text-muted">/</span><span className="font-semibold">{page}</span></>}
            </div>
          </div>
          <button type="button" className="btn-ghost px-4 lg:hidden" aria-label="Buka semua menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(true)}>Menu</button>
          <span aria-hidden className="brand-top-tag hidden xl:inline-flex">LEARN. EXECUTE. GROW. ✦</span><Link to="/app/tersimpan" className="hidden items-center gap-2 text-sm font-semibold text-muted hover:text-ink lg:flex">▱ Hasil tersimpan</Link>
        </header>
        <main id="workspace-content" tabIndex={-1} className="workspace-main mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
          {location.pathname !== '/app' && <Link to="/app" className="mb-5 inline-flex min-h-10 items-center text-sm font-semibold text-muted hover:text-ink">← Kembali ke Dashboard</Link>}
          <TrialBanner />
          <Outlet />
        </main>
      </div>
      <dialog ref={dialog} id="mobile-nav" aria-label="Semua menu GenZ Preneur" onClose={() => setOpen(false)} onCancel={() => setOpen(false)} className="workspace-drawer" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
        {sidebar}
      </dialog>
      <nav aria-label="Menu cepat" className="mobile-bottom-nav">
        {MOBILE_NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `mobile-nav-link ${isActive || (n.label === 'Belajar' && location.pathname.startsWith('/app/belajar/')) ? 'is-active' : ''}`}><span aria-hidden className="text-xl leading-none">{n.icon}</span><span>{n.label}</span></NavLink>)}
      </nav>
    </div>
  );
}
