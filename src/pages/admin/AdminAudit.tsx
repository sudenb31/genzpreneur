import { useCallback, useEffect, useState } from 'react';
import { listAuditLogs, listUsers, type AuditLog } from '../../lib/data';
import { isRole, ROLE_LABEL } from '../../lib/roles';
import { EmptyState, ErrorState, PageSkeleton } from '../../components/ui';

const ACTION_LABEL: Record<string, string> = { 'user.role_changed': 'Perubahan role' };

const roleText = (v: unknown) => (isRole(v) ? ROLE_LABEL[v] : String(v ?? '—'));

export default function AdminAudit() {
  const [logs, setLogs] = useState<AuditLog[] | null>(null);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [l, users] = await Promise.all([listAuditLogs(), listUsers()]);
      setEmails(Object.fromEntries(users.map((u) => [u.uid, u.email])));
      setLogs(l);
    } catch (e) {
      console.error(e);
      setError('Audit log gagal dimuat.');
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!logs) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-amber-ink">Command Center</p>
        <h1 className="h-page">Audit Log</h1>
        <p className="mt-1 text-sm text-muted">Catatan permanen tindakan sensitif. Tidak dapat diubah atau dihapus siapa pun.</p>
      </header>

      {logs.length === 0 ? (
        <EmptyState title="Belum ada aktivitas" description="Perubahan role dan tindakan sensitif lain akan tercatat di sini." />
      ) : (
        <ol className="card divide-y divide-line">
          {logs.map((l) => (
            <li key={l.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="text-sm">
                <p className="font-medium">{ACTION_LABEL[l.action] ?? l.action}</p>
                <p className="text-muted">
                  {emails[l.actorUid] ?? l.actorUid} → {emails[l.targetId] ?? l.targetId}:{' '}
                  {roleText(l.before.role)} → <strong className="text-ink">{roleText(l.after.role)}</strong>
                </p>
                {l.reason && <p className="mt-1 text-xs text-muted">Alasan: {l.reason}</p>}
              </div>
              <time className="shrink-0 text-xs text-muted">{l.createdAt?.toLocaleString('id-ID') ?? '—'}</time>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
