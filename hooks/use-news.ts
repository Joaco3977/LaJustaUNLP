import { usePaginated } from '@/hooks/use-paginated';
import { getNews } from '@/services/news.service';
import type { NewsItem } from '@/types';

export type { NewsItem } from '@/types';

export function useNews(page: number, pageSize: number) {
  const { items, total, loading, error, refetch } = usePaginated<NewsItem>(
    () => getNews({ page, size: pageSize }),
    [page, pageSize]
  );

  return { news: items, total, loading, error, refetch };
}
