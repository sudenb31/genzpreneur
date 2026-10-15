import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { isRole, type Role } from './roles';
import { normalizePassport, passportSchema, type Passport } from './passport';

/* ------------------------------ Users ------------------------------ */

export interface UserRecord {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const toDate = (v: unknown): Date | null =>
  v && typeof (v as Timestamp).toDate === 'function' ? (v as Timestamp).toDate() : null;

function toUser(uid: string, d: Record<string, unknown>): UserRecord {
  return {
    uid,
    email: String(d.email ?? ''),
    displayName: String(d.displayName ?? ''),
    role: isRole(d.role) ? d.role : 'user',
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

export async function getUserRecord(uid: string): Promise<UserRecord | null> {
  const snap = await getDoc(doc(db(), 'users', uid));
  return snap.exists() ? toUser(uid, snap.data()) : null;
}

/**
 * Membuat dokumen user saat pertama kali login. Role SELALU 'user' —
 * Security Rules menolak pembuatan dengan role lain.
 */
export async function ensureUserRecord(uid: string, email: string, displayName: string): Promise<UserRecord> {
  const existing = await getUserRecord(uid);
  if (existing) return existing;
  await setDoc(doc(db(), 'users', uid), {
    email,
    displayName: displayName.slice(0, 80),
    role: 'user',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return (await getUserRecord(uid))!;
}

export async function updateDisplayName(uid: string, displayName: string) {
  await updateDoc(doc(db(), 'users', uid), { displayName: displayName.trim().slice(0, 80), updatedAt: serverTimestamp() });
}

export async function listUsers(max = 500): Promise<UserRecord[]> {
  const snap = await getDocs(query(collection(db(), 'users'), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((d) => toUser(d.id, d.data()));
}

/**
 * Mengubah role + menulis audit log secara atomik (satu batch).
 * Security Rules mewajibkan audit log dengan id = lastAuditId ikut tertulis
 * di batch yang sama; tanpa itu perubahan role ditolak.
 */
export async function changeUserRole(params: {
  actorUid: string;
  target: UserRecord;
  to: Role;
  reason: string;
}) {
  const { actorUid, target, to, reason } = params;
  const batch = writeBatch(db());
  const auditRef = doc(collection(db(), 'auditLogs'));
  batch.set(auditRef, {
    actorUid,
    action: 'user.role_changed',
    targetType: 'user',
    targetId: target.uid,
    before: { role: target.role },
    after: { role: to },
    reason: reason.trim().slice(0, 300),
    createdAt: serverTimestamp(),
  });
  batch.update(doc(db(), 'users', target.uid), {
    role: to,
    lastAuditId: auditRef.id,
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
}

/* ---------------------------- Audit logs --------------------------- */

export interface AuditLog {
  id: string;
  actorUid: string;
  action: string;
  targetType: string;
  targetId: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  reason: string;
  createdAt: Date | null;
}

export async function listAuditLogs(max = 100): Promise<AuditLog[]> {
  const snap = await getDocs(query(collection(db(), 'auditLogs'), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      actorUid: String(x.actorUid ?? ''),
      action: String(x.action ?? ''),
      targetType: String(x.targetType ?? ''),
      targetId: String(x.targetId ?? ''),
      before: (x.before as Record<string, unknown>) ?? {},
      after: (x.after as Record<string, unknown>) ?? {},
      reason: String(x.reason ?? ''),
      createdAt: toDate(x.createdAt),
    };
  });
}

/* ---------------------------- Passports ---------------------------- */

export interface PassportRecord {
  data: Passport;
  exists: boolean;
  updatedAt: Date | null;
}

export async function getPassport(uid: string, fallbackName: string): Promise<PassportRecord> {
  const snap = await getDoc(doc(db(), 'passports', uid));
  if (!snap.exists()) return { data: normalizePassport(null, fallbackName), exists: false, updatedAt: null };
  const raw = snap.data();
  return { data: normalizePassport(raw, fallbackName), exists: true, updatedAt: toDate(raw.updatedAt) };
}

/** Validasi di sisi klien dulu, lalu Security Rules memvalidasi lagi di server. */
export async function savePassport(uid: string, passport: Passport, isNew: boolean) {
  const parsed = passportSchema.parse(passport);
  const ref = doc(db(), 'passports', uid);
  if (isNew) {
    await setDoc(ref, { ...parsed, ownerUid: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  } else {
    await updateDoc(ref, { ...parsed, updatedAt: serverTimestamp() });
  }
}

export async function deletePassport(uid: string) {
  await deleteDoc(doc(db(), 'passports', uid));
}

/** Ekspor data milik user sendiri (hak akses data pribadi). */
export function exportJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
