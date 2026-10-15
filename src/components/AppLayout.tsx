import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { isAdminRole, ROLE_LABEL } from '../lib/roles';
import { Logo, useToast } from './ui';

/**
 * Hanya menu yang SUDAH berfungsi yang ditampilkan.
 * Modul sprint berikutnya ditambahkan ke sini saat benar-benar jadi.
 */
const MEMBER_NAV = [
  { to: '/app', label: 'Dashboard', end: true },
  { to: '/app/passport', label: 'Entrepreneur Passport' },
  { to: '/app/pengaturan', label: 'Profil & Pengaturan' },
];

const ADMIN_NAV = [
  { to: '/app/admin/pengguna', label: 'Pengguna & Role' },
  { to: '/app/admin/audit', label: 'Audit Log' },
];

export default function AppLayout() {
  const { profile, logout } = useAuth();
  const nav = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-ink text-paper' : 'text-ink/80 hover:bg-paper-2'}`;

  async function doLogout() {
    try {
      await logout();
      nav('/', { replace: true });
    } catch {
      toast('error', 'Gagal keluar. Coba lagi.');
    }
  }

  const sidebar = (
    <nav aria-label="Navigasi utama" className="flex h-full flex-col gap-6 p-4">
      <NavLink to="/" className="px-2 text-ink" onClick={() => setOpen(false)}><Logo /></NavLink>
      <div className="space-y-1">
        {MEMBER_NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.end} className={linkCls} onClick={() => setOpen(false)}>{n.label}</NavLink>)}
      </div>
      {isAdminRole(profile?.role) && (
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted">Command Center</p>
          {ADMIN_NAV.map((n) => <NavLink key={n.to} to={n.to} className={linkCls} onClick={() => setOpen(false)}>{n.label}</NavLink>)}
        </div>
      )}
      <div className="mt-auto rounded-xl border border-line bg-paper p-3">
        <p className="truncate text-sm font-semibold">{profile?.displayName || profile?.email}</p>
        <p className="truncate text-xs text-muted">{profile?.email}</p>
        <span className="mt-2 inline-block rounded-full bg-amber-soft px-2 py-0.5 text-xs font-semibold text-amber-ink">{profile ? ROLE_LABEL[profile.role] : ''}</span>
        <button type="button" onClick={doLogout} className="btn-ghost mt-3 w-full">Keluar</button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-white lg:block">{sidebar}</aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button type="button" className="btn-ghost px-3 py-2" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
          {open ? 'Tutup' : 'Menu'}
        </button>
      </header>
      {open && (
        <div id="mobile-nav" className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Tutup menu" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}
