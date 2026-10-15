import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { changeUserRole, listUsers, type UserRecord } from '../../lib/data';
import { assignableRoles, canChangeRole, ROLE_LABEL, ROLES, type Role } from '../../lib/roles';
import { ConfirmDialog, EmptyState, ErrorState, PageSkeleton, useToast } from '../../components/ui';

export default function AdminUsers() {
  const { profile } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState<UserRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [pending, setPending] = useState<{ user: UserRecord; to: Role } | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      setUsers(await listUsers());
    } catch (e) {
      console.error(e);
      setError('Daftar pengguna gagal dimuat.');
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    return users.filter((u) =>
      (roleFilter === 'all' || u.role === roleFilter) &&
      (!q || u.email.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q)));
  }, [users, search, roleFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: users?.length ?? 0 };
    for (const r of ROLES) c[r] = users?.filter((u) => u.role === r).length ?? 0;
    return c;
  }, [users]);

  async function confirmChange() {
    if (!pending || !profile) return;
    if (reason.trim().length < 3) return toast('error', 'Tulis alasan perubahan (minimal 3 karakter).');
    setBusy(true);
    try {
      await changeUserRole({ actorUid: profile.uid, target: pending.user, to: pending.to, reason });
      toast('success', `Role ${pending.user.email} diubah menjadi ${ROLE_LABEL[pending.to]}.`);
      setPending(null);
      setReason('');
      await load();
    } catch (e) {
      console.error(e);
      toast('error', 'Perubahan ditolak server. Pastikan kamu punya wewenang untuk perubahan ini.');
    } finally {
      setBusy(false);
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!users) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-amber-ink">Command Center</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Pengguna & Role</h1>
        <p className="mt-1 text-sm text-muted">Setiap perubahan role tercatat di Audit Log. Admin hanya bisa mengatur Peserta ⇄ Mentor; Super Admin bisa mengatur semua role.</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="user-search">Cari pengguna</label>
        <input id="user-search" className="input sm:max-w-xs" placeholder="Cari nama atau email…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter role">
          {(['all', ...ROLES] as const).map((r) => (
            <button key={r} type="button" aria-pressed={roleFilter === r} onClick={() => setRoleFilter(r)}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${roleFilter === r ? 'bg-ink text-paper' : 'border border-line bg-white hover:bg-paper-2'}`}>
              {r === 'all' ? 'Semua' : ROLE_LABEL[r]} <span className="opacity-60">{counts[r]}</span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={users.length === 0 ? 'Belum ada pengguna' : 'Tidak ada yang cocok'}
          description={users.length === 0 ? 'Pengguna akan muncul di sini setelah mendaftar.' : 'Ubah kata kunci atau filter role.'} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wider text-muted">
              <tr><th className="px-4 py-3">Pengguna</th><th className="px-4 py-3">Terdaftar</th><th className="px-4 py-3">Role</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((u) => {
                const options = assignableRoles(profile?.role, u.role);
                const self = u.uid === profile?.uid;
                return (
                  <tr key={u.uid}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{u.displayName || '—'} {self && <span className="text-xs text-muted">(kamu)</span>}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">{u.createdAt ? u.createdAt.toLocaleDateString('id-ID') : '—'}</td>
                    <td className="px-4 py-3">
                      {self || options.length <= 1 ? (
                        <span className="inline-block rounded-full bg-paper-2 px-2.5 py-1 text-xs font-semibold">{ROLE_LABEL[u.role]}</span>
                      ) : (
                        <select aria-label={`Role ${u.email}`} className="input w-40 py-1.5" value={u.role}
                          onChange={(e) => {
                            const to = e.target.value as Role;
                            if (canChangeRole({ actorRole: profile?.role, actorUid: profile!.uid, targetUid: u.uid, from: u.role, to })) setPending({ user: u, to });
                          }}>
                          {options.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!pending}
        title="Ubah role pengguna?"
        description={pending && <>Role <strong>{pending.user.email}</strong> akan diubah dari <strong>{ROLE_LABEL[pending.user.role]}</strong> menjadi <strong>{ROLE_LABEL[pending.to]}</strong>.</>}
        confirmLabel="Ubah role"
        busy={busy}
        onConfirm={() => void confirmChange()}
        onCancel={() => { setPending(null); setReason(''); }}
      >
        <label htmlFor="reason" className="label">Alasan (tercatat di audit log)</label>
        <input id="reason" className="input" value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder="Contoh: ditugaskan sebagai mentor batch 1" />
      </ConfirmDialog>
    </div>
  );
}
