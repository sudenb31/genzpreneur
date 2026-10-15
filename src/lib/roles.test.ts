import { describe, expect, it } from 'vitest';
import { assignableRoles, canChangeRole, hasAtLeast, ROLES, type Role } from './roles';

const change = (actorRole: Role, from: Role, to: Role, self = false) =>
  canChangeRole({ actorRole, actorUid: 'a', targetUid: self ? 'a' : 'b', from, to });

describe('hasAtLeast', () => {
  it('urutan role benar', () => {
    expect(hasAtLeast('owner', 'admin')).toBe(true);
    expect(hasAtLeast('admin', 'owner')).toBe(false);
    expect(hasAtLeast('user', 'mentor')).toBe(false);
    expect(hasAtLeast(undefined, 'user')).toBe(false);
  });
});

describe('canChangeRole (cermin firestore.rules)', () => {
  it('tidak ada yang boleh mengubah role sendiri', () => {
    for (const r of ROLES) expect(change(r, r, 'user', true)).toBe(false);
  });

  it('user dan mentor tidak boleh mengubah role siapa pun', () => {
    expect(change('user', 'user', 'mentor')).toBe(false);
    expect(change('mentor', 'user', 'mentor')).toBe(false);
  });

  it('admin hanya user ⇄ mentor', () => {
    expect(change('admin', 'user', 'mentor')).toBe(true);
    expect(change('admin', 'mentor', 'user')).toBe(true);
    expect(change('admin', 'user', 'admin')).toBe(false);
    expect(change('admin', 'admin', 'user')).toBe(false);
    expect(change('admin', 'owner', 'user')).toBe(false);
  });

  it('owner boleh semua perubahan ke orang lain', () => {
    expect(change('owner', 'user', 'admin')).toBe(true);
    expect(change('owner', 'admin', 'owner')).toBe(true);
  });

  it('perubahan ke role yang sama ditolak', () => {
    expect(change('owner', 'user', 'user')).toBe(false);
  });

  it('assignableRoles konsisten dengan canChangeRole', () => {
    for (const actor of ROLES) for (const from of ROLES) {
      for (const to of assignableRoles(actor, from)) {
        if (to !== from) expect(change(actor, from, to)).toBe(true);
      }
    }
  });
});
