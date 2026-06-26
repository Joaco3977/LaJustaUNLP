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

// Al buscar traemos "todos" para filtrar en el teléfono (hay ~102).
// Si algún día hay más, conviene pasar a búsqueda en el servidor (ver backlog).
const SEARCH_FETCH_SIZE = 300;

// Arma la URL de productores para una página dada.
// range = "numeroDePagina,tamaño" (la página es 0-based). Página 0 -> "0,10", página 1 -> "1,10", etc.
export const buildProducersUrl = (page: number, pageSize: number) => {
  const properties = encodeURIComponent(
    JSON.stringify([{ key: 'deletedAt', value: 'null' }])
  );

  return `${PRODUCER_BASE}?properties=${properties}&range=${page},${pageSize}&sort=id,ASC`;
};

/* ===== HOOK ===== */
export function useProducers(page: number, pageSize: number, search = '') {
  // Normalizo el término: sin espacios, en minúsculas y sin el "#" inicial.
  const term = search.trim().toLowerCase().replace(/^#/, '');
  const isSearch = term.length > 0;

  // Datos crudos según el modo.
  const [serverItems, setServerItems] = useState<Producer[]>([]); // modo lista: la página del servidor
  const [serverTotal, setServerTotal] = useState(0);
  const [searchAll, setSearchAll] = useState<Producer[]>([]); // modo búsqueda: todos los filtrados

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Permite reintentar tras un error.
  const [reloadKey, setReloadKey] = useState(0);
  const refetch = () => setReloadKey((k) => k + 1);

  // ===== MODO LISTA: pide al servidor solo la página actual =====
  useEffect(() => {
    if (isSearch) return; // en búsqueda se encarga el otro efecto

    let active = true;

    const fetchPage = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch(buildProducersUrl(page, pageSize));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (!active) return;

        setServerItems(json.page ?? []);
        setServerTotal(json.totalElements ?? 0);
      } catch (e) {
        if (!active) return;
        console.error('Error cargando productores', e);
        setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPage();
    return () => {
      active = false;
    };
  }, [isSearch, page, pageSize, reloadKey]);

  // ===== MODO BÚSQUEDA: trae "todos" UNA vez por término y filtra =====
  // OJO: no depende de `page`, así cambiar de página NO vuelve a pedir datos.
  useEffect(() => {
    if (!isSearch) return;

    let active = true;

    const fetchAll = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch(buildProducersUrl(0, SEARCH_FETCH_SIZE));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (!active) return;

        const list: Producer[] = json.page ?? [];

        // Filtra por nombre O por alguna etiqueta que contenga el término.
        const filtered = list.filter((p) => {
          const inName = p.name?.toLowerCase().includes(term);
          const inTags = p.tags?.some((t) =>
            t.description.toLowerCase().includes(term)
          );
          return inName || inTags;
        });

        setSearchAll(filtered);
      } catch (e) {
        if (!active) return;
        console.error('Error buscando productores', e);
        setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      active = false;
    };
  }, [isSearch, term, reloadKey]);

  // ===== Qué mostrar =====
  // En búsqueda, la paginación se hace acá cortando la lista filtrada (en memoria).
  let producers: Producer[];
  let total: number;

  if (isSearch) {
    total = searchAll.length;
    const start = page * pageSize;
    producers = searchAll.slice(start, start + pageSize);
  } else {
    producers = serverItems;
    total = serverTotal;
  }

  return { producers, total, loading, error, refetch, isSearch };
}
