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
  const [hasMore, setHasMore] = useState(true);

  const fetchSearch = useCallback(async () => {
    if (!searchText.trim()) {
      setProducts([]);
      setHasMore(false);
      return;
    }

    setLoading(true);

    try {
      const url = new URL('https://www.lajustaunlp.com.ar/api/product');

      url.searchParams.set(
        'properties',
        JSON.stringify([
          { key: 'deletedAt', value: 'null' },
        ])
      );

      url.searchParams.set('search', searchText);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('size', pageSize.toString());
      url.searchParams.set('sort', 'id,ASC');

      const res = await fetch(url.toString());
      const json = await res.json();

      const newProducts = json.page ?? [];

      setProducts((prev) =>
        page === 0 ? newProducts : [...prev, ...newProducts]
      );

      setHasMore(newProducts.length === pageSize);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchText, page, pageSize]);

  useEffect(() => {
    fetchSearch();
  }, [fetchSearch]);

  // handlers públicos
  const submitSearch = (text?: string) => {
    if (text !== undefined) {
      setSearchText(text);
    }
    setPage(0);
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

    // setters / actions
    setSearchText,
    submitSearch,
    clearSearch,
    loadMore,
  };
}