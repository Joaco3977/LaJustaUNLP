import { apiGet, propertiesParam } from '@/services/api';
import type { PageableCollection, Producer } from '@/types';

const PATH = '/producer';

export function getProducers(params: { page?: number; size?: number } = {}) {
  const { page = 0, size = 10 } = params;

  return apiGet<PageableCollection<Producer>>(PATH, {
    properties: propertiesParam([{ key: 'deletedAt', value: 'null' }]),
    range: `${page},${size}`,
    sort: 'id,ASC',
  });
}
