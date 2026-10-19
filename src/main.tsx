import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, Link, Route, Routes } from 'react-router-dom';

import './index.css';
import { AuthProvider } from './auth/AuthProvider';
import { AccessProvider, RequireFeature } from './auth/AccessProvider';
import { GuestOnly, RequireAuth, RequireRole } from './auth/guards';
import { ToastProvider } from './components/ui';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import { EmailLinkPage, ForgotPasswordPage, LoginPage, WaitlistPage } from './pages/AuthPages';
import Dashboard from './pages/Dashboard';
import PassportPage from './pages/PassportPage';
import SettingsPage from './pages/SettingsPage';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAudit from './pages/admin/AdminAudit';
import AdminMembers from './pages/admin/AdminMembers';
import AdminWaitlist from './pages/admin/AdminWaitlist';
import AssessmentPage from './pages/AssessmentPage';
import OutreachPage from './pages/OutreachPage';
import ModulePage from './pages/ModulePage';
import VoucherPage from './pages/VoucherPage';
import AdminVouchers from './pages/admin/AdminVouchers';
import ToolkitPage from './pages/ToolkitPage';
import EntryPage from './pages/EntryPage';
import MissionPage from './pages/MissionPage';
import ActionPlanPage from './pages/ActionPlanPage';
import SavedPage from './pages/SavedPage';
import CurriculumPage from './pages/CurriculumPage';
import DreamPactPage from './pages/DreamPactPage';
import DreamPactPrint from './pages/DreamPactPrint';

/** Build "standalone" (bisa dibuka dengan klik dua kali) memakai HashRouter. */
const Router = import.meta.env.MODE === 'standalone' ? HashRouter : BrowserRouter;

function NotFound() {
  return (
    <main className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-7xl font-extrabold text-amber">404</p>
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
          <AccessProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/masuk" element={<GuestOnly><LoginPage /></GuestOnly>} />
            <Route path="/masuk/link" element={<EmailLinkPage />} />
            <Route path="/daftar" element={<WaitlistPage />} />
            <Route path="/voucher" element={<VoucherPage />} />
            <Route path="/lupa-password" element={<GuestOnly><ForgotPasswordPage /></GuestOnly>} />
            <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
              <Route index element={<Dashboard />} />
              <Route path="kondisi-awal" element={<EntryPage />} />
              <Route path="passport" element={<PassportPage />} />
              <Route path="assessment" element={<AssessmentPage />} />
              <Route path="outreach" element={<RequireFeature feature="outreach"><OutreachPage /></RequireFeature>} />
              <Route path="belajar/:slug" element={<ModulePage />} />
              <Route path="toolkit" element={<RequireFeature feature="toolkit"><ToolkitPage /></RequireFeature>} />
              <Route path="action-plan" element={<RequireFeature feature="actionPlan"><MissionPage /></RequireFeature>} /><Route path="action-plan/arsip" element={<RequireFeature feature="actionPlan"><ActionPlanPage /></RequireFeature>} />
              <Route path="tersimpan" element={<SavedPage />} />
              <Route path="kurikulum" element={<CurriculumPage />} />
              <Route path="dream-pact" element={<RequireFeature feature="dreamPact"><DreamPactPage /></RequireFeature>} />
              <Route path="pengaturan" element={<SettingsPage />} />
              <Route path="admin/peserta" element={<RequireRole min="admin"><AdminMembers /></RequireRole>} />
              <Route path="admin/voucher" element={<RequireRole min="admin"><AdminVouchers /></RequireRole>} />
              <Route path="admin/daftar-tunggu" element={<RequireRole min="admin"><AdminWaitlist /></RequireRole>} />
              <Route path="admin/pengguna" element={<RequireRole min="admin"><AdminUsers /></RequireRole>} />
              <Route path="admin/audit" element={<RequireRole min="admin"><AdminAudit /></RequireRole>} />
            </Route>
            <Route path="/cetak/dream-pact" element={<RequireAuth><RequireFeature feature="dreamPact"><DreamPactPrint /></RequireFeature></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AccessProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  </StrictMode>,
);
