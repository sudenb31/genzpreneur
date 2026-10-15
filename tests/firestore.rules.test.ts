/**
 * Uji Security Rules terhadap Firestore Emulator.
 * Jalankan: npm run test:rules   (butuh Java 11+; emulator diunduh otomatis saat pertama kali)
 */
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc, deleteDoc, writeBatch, collection, getDocs } from 'firebase/firestore';

let env: RulesTestEnvironment;

const passport = (uid: string) => ({
  personal: { fullName: 'Rani Putri', ageRange: '', status: '', fieldOfWork: '', city: '', businessExperience: '', programGoal: '' },
  skills: { levels: {}, otherSkills: '' },
  resources: { hoursPerWeek: null, devices: [], startBudget: '', workMode: '', customerExperience: '' },
  interests: { selected: [], otherInterests: '' },
  goals: { skillTarget: '', weeklyActivityTarget: null, weeklyProspectTarget: null, portfolioTarget: '', monthlyIncomeAspiration: null },
  ownerUid: uid,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

const ctx = (uid: string) => env.authenticatedContext(uid, { email: `${uid}@test.id` }).firestore();

async function seedUser(uid: string, role: string) {
  await env.withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), 'users', uid), { email: `${uid}@test.id`, displayName: uid, role, createdAt: new Date(), updatedAt: new Date() });
  });
}

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-genz',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});
afterAll(async () => env.cleanup());
beforeEach(async () => {
  await env.clearFirestore();
  await seedUser('alice', 'user');
  await seedUser('bob', 'user');
  await seedUser('mia', 'mentor');
  await seedUser('adi', 'admin');
  await seedUser('owner', 'owner');
});

describe('users', () => {
  it('pendaftaran baru hanya boleh role user', async () => {
    const db = ctx('newbie');
    await assertFails(setDoc(doc(db, 'users', 'newbie'), { email: 'newbie@test.id', displayName: 'N', role: 'admin', createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
    await assertSucceeds(setDoc(doc(db, 'users', 'newbie'), { email: 'newbie@test.id', displayName: 'N', role: 'user', createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
  });

  it('tidak bisa membuat dokumen user untuk orang lain', async () => {
    await assertFails(setDoc(doc(ctx('alice'), 'users', 'ghost'), { email: 'alice@test.id', displayName: 'G', role: 'user', createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
  });

  it('user tidak bisa membaca user lain; admin bisa', async () => {
    await assertFails(getDoc(doc(ctx('alice'), 'users', 'bob')));
    await assertSucceeds(getDoc(doc(ctx('alice'), 'users', 'alice')));
    await assertSucceeds(getDoc(doc(ctx('adi'), 'users', 'bob')));
  });

  it('user tidak bisa menaikkan role sendiri', async () => {
    await assertFails(updateDoc(doc(ctx('alice'), 'users', 'alice'), { role: 'owner', updatedAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(ctx('alice'), 'users', 'alice'), { displayName: 'Alice B', updatedAt: serverTimestamp() }));
  });

  it('perubahan role oleh admin WAJIB disertai audit log', async () => {
    const db = ctx('adi');
    await assertFails(updateDoc(doc(db, 'users', 'alice'), { role: 'mentor', lastAuditId: 'x', updatedAt: serverTimestamp() }));

    const batch = writeBatch(db);
    const a = doc(collection(db, 'auditLogs'));
    batch.set(a, { actorUid: 'adi', action: 'user.role_changed', targetType: 'user', targetId: 'alice', before: { role: 'user' }, after: { role: 'mentor' }, reason: 'tes', createdAt: serverTimestamp() });
    batch.update(doc(db, 'users', 'alice'), { role: 'mentor', lastAuditId: a.id, updatedAt: serverTimestamp() });
    await assertSucceeds(batch.commit());
  });

  it('admin tidak boleh menjadikan orang admin; owner boleh', async () => {
    const tryPromote = (actor: string) => {
      const db = ctx(actor);
      const batch = writeBatch(db);
      const a = doc(collection(db, 'auditLogs'));
      batch.set(a, { actorUid: actor, action: 'user.role_changed', targetType: 'user', targetId: 'bob', before: { role: 'user' }, after: { role: 'admin' }, reason: 'tes', createdAt: serverTimestamp() });
      batch.update(doc(db, 'users', 'bob'), { role: 'admin', lastAuditId: a.id, updatedAt: serverTimestamp() });
      return batch.commit();
    };
    await assertFails(tryPromote('adi'));
    await assertSucceeds(tryPromote('owner'));
  });

  it('mentor tidak bisa mengubah role', async () => {
    const db = ctx('mia');
    const batch = writeBatch(db);
    const a = doc(collection(db, 'auditLogs'));
    batch.set(a, { actorUid: 'mia', action: 'user.role_changed', targetType: 'user', targetId: 'alice', before: { role: 'user' }, after: { role: 'mentor' }, reason: 'x', createdAt: serverTimestamp() });
    batch.update(doc(db, 'users', 'alice'), { role: 'mentor', lastAuditId: a.id, updatedAt: serverTimestamp() });
    await assertFails(batch.commit());
  });

  it('dokumen user tidak bisa dihapus dari browser', async () => {
    await assertFails(deleteDoc(doc(ctx('owner'), 'users', 'alice')));
  });
});

describe('passports', () => {
  it('pemilik bisa membuat, membaca, menghapus Passport sendiri', async () => {
    const db = ctx('alice');
    await assertSucceeds(setDoc(doc(db, 'passports', 'alice'), passport('alice')));
    await assertSucceeds(getDoc(doc(db, 'passports', 'alice')));
    await assertSucceeds(deleteDoc(doc(db, 'passports', 'alice')));
  });

  it('peserta lain tidak bisa membaca atau menulis Passport orang lain', async () => {
    await setDoc(doc(ctx('alice'), 'passports', 'alice'), passport('alice'));
    await assertFails(getDoc(doc(ctx('bob'), 'passports', 'alice')));
    await assertFails(setDoc(doc(ctx('bob'), 'passports', 'alice'), passport('alice')));
    await assertFails(deleteDoc(doc(ctx('bob'), 'passports', 'alice')));
  });

  it('admin bisa membaca tapi tidak bisa mengubah Passport', async () => {
    await setDoc(doc(ctx('alice'), 'passports', 'alice'), passport('alice'));
    await assertSucceeds(getDoc(doc(ctx('adi'), 'passports', 'alice')));
    await assertFails(updateDoc(doc(ctx('adi'), 'passports', 'alice'), { 'personal.fullName': 'Hack', updatedAt: serverTimestamp() }));
  });

  it('menolak field asing dan ownerUid palsu', async () => {
    const db = ctx('alice');
    await assertFails(setDoc(doc(db, 'passports', 'alice'), { ...passport('alice'), isPaid: true }));
    await assertFails(setDoc(doc(db, 'passports', 'alice'), passport('bob')));
  });
});

describe('auditLogs', () => {
  it('append-only dan hanya admin yang membaca', async () => {
    const db = ctx('adi');
    const ref = doc(collection(db, 'auditLogs'));
    await assertSucceeds(setDoc(ref, { actorUid: 'adi', action: 'test', targetType: 'user', targetId: 'alice', before: {}, after: {}, reason: '', createdAt: serverTimestamp() }));
    await assertFails(updateDoc(ref, { reason: 'ubah' }));
    await assertFails(deleteDoc(ref));
    await assertFails(getDocs(collection(ctx('alice'), 'auditLogs')));
    await assertSucceeds(getDocs(collection(db, 'auditLogs')));
  });

  it('admin tidak bisa memalsukan actorUid', async () => {
    await assertFails(setDoc(doc(collection(ctx('adi'), 'auditLogs')), { actorUid: 'owner', action: 'test', targetType: 'user', targetId: 'x', before: {}, after: {}, reason: '', createdAt: serverTimestamp() }));
  });
});

describe('default deny', () => {
  it('koleksi yang tidak didefinisikan tertutup', async () => {
    await assertFails(setDoc(doc(ctx('owner'), 'payments', 'p1'), { amount: 99000 }));
  });
});
