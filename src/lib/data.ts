import { encodeEntry, ENTRY_KEY, type EntryRecord } from './entry';
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
  increment,
  addDoc,
  where,
} from 'firebase/firestore';
import { isIndustryKey, isProfileKey, isTrackKey, type AssessmentResult } from './assessment';
import type { ProfileKey } from '../content/wealthProfiles';
import type { IndustryKey } from '../content/industries';
import type { TrackKey } from '../content/assessment';
import { dreamPactSchema, normalizeDreamPact, type DreamPact } from './dreamPact';
import { auth, db } from './firebase';
import { isRole, type Role } from './roles';
import { normalizePassport, passportSchema, type Passport } from './passport';
import {
  buildTrial, isPlanKey, normalizeEmail, type Membership, type PlanKey, type Trial, type TrialPlan,
} from './membership';
import { normalizeCode, type Voucher } from './voucher';
import { encodeMissionDraft, missionKey, type MissionDraft } from './mission';

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

/* ---------------------------- Assessments --------------------------- */


export interface AssessmentRecord {
  topIndustries: IndustryKey[];
  track: TrackKey;
  industryScores: Record<string, number>;
  trackScores: Record<string, number>;
  answers: Record<string, string>;
  /** Kosong untuk hasil versi lama (sebelum Profil Cuan ada) — peserta diminta mengulang. */
  profileScores: Record<string, number>;
  topProfiles: ProfileKey[];
  attempts: number;
  completedAt: Date | null;
}

export async function getAssessment(uid: string): Promise<AssessmentRecord | null> {
  const snap = await getDoc(doc(db(), 'assessments', uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  const top = Array.isArray(d.topIndustries) ? d.topIndustries.filter(isIndustryKey) : [];
  if (top.length === 0 || !isTrackKey(d.track)) return null;
  return {
    topIndustries: top,
    track: d.track,
    industryScores: (d.industryScores as Record<string, number>) ?? {},
    trackScores: (d.trackScores as Record<string, number>) ?? {},
    answers: (d.answers as Record<string, string>) ?? {},
    profileScores: (d.profileScores as Record<string, number>) ?? {},
    topProfiles: Array.isArray(d.topProfiles) ? d.topProfiles.filter(isProfileKey) : [],
    attempts: Number(d.attempts ?? 1),
    completedAt: toDate(d.completedAt),
  };
}

export async function saveAssessment(uid: string, r: AssessmentResult) {
  await setDoc(
    doc(db(), 'assessments', uid),
    {
      ownerUid: uid,
      answers: r.answers,
      industryScores: r.industryScores,
      trackScores: r.trackScores,
      topIndustries: r.topIndustries,
      track: r.track,
      profileScores: r.profileScores,
      topProfiles: r.topProfiles,
      attempts: increment(1),
      completedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/* ------------------------------ Progress ---------------------------- */

export interface LessonProgress { done: boolean; reflection: string }
export interface ProgressRecord {
  lessons: Record<string, LessonProgress>;
  tasks: Record<string, boolean>;
  notes: Record<string, string>;
}

export const emptyProgress = (): ProgressRecord => ({ lessons: {}, tasks: {}, notes: {} });

export async function getProgress(uid: string): Promise<ProgressRecord> {
  const snap = await getDoc(doc(db(), 'progress', uid));
  if (!snap.exists()) return emptyProgress();
  const d = snap.data();
  const lessons: Record<string, LessonProgress> = {};
  for (const [k, v] of Object.entries((d.lessons as Record<string, Record<string, unknown>>) ?? {})) {
    lessons[k] = { done: v?.done === true, reflection: String(v?.reflection ?? '') };
  }
  const plan = (d.plan as Record<string, Record<string, unknown>>) ?? {};
  const tasks: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(plan.tasks ?? {})) tasks[k] = v === true;
  const notes: Record<string, string> = {};
  for (const [k, v] of Object.entries(plan.notes ?? {})) notes[k] = String(v ?? '');
  return { lessons, tasks, notes };
}

const progressRef = (uid: string) => doc(db(), 'progress', uid);

export async function saveLesson(uid: string, lessonId: string, value: LessonProgress) {
  await setDoc(
    progressRef(uid),
    { ownerUid: uid, lessons: { [lessonId]: { done: value.done, reflection: value.reflection.slice(0, 2000) } }, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function setTask(uid: string, taskId: string, done: boolean) {
  await setDoc(progressRef(uid), { ownerUid: uid, plan: { tasks: { [taskId]: done } }, updatedAt: serverTimestamp() }, { merge: true });
}

export async function setDayNote(uid: string, day: number, note: string) {
  await setDoc(progressRef(uid), { ownerUid: uid, plan: { notes: { [`d${day}`]: note.slice(0, 2000) } }, updatedAt: serverTimestamp() }, { merge: true });
}

/** New work drafts live alongside legacy day notes; no migration or rule expansion. */
export async function saveMissionArtifact(uid: string, stepId: string, draft: MissionDraft) {
  const key = missionKey(stepId);
  const encoded = encodeMissionDraft(draft);
  await setDoc(progressRef(uid), { ownerUid: uid, plan: { notes: { [key]: encoded } }, updatedAt: serverTimestamp() }, { merge: true });
  return encoded;
}

/** Store one versioned initial-condition record alongside existing notes, owner writes only. */
export async function saveEntry(uid: string, record: EntryRecord) {
  const encoded = encodeEntry(record);
  await setDoc(progressRef(uid), { ownerUid: uid, plan: { notes: { [ENTRY_KEY]: encoded } }, updatedAt: serverTimestamp() }, { merge: true });
  return encoded;
}

/* ---------------------------- Saved items --------------------------- */

export type SavedKind = 'outreach' | 'prompt' | 'proposal' | 'calc' | 'problem';
export interface SavedItem { id: string; kind: SavedKind; title: string; content: string; createdAt: Date | null }

export async function saveItem(uid: string, kind: SavedKind, title: string, content: string) {
  await addDoc(collection(db(), 'savedItems'), {
    ownerUid: uid,
    kind,
    title: title.trim().slice(0, 120) || 'Tanpa judul',
    content: content.slice(0, 6000),
    createdAt: serverTimestamp(),
  });
}

/** Tanpa orderBy di server agar tidak butuh composite index; diurutkan di browser. */
export async function listSavedItems(uid: string): Promise<SavedItem[]> {
  const snap = await getDocs(query(collection(db(), 'savedItems'), where('ownerUid', '==', uid), limit(300)));
  return snap.docs
    .map((d) => {
      const x = d.data();
      return { id: d.id, kind: x.kind as SavedKind, title: String(x.title ?? ''), content: String(x.content ?? ''), createdAt: toDate(x.createdAt) };
    })
    .sort((a, b) => (b.createdAt?.getTime() ?? Date.now()) - (a.createdAt?.getTime() ?? Date.now()));
}

export async function deleteSavedItem(id: string) {
  await deleteDoc(doc(db(), 'savedItems', id));
}

/* ----------------------------- Dream Pact ---------------------------- */


export interface DreamPactRecord { data: DreamPact; exists: boolean; updatedAt: Date | null }

export async function getDreamPact(uid: string, name: string): Promise<DreamPactRecord> {
  const snap = await getDoc(doc(db(), 'dreamPacts', uid));
  if (!snap.exists()) return { data: normalizeDreamPact(null, name), exists: false, updatedAt: null };
  const raw = snap.data();
  return { data: normalizeDreamPact(raw, name), exists: true, updatedAt: toDate(raw.updatedAt) };
}

export async function saveDreamPact(uid: string, pact: DreamPact, isNew: boolean) {
  const parsed = dreamPactSchema.parse(pact);
  const ref = doc(db(), 'dreamPacts', uid);
  if (isNew) await setDoc(ref, { ...parsed, ownerUid: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  else await updateDoc(ref, { ...parsed, updatedAt: serverTimestamp() });
}

/* ===================== Akses undangan, paket & trial ===================== */


export interface Invite { email: string; name: string; status: 'pending' | 'accepted' | 'revoked'; createdAt: Date | null; acceptedAt: Date | null }

function toTrial(v: unknown): Trial | null {
  if (!v || typeof v !== 'object') return null;
  const t = v as Record<string, unknown>;
  const startedAt = toDate(t.startedAt);
  const endsAt = toDate(t.endsAt);
  if ((t.plan !== 'boost' && t.plan !== 'impact') || !startedAt || !endsAt) return null;
  return { plan: t.plan, days: Number(t.days ?? 0), startedAt, endsAt };
}

function toMembership(id: string, d: Record<string, unknown>): Membership {
  const used = (d.trialsUsed as Record<string, unknown>) ?? {};
  return {
    email: id,
    name: String(d.name ?? ''),
    plan: isPlanKey(d.plan) ? d.plan : 'none',
    trial: toTrial(d.trial),
    trialsUsed: { boost: used.boost === true, impact: used.impact === true },
    note: String(d.note ?? ''),
    updatedAt: toDate(d.updatedAt),
  };
}

export async function getMembership(email: string): Promise<Membership | null> {
  const id = normalizeEmail(email);
  const snap = await getDoc(doc(db(), 'memberships', id));
  return snap.exists() ? toMembership(id, snap.data()) : null;
}

export async function listMemberships(max = 1000): Promise<Membership[]> {
  const snap = await getDocs(query(collection(db(), 'memberships'), limit(max)));
  return snap.docs.map((d) => toMembership(d.id, d.data()));
}

export async function listInvites(max = 1000): Promise<Invite[]> {
  const snap = await getDocs(query(collection(db(), 'invites'), limit(max)));
  return snap.docs.map((d) => {
    const x = d.data();
    const st = x.status === 'accepted' || x.status === 'revoked' ? x.status : 'pending';
    return { email: d.id, name: String(x.name ?? ''), status: st, createdAt: toDate(x.createdAt), acceptedAt: toDate(x.acceptedAt) };
  });
}

const trialToFs = (t: Trial | null) => (t ? { plan: t.plan, days: t.days, startedAt: t.startedAt, endsAt: t.endsAt } : null);

/**
 * Menulis membership + audit log dalam satu batch (Security Rules menolak tanpa audit).
 * Dipakai untuk: undang, ubah paket, beri trial, akhiri trial.
 */
async function writeMembership(params: {
  actorUid: string;
  before: Membership | null;
  next: Omit<Membership, 'updatedAt'>;
  action: string;
  reason: string;
  extra?: (batch: ReturnType<typeof writeBatch>) => void;
}) {
  const { actorUid, before, next, action, reason, extra } = params;
  const id = normalizeEmail(next.email);
  const batch = writeBatch(db());
  const auditRef = doc(collection(db(), 'auditLogs'));
  batch.set(auditRef, {
    actorUid,
    action,
    targetType: 'membership',
    targetId: id,
    before: before ? { plan: before.plan, trial: before.trial ? `${before.trial.plan} s.d. ${before.trial.endsAt.toISOString()}` : null } : {},
    after: { plan: next.plan, trial: next.trial ? `${next.trial.plan} s.d. ${next.trial.endsAt.toISOString()}` : null },
    reason: reason.trim().slice(0, 300),
    createdAt: serverTimestamp(),
  });
  batch.set(doc(db(), 'memberships', id), {
    email: id,
    name: next.name.trim().slice(0, 80),
    plan: next.plan,
    trial: trialToFs(next.trial),
    trialsUsed: next.trialsUsed,
    note: next.note.trim().slice(0, 300),
    updatedAt: serverTimestamp(),
    updatedBy: actorUid,
    lastAuditId: auditRef.id,
  });
  extra?.(batch);
  await batch.commit();
}

/** URL tujuan link masuk di email. */
export const loginLinkUrl = () => `${window.location.origin}${import.meta.env.MODE === 'standalone' ? '/#' : ''}/masuk/link`;

/** Admin mengundang peserta: buat/aktifkan undangan + atur paket (opsional trial) dalam satu batch. */
export async function inviteMember(params: {
  actorUid: string;
  email: string;
  name: string;
  plan: PlanKey;
  startTrial: boolean;
  note: string;
  existing: Membership | null;
  waitlistId?: string;
}) {
  const email = normalizeEmail(params.email);
  const prev = params.existing;
  let trial: Trial | null = prev?.trial ?? null;
  const trialsUsed = { ...(prev?.trialsUsed ?? { boost: false, impact: false }) };
  if (params.startTrial) {
    const offer = params.plan === 'spark' ? { plan: 'boost' as const, days: 3 } : params.plan === 'boost' ? { plan: 'impact' as const, days: 7 } : null;
    if (offer && !trialsUsed[offer.plan]) {
      trial = buildTrial(offer.plan, offer.days, new Date());
      trialsUsed[offer.plan] = true;
    }
  }
  await writeMembership({
    actorUid: params.actorUid,
    before: prev,
    next: { email, name: params.name, plan: params.plan, trial, trialsUsed, note: params.note },
    action: prev ? 'member.reinvited' : 'member.invited',
    reason: params.note || `Undangan paket ${params.plan}`,
    extra: (batch) => {
      batch.set(doc(db(), 'invites', email), {
        email,
        name: params.name.trim().slice(0, 80),
        status: 'pending',
        invitedBy: params.actorUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      if (params.waitlistId) batch.update(doc(db(), 'waitlist', params.waitlistId), { status: 'invited' });
    },
  });
}

export async function setMemberPlan(params: { actorUid: string; member: Membership; plan: PlanKey; reason: string }) {
  const { member } = params;
  await writeMembership({
    actorUid: params.actorUid,
    before: member,
    next: { ...member, plan: params.plan },
    action: 'member.plan_changed',
    reason: params.reason,
  });
}

export async function grantTrial(params: { actorUid: string; member: Membership; plan: TrialPlan; days: number; reason: string }) {
  const { member } = params;
  await writeMembership({
    actorUid: params.actorUid,
    before: member,
    next: { ...member, trial: buildTrial(params.plan, params.days, new Date()), trialsUsed: { ...member.trialsUsed, [params.plan]: true } },
    action: 'member.trial_started',
    reason: params.reason,
  });
}

export async function endTrial(params: { actorUid: string; member: Membership; reason: string }) {
  const { member } = params;
  if (!member.trial) return;
  await writeMembership({
    actorUid: params.actorUid,
    before: member,
    next: { ...member, trial: { ...member.trial, endsAt: new Date() } },
    action: 'member.trial_ended',
    reason: params.reason,
  });
}

export async function revokeInvite(actorUid: string, email: string, name: string) {
  void actorUid;
  await setDoc(doc(db(), 'invites', normalizeEmail(email)), {
    email: normalizeEmail(email), name: name.slice(0, 80), status: 'revoked', updatedAt: serverTimestamp(),
  }, { merge: true });
}

/** Peserta yang baru login pertama kali menandai undangannya diterima. Gagal diam-diam bila sudah. */
export async function acceptInvite(email: string) {
  try {
    await updateDoc(doc(db(), 'invites', normalizeEmail(email)), { status: 'accepted', acceptedAt: serverTimestamp(), updatedAt: serverTimestamp() });
  } catch { /* sudah diterima / bukan pending */ }
}

/* ------------------------------ Mode akses ------------------------------ */

export async function getAccessConfig(): Promise<{ gatingEnabled: boolean }> {
  const snap = await getDoc(doc(db(), 'config', 'access'));
  return { gatingEnabled: snap.exists() ? snap.data().gatingEnabled === true : false };
}

export async function setGating(actorUid: string, enabled: boolean, reason: string) {
  const batch = writeBatch(db());
  const auditRef = doc(collection(db(), 'auditLogs'));
  batch.set(auditRef, {
    actorUid, action: 'config.access_mode', targetType: 'config', targetId: 'config/access',
    before: { gatingEnabled: !enabled }, after: { gatingEnabled: enabled },
    reason: reason.trim().slice(0, 300), createdAt: serverTimestamp(),
  });
  batch.set(doc(db(), 'config', 'access'), { gatingEnabled: enabled, updatedAt: serverTimestamp(), updatedBy: actorUid, lastAuditId: auditRef.id });
  await batch.commit();
}

/* ------------------------------ Daftar tunggu ------------------------------ */

export type WaitlistInterest = 'spark' | 'boost' | 'impact' | 'unsure';
export interface WaitlistEntry { id: string; name: string; email: string; whatsapp: string; interest: WaitlistInterest; message: string; status: 'new' | 'invited' | 'skipped'; createdAt: Date | null }

export async function joinWaitlist(e: { name: string; email: string; whatsapp: string; interest: WaitlistInterest; message: string }) {
  await addDoc(collection(db(), 'waitlist'), {
    name: e.name.trim().slice(0, 80),
    email: normalizeEmail(e.email).slice(0, 120),
    whatsapp: e.whatsapp.trim().slice(0, 20),
    interest: e.interest,
    message: e.message.trim().slice(0, 300),
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

export async function listWaitlist(max = 500): Promise<WaitlistEntry[]> {
  const snap = await getDocs(query(collection(db(), 'waitlist'), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((d) => {
    const x = d.data();
    return {
      id: d.id, name: String(x.name ?? ''), email: String(x.email ?? ''), whatsapp: String(x.whatsapp ?? ''),
      interest: (['spark', 'boost', 'impact'].includes(x.interest) ? x.interest : 'unsure') as WaitlistInterest,
      message: String(x.message ?? ''),
      status: x.status === 'invited' || x.status === 'skipped' ? x.status : 'new',
      createdAt: toDate(x.createdAt),
    };
  });
}

export async function setWaitlistStatus(id: string, status: 'new' | 'invited' | 'skipped') {
  await updateDoc(doc(db(), 'waitlist', id), { status });
}

/** Admin mengirim (ulang) link masuk ke email peserta. Tidak menyimpan email di perangkat admin. */
export async function sendInviteLink(email: string) {
  const { sendSignInLinkToEmail } = await import('firebase/auth');
  const { auth } = await import('./firebase');
  await sendSignInLinkToEmail(auth(), normalizeEmail(email), { url: loginLinkUrl(), handleCodeInApp: true });
}

/* ------------------------------ Voucher ------------------------------ */


function toVoucher(id: string, x: Record<string, unknown>): Voucher {
  return {
    code: id,
    plan: (x.plan === 'boost' || x.plan === 'impact' ? x.plan : 'spark'),
    maxUses: Number(x.maxUses ?? 1),
    uses: Number(x.uses ?? 0),
    active: x.active === true,
    expiresAt: toDate(x.expiresAt),
    batch: String(x.batch ?? ''),
    note: String(x.note ?? ''),
    assignedEmail: typeof x.assignedEmail === 'string' ? x.assignedEmail : undefined,
    source: typeof x.source === 'string' ? x.source : undefined,
    sourcePaymentId: typeof x.sourcePaymentId === 'string' ? x.sourcePaymentId : undefined,
    createdAt: toDate(x.createdAt),
  };
}

/**
 * Membaca satu voucher. Mengembalikan 'wrong_email' bila Rules menolak pembacaan —
 * terjadi untuk voucher GoAkal yang terikat ke email pembeli lain.
 */
export async function getVoucher(code: string): Promise<Voucher | null | 'wrong_email'> {
  const id = normalizeCode(code);
  if (!id) return null;
  try {
    const snap = await getDoc(doc(db(), 'vouchers', id));
    return snap.exists() ? toVoucher(id, snap.data()) : null;
  } catch (err) {
    if ((err as { code?: string }).code === 'permission-denied') return 'wrong_email';
    return null;
  }
}

/**
 * Menukar voucher dalam SATU batch:
 *  1) pemakaian voucher +1, 2) catatan penukaran, 3) akun peserta (bila belum ada),
 *  4) paket naik sesuai voucher. Security Rules memeriksa ulang semuanya di server.
 */
export async function redeemVoucher(params: {
  uid: string;
  authEmail: string;
  name: string;
  voucher: Voucher;
  hasUserDoc: boolean;
  membership: Membership | null;
}) {
  const { uid, authEmail, name, voucher, hasUserDoc, membership } = params;
  const email = normalizeEmail(authEmail);
  const rid = `${voucher.code}_${uid}`;
  const batch = writeBatch(db());
  batch.update(doc(db(), 'vouchers', voucher.code), { uses: increment(1), updatedAt: serverTimestamp() });
  batch.set(doc(db(), 'redemptions', rid), { code: voucher.code, uid, email, plan: voucher.plan, createdAt: serverTimestamp() });
  if (!hasUserDoc) {
    batch.set(doc(db(), 'users', uid), {
      email: authEmail,
      displayName: name.trim().slice(0, 80),
      role: 'user',
      viaVoucher: voucher.code,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  const mRef = doc(db(), 'memberships', email);
  if (membership) {
    batch.update(mRef, { plan: voucher.plan, updatedAt: serverTimestamp(), updatedBy: uid, lastRedemptionId: rid });
  } else {
    batch.set(mRef, {
      email, name: name.trim().slice(0, 80), plan: voucher.plan, trial: null, trialsUsed: { boost: false, impact: false },
      note: '', updatedAt: serverTimestamp(), updatedBy: uid, lastRedemptionId: rid,
    });
  }
  await batch.commit();
}

export async function listVouchers(max = 5000): Promise<Voucher[]> {
  const snap = await getDocs(query(collection(db(), 'vouchers'), limit(max)));
  return snap.docs.map((d) => toVoucher(d.id, d.data())).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

export async function createVouchers(params: {
  actorUid: string; codes: string[]; plan: Voucher['plan']; maxUses: number; expiresAt: Date | null; batch: string; note: string;
}) {
  const { codes } = params;
  for (let i = 0; i < codes.length; i += 400) {
    const b = writeBatch(db());
    for (const code of codes.slice(i, i + 400)) {
      b.set(doc(db(), 'vouchers', code), {
        code, plan: params.plan, maxUses: params.maxUses, uses: 0, active: true,
        expiresAt: params.expiresAt, batch: params.batch.trim().slice(0, 60), note: params.note.trim().slice(0, 300),
        createdBy: params.actorUid, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
    }
    await b.commit();
  }
}

export async function setVoucherActive(code: string, active: boolean) {
  await updateDoc(doc(db(), 'vouchers', code), { active, updatedAt: serverTimestamp() });
}

/** Ubah status banyak voucher sekaligus (mis. satu batch). Hanya field active & updatedAt yang disentuh. */
export async function setVouchersActive(codes: string[], active: boolean) {
  for (let i = 0; i < codes.length; i += 400) {
    const b = writeBatch(db());
    for (const code of codes.slice(i, i + 400)) b.update(doc(db(), 'vouchers', code), { active, updatedAt: serverTimestamp() });
    await b.commit();
  }
}

export interface Redemption { id: string; code: string; uid: string; email: string; plan: string; createdAt: Date | null }

export async function listRedemptions(max = 2000): Promise<Redemption[]> {
  const snap = await getDocs(query(collection(db(), 'redemptions'), limit(max)));
  return snap.docs.map((d) => {
    const x = d.data();
    return { id: d.id, code: String(x.code ?? ''), uid: String(x.uid ?? ''), email: String(x.email ?? ''), plan: String(x.plan ?? ''), createdAt: toDate(x.createdAt) };
  }).sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
}

/** Peserta memulai trial paket berikutnya sendiri (diproses server, sekali per akun). */
export async function startSelfTrial(): Promise<{ plan: string; days: number; endsAt: string }> {
  const user = auth().currentUser;
  if (!user) throw new Error('Silakan masuk dulu.');
  const token = await user.getIdToken();
  const res = await fetch('/api/trial/start', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'Server sedang sibuk. Muat ulang halaman; kalau trial belum aktif, klik lagi.');
  return body;
}
