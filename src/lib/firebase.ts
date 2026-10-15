import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Konfigurasi Firebase dibaca dari environment variable (file .env.local).
 * Nilai-nilai ini memang aman berada di browser — keamanan data dijaga oleh
 * Firestore Security Rules (firestore.rules), BUKAN oleh kerahasiaan config ini.
 * Kunci rahasia (payment gateway, AI) TIDAK BOLEH memakai prefix VITE_.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const missingFirebaseKeys = Object.entries(config)
  .filter(([, v]) => !v)
  .map(([k]) => k);

export const isFirebaseConfigured = missingFirebaseKeys.length === 0;

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

if (isFirebaseConfigured) {
  app = initializeApp(config);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
}

export function auth(): Auth {
  if (!authInstance) throw new Error('Firebase belum dikonfigurasi.');
  return authInstance;
}

export function db(): Firestore {
  if (!dbInstance) throw new Error('Firebase belum dikonfigurasi.');
  return dbInstance;
}
