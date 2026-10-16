import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listWaitlist, setWaitlistStatus, type WaitlistEntry } from '../../lib/data';
import { CopyButton, EmptyState, ErrorState, PageSkeleton, useToast } from '../../components/ui';

const INTEREST: Record<WaitlistEntry['interest'], string> = { spark: '⚡ Spark', boost: '🚀 Boost', impact: '🎯 Impact', unsure: '🤔 Belum tahu' };
const STATUS: Record<WaitlistEntry['status'], { l: string; cls: string }> = {
  new: { l: 'Baru', cls: 'bg-lime' },
  invited: { l: 'Sudah diundang', cls: 'bg-sky' },
  skipped: { l: 'Dilewati', cls: 'bg-paper-2' },
};

/** Ubah 08xx menjadi 628xx untuk link WhatsApp. */
const waNumber = (w: string) => w.replace(/[^0-9]/g, '').replace(/^0/, '62');

export default function AdminWaitlist() {
  const toast = useToast();
  const [items, setItems] = useState<WaitlistEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<WaitlistEntry['status'] | 'all'>('new');

  const load = useCallback(async () => {
    setError(null);
    try { setItems(await listWaitlist()); }
    catch (e) { console.error(e); setError('Daftar tunggu gagal dimuat. Pastikan Security Rules terbaru sudah dipublish.'); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const list = useMemo(() => (items ?? []).filter((i) => filter === 'all' || i.status === filter), [items, filter]);
  const csv = useMemo(() => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    return ['nama,email,whatsapp,minat,pesan,status,tanggal', ...(items ?? []).map((i) =>
      [i.name, i.email, i.whatsapp, i.interest, i.message, i.status, i.createdAt?.toISOString() ?? ''].map(esc).join(','))].join('\n');
  }, [items]);

  async function mark(i: WaitlistEntry, status: WaitlistEntry['status']) {
    try { await setWaitlistStatus(i.id, status); await load(); }
    catch { toast('error', 'Gagal mengubah status.'); }
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!items) return <PageSkeleton />;

  const count = (s: WaitlistEntry['status'] | 'all') => (s === 'all' ? items.length : items.filter((i) => i.status === s).length);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-ink">Command Center</p>
          <h1 className="h-page">Daftar Tunggu</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">Orang yang mengisi form di landing page. Hubungi lewat WhatsApp, lalu klik "Undang" setelah pembayaran/kesepakatan beres.</p>
        </div>
        <CopyButton text={csv} label="Salin CSV" className="btn-ghost" />
      </header>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter status">
        {(['new', 'invited', 'skipped', 'all'] as const).map((s) => (
          <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === s ? 'bg-ink text-paper' : 'border border-line bg-white hover:bg-paper-2'}`}>
            {s === 'all' ? 'Semua' : STATUS[s].l} <span className="opacity-60">{count(s)}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState title="Belum ada data" description="Pendaftar daftar tunggu dari landing page akan muncul di sini." />
      ) : (
        <div className="space-y-3">
          {list.map((i) => (
            <article key={i.id} className="card flex flex-wrap items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-bold">{i.name}</p>
                <p className="text-xs text-muted">{i.email} · {i.whatsapp} · {i.createdAt?.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) ?? '—'}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-xs font-semibold">{INTEREST[i.interest]}</span>
                  <span className={`rounded-full border border-ink px-2.5 py-0.5 text-xs font-extrabold ${STATUS[i.status].cls}`}>{STATUS[i.status].l}</span>
                </div>
                {i.message && <p className="mt-2 text-sm text-ink/80">“{i.message}”</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <a className="btn-ghost py-1.5 text-sm" href={`https://wa.me/${waNumber(i.whatsapp)}`} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
                {i.status !== 'invited' && (
                  <Link className="btn-accent py-1.5 text-sm"
                    to={`/app/admin/peserta?undang=${encodeURIComponent(i.email)}&nama=${encodeURIComponent(i.name)}&paket=${i.interest === 'unsure' ? 'spark' : i.interest}&wl=${i.id}`}>
                    Undang →
                  </Link>
                )}
                {i.status === 'new' && <button type="button" className="btn-ghost py-1.5 text-sm" onClick={() => void mark(i, 'skipped')}>Lewati</button>}
                {i.status === 'skipped' && <button type="button" className="btn-ghost py-1.5 text-sm" onClick={() => void mark(i, 'new')}>Kembalikan</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
