export type NewsItem = {
  id: number;
  title: string;
  subtitle?: string | null;
  text?: string | null;
  deletedAt?: number | null;
  image?: { id: number; value: string } | null;
  url?: string | null;
};
