import { create } from 'zustand';

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

type NodeStore = {
  nodes: Node[];
  favoriteNodeId: number | null;

  setNodes: (nodes: Node[]) => void;

  setFavoriteNode: (nodeId: number) => void;
  clearFavoriteNode: () => void;

  getFavoriteNode: () => Node | null;
};

export const useNodeStore = create<NodeStore>((set, get) => ({
  nodes: [],
  favoriteNodeId: null,

  setNodes: (nodes) => set({ nodes }),

  setFavoriteNode: (nodeId) =>
    set({ favoriteNodeId: nodeId }),

  clearFavoriteNode: () =>
    set({ favoriteNodeId: null }),

  getFavoriteNode: () => {
    const { nodes, favoriteNodeId } = get();
    if (!favoriteNodeId) return null;
    return nodes.find((n) => n.id === favoriteNodeId) ?? null;
  },
}));