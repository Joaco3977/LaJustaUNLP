import { useEffect, useState } from 'react';

/* ===== TYPES ===== */
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

/* ===== API ===== */
const PRODUCER_BASE = 'https://www.lajustaunlp.com.ar/api/producer';

// Arma la URL de productores para una página dada.
// range = "numeroDePagina,tamaño" (la página es 0-based). Página 0 -> "0,10", página 1 -> "1,10", etc.
export const buildProducersUrl = (page: number, pageSize: number) => {
  const properties = encodeURIComponent(
    JSON.stringify([{ key: 'deletedAt', value: 'null' }])
  );

  return `${PRODUCER_BASE}?properties=${properties}&range=${page},${pageSize}&sort=id,ASC`;
};

/* ===== HOOK ===== */
export function useProducers(page: number, pageSize: number) {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Permite reintentar la misma página tras un error.
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    let active = true; // evita actualizar estado si la pantalla ya se cerró

    const fetchProducers = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch(buildProducersUrl(page, pageSize));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (!active) return;

        setProducers(json.page ?? []);
        setTotal(json.totalElements ?? 0);
      } catch (e) {
        if (!active) return;
        console.error('Error cargando productores', e);
        setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducers();

    return () => {
      active = false;
    };
  }, [page, pageSize, reloadKey]);

  return { producers, total, loading, error, refetch };
}
