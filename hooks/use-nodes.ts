import { useEffect, useState } from 'react';

export type NodeAddress = {
  id: number;
  street: string;
  number?: string;
  betweenStreets?: string;
  floor?: string;
  apartment?: string;
  description?: string;
  latitude: number;
  longitude: number;
};

export type NodeImage = {
  id: number;
  value: string;
  type?: string;
};

export type Node = {
  id: number;
  name: string;
  address: NodeAddress;
  image: NodeImage | null;
  description: string | null;
  phone: string | null;
  deletedAt: number | null;
  hasFridge: boolean;
};

type UseNodesResult = {
  nodes: Node[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useNodes(): UseNodesResult {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://lajustaunlp.com.ar/api/node'
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: Node[] = await response.json();

      setNodes(data);
    } catch (err: any) {
      setError(err.message ?? 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  return {
    nodes,
    loading,
    error,
    refetch: fetchNodes,
  };
}