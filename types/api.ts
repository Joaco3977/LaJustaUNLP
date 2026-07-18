export type PageableCollection<T> = {
  totalElements: number;
  page: T[];
};

export type PropertyFilter = {
  key: string;
  value: string | number | boolean;
};
