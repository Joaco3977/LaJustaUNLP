import { useEffect, useRef, useState } from 'react';

type UseProductsOptions = {
  isPromotion?: boolean;
  page?: number;
  size?: number;
  categoryId?: number | null;
};

export function useProducts(options?: UseProductsOptions) {
  const {
    isPromotion = false,
    page = 0,
    size = 12,
    categoryId,
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
        const url = new URL('https://lajustaunlp.com.ar/api/product');

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

    fetchProducts();
  }, [isPromotion, page, size, categoryId]);

  return {
    products,
    loading,
    hasMore,
  };
}