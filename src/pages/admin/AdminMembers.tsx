import AdminEntrySummary from '../../components/AdminEntrySummary';
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../auth/AuthProvider';
import { useAccess } from '../../auth/AccessProvider';
import {
  endTrial, getAccessConfig, grantTrial, inviteMember, listInvites, listMemberships, listUsers, revokeInvite,
  sendInviteLink, setGating, setMemberPlan, type Invite, type UserRecord,
} from '../../lib/data';
import {
  availableTrial, formatRemaining, MEMBER_STATUS_INFO, memberStatus, normalizeEmail, PLAN_INFO, PLAN_KEYS, TRIAL_OFFER,
  trialMsLeft, trialState, type Membership, type MemberStatus, type PlanKey,
} from '../../lib/membership';
import { authErrorMessage } from '../../auth/AuthProvider';
import { ConfirmDialog, EmptyState, ErrorState, PageSkeleton, useToast } from '../../components/ui';

interface Row {
  email: string;
  name: string;
  membership: Membership;
  hasMembership: boolean;
  invite: Invite | null;
  user: UserRecord | null;
  status: MemberStatus;
}

type Filter = 'all' | MemberStatus | 'not_logged_in';
type Pending =
  | { kind: 'plan'; row: Row; plan: PlanKey }
  | { kind: 'trial'; row: Row }
  | { kind: 'endTrial'; row: Row }
  | { kind: 'revoke'; row: Row }
  | { kind: 'gating'; enabled: boolean };

const emptyMembership = (email: string, name: string): Membership => ({
  email, name, plan: 'none', trial: null, trialsUsed: { boost: false, impact: false }, note: '', updatedAt: null,
});

const inviteSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(80),
  email: z.email('Format email tidak valid'),
  plan: z.enum(PLAN_KEYS),
  startTrial: z.boolean(),
  note: z.string().trim().max(300),
});

export default function AdminMembers() {
  const { profile } = useAuth();
  const access = useAccess();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [gating, setGatingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(() => new Date());
  const [pending, setPending] = useState<Pending | null>(null);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);

  // Form undangan (bisa diisi otomatis dari Daftar Tunggu lewat query string).
  const [inv, setInv] = useState({
    name: params.get('nama') ?? '', email: params.get('undang') ?? '',
    plan: ((params.get('paket') as PlanKey) || 'spark') as PlanKey, startTrial: false, note: '',
  });
  const waitlistId = params.get('wl') ?? undefined;
  const [invErrors, setInvErrors] = useState<Record<string, string>>({});
  const [showInvite, setShowInvite] = useState(!!params.get('undang'));

  const load = useCallback(async () => {
    setError(null);
    try {
      const [ms, invites, users, cfg] = await Promise.all([listMemberships(), listInvites(), listUsers(), getAccessConfig()]);
      const byEmail = new Map<string, Row>();
      const userByEmail = new Map(users.map((u) => [normalizeEmail(u.email), u]));
      const inviteByEmail = new Map(invites.map((i) => [i.email, i]));
      const t = new Date();
      for (const m of ms) {
        byEmail.set(m.email, { email: m.email, name: m.name, membership: m, hasMembership: true, invite: inviteByEmail.get(m.email) ?? null, user: userByEmail.get(m.email) ?? null, status: memberStatus(m, t) });
      }
      // Akun lama (sebelum sistem undangan) yang belum punya membership.
      for (const u of users) {
        const e = normalizeEmail(u.email);
        if (!byEmail.has(e)) {
          const m = emptyMembership(e, u.displayName);
          byEmail.set(e, { email: e, name: u.displayName, membership: m, hasMembership: false, invite: inviteByEmail.get(e) ?? null, user: u, status: 'no_plan' });
        }
      }
      setRows([...byEmail.values()].sort((a, b) => a.email.localeCompare(b.email)));
      setGatingState(cfg.gatingEnabled);
      setNow(t);
    } catch (e) {
      console.error(e);
      setError('Data peserta gagal dimuat. Pastikan Security Rules terbaru sudah dipublish.');
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const withStatus = useMemo(() => (rows ?? []).map((r) => ({ ...r, status: memberStatus(r.membership, now) })), [rows, now]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: withStatus.length, not_logged_in: 0, trial_active: 0, trial_ending: 0, trial_expired: 0, paid: 0, no_plan: 0, spark: 0, boost: 0, impact: 0 };
    for (const r of withStatus) {
      c[r.status] += 1;
      if (!r.user) c.not_logged_in += 1;
      if (r.membership.plan !== 'none') c[r.membership.plan] += 1;
    }
    return c;
  }, [withStatus]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return withStatus
      .filter((r) => filter === 'all' || (filter === 'not_logged_in' ? !r.user : r.status === filter))
      .filter((r) => !q || r.email.includes(q) || r.name.toLowerCase().includes(q))
      // Trial yang paling cepat habis tampil paling atas.
      .sort((a, b) => {
        const ta = a.membership.trial && trialMsLeft(a.membership, now) > 0 ? trialMsLeft(a.membership, now) : Infinity;
        const tb = b.membership.trial && trialMsLeft(b.membership, now) > 0 ? trialMsLeft(b.membership, now) : Infinity;
        return ta - tb || a.email.localeCompare(b.email);
      });
  }, [withStatus, filter, search, now]);

  async function submitInvite(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const parsed = inviteSchema.safeParse(inv);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      return setInvErrors(errs);
    }
    setInvErrors({});
    setBusy(true);
    const email = normalizeEmail(parsed.data.email);
    try {
      const existing = rows?.find((r) => r.email === email);
      await inviteMember({
        actorUid: profile.uid, email, name: parsed.data.name, plan: parsed.data.plan, startTrial: parsed.data.startTrial,
        note: parsed.data.note, existing: existing?.hasMembership ? existing.membership : null, waitlistId,
      });
    } catch (err) {
      console.error(err);
      setBusy(false);
      return toast('error', 'Undangan ditolak server. Pastikan akunmu Admin/Super Admin dan rules terbaru sudah dipublish.');
    }
    try {
      await sendInviteLink(email);
      toast('success', `Undangan tersimpan & link masuk dikirim ke ${email}.`);
    } catch (err) {
      toast('error', `Undangan tersimpan, tapi email gagal dikirim: ${authErrorMessage(err)} Coba "Kirim link" lagi nanti.`);
    }
    setInv({ name: '', email: '', plan: 'spark', startTrial: false, note: '' });
    setParams({}, { replace: true });
    setShowInvite(false);
    setBusy(false);
    await load();
  }

  async function resend(row: Row) {
    try {
      await sendInviteLink(row.email);
      toast('success', `Link masuk dikirim ulang ke ${row.email}.`);
    } catch (err) {
      toast('error', authErrorMessage(err));
    }
  }

  async function confirmPending() {
    if (!pending || !profile) return;
    setBusy(true);
    const why = reason.trim();
    try {
      if (pending.kind === 'plan') {
        await setMemberPlan({ actorUid: profile.uid, member: pending.row.membership, plan: pending.plan, reason: why || `Ubah paket ke ${pending.plan}` });
        toast('success', `Paket ${pending.row.email} → ${PLAN_INFO[pending.plan].name}.`);
      } else if (pending.kind === 'trial') {
        const offer = availableTrial(pending.row.membership, new Date());
        if (!offer) throw new Error('no-trial');
        await grantTrial({ actorUid: profile.uid, member: pending.row.membership, plan: offer.plan, days: offer.days, reason: why || `Trial ${offer.plan} ${offer.days} hari` });
        toast('success', `Trial ${PLAN_INFO[offer.plan].name} ${offer.days} hari dimulai untuk ${pending.row.email}.`);
      } else if (pending.kind === 'endTrial') {
        await endTrial({ actorUid: profile.uid, member: pending.row.membership, reason: why || 'Trial diakhiri admin' });
        toast('success', `Trial ${pending.row.email} diakhiri.`);
      } else if (pending.kind === 'revoke') {
        await revokeInvite(profile.uid, pending.row.email, pending.row.name);
        toast('success', `Undangan ${pending.row.email} dicabut.`);
      } else if (pending.kind === 'gating') {
        await setGating(profile.uid, pending.enabled, why || (pending.enabled ? 'Aktifkan akses sesuai paket' : 'Buka semua fitur'));
        toast('success', pending.enabled ? 'Mode akses: Sesuai paket.' : 'Mode akses: Terbuka untuk semua.');
        await access.reload();
      }
      setPending(null);
      setReason('');
      await load();
    } catch (err) {
      console.error(err);
      toast('error', 'Perubahan ditolak. Pastikan kamu punya wewenang dan rules terbaru sudah dipublish.');
    } finally {
      setBusy(false);
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!rows) return <PageSkeleton />;

  const isOwner = profile?.role === 'owner';
  const offerForInvite = TRIAL_OFFER[inv.plan];
  const FILTERS: { k: Filter; l: string }[] = [
    { k: 'all', l: 'Semua' },
    { k: 'trial_ending', l: '⏰ Trial ≤ 24 jam' },
    { k: 'trial_active', l: 'Trial aktif' },
    { k: 'trial_expired', l: 'Trial habis — follow up' },
    { k: 'paid', l: 'Aktif' },
    { k: 'no_plan', l: 'Belum ada paket' },
    { k: 'not_logged_in', l: 'Belum pernah login' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-ink">Command Center</p>
          <h1 className="h-page">Peserta & Paket</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">Undang peserta, atur paket, dan pantau trial. Setiap perubahan tercatat di Audit Log. Trial berakhir otomatis sesuai jam.</p>
        </div>
        <button type="button" className="btn-accent" onClick={() => setShowInvite((v) => !v)}>{showInvite ? 'Tutup form' : '+ Undang peserta'}</button>
      </header>

      {/* Ringkasan */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { k: 'Total peserta', v: counts.all, cls: 'bg-white' },
          { k: '⏰ Trial ≤ 24 jam', v: counts.trial_ending, cls: 'bg-amber-soft', f: 'trial_ending' as Filter },
          { k: 'Trial aktif', v: counts.trial_active, cls: 'bg-sky', f: 'trial_active' as Filter },
          { k: 'Trial habis (follow up)', v: counts.trial_expired, cls: 'bg-pink', f: 'trial_expired' as Filter },
        ].map((c) => (
          <button key={c.k} type="button" onClick={() => c.f && setFilter(c.f)} className={`rounded-3xl border-2 border-ink p-4 text-left shadow-[3px_3px_0_0_#111112] ${c.cls}`}>
            <p className="text-xs font-bold text-ink/70">{c.k}</p>
            <p className="font-display text-3xl font-extrabold">{c.v}</p>
          </button>
        ))}
      </section>
      <p className="text-xs text-muted">
        Per paket: ⚡ Spark {counts.spark} · 🚀 Boost {counts.boost} · 🎯 Impact {counts.impact} · 🔒 tanpa paket {counts.no_plan} · belum pernah login {counts.not_logged_in}
      </p>

      {/* Mode akses */}
      <section className={`card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between ${gating ? '' : 'bg-amber-soft'}`}>
        <div>
          <h2 className="font-display text-lg font-extrabold">Mode akses: {gating ? '🔐 Sesuai paket' : '🔓 Terbuka (pra-launch)'}</h2>
          <p className="text-sm text-ink/75">{gating
            ? 'Peserta hanya bisa membuka fitur sesuai paket + trial aktifnya.'
            : 'Semua fitur terbuka untuk semua peserta. Paket & trial tetap tercatat, tapi belum mengunci apa pun.'}</p>
        </div>
        {isOwner ? (
          <button type="button" className={gating ? 'btn-ghost' : 'btn-primary'} onClick={() => setPending({ kind: 'gating', enabled: !gating })}>
            {gating ? 'Buka semua fitur' : 'Aktifkan akses sesuai paket'}
          </button>
        ) : <p className="text-xs text-muted">Hanya Super Admin yang bisa mengubah.</p>}
      </section>

      {/* Form undangan */}
      {showInvite && (
        <form onSubmit={submitInvite} noValidate className="card-pop space-y-4 p-5">
          <h2 className="font-display text-xl font-extrabold">Undang peserta</h2>
          <p className="text-sm text-muted">Peserta akan menerima email berisi link masuk. Tanpa undangan ini, email tersebut tidak bisa membuat akun.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="inv-name" className="label">Nama</label>
              <input id="inv-name" className="input" value={inv.name} maxLength={80} onChange={(e) => setInv({ ...inv, name: e.target.value })} aria-invalid={!!invErrors.name} />
              {invErrors.name && <p className="err">{invErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="inv-email" className="label">Email</label>
              <input id="inv-email" type="email" className="input" value={inv.email} onChange={(e) => setInv({ ...inv, email: e.target.value })} aria-invalid={!!invErrors.email} />
              {invErrors.email && <p className="err">{invErrors.email}</p>}
            </div>
          </div>
          <fieldset>
            <legend className="label">Paket</legend>
            <div className="flex flex-wrap gap-2">
              {PLAN_KEYS.map((p) => (
                <button key={p} type="button" aria-pressed={inv.plan === p} onClick={() => setInv({ ...inv, plan: p, startTrial: false })}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-bold ${inv.plan === p ? 'border-ink bg-lime' : 'border-line bg-white'}`}>
                  {PLAN_INFO[p].emoji} {PLAN_INFO[p].name}
                </button>
              ))}
            </div>
          </fieldset>
          {offerForInvite && (
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" className="h-4 w-4 accent-amber" checked={inv.startTrial} onChange={(e) => setInv({ ...inv, startTrial: e.target.checked })} />
              Langsung mulai trial {PLAN_INFO[offerForInvite.plan].name} {offerForInvite.days} hari
            </label>
          )}
          <div>
            <label htmlFor="inv-note" className="label">Catatan (opsional)</label>
            <input id="inv-note" className="input" maxLength={300} value={inv.note} placeholder="Contoh: bayar via transfer 16 Okt, batch 1" onChange={(e) => setInv({ ...inv, note: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Mengundang…' : 'Undang & kirim link masuk'}</button>
        </form>
      )}

      {/* Filter */}
      <div className="flex flex-col gap-3">
        <input className="input sm:max-w-xs" aria-label="Cari peserta" placeholder="Cari nama atau email…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter status">
          {FILTERS.map((f) => (
            <button key={f.k} type="button" aria-pressed={filter === f.k} onClick={() => setFilter(f.k)}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${filter === f.k ? 'bg-ink text-paper' : 'border border-line bg-white hover:bg-paper-2'}`}>
              {f.l} <span className="opacity-60">{counts[f.k]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daftar */}
      {filtered.length === 0 ? (
        <EmptyState title={rows.length === 0 ? 'Belum ada peserta' : 'Tidak ada yang cocok'} description={rows.length === 0 ? 'Klik "Undang peserta" untuk memulai.' : 'Ubah filter atau kata kunci.'} />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const m = r.membership;
            const ts = trialState(m, now);
            const offer = availableTrial(m, now);
            const st = MEMBER_STATUS_INFO[r.status];
            return (
              <article key={r.email} className="card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold">{r.name || r.user?.displayName || '—'}</p>
                    <p className="truncate text-xs text-muted">{r.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className={`rounded-full border border-ink px-2.5 py-0.5 text-xs font-extrabold ${PLAN_INFO[m.plan].tile}`}>{PLAN_INFO[m.plan].emoji} {PLAN_INFO[m.plan].name}</span>
                      <span className={`rounded-full border border-ink px-2.5 py-0.5 text-xs font-extrabold ${st.cls}`}>{st.label}</span>
                      <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-xs font-semibold">
                        {r.user ? '✓ Sudah login' : r.invite?.status === 'revoked' ? '⛔ Undangan dicabut' : '✉️ Belum login'}
                      </span>
                    </div>
                    {m.trial && (
                      <p className="mt-2 text-xs">
                        Trial {PLAN_INFO[m.trial.plan].name} ({m.trial.days} hari):{' '}
                        {ts === 'expired'
                          ? <strong>berakhir {m.trial.endsAt.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</strong>
                          : <strong>sisa {formatRemaining(trialMsLeft(m, now))}</strong>}
                        {ts !== 'expired' && <span className="text-muted"> · berakhir {m.trial.endsAt.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>}
                      </p>
                    )}
                    {m.note && <p className="mt-1 text-xs text-muted">📝 {m.note}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select aria-label={`Paket ${r.email}`} className="input w-44 py-1.5 text-sm" value={m.plan}
                      onChange={(e) => setPending({ kind: 'plan', row: r, plan: e.target.value as PlanKey })}>
                      {PLAN_KEYS.map((p) => <option key={p} value={p}>{PLAN_INFO[p].emoji} {PLAN_INFO[p].name}</option>)}
                    </select>
                    {offer && r.hasMembership && (
                      <button type="button" className="btn-ghost py-1.5 text-sm" onClick={() => setPending({ kind: 'trial', row: r })}>
                        🎁 Trial {PLAN_INFO[offer.plan].name.replace('GenZ ', '')} {offer.days} hari
                      </button>
                    )}
                    {(ts === 'active' || ts === 'ending') && (
                      <button type="button" className="btn-ghost py-1.5 text-sm" onClick={() => setPending({ kind: 'endTrial', row: r })}>Akhiri trial</button>
                    )}
                    {!r.user && r.invite?.status !== 'revoked' && (
                      <>
                        <button type="button" className="btn-ghost py-1.5 text-sm" onClick={() => void resend(r)}>✉️ Kirim link</button>
                        <button type="button" className="btn-ghost py-1.5 text-sm" onClick={() => setPending({ kind: 'revoke', row: r })}>Cabut undangan</button>
                      </>
                    )}
                  </div>
                </div>
                {r.user && <AdminEntrySummary key={r.user.uid} uid={r.user.uid} />}
              </article>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!pending}
        title={
          pending?.kind === 'plan' ? 'Ubah paket?'
          : pending?.kind === 'trial' ? 'Mulai trial?'
          : pending?.kind === 'endTrial' ? 'Akhiri trial sekarang?'
          : pending?.kind === 'revoke' ? 'Cabut undangan?'
          : pending?.kind === 'gating' ? (pending.enabled ? 'Aktifkan akses sesuai paket?' : 'Buka semua fitur untuk semua peserta?') : ''
        }
        description={
          pending?.kind === 'plan' ? <><strong>{pending.row.email}</strong>: {PLAN_INFO[pending.row.membership.plan].name} → <strong>{PLAN_INFO[pending.plan].name}</strong>.</>
          : pending?.kind === 'trial' ? (() => { const o = availableTrial(pending.row.membership, new Date()); return o ? <><strong>{pending.row.email}</strong> mendapat trial <strong>{PLAN_INFO[o.plan].name} {o.days} hari</strong>, mulai sekarang. Trial hanya bisa diberikan sekali.</> : 'Trial tidak tersedia.'; })()
          : pending?.kind === 'endTrial' ? <>Trial <strong>{pending.row.email}</strong> langsung berakhir dan fiturnya kembali sesuai paket.</>
          : pending?.kind === 'revoke' ? <><strong>{pending.row.email}</strong> tidak bisa lagi membuat akun lewat undangan ini (berlaku untuk yang belum pernah login).</>
          : pending?.kind === 'gating' ? (pending.enabled
            ? <>Peserta tanpa paket yang sesuai akan melihat fitur terkunci. Pastikan semua peserta sudah diberi paket yang benar.</>
            : <>Semua peserta bisa membuka semua fitur, apa pun paketnya.</>) : null
        }
        confirmLabel="Ya, lanjutkan"
        danger={pending?.kind === 'revoke' || pending?.kind === 'endTrial'}
        busy={busy}
        onConfirm={() => void confirmPending()}
        onCancel={() => { setPending(null); setReason(''); }}
      >
        <label htmlFor="pending-reason" className="label">Alasan / catatan (tercatat di audit log)</label>
        <input id="pending-reason" className="input" value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} placeholder="Contoh: sudah transfer Rp149.000" />
      </ConfirmDialog>
    </div>
  );
}
