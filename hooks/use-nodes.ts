import { useAsync } from '@/hooks/use-async';
import { getNodes } from '@/services/nodes.service';
import type { Node } from '@/types';

export type { Node, NodeAddress, NodeImage } from '@/types';

export function useNodes() {
  const { data, loading, error, refetch } = useAsync<Node[]>(getNodes, []);

  return {
    nodes: data ?? [],
    loading,
    error: error ? 'Error cargando nodos' : null,
    refetch,
  };
}
