import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { isAdminRole } from '../lib/roles';
import { getProgress } from '../lib/data';
import { ENTRY_KEY, readEntry, type EntryRecord } from '../lib/entry';
import EntrySummary from './EntrySummary';
export default function AdminEntrySummary({ uid }: { uid: string }) {
  const { profile } = useAuth();
  const [open,setOpen]=useState(false);
  const [record,setRecord]=useState<EntryRecord | null>(null);
  const [busy,setBusy]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const [error,setError]=useState('');
  if (!isAdminRole(profile?.role)) return null;
  async function load() {
    if (!isAdminRole(profile?.role)) return;
    setOpen(true);setBusy(true);setError('');
    try { const progress=await getProgress(uid); const raw=progress.notes[ENTRY_KEY]; const parsed=readEntry(raw); if(raw && !parsed) throw new Error('unsupported');setRecord(parsed);setLoaded(true); }
    catch { setError('Ringkasan belum dapat dibaca. Periksa koneksi, versi aplikasi dan kewenangan akun.'); }
    finally {setBusy(false);}
  }
  return <section className="mt-4 border-t border-line pt-3"><button type="button" className="btn-ghost text-xs" disabled={busy} aria-expanded={open} onClick={()=>open?setOpen(false):loaded?setOpen(true):void load()}>{busy?'Memuat kondisi awal…':open?'Tutup ringkasan kondisi awal':'Lihat ringkasan kondisi awal'}</button>{open && <div className="mt-4 space-y-3">{error?<><p role="alert" className="err">{error}</p><button type="button" className="btn-ghost" onClick={()=>void load()}>Coba muat lagi</button></>:!busy && (record?<EntrySummary record={record} />:<p className="text-sm text-muted">Belum ada kondisi awal tersimpan. Peserta tetap boleh melanjutkan Misi.</p>)}<p className="text-xs text-muted">Hanya baca. Membuka ringkasan tidak memberi status ditinjau mentor atau mengubah progres.</p></div>}</section>;
}
