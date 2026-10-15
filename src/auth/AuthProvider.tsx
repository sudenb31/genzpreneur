import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { ensureUserRecord, updateDisplayName, type UserRecord } from '../lib/data';

interface AuthState {
  /** true selama status login awal belum diketahui. */
  loading: boolean;
  firebaseUser: User | null;
  profile: UserRecord | null;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async (u: User) => {
    try {
      const rec = await ensureUserRecord(u.uid, u.email ?? '', u.displayName ?? '');
      setProfile(rec);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Profil akun gagal dimuat. Periksa koneksi lalu muat ulang halaman.');
    }
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(auth(), async (u) => {
      setFirebaseUser(u);
      if (u) await loadProfile(u);
      else setProfile(null);
      setLoading(false);
    });
  }, [loadProfile]);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      firebaseUser,
      profile,
      error,
      register: async (name, email, password) => {
        const cred = await createUserWithEmailAndPassword(auth(), email, password);
        await updateProfile(cred.user, { displayName: name });
        // onAuthStateChanged bisa sudah membuat dokumen user SEBELUM nama terpasang
        // (displayName masih kosong). Pastikan nama tersimpan.
        const rec = await ensureUserRecord(cred.user.uid, email, name);
        if (rec.displayName !== name.trim().slice(0, 80)) await updateDisplayName(cred.user.uid, name);
        await loadProfile(cred.user);
        // Email verifikasi tidak memblokir pendaftaran bila gagal terkirim.
        sendEmailVerification(cred.user).catch((e) => console.warn('Verifikasi email gagal dikirim', e));
      },
      login: async (email, password) => {
        await signInWithEmailAndPassword(auth(), email, password);
      },
      logout: async () => {
        await signOut(auth());
      },
      resetPassword: async (email) => {
        await sendPasswordResetEmail(auth(), email);
      },
      refreshProfile: async () => {
        if (firebaseUser) await loadProfile(firebaseUser);
      },
    }),
    [loading, firebaseUser, profile, error, loadProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>.');
  return ctx;
}

/** Terjemahan pesan error Firebase Auth ke Bahasa Indonesia. */
export function authErrorMessage(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan masuk.',
    'auth/weak-password': 'Password terlalu lemah. Gunakan minimal 8 karakter.',
    'auth/invalid-credential': 'Email atau password salah.',
    'auth/wrong-password': 'Email atau password salah.',
    'auth/user-not-found': 'Email atau password salah.',
    'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.',
    'auth/network-request-failed': 'Koneksi internet bermasalah. Coba lagi.',
    'auth/user-disabled': 'Akun ini dinonaktifkan. Hubungi admin.',
    'auth/operation-not-allowed': 'Metode login Email/Password belum diaktifkan di Firebase Console.',
  };
  return map[code] ?? 'Terjadi kesalahan. Coba lagi beberapa saat lagi.';
}
