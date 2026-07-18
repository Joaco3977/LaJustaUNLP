export type Category = {
  id: number;
  name: string;
  parent: { id: number } | null;
};
