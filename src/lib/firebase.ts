import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

/**
 * Konfigurasi Firebase proyek "genzpreneur".
 * Nilai-nilai ini memang aman berada di browser — keamanan data dijaga oleh
 * Firestore Security Rules (firestore.rules), BUKAN oleh kerahasiaan config ini.
 * Environment variable VITE_FIREBASE_* (bila diisi) akan menimpa nilai bawaan,
 * misalnya untuk proyek Firebase terpisah khusus testing.
 * Kunci rahasia (payment gateway, AI) TIDAK BOLEH ditaruh di sini.
 */
const DEFAULT_CONFIG = {
  apiKey: 'AIzaSyBVHILZ7SFYW_26cd5g5vanedwZ8KdoBlE',
  authDomain: 'genzpreneur.firebaseapp.com',
  projectId: 'genzpreneur',
  storageBucket: 'genzpreneur.firebasestorage.app',
  messagingSenderId: '1001814803411',
  appId: '1:1001814803411:web:c0d4a1e462c85604baa526',
};

const env = import.meta.env;
const useDefaults = env.MODE !== 'test';
const pick = (v: string | undefined, fallback: string) => v || (useDefaults ? fallback : '');

const config = {
  apiKey: pick(env.VITE_FIREBASE_API_KEY, DEFAULT_CONFIG.apiKey),
  authDomain: pick(env.VITE_FIREBASE_AUTH_DOMAIN, DEFAULT_CONFIG.authDomain),
  projectId: pick(env.VITE_FIREBASE_PROJECT_ID, DEFAULT_CONFIG.projectId),
  storageBucket: pick(env.VITE_FIREBASE_STORAGE_BUCKET, DEFAULT_CONFIG.storageBucket),
  messagingSenderId: pick(env.VITE_FIREBASE_MESSAGING_SENDER_ID, DEFAULT_CONFIG.messagingSenderId),
  appId: pick(env.VITE_FIREBASE_APP_ID, DEFAULT_CONFIG.appId),
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
