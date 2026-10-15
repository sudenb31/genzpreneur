/**
 * Role-Based Access Control.
 * Status "Paid Member" TIDAK disimpan sebagai role — ia diturunkan dari
 * entitlement aktif (Sprint 2), supaya akses berbayar diatur per produk,
 * masa aktif, dan fitur, bukan nama paket yang di-hardcode.
 */
export const ROLES = ['user', 'mentor', 'admin', 'owner'] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  user: 'Peserta',
  mentor: 'Mentor',
  admin: 'Admin',
  owner: 'Super Admin',
};

const RANK: Record<Role, number> = { user: 0, mentor: 1, admin: 2, owner: 3 };

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value);
}

export function hasAtLeast(role: Role | undefined, min: Role): boolean {
  if (!role) return false;
  return RANK[role] >= RANK[min];
}

export function isAdminRole(role: Role | undefined): boolean {
  return role === 'admin' || role === 'owner';
}

/**
 * Aturan perubahan role — HARUS identik dengan fungsi roleChangeAllowed()
 * di firestore.rules. Dipakai di UI untuk menyembunyikan opsi yang pasti
 * ditolak server.
 * - Tidak ada yang boleh mengubah role-nya sendiri.
 * - Owner boleh mengubah role siapa pun ke role apa pun.
 * - Admin hanya boleh memindahkan user ⇄ mentor.
 */
export function canChangeRole(params: {
  actorRole: Role | undefined;
  actorUid: string;
  targetUid: string;
  from: Role;
  to: Role;
}): boolean {
  const { actorRole, actorUid, targetUid, from, to } = params;
  if (actorUid === targetUid) return false;
  if (from === to) return false;
  if (actorRole === 'owner') return true;
  if (actorRole === 'admin') {
    const lower: Role[] = ['user', 'mentor'];
    return lower.includes(from) && lower.includes(to);
  }
  return false;
}

export function assignableRoles(actorRole: Role | undefined, from: Role): Role[] {
  if (actorRole === 'owner') return [...ROLES];
  if (actorRole === 'admin' && (from === 'user' || from === 'mentor')) return ['user', 'mentor'];
  return [from];
}
