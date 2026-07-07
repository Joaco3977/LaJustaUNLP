import { getProducers } from '@/services/producers.service';
import type { Producer } from '@/types';
import { useEffect, useState } from 'react';

export type { Producer, ProducerImage, ProducerTag } from '@/types';

const SEARCH_FETCH_SIZE = 300;

export function useProducers(page: number, pageSize: number, search = '') {
  const term = search.trim().toLowerCase().replace(/^#/, '');
  const isSearch = term.length > 0;

  const [serverItems, setServerItems] = useState<Producer[]>([]);
  const [serverTotal, setServerTotal] = useState(0);
  const [searchAll, setSearchAll] = useState<Producer[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);
  const refetch = () => setReloadKey((k) => k + 1);

  useEffect(() => {
    if (isSearch) return;

    let active = true;

    const fetchPage = async () => {
      setLoading(true);
      setError(false);

      try {
        const json = await getProducers({ page, size: pageSize });
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

  useEffect(() => {
    if (!isSearch) return;

    let active = true;

    const fetchAll = async () => {
      setLoading(true);
      setError(false);

      try {
        const json = await getProducers({ page: 0, size: SEARCH_FETCH_SIZE });
        if (!active) return;

        const list: Producer[] = json.page ?? [];

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
