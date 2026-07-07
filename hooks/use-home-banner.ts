import { useAsync } from '@/hooks/use-async';
import { getHomeBanner } from '@/services/banner.service';

export function useHomeBanner() {
  const { data } = useAsync(getHomeBanner, []);
  return data?.[0] ?? null;
}
