import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { acceptInvite, ensureUserRecord, getUserRecord, loginLinkUrl, type UserRecord } from '../lib/data';
import { normalizeEmail } from '../lib/membership';

const EMAIL_KEY = 'gzp.emailForSignIn';
const readStoredEmail = () => { try { return localStorage.getItem(EMAIL_KEY) ?? ''; } catch { return ''; } };
const storeEmail = (e: string | null) => {
  try { if (e) localStorage.setItem(EMAIL_KEY, e); else localStorage.removeItem(EMAIL_KEY); } catch { /* storage tidak tersedia */ }
};

interface AuthState {
  /** true selama status login awal belum diketahui. */
  loading: boolean;
  firebaseUser: User | null;
  profile: UserRecord | null;
  error: string | null;
  /** true bila sudah login tapi emailnya tidak punya undangan → akses ditolak. */
  notInvited: boolean;
  /** Kirim link masuk ke email (login tanpa password). */
  sendLoginLink: (email: string) => Promise<void>;
  /** Selesaikan login dari link email. */
  completeLinkSignIn: (href: string, email: string) => Promise<void>;
  isLoginLink: (href: string) => boolean;
  storedEmail: () => string;
  /** Login password — hanya untuk akun lama yang sudah punya password. */
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
  const [notInvited, setNotInvited] = useState(false);

  const loadProfile = useCallback(async (u: User) => {
    setNotInvited(false);
    try {
      const existing = await getUserRecord(u.uid);
      if (existing) {
        setProfile(existing);
        setError(null);
        return;
      }
      // Akun baru: hanya bisa dibuat bila emailnya diundang admin (ditegakkan Security Rules).
      const email = normalizeEmail(u.email ?? '');
      let inviteName = '';
      try {
        const inv = await getDoc(doc(db(), 'invites', email));
        if (!inv.exists() || inv.data().status === 'revoked') {
          setProfile(null);
          setNotInvited(true);
          return;
        }
        inviteName = String(inv.data().name ?? '');
      } catch {
        setProfile(null);
        setNotInvited(true);
        return;
      }
      const rec = await ensureUserRecord(u.uid, u.email ?? '', u.displayName || inviteName);
      await acceptInvite(email);
      setProfile(rec);
      setError(null);
    } catch (e) {
      console.error(e);
      const code = (e as { code?: string }).code;
      if (code === 'permission-denied') {
        setProfile(null);
        setNotInvited(true);
      } else {
        setError('Profil akun gagal dimuat. Periksa koneksi lalu muat ulang halaman.');
      }
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
      notInvited,
      sendLoginLink: async (email) => {
        await sendSignInLinkToEmail(auth(), email.trim(), { url: loginLinkUrl(), handleCodeInApp: true });
        storeEmail(email.trim());
      },
      completeLinkSignIn: async (href, email) => {
        await signInWithEmailLink(auth(), email.trim(), href);
        storeEmail(null);
      },
      isLoginLink: (href) => isFirebaseConfigured && isSignInWithEmailLink(auth(), href),
      storedEmail: readStoredEmail,
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
    [loading, firebaseUser, profile, error, notInvited, loadProfile],
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
    'auth/operation-not-allowed': 'Metode login ini belum diaktifkan di Firebase Console (Authentication → Sign-in method → Email/Password → Email link).',
    'auth/invalid-action-code': 'Link masuk sudah kedaluwarsa atau sudah dipakai. Minta link baru.',
    'auth/expired-action-code': 'Link masuk sudah kedaluwarsa. Minta link baru.',
    'auth/unauthorized-continue-uri': 'Domain website belum didaftarkan di Firebase (Authentication → Settings → Authorized domains).',
    'auth/quota-exceeded': 'Batas pengiriman email hari ini tercapai. Coba lagi besok.',
  };
  return map[code] ?? 'Terjadi kesalahan. Coba lagi beberapa saat lagi.';
}
