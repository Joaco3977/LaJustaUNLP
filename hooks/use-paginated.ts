import { useAsync } from '@/hooks/use-async';
import type { PageableCollection } from '@/types';
import { type DependencyList } from 'react';

type UsePaginatedResult<T> = {
  items: T[];
  total: number;
  loading: boolean;
  error: boolean;
  refetch: () => void;
};

export function usePaginated<T>(
  fn: () => Promise<PageableCollection<T>>,
  deps: DependencyList = []
): UsePaginatedResult<T> {
  const { data, loading, error, refetch } = useAsync(fn, deps);

  return {
    items: data?.page ?? [],
    total: data?.totalElements ?? 0,
    loading,
    error,
    refetch,
  };
}
