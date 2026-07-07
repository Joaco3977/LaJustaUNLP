import { apiGet, propertiesParam } from '@/services/api';
import type { PageableCollection, Product, PropertyFilter } from '@/types';

const PATH = '/product';

type GetProductsParams = {
  page?: number;
  size?: number;
  categoryId?: number | null;
  isPromotion?: boolean;
};

export function getProducts(params: GetProductsParams = {}) {
  const { page = 0, size = 12, categoryId, isPromotion } = params;

  const filters: PropertyFilter[] = [{ key: 'deletedAt', value: 'null' }];
  if (isPromotion) filters.push({ key: 'isPromotion', value: 'true' });
  if (categoryId != null) filters.push({ key: 'categories.id', value: categoryId });

  return apiGet<PageableCollection<Product>>(PATH, {
    properties: propertiesParam(filters),
    range: `${page},${size}`,
    sort: 'id,ASC',
  });
}

export function getProductById(id: number) {
  return apiGet<Product>(`${PATH}/${id}`);
}

export function getProductsByIds(ids: number[]) {
  return Promise.all(ids.map((id) => getProductById(id)));
}

export function searchProducts(params: {
  query: string;
  page?: number;
  size?: number;
}) {
  const { query, page = 0, size = 12 } = params;

  return apiGet<PageableCollection<Product>>(PATH, {
    filter: `"${query}"`,
    properties: propertiesParam([{ key: 'deletedAt', value: 'null' }]),
    range: `${page},${size}`,
    sort: 'id,ASC',
  });
}

export function getPromotions() {
  return apiGet<PageableCollection<Product>>(PATH, {
    properties: propertiesParam([
      { key: 'isPromotion', value: true },
      { key: 'deletedAt', value: 'null' },
    ]),
    sort: 'id,ASC',
  });
}
