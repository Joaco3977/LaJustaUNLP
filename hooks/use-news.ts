import { useEffect, useState } from 'react';

/* ===== TYPES ===== */
export type NewsItem = {
  id: number;
  title: string;
  subtitle?: string | null;
  text?: string | null;
  deletedAt?: number | null;
  image?: { id: number; value: string } | null;
  url?: string | null;
};

/* ===== API ===== */
const NEWS_BASE = 'https://www.lajustaunlp.com.ar/api/news';

// A diferencia de productos/productores, noticias NO filtra por deletedAt.
// Por eso properties es un array vacío [].
export const buildNewsUrl = (page: number, pageSize: number) => {
  const properties = encodeURIComponent(JSON.stringify([]));
  return `${NEWS_BASE}?properties=${properties}&range=${page},${pageSize}&sort=id,ASC`;
};

/* ===== HOOK ===== */
export function useNews(page: number, pageSize: number) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);
  const refetch = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let active = true;

    const fetchNews = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch(buildNewsUrl(page, pageSize));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (!active) return;

        setNews(json.page ?? []);
        setTotal(json.totalElements ?? 0);
      } catch (e) {
        if (!active) return;
        console.error('Error cargando noticias', e);
        setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchNews();

    return () => {
      active = false;
    };
  }, [page, pageSize, reloadKey]);

  return { news, total, loading, error, refetch };
}
