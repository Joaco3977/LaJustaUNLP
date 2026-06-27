// hooks/use-products.ts
import { useEffect, useState } from 'react';

type UseProductsOptions = {
  isPromotion?: boolean;
};

export function useProducts(options?: UseProductsOptions) {
  const { isPromotion = false } = options ?? {};

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const url = new URL('https://www.lajustaunlp.com.ar/api/product');

        const properties: { key: string; value: string }[] = [
          { key: 'deletedAt', value: 'null' },
        ];

        if (isPromotion) {
          properties.push({ key: 'isPromotion', value: 'true' });
        }

        url.searchParams.set(
          'properties',
          JSON.stringify(properties)
        );

        url.searchParams.set('sort', 'id,ASC');

        const res = await fetch(url.toString());
        const json = await res.json();

        setProducts(json.page ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isPromotion]);

  return {
    products,
    loading,
  };
}