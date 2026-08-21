export type ProductImage = {
  id?: number;
  value: string;
};

export type Unit = {
  id?: number;
  code?: string;
  description?: string;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  brand?: string;
  stock?: number;
  unit?: Unit;
  unitQuantity?: number;
  unitDescription?: string;
  images?: ProductImage[];
  producer?: { id?: number; name?: string };
  categories?: { id: number; name: string }[];
  isPromotion?: boolean;
};
