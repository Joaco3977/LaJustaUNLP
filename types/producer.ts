export type ProducerTag = {
  id: number;
  description: string;
};

export type ProducerImage = {
  id: number;
  value: string;
};

export type Producer = {
  id: number;
  name: string;
  origin?: string | null;
  description?: string | null;
  phone?: string | null;
  images?: ProducerImage[] | null;
  tags?: ProducerTag[] | null;
  isCompany?: boolean;
};
