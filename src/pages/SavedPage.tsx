import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { deleteSavedItem, listSavedItems, type SavedItem, type SavedKind } from '../lib/data';
import { useAsync } from '../lib/useAsync';
import { ConfirmDialog, CopyButton, EmptyState, ErrorState, PageHeader, PageSkeleton, useToast } from '../components/ui';

const KIND: Record<SavedKind, { label: string; cls: string }> = {
  outreach: { label: '💬 Pesan', cls: 'bg-lime' },
  prompt: { label: '⚡ Prompt', cls: 'bg-lilac' },
  proposal: { label: '📄 Proposal', cls: 'bg-sky' },
  calc: { label: '🧮 Simulasi', cls: 'bg-pink' },
  problem: { label: '🧩 Problem Map', cls: 'bg-amber-soft' },
};

export default function SavedPage() {
  const { profile } = useAuth();
  const toast = useToast();
  const { data: items, setData: setItems, loading, error, reload } = useAsync(() => listSavedItems(profile!.uid), [profile?.uid]);
  const [filter, setFilter] = useState<SavedKind | 'all'>('all');
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<SavedItem | null>(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <PageSkeleton />;
  if (error || !items) return <ErrorState message={error ?? 'Data tidak tersedia.'} onRetry={reload} />;

  const q = search.trim().toLowerCase();
  const list = items.filter((i) => (filter === 'all' || i.kind === filter) && (!q || i.title.toLowerCase().includes(q) || i.content.toLowerCase().includes(q)));

  async function doDelete() {
    if (!toDelete || !items) return;
    setBusy(true);
    try {
      await deleteSavedItem(toDelete.id);
      setItems(items.filter((i) => i.id !== toDelete.id));
      toast('success', 'Dihapus.');
      setToDelete(null);
    } catch {
      toast('error', 'Gagal menghapus.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Workspace" title="Tersimpan 📌" desc="Semua pesan, prompt, proposal, dan simulasi yang kamu simpan. Hanya kamu yang bisa melihatnya." />
      {items.length === 0 ? (
        <EmptyState title="Belum ada yang disimpan" description="Buat pesan di Outreach Studio atau pakai AI Toolkit, lalu tekan Simpan."
          action={<Link to="/app/outreach" className="btn-accent">Buka Outreach Studio</Link>} />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label htmlFor="saved-q" className="sr-only">Cari</label>
            <input id="saved-q" className="input sm:max-w-xs" placeholder="Cari…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter jenis">
              {(['all', 'outreach', 'prompt', 'proposal', 'calc', 'problem'] as const).map((k) => (
                <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold ${filter === k ? 'border-ink bg-ink text-paper' : 'border-line bg-white'}`}>
                  {k === 'all' ? 'Semua' : KIND[k].label}
                </button>
              ))}
            </div>
          </div>
          {list.length === 0 ? <EmptyState title="Tidak ada yang cocok" description="Ubah kata kunci atau filter." /> : (
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((i) => (
                <article key={i.id} className="card flex flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${KIND[i.kind]?.cls ?? 'bg-paper-2'}`}>{KIND[i.kind]?.label ?? i.kind}</span>
                    <time className="text-xs text-muted">{i.createdAt?.toLocaleDateString('id-ID') ?? 'baru saja'}</time>
                  </div>
                  <h3 className="mt-2 font-bold">{i.title}</h3>
                  <pre className="mt-2 max-h-40 flex-1 overflow-auto whitespace-pre-wrap rounded-2xl bg-paper p-3 font-sans text-xs leading-relaxed">{i.content}</pre>
                  <div className="mt-3 flex gap-2">
                    <CopyButton text={i.content} className="btn-accent py-2" />
                    <button type="button" className="btn-danger py-2" onClick={() => setToDelete(i)}>Hapus</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
      <ConfirmDialog open={!!toDelete} title="Hapus item ini?" description={`"${toDelete?.title}" akan dihapus permanen.`}
        confirmLabel="Hapus" danger busy={busy} onConfirm={() => void doDelete()} onCancel={() => setToDelete(null)} />
    </div>
  );
}
