import { useEffect, useRef, useState } from 'react';

type UseProductsOptions = {
  isPromotion?: boolean;
  page?: number;
  size?: number;
  categoryId?: number | null;

  /** fetch directo por IDs (favorites / cart) */
  ids?: number[];
};

const API_BASE = 'https://lajustaunlp.com.ar/api/product';

export function useProducts(options?: UseProductsOptions) {
  const {
    isPromotion = false,
    page = 0,
    size = 12,
    categoryId,
    ids,
  } = options ?? {};

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const requestId = useRef(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const currentRequest = ++requestId.current;
      setLoading(true);

      try {
        /* ===============================
           MODO IDS (favorites / cart)
        ================================ */
        if (ids && ids.length > 0) {
          const responses = await Promise.all(
            ids.map(id =>
              fetch(`${API_BASE}/${id}`).then(res => res.json())
            )
          );

          if (currentRequest !== requestId.current) return;

          setProducts(responses);
          setHasMore(false);
          return;
        }

        /* ===============================
           MODO LISTADO
        ================================ */
        const url = new URL(API_BASE);

        const properties: { key: string; value: string }[] = [
          { key: 'deletedAt', value: 'null' },
        ];

        if (isPromotion) {
          properties.push({
            key: 'isPromotion',
            value: 'true',
          });
        }

        if (categoryId != null) {
          properties.push({
            key: 'categories.id',
            value: String(categoryId),
          });
        }

        url.searchParams.set('properties', JSON.stringify(properties));

        const requestSize = size + 1;
        url.searchParams.set('range', `${page},${requestSize}`);
        url.searchParams.set('sort', 'id,ASC');

        const res = await fetch(url.toString());
        const json = await res.json();

        if (currentRequest !== requestId.current) return;

        const data = json.page ?? [];
        const hasExtra = data.length > size;

        setProducts(data.slice(0, size));
        setHasMore(hasExtra);
      } catch (error) {
        console.error(error);
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    };

    // no fetch si ids existe pero está vacío
    if (ids && ids.length === 0) {
      setProducts([]);
      setHasMore(false);
      return;
    }

    fetchProducts();
  }, [isPromotion, page, size, categoryId, ids]);

  return {
    products,
    loading,
    hasMore,
  };
}