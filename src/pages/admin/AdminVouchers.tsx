import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { createVouchers, listRedemptions, listVouchers, setVoucherActive, setVouchersActive, type Redemption } from '../../lib/data';
import { PLAN_INFO } from '../../lib/membership';
import { generateCodes, normalizeCode, VOUCHER_RE, type Voucher } from '../../lib/voucher';
import { CopyButton, EmptyState, ErrorState, PageSkeleton, useToast } from '../../components/ui';

type Mode = 'unique' | 'shared';
type PaidPlan = Voucher['plan'];

function statusOf(v: Voucher, now: Date) {
  if (!v.active) return { l: 'Nonaktif', cls: 'bg-paper-2' };
  if (v.expiresAt && now >= v.expiresAt) return { l: 'Kedaluwarsa', cls: 'bg-pink' };
  if (v.uses >= v.maxUses) return { l: 'Habis', cls: 'bg-amber-soft' };
  return { l: 'Aktif', cls: 'bg-lime' };
}

export default function AdminVouchers() {
  const { profile } = useAuth();
  const toast = useToast();
  const [vouchers, setVouchers] = useState<Voucher[] | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'codes' | 'redemptions'>('codes');
  const [batchFilter, setBatchFilter] = useState('all');
  const [confirmBulk, setConfirmBulk] = useState<null | boolean>(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<string[] | null>(null);
  const [form, setForm] = useState({
    mode: 'unique' as Mode, plan: 'boost' as PaidPlan, count: '20', prefix: 'BOOST', sharedCode: '', maxUses: '50',
    expires: '', batch: '', note: '',
  });

  const load = useCallback(async () => {
    setError(null);
    try {
      const [v, r] = await Promise.all([listVouchers(), listRedemptions()]);
      setVouchers(v);
      setRedemptions(r);
    } catch (e) {
      console.error(e);
      setError('Data voucher gagal dimuat. Pastikan Security Rules terbaru sudah dipublish.');
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const now = new Date();
  const batches = useMemo(() => [...new Set((vouchers ?? []).map((v) => v.batch).filter(Boolean))], [vouchers]);
  /** Kode → email yang sudah menukarnya (dari koleksi redemptions). */
  const usedBy = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const r of redemptions) { const k = r.code.toUpperCase(); m.set(k, [...(m.get(k) ?? []), r.email.toLowerCase()]); }
    return m;
  }, [redemptions]);
  const list = useMemo(() => {
    const q = normalizeCode(search);
    const qe = search.trim().toLowerCase();
    const byEmail = (v: { code: string; assignedEmail?: string }) =>
      (v.assignedEmail ?? '').includes(qe) || (usedBy.get(v.code) ?? []).some((e) => e.includes(qe));
    return (vouchers ?? []).filter((v) => (batchFilter === 'all' || v.batch === batchFilter) && (!qe || (!!q && v.code.includes(q)) || byEmail(v)));
  }, [vouchers, batchFilter, search, usedBy]);
  const stats = useMemo(() => {
    const vs = vouchers ?? [];
    return {
      codes: vs.length,
      redeemed: redemptions.length,
      active: vs.filter((v) => statusOf(v, now).l === 'Aktif').length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vouchers, redemptions]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const expiresAt = form.expires ? new Date(`${form.expires}T23:59:59`) : null;
    if (expiresAt && expiresAt <= new Date()) return toast('error', 'Tanggal kedaluwarsa harus di masa depan.');
    let codes: string[];
    let maxUses: number;
    if (form.mode === 'unique') {
      const n = Number(form.count);
      if (!Number.isInteger(n) || n < 1 || n > 500) return toast('error', 'Jumlah kode 1–500.');
      codes = generateCodes(form.prefix, n);
      maxUses = 1;
    } else {
      const c = normalizeCode(form.sharedCode);
      if (!VOUCHER_RE.test(c)) return toast('error', 'Kode bersama: 4–32 huruf besar/angka/tanda hubung.');
      if ((vouchers ?? []).some((v) => v.code === c)) return toast('error', 'Kode itu sudah ada.');
      const m = Number(form.maxUses);
      if (!Number.isInteger(m) || m < 1 || m > 100000) return toast('error', 'Kuota pemakaian 1–100.000.');
      codes = [c];
      maxUses = m;
    }
    setBusy(true);
    try {
      await createVouchers({ actorUid: profile.uid, codes, plan: form.plan, maxUses, expiresAt, batch: form.batch || `${form.plan}-${new Date().toISOString().slice(0, 10)}`, note: form.note });
      setCreated(codes);
      toast('success', `${codes.length} kode voucher ${PLAN_INFO[form.plan].name} dibuat.`);
      await load();
    } catch (err) {
      console.error(err);
      toast('error', 'Gagal membuat voucher. Pastikan akunmu Admin dan rules terbaru sudah dipublish.');
    } finally {
      setBusy(false);
    }
  }

  /** Nonaktifkan/aktifkan semua kode di batch yang sedang difilter (dua langkah: pilih lalu konfirmasi). */
  async function bulkToggle(active: boolean) {
    const codes = (vouchers ?? []).filter((v) => v.batch === batchFilter && v.active !== active).map((v) => v.code);
    if (codes.length === 0) { setConfirmBulk(null); return; }
    setBusy(true);
    try {
      await setVouchersActive(codes, active);
      toast('success', `${codes.length} kode di batch "${batchFilter}" ${active ? 'diaktifkan' : 'dinonaktifkan'}.`);
      setConfirmBulk(null);
      await load();
    } catch {
      toast('error', 'Gagal mengubah status batch. Pastikan akunmu Admin.');
    } finally {
      setBusy(false);
    }
  }

  async function toggle(v: Voucher) {
    try { await setVoucherActive(v.code, !v.active); await load(); }
    catch { toast('error', 'Gagal mengubah status voucher.'); }
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!vouchers) return <PageSkeleton />;

  const listText = list.map((v) => v.code).join('\n');
  const csv = ['kode,paket,dipakai,kuota,status,batch,kedaluwarsa', ...list.map((v) =>
    [v.code, v.plan, v.uses, v.maxUses, statusOf(v, now).l, v.batch, v.expiresAt?.toISOString().slice(0, 10) ?? ''].join(','))].join('\n');

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-amber-ink">Command Center</p>
        <h1 className="h-page">Voucher</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Buat kode untuk pembeli (mis. dari GoAkal). Pembeli menukarnya di <strong>{typeof window !== 'undefined' ? window.location.origin : ''}/voucher</strong> → akunnya otomatis aktif dengan paket voucher.
        </p>
      </header>

      <section className="grid grid-cols-3 gap-3">
        {[['Total kode', stats.codes, 'bg-white'], ['Masih aktif', stats.active, 'bg-lime'], ['Sudah ditukar', stats.redeemed, 'bg-sky']].map(([k, v, c]) => (
          <div key={k as string} className={`rounded-3xl border-2 border-ink p-4 shadow-[3px_3px_0_0_#111112] ${c}`}>
            <p className="text-xs font-bold text-ink/70">{k}</p>
            <p className="font-display text-3xl font-extrabold">{v}</p>
          </div>
        ))}
      </section>

      <form onSubmit={submit} noValidate className="card-pop space-y-4 p-5">
        <h2 className="font-display text-xl font-extrabold">Buat voucher</h2>
        <fieldset>
          <legend className="label">Jenis kode</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {([
              ['unique', '🔑 Kode unik (disarankan)', 'Satu kode untuk satu pembeli. Aman kalau platform bisa mengirim kode berbeda ke tiap pembeli.'],
              ['shared', '👥 Satu kode bersama', 'Satu kode untuk banyak orang dengan batas kuota. Praktis, tapi bisa disebarkan.'],
            ] as const).map(([k, l, d]) => (
              <button key={k} type="button" aria-pressed={form.mode === k} onClick={() => setForm({ ...form, mode: k })}
                className={`rounded-2xl border-2 p-3 text-left text-sm ${form.mode === k ? 'border-ink bg-lime' : 'border-line bg-white'}`}>
                <p className="font-bold">{l}</p>
                <p className="text-xs text-ink/70">{d}</p>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label">Paket yang didapat</legend>
          <div className="flex flex-wrap gap-2">
            {(['spark', 'boost', 'impact'] as const).map((p) => (
              <button key={p} type="button" aria-pressed={form.plan === p}
                onClick={() => setForm({ ...form, plan: p, prefix: form.prefix === form.plan.toUpperCase() ? p.toUpperCase() : form.prefix })}
                className={`rounded-full border-2 px-4 py-2 text-sm font-bold ${form.plan === p ? 'border-ink bg-lime' : 'border-line bg-white'}`}>
                {PLAN_INFO[p].emoji} {PLAN_INFO[p].name}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          {form.mode === 'unique' ? (
            <>
              <div>
                <label htmlFor="vc-count" className="label">Jumlah kode</label>
                <input id="vc-count" type="number" min={1} max={500} className="input" value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })} />
                <p className="hint">Maksimal 500 per pembuatan. Tiap kode sekali pakai.</p>
              </div>
              <div>
                <label htmlFor="vc-prefix" className="label">Awalan kode</label>
                <input id="vc-prefix" className="input uppercase" maxLength={12} value={form.prefix} onChange={(e) => setForm({ ...form, prefix: e.target.value.toUpperCase() })} />
                <p className="hint">Contoh hasil: {form.prefix ? `${normalizeCode(form.prefix).replace(/[^A-Z0-9]/g, '')}-` : ''}7KQ2M9XA</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="vc-shared" className="label">Kode</label>
                <input id="vc-shared" className="input font-mono uppercase" maxLength={32} placeholder="mis. SEMINARUI25" value={form.sharedCode} onChange={(e) => setForm({ ...form, sharedCode: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <label htmlFor="vc-max" className="label">Kuota pemakaian</label>
                <input id="vc-max" type="number" min={1} className="input" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
              </div>
            </>
          )}
          <div>
            <label htmlFor="vc-exp" className="label">Berlaku sampai (opsional)</label>
            <input id="vc-exp" type="date" className="input" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} />
          </div>
          <div>
            <label htmlFor="vc-batch" className="label">Nama batch (opsional)</label>
            <input id="vc-batch" className="input" maxLength={60} placeholder="mis. GoAkal Batch 1" value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} />
          </div>
        </div>
        <div>
          <label htmlFor="vc-note" className="label">Catatan (opsional)</label>
          <input id="vc-note" className="input" maxLength={300} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Membuat…' : 'Buat voucher'}</button>
      </form>

      {created && (
        <section className="card space-y-3 bg-lime/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-extrabold">✅ {created.length} kode baru</h2>
            <div className="flex gap-2">
              <CopyButton text={created.join('\n')} label="Salin semua (1 per baris)" className="btn-accent py-2" />
              <button type="button" className="btn-ghost py-2" onClick={() => setCreated(null)}>Tutup</button>
            </div>
          </div>
          <pre className="max-h-48 overflow-auto rounded-2xl bg-white p-3 font-mono text-xs">{created.join('\n')}</pre>
          <p className="text-xs text-muted">Tempel daftar ini ke pengaturan produk di GoAkal (bagian kode/lisensi yang dikirim ke pembeli). Simpan juga salinannya di tempat aman.</p>
        </section>
      )}

      <div className="flex flex-wrap gap-2" role="tablist">
        {([['codes', `Kode (${vouchers.length})`], ['redemptions', `Penukaran (${redemptions.length})`]] as const).map(([k, l]) => (
          <button key={k} role="tab" type="button" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`rounded-full border-2 px-4 py-2 text-sm font-bold ${tab === k ? 'border-ink bg-ink text-paper' : 'border-line bg-white'}`}>{l}</button>
        ))}
      </div>

      {tab === 'codes' ? (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input className="input sm:max-w-xs" aria-label="Cari kode atau email" placeholder="Cari kode atau email…" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="input sm:max-w-xs" aria-label="Filter batch" value={batchFilter} onChange={(e) => { setBatchFilter(e.target.value); setConfirmBulk(null); }}>
              <option value="all">Semua batch</option>
              {batches.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            {batchFilter !== 'all' && (() => {
              const inBatch = (vouchers ?? []).filter((v) => v.batch === batchFilter);
              const activeN = inBatch.filter((v) => v.active).length;
              const inactiveN = inBatch.length - activeN;
              if (confirmBulk !== null) {
                const n = confirmBulk ? inactiveN : activeN;
                return (
                  <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-danger/40 bg-danger-soft px-3 py-2 text-sm">
                    <span>{confirmBulk ? 'Aktifkan' : 'Nonaktifkan'} <strong>{n}</strong> kode di batch <strong>{batchFilter}</strong>?</span>
                    <button type="button" disabled={busy} className="btn-primary py-1.5 text-sm" onClick={() => void bulkToggle(confirmBulk)}>Ya, {confirmBulk ? 'aktifkan' : 'nonaktifkan'}</button>
                    <button type="button" className="btn-ghost py-1.5 text-sm" onClick={() => setConfirmBulk(null)}>Batal</button>
                  </div>
                );
              }
              return (
                <div className="flex flex-wrap gap-2">
                  {activeN > 0 && <button type="button" className="btn-ghost py-2 text-danger" onClick={() => setConfirmBulk(false)}>Nonaktifkan batch ({activeN})</button>}
                  {inactiveN > 0 && <button type="button" className="btn-ghost py-2" onClick={() => setConfirmBulk(true)}>Aktifkan lagi ({inactiveN})</button>}
                </div>
              );
            })()}
            <div className="flex gap-2">
              <CopyButton text={listText} label="Salin kode" className="btn-ghost py-2" />
              <CopyButton text={csv} label="Salin CSV" className="btn-ghost py-2" />
            </div>
          </div>
          {list.length === 0 ? (
            <EmptyState title="Belum ada voucher" description="Buat voucher pertama dengan form di atas." />
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-line bg-paper text-xs uppercase tracking-wider text-muted">
                  <tr><th className="px-4 py-3">Kode</th><th className="px-4 py-3">Paket</th><th className="px-4 py-3">Dipakai</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Batch</th><th className="px-4 py-3">Berlaku s.d.</th><th className="px-4 py-3" /></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {list.map((v) => {
                    const st = statusOf(v, now);
                    return (
                      <tr key={v.code}>
                        <td className="px-4 py-2 font-mono text-xs font-bold">{v.code}</td>
                        <td className="px-4 py-2">{PLAN_INFO[v.plan].emoji} {PLAN_INFO[v.plan].name.replace('GenZ ', '')}</td>
                        <td className="px-4 py-2">{v.uses}/{v.maxUses}</td>
                        <td className="px-4 py-2 text-xs">
                          {(usedBy.get(v.code) ?? []).length > 0
                            ? (usedBy.get(v.code) ?? []).map((e) => <div key={e} className="font-semibold break-all">✅ {e}</div>)
                            : v.assignedEmail ? <div className="break-all text-muted" title="Kode dikunci ke email pembeli GoAkal">🔒 {v.assignedEmail}</div> : <span className="text-muted">—</span>}
                        </td>
                        <td className="px-4 py-2"><span className={`rounded-full border border-ink px-2 py-0.5 text-xs font-bold ${st.cls}`}>{st.l}</span></td>
                        <td className="px-4 py-2 text-xs text-muted">{v.batch || '—'}</td>
                        <td className="px-4 py-2 text-xs text-muted">{v.expiresAt ? v.expiresAt.toLocaleDateString('id-ID') : '—'}</td>
                        <td className="px-4 py-2 text-right">
                          <button type="button" className="text-xs font-bold underline" onClick={() => void toggle(v)}>{v.active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : redemptions.length === 0 ? (
        <EmptyState title="Belum ada penukaran" description="Penukaran voucher oleh pembeli akan muncul di sini." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wider text-muted">
              <tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Kode</th><th className="px-4 py-3">Paket</th><th className="px-4 py-3">Waktu</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {redemptions.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2 font-mono text-xs">{r.code}</td>
                  <td className="px-4 py-2">{PLAN_INFO[(r.plan as PaidPlan)]?.name ?? r.plan}</td>
                  <td className="px-4 py-2 text-xs text-muted">{r.createdAt?.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
