import { apiGet, propertiesParam } from '@/services/api';
import type { NewsItem, PageableCollection } from '@/types';

export function getNews(params: { page?: number; size?: number } = {}) {
  const { page = 0, size = 10 } = params;

  return apiGet<PageableCollection<NewsItem>>('/news', {
    properties: propertiesParam([]),
    range: `${page},${size}`,
    sort: 'id,ASC',
  });
}
