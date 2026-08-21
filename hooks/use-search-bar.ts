import { searchProducts } from '@/services/products.service';
import type { Product } from '@/types';
import { useCallback, useEffect, useState } from 'react';

type UseSearchBarOptions = {
  initialPage?: number;
  pageSize?: number;
};

export function useSearchBar(options?: UseSearchBarOptions) {
  const { initialPage = 0, pageSize = 12 } = options ?? {};

  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchSearch = useCallback(async () => {
    const query = searchText.trim();

    if (!query) {
      setProducts([]);
      setHasMore(false);
      return;
    }

    setLoading(true);

    try {
      const json = await searchProducts({ query, page, size: pageSize });
      const newProducts = json.page ?? [];

      setProducts((prev) =>
        page === initialPage ? newProducts : [...prev, ...newProducts]
      );

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
    searchText,
    products,
    loading,
    page,
    hasMore,
    setSearchText,
    submitSearch,
    clearSearch,
    loadMore,
  };
}
