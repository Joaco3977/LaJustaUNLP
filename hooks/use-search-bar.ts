// hooks/use-search-bar.ts
import { useCallback, useEffect, useState } from 'react';

type UseSearchBarOptions = {
  initialPage?: number;
  pageSize?: number;
};

export function useSearchBar(options?: UseSearchBarOptions) {
  const { initialPage = 0, pageSize = 12 } = options ?? {};

  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchSearch = useCallback(async () => {
    const query = searchText.trim();

    // Si no hay texto de búsqueda, reseteamos estado
    if (!query) {
      setProducts([]);
      setHasMore(false);
      return;
    }

    setLoading(true);

    try {
      const url = new URL('https://lajustaunlp.com.ar/api/product');

      // Texto de búsqueda (API real)
      url.searchParams.set('filter', `"${query}"`);

      // Filtro fijo
      url.searchParams.set(
        'properties',
        JSON.stringify([{ key: 'deletedAt', value: 'null' }])
      );

      // Paginación REAL: page, size
      url.searchParams.set('range', `${page},${pageSize}`);

      // Orden
      url.searchParams.set('sort', 'id,ASC');

      const res = await fetch(url.toString());
      const json = await res.json();

      const newProducts = json.page ?? [];

      setProducts((prev) =>
        page === initialPage ? newProducts : [...prev, ...newProducts]
      );

      // Si devuelve menos de pageSize, no hay más páginas
      setHasMore(newProducts.length === pageSize);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchText, page, pageSize, initialPage]);

  useEffect(() => {
    fetchSearch();
  }, [fetchSearch]);

  const submitSearch = (text?: string) => {
    if (text !== undefined) {
      setSearchText(text);
    }
    setPage(initialPage);
    setProducts([]);
    setHasMore(true);
  };

  const clearSearch = () => {
    setSearchText('');
    setProducts([]);
    setPage(initialPage);
    setHasMore(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    // state
    searchText,
    products,
    loading,
    page,
    hasMore,

    // actions
    setSearchText,
    submitSearch,
    clearSearch,
    loadMore,
  };
}