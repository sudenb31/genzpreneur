import { useCallback, useEffect, useState } from 'react';
import { getPassport, type PassportRecord } from './data';

export function usePassport(uid: string | undefined, fallbackName: string) {
  const [state, setState] = useState<{ loading: boolean; error: string | null; record: PassportRecord | null }>({
    loading: true,
    error: null,
    record: null,
  });

  const load = useCallback(async () => {
    if (!uid) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const record = await getPassport(uid, fallbackName);
      setState({ loading: false, error: null, record });
    } catch (e) {
      console.error(e);
      setState({ loading: false, error: 'Passport gagal dimuat. Periksa koneksi internet.', record: null });
    }
  }, [uid, fallbackName]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
