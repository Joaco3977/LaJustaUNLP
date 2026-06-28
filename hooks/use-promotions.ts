import { useEffect, useState } from 'react';

export function usePromotions() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);

      try {
        const url = new URL('https://www.lajustaunlp.com.ar/api/product');

        url.searchParams.set(
          'properties',
          JSON.stringify([
            { key: 'isPromotion', value: true },
            { key: 'deletedAt', value: 'null' },
          ])
        );

        url.searchParams.set('sort', 'id,ASC');

        const res = await fetch(url.toString());
        const json = await res.json();

        setProducts(json.page ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return {
    products,
    loading,
  };
}