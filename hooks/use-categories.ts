import { useAsync } from '@/hooks/use-async';
import { getCategories } from '@/services/categories.service';
import type { Category } from '@/types';

export type { Category } from '@/types';

export function useCategories() {
  const { data, loading } = useAsync(getCategories, []);
  const allCategories = data?.page ?? [];

  const rootCategories: Category[] = [
    { id: 0, name: 'Todos', parent: null },
    ...allCategories.filter((cat) => cat.parent === null),
  ];

  const getChildren = (parentId: number) =>
    allCategories.filter((cat) => cat.parent?.id === parentId);

  return {
    allCategories,
    rootCategories,
    getChildren,
    loading,
  };
}
