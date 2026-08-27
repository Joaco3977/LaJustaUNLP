import { useAsync } from '@/hooks/use-async';
import { getProducerById } from '@/services/producers.service';

export function useProducer(id: number) {
  const { data, loading, error } = useAsync(() => getProducerById(id), [id]);
  return { producer: data, loading, error };
}
