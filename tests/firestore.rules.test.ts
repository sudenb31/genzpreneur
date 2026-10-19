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

const ctx = (uid: string, verified = true) => env.authenticatedContext(uid, { email: `${uid}@test.id`, email_verified: verified }).firestore();

async function seedInvite(email: string, status = 'pending') {
  await env.withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), 'invites', email), { email, name: 'X', status, invitedBy: 'owner', createdAt: new Date(), updatedAt: new Date() });
  });
}

async function seedUser(uid: string, role: string) {
  await env.withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), 'users', uid), { email: `${uid}@test.id`, displayName: uid, role, createdAt: new Date(), updatedAt: new Date() });
  });
}

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-genz",
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
  it('TANPA undangan tidak bisa membuat akun; dengan undangan hanya role user', async () => {
    const db = ctx('newbie');
    const u = (role: string) => ({ email: 'newbie@test.id', displayName: 'N', role, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    await assertFails(setDoc(doc(db, 'users', 'newbie'), u('user'))); // belum diundang
    await seedInvite('newbie@test.id');
    await assertFails(setDoc(doc(db, 'users', 'newbie'), u('admin')));
    await assertFails(setDoc(doc(ctx('newbie', false), 'users', 'newbie'), u('user'))); // email belum terverifikasi
    await assertSucceeds(setDoc(doc(db, 'users', 'newbie'), u('user')));
  });

  it('undangan yang dicabut tidak bisa dipakai', async () => {
    await seedInvite('newbie@test.id', 'revoked');
    await assertFails(setDoc(doc(ctx('newbie'), 'users', 'newbie'), { email: 'newbie@test.id', displayName: 'N', role: 'user', createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
  });

  it('akun Auth tanpa dokumen user (tidak diundang) tidak bisa menulis data apa pun', async () => {
    await assertFails(setDoc(doc(ctx('stranger'), 'passports', 'stranger'), passport('stranger')));
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

describe('assessments, progress, savedItems', () => {
  const assessment = (uid: string) => ({
    ownerUid: uid, answers: { q1: 'a' }, industryScores: { fnb: 80 }, trackScores: { sales_partner: 90 },
    topIndustries: ['fnb', 'retail', 'event'], track: 'sales_partner',
    profileScores: { creator: 70, star: 40 }, topProfiles: ['creator', 'star'], attempts: 1, completedAt: serverTimestamp(),
  });

  it('assessment: pemilik bisa simpan; orang lain tidak bisa baca; admin bisa baca', async () => {
    await assertSucceeds(setDoc(doc(ctx('alice'), 'assessments', 'alice'), assessment('alice')));
    await assertFails(getDoc(doc(ctx('bob'), 'assessments', 'alice')));
    await assertSucceeds(getDoc(doc(ctx('adi'), 'assessments', 'alice')));
    await assertFails(setDoc(doc(ctx('bob'), 'assessments', 'alice'), assessment('alice')));
    await assertFails(setDoc(doc(ctx('alice'), 'assessments', 'alice'), { ...assessment('alice'), track: 'hacker' }));
    await assertFails(setDoc(doc(ctx('alice'), 'assessments', 'alice'), { ...assessment('alice'), topProfiles: ['creator'] }));
    await assertFails(setDoc(doc(ctx('alice'), 'assessments', 'alice'), { ...assessment('alice'), isPaid: true }));
  });

  it('progress: hanya pemilik yang menulis', async () => {
    const data = { ownerUid: 'alice', lessons: { 'mindset-1': { done: true, reflection: 'x' } }, updatedAt: serverTimestamp() };
    await assertSucceeds(setDoc(doc(ctx('alice'), 'progress', 'alice'), data, { merge: true }));
    await assertFails(setDoc(doc(ctx('bob'), 'progress', 'alice'), data, { merge: true }));
    await assertFails(setDoc(doc(ctx('alice'), 'progress', 'alice'), { ...data, isPaid: true }, { merge: true }));
  });

  it('savedItems: privat per pemilik, tidak bisa diubah', async () => {
    const ref = doc(collection(ctx('alice'), 'savedItems'));
    await assertSucceeds(setDoc(ref, { ownerUid: 'alice', kind: 'outreach', title: 'Pesan', content: 'Halo', createdAt: serverTimestamp() }));
    await assertFails(getDoc(doc(ctx('bob'), 'savedItems', ref.id)));
    await assertFails(getDoc(doc(ctx('adi'), 'savedItems', ref.id)));
    await assertFails(updateDoc(ref, { title: 'ubah' }));
    await assertFails(setDoc(doc(collection(ctx('bob'), 'savedItems')), { ownerUid: 'alice', kind: 'outreach', title: 'x', content: 'x', createdAt: serverTimestamp() }));
    await assertSucceeds(deleteDoc(ref));
  });
});

describe('dreamPacts', () => {
  const pact = (uid: string) => ({
    ownerUid: uid, why: { people: 'x' }, edge: {}, dream: { currentAge: 22, dreamAge: 40 }, milestones: {}, skillTree: {},
    plan: [{ cat: 'cuan', program: 'x', target: '', month: 'Mei' }], commit: { signName: 'A' },
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  });
  it('pemilik menulis, admin membaca saja, orang lain ditolak', async () => {
    await assertSucceeds(setDoc(doc(ctx('alice'), 'dreamPacts', 'alice'), pact('alice')));
    await assertFails(getDoc(doc(ctx('bob'), 'dreamPacts', 'alice')));
    await assertSucceeds(getDoc(doc(ctx('adi'), 'dreamPacts', 'alice')));
    await assertFails(updateDoc(doc(ctx('adi'), 'dreamPacts', 'alice'), { 'commit.signName': 'hack', updatedAt: serverTimestamp() }));
    await assertFails(setDoc(doc(ctx('alice'), 'dreamPacts', 'alice'), { ...pact('alice'), plan: Array(16).fill({}) }));
  });
});

describe('default deny', () => {
  it('koleksi yang tidak didefinisikan tertutup', async () => {
    await assertFails(setDoc(doc(ctx('owner'), 'payments', 'p1'), { amount: 99000 }));
  });
});

describe('undangan, paket & trial', () => {
  const membership = (actor: string, auditId: string, plan = 'spark') => ({
    email: 'newbie@test.id', name: 'N', plan, trial: null, trialsUsed: { boost: false, impact: false }, note: '',
    updatedAt: serverTimestamp(), updatedBy: actor, lastAuditId: auditId,
  });
  const audit = (actor: string) => ({
    actorUid: actor, action: 'member.invited', targetType: 'membership', targetId: 'newbie@test.id',
    before: {}, after: { plan: 'spark' }, reason: 'tes', createdAt: serverTimestamp(),
  });

  it('admin bisa mengatur paket HANYA bersama audit log di batch yang sama', async () => {
    const db = ctx('adi');
    await assertFails(setDoc(doc(db, 'memberships', 'newbie@test.id'), membership('adi', 'tidak-ada')));
    const b = writeBatch(db);
    const a = doc(collection(db, 'auditLogs'));
    b.set(a, audit('adi'));
    b.set(doc(db, 'memberships', 'newbie@test.id'), membership('adi', a.id));
    await assertSucceeds(b.commit());
  });

  it('peserta tidak bisa mengubah paketnya sendiri, tapi bisa membacanya', async () => {
    const admin = ctx('adi');
    const b = writeBatch(admin);
    const a = doc(collection(admin, 'auditLogs'));
    b.set(a, { ...audit('adi'), targetId: 'alice@test.id' });
    b.set(doc(admin, 'memberships', 'alice@test.id'), { ...membership('adi', a.id), email: 'alice@test.id' });
    await b.commit();
    await assertSucceeds(getDoc(doc(ctx('alice'), 'memberships', 'alice@test.id')));
    await assertFails(getDoc(doc(ctx('bob'), 'memberships', 'alice@test.id')));
    await assertFails(updateDoc(doc(ctx('alice'), 'memberships', 'alice@test.id'), { plan: 'impact' }));
  });

  it('trial hanya boost/impact 3 atau 7 hari', async () => {
    const db = ctx('adi');
    const b = writeBatch(db);
    const a = doc(collection(db, 'auditLogs'));
    b.set(a, audit('adi'));
    b.set(doc(db, 'memberships', 'newbie@test.id'), { ...membership('adi', a.id), trial: { plan: 'impact', days: 30, startedAt: new Date(), endsAt: new Date() } });
    await assertFails(b.commit());
  });

  it('hanya admin yang bisa membuat undangan; peserta hanya bisa menandai undangannya diterima', async () => {
    const inv = { email: 'newbie@test.id', name: 'N', status: 'pending', invitedBy: 'adi', createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
    await assertFails(setDoc(doc(ctx('alice'), 'invites', 'newbie@test.id'), { ...inv, invitedBy: 'alice' }));
    await assertSucceeds(setDoc(doc(ctx('adi'), 'invites', 'newbie@test.id'), inv));
    await assertFails(updateDoc(doc(ctx('newbie'), 'invites', 'newbie@test.id'), { status: 'revoked', updatedAt: serverTimestamp() }));
    await assertSucceeds(updateDoc(doc(ctx('newbie'), 'invites', 'newbie@test.id'), { status: 'accepted', acceptedAt: serverTimestamp(), updatedAt: serverTimestamp() }));
  });

  it('mode akses hanya bisa diubah Super Admin (dengan audit)', async () => {
    for (const who of ['adi', 'owner']) {
      const db = ctx(who);
      const b = writeBatch(db);
      const a = doc(collection(db, 'auditLogs'));
      b.set(a, { actorUid: who, action: 'config.access_mode', targetType: 'config', targetId: 'config/access', before: {}, after: { gatingEnabled: true }, reason: '', createdAt: serverTimestamp() });
      b.set(doc(db, 'config', 'access'), { gatingEnabled: true, updatedAt: serverTimestamp(), updatedBy: who, lastAuditId: a.id });
      if (who === 'adi') await assertFails(b.commit()); else await assertSucceeds(b.commit());
    }
  });

  it('daftar tunggu: siapa pun bisa mendaftar dengan isian valid; hanya admin yang membaca', async () => {
    const anon = env.unauthenticatedContext().firestore();
    const entry = { name: 'Rani', email: 'rani@mail.com', whatsapp: '081234567890', interest: 'boost', message: '', status: 'new', createdAt: serverTimestamp() };
    await assertSucceeds(setDoc(doc(anon, 'waitlist', 'w1'), entry));
    await assertFails(setDoc(doc(anon, 'waitlist', 'w2'), { ...entry, status: 'invited' }));
    await assertFails(setDoc(doc(anon, 'waitlist', 'w3'), { ...entry, email: 'bukan-email' }));
    await assertFails(getDoc(doc(anon, 'waitlist', 'w1')));
    await assertFails(getDoc(doc(ctx('alice'), 'waitlist', 'w1')));
    await assertSucceeds(getDoc(doc(ctx('adi'), 'waitlist', 'w1')));
  });
});

describe('voucher', () => {
  const voucher = (over: Record<string, unknown> = {}) => ({
    code: 'BOOST-ABCD2345', plan: 'boost', maxUses: 1, uses: 0, active: true, expiresAt: null, batch: 'b1', note: '',
    createdBy: 'adi', createdAt: new Date(), updatedAt: new Date(), ...over,
  });
  async function seedVoucher(over: Record<string, unknown> = {}) {
    await env.withSecurityRulesDisabled(async (c) => { await setDoc(doc(c.firestore(), 'vouchers', 'BOOST-ABCD2345'), voucher(over)); });
  }
  function redeemBatch(uid: string, plan = 'boost') {
    const db = ctx(uid);
    const b = writeBatch(db);
    const rid = `BOOST-ABCD2345_${uid}`;
    b.update(doc(db, 'vouchers', 'BOOST-ABCD2345'), { uses: 1, updatedAt: serverTimestamp() });
    b.set(doc(db, 'redemptions', rid), { code: 'BOOST-ABCD2345', uid, email: `${uid}@test.id`, plan, createdAt: serverTimestamp() });
    b.set(doc(db, 'users', uid), { email: `${uid}@test.id`, displayName: uid, role: 'user', viaVoucher: 'BOOST-ABCD2345', createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    b.set(doc(db, 'memberships', `${uid}@test.id`), {
      email: `${uid}@test.id`, name: uid, plan, trial: null, trialsUsed: { boost: false, impact: false }, note: '',
      updatedAt: serverTimestamp(), updatedBy: uid, lastRedemptionId: rid,
    });
    return b.commit();
  }

  it('pembeli tanpa undangan bisa menukar voucher valid → akun + paket aktif', async () => {
    await seedVoucher();
    await assertSucceeds(redeemBatch('buyer'));
  });
  it('paket di membership harus sama dengan isi voucher', async () => {
    await seedVoucher();
    await assertFails(redeemBatch('buyer', 'impact'));
  });
  it('voucher nonaktif / kedaluwarsa / kuota habis ditolak', async () => {
    await seedVoucher({ active: false });
    await assertFails(redeemBatch('buyer'));
    await seedVoucher({ expiresAt: new Date('2020-01-01') });
    await assertFails(redeemBatch('buyer'));
    await seedVoucher({ uses: 1 });
    await assertFails(redeemBatch('buyer'));
  });
  it('peserta tidak bisa mengubah paket tanpa penukaran baru', async () => {
    await seedVoucher();
    await redeemBatch('buyer');
    await assertFails(updateDoc(doc(ctx('buyer'), 'memberships', 'buyer@test.id'), { plan: 'impact', updatedAt: serverTimestamp(), updatedBy: 'buyer' }));
  });
  it('daftar voucher hanya untuk admin; peserta hanya bisa membaca satu kode', async () => {
    await seedVoucher();
    await assertFails(getDocs(collection(ctx('alice'), 'vouchers')));
    await assertSucceeds(getDoc(doc(ctx('alice'), 'vouchers', 'BOOST-ABCD2345')));
    await assertSucceeds(getDocs(collection(ctx('adi'), 'vouchers')));
  });
});

// Initial conditions reuse existing progress permissions; no new collection or privilege.
describe('versioned initial conditions within progress', () => {
  const condition = JSON.stringify({questionVersion:1,ruleVersion:1,answers:{goal:'DATA UJI'},selectedStage:null});
  it('preserves old work on merge; owner/admin read, peer/mentor/anonymous denied; admin cannot write', async () => {
    const ref=doc(ctx('alice'),'progress','alice');
    await assertSucceeds(setDoc(ref,{ownerUid:'alice',lessons:{'b101-1':{done:true,reflection:'DATA UJI'}},plan:{tasks:{old:true},notes:{d1:'DATA UJI LAMA','work-v1-sample':'DATA UJI MISI'}},updatedAt:serverTimestamp()}));
    await assertSucceeds(setDoc(ref,{ownerUid:'alice',plan:{notes:{'entry-map-v1':condition}},updatedAt:serverTimestamp()},{merge:true}));
    const snapshot=await getDoc(ref);
    const d=snapshot.data()!;
    if(d.plan.notes.d1!=='DATA UJI LAMA'||d.plan.notes['work-v1-sample']!=='DATA UJI MISI'||!d.plan.tasks.old||!d.lessons['b101-1'].done) throw new Error('Legacy work overwritten');
    await assertSucceeds(getDoc(doc(ctx('adi'),'progress','alice')));
    await assertSucceeds(getDoc(doc(ctx('owner'),'progress','alice')));
    await assertFails(getDoc(doc(ctx('bob'),'progress','alice')));
    await assertFails(getDoc(doc(ctx('mia'),'progress','alice')));
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(),'progress','alice')));
    for(const uid of ['bob','mia','adi']) await assertFails(setDoc(doc(ctx(uid),'progress','alice'),{ownerUid:'alice',plan:{notes:{'entry-map-v1':condition}},updatedAt:serverTimestamp()},{merge:true}));
  });
});
