import { useCallback, useEffect, useState, type DependencyList } from 'react';

type UseAsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: boolean;
  refetch: () => void;
};

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: DependencyList = []
): UseAsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);
  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    fn()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((e) => {
        if (!active) return;
        console.error(e);
        setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  return { data, loading, error, refetch };
}
