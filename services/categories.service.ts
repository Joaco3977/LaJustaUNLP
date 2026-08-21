import { apiGet, propertiesParam } from '@/services/api';
import type { Category, PageableCollection } from '@/types';

export function getCategories() {
  return apiGet<PageableCollection<Category>>('/category', {
    properties: propertiesParam([{ key: 'deletedAt', value: '' }]),
    sort: 'id,ASC',
  });
}
