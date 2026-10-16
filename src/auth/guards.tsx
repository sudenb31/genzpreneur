import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { hasAtLeast, type Role } from '../lib/roles';
import { isFirebaseConfigured } from '../lib/firebase';
import { ErrorState, PageSkeleton } from '../components/ui';
import SetupRequired from '../pages/SetupRequired';
import { NotInvitedPage } from '../pages/AuthPages';

/**
 * Penjaga rute di BROWSER — hanya untuk pengalaman pengguna.
 * Perlindungan data yang sesungguhnya ada di firestore.rules.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, firebaseUser, profile, error, notInvited } = useAuth();
  const location = useLocation();
  if (!isFirebaseConfigured) return <SetupRequired />;
  if (loading) return <div className="mx-auto max-w-5xl p-6"><PageSkeleton /></div>;
  if (!firebaseUser) return <Navigate to="/masuk" replace state={{ from: location.pathname }} />;
  if (notInvited) return <NotInvitedPage />;
  if (error) return <div className="mx-auto max-w-xl p-6"><ErrorState message={error} onRetry={() => window.location.reload()} /></div>;
  if (!profile) return <div className="mx-auto max-w-5xl p-6"><PageSkeleton /></div>;
  return <>{children}</>;
}

export function RequireRole({ min, children }: { min: Role; children: ReactNode }) {
  const { profile } = useAuth();
  if (!hasAtLeast(profile?.role, min)) {
    return (
      <div className="card p-8 text-center">
        <h1 className="text-lg font-semibold">Akses ditolak</h1>
        <p className="mt-1 text-sm text-muted">Halaman ini hanya untuk peran tertentu. Hubungi admin bila menurutmu ini keliru.</p>
      </div>
    );
  }
  return <>{children}</>;
}

/** Halaman masuk/daftar: arahkan ke dashboard bila sudah login. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { loading, firebaseUser, notInvited } = useAuth();
  if (!isFirebaseConfigured) return <SetupRequired />;
  if (loading) return <div className="mx-auto max-w-md p-6"><PageSkeleton /></div>;
  if (firebaseUser && !notInvited) return <Navigate to="/app" replace />;
  return <>{children}</>;
}
