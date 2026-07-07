import { useAsync } from '@/hooks/use-async';
import { getPromotions } from '@/services/products.service';

export function usePromotions() {
  const { data, loading } = useAsync(getPromotions, []);

  return {
    products: data?.page ?? [],
    loading,
  };
}
