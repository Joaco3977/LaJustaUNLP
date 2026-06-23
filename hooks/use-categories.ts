import { useEffect, useState } from 'react';

/* ===== TYPES ===== */
export type Category = {
  id: number;
  name: string;
  parent: { id: number } | null;
};

/* ===== API ===== */
const CATEGORY_ENDPOINT =
  'https://www.lajustaunlp.com.ar/api/category?properties=%5B%7B%22key%22%3A%22deletedAt%22%2C%22value%22%3A%22%22%7D%5D&sort=id%2CASC';

/* ===== PRODUCT URL (por categoría) ===== */
export const buildProductUrl = (categoryId: number) => {
  const properties = encodeURIComponent(
    JSON.stringify([
      { key: 'categories.id', value: categoryId },
      { key: 'deletedAt', value: 'null' },
    ])
  );

  return `https://www.lajustaunlp.com.ar/api/product?properties=${properties}&range=0,12&sort=id,ASC`;
};

/* ===== PRODUCT URL (TODOS) ===== */
export const buildAllProductsUrl = () => {
  const properties = encodeURIComponent(
    JSON.stringify([
      { key: 'deletedAt', value: 'null' },
    ])
  );

  return `https://www.lajustaunlp.com.ar/api/product?properties=${properties}&range=0,12&sort=id,ASC`;
};

export function useCategories() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(CATEGORY_ENDPOINT);
        const json = await res.json();
        setAllCategories(json.page ?? []);
      } catch (error) {
        console.error('Error cargando categorías', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* ===== ROOT + TODOS ===== */
  const rootCategories = [
    {
      id: 0,
      name: 'Todos',
      parent: null,
    },
    ...allCategories.filter((cat) => cat.parent === null),
  ];

  const getChildren = (parentId: number) =>
    allCategories.filter((cat) => cat.parent?.id === parentId);

  return {
    allCategories,
    rootCategories,
    getChildren,
    loading,
  };
}