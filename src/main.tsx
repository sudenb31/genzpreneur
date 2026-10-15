import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, Link, Route, Routes } from 'react-router-dom';

import './index.css';
import { AuthProvider } from './auth/AuthProvider';
import { GuestOnly, RequireAuth, RequireRole } from './auth/guards';
import { ToastProvider } from './components/ui';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import { ForgotPasswordPage, LoginPage, RegisterPage } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import PassportPage from './pages/PassportPage';
import SettingsPage from './pages/SettingsPage';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAudit from './pages/admin/AdminAudit';

/** Build "standalone" (bisa dibuka dengan klik dua kali) memakai HashRouter. */
const Router = import.meta.env.MODE === 'standalone' ? HashRouter : BrowserRouter;

function NotFound() {
  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-6xl font-semibold text-amber">404</p>
      <h1 className="mt-4 text-xl font-semibold">Halaman tidak ditemukan</h1>
      <Link to="/" className="btn-primary mt-6">Kembali ke beranda</Link>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/masuk" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route path="/daftar" element={<GuestOnly><RegisterPage /></GuestOnly>} />
            <Route path="/lupa-password" element={<GuestOnly><ForgotPasswordPage /></GuestOnly>} />
            <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route index element={<Dashboard />} />
              <Route path="passport" element={<PassportPage />} />
              <Route path="pengaturan" element={<SettingsPage />} />
              <Route path="admin/pengguna" element={<RequireRole min="admin"><AdminUsers /></RequireRole>} />
              <Route path="admin/audit" element={<RequireRole min="admin"><AdminAudit /></RequireRole>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  </StrictMode>,
);
