import { useCallback, useEffect, useState, type DependencyList } from 'react';

/** Memuat data async dengan state loading/error dan fungsi reload. */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await run());
    } catch (e) {
      console.error(e);
      setError('Data gagal dimuat. Periksa koneksi internet lalu coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [run]);

  useEffect(() => { void reload(); }, [reload]);

  return { data, setData, loading, error, reload };
}
