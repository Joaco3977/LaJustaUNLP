import { getProducts, getProductsByIds } from '@/services/products.service';
import type { Product } from '@/types';
import { useEffect, useRef, useState } from 'react';

type UseProductsOptions = {
  isPromotion?: boolean;
  page?: number;
  size?: number;
  categoryId?: number | null;
  ids?: number[];
};

export function useProducts(options?: UseProductsOptions) {
  const {
    isPromotion = false,
    page = 0,
    size = 12,
    categoryId,
    ids,
  } = options ?? {};

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const requestId = useRef(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const currentRequest = ++requestId.current;
      setLoading(true);

      try {
        if (ids && ids.length > 0) {
          const responses = await getProductsByIds(ids);
          if (currentRequest !== requestId.current) return;

          setProducts(responses);
          setHasMore(false);
          return;
        }

        const json = await getProducts({
          page,
          size: size + 1,
          categoryId,
          isPromotion,
        });
        if (currentRequest !== requestId.current) return;

        const data = json.page ?? [];
        setProducts(data.slice(0, size));
        setHasMore(data.length > size);
      } catch (error) {
        console.error(error);
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    };

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
