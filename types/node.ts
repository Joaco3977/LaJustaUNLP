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
