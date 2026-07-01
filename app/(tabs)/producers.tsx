import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { ProducerCard } from '@/components/producer-card';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProducers } from '@/hooks/use-producers';

const PAGE_SIZE = 10;

export default function ProducersScreen() {
  const [page, setPage] = useState(0);

  // searchText = lo que se escribe; searchQuery = lo que realmente se busca (al enviar).
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { producers, total, loading, error, refetch, isSearch } = useProducers(
    page,
    PAGE_SIZE,
    searchQuery
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  // Referencia al ScrollView para poder moverlo por código.
  const scrollRef = useRef<ScrollView>(null);

  // Cada vez que cambia la página, vuelve al tope.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [page]);

  const executeSearch = () => {
    setPage(0);
    setSearchQuery(searchText.trim());
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll}>
        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchText}
            onChangeText={(t) => {
              setSearchText(t);
              // Si borran todo el texto, vuelve a la lista completa.
              if (t.trim() === '') {
                setSearchQuery('');
                setPage(0);
              }
            }}
            onSubmit={executeSearch}
            placeholder="Buscar por nombre o #etiqueta..."
          />
        </View>

        {/* CONTADOR */}
        {!loading && !error && total > 0 && (
          <ThemedText color="subtext" style={styles.count}>
            {isSearch
              ? `${total} resultado${total === 1 ? '' : 's'}`
              : `${total} productores`}
          </ThemedText>
        )}

        {/* ESTADOS */}
        {loading ? (
          <ThemedText color="subtext" style={styles.message}>
            Cargando productores...
          </ThemedText>
        ) : error ? (
          <View style={styles.center}>
            <ThemedText color="subtext" style={styles.message}>
              No se pudieron cargar los productores.
            </ThemedText>
            <AnimatedButton title="Reintentar" onPress={refetch} />
          </View>
        ) : producers.length === 0 ? (
          <ThemedText color="subtext" style={styles.message}>
            {isSearch
              ? 'No se encontraron productores'
              : 'No hay productores para mostrar'}
          </ThemedText>
        ) : (
          producers.map((producer) => (
            <ProducerCard key={producer.id} producer={producer} />
          ))
        )}

        {/* PAGINACIÓN: en lista y en búsqueda (en búsqueda se corta en memoria) */}
        {!loading && !error && totalPages > 1 && (
          <View style={styles.pagination}>
            <AnimatedButton
              title="Anterior"
              onPress={() => setPage(page - 1)}
              disabled={!hasPrev}
            />

            <ThemedText color="subtext" style={styles.pageText}>
              Página {page + 1} de {totalPages}
            </ThemedText>

            <AnimatedButton
              title="Siguiente"
              onPress={() => setPage(page + 1)}
              disabled={!hasNext}
            />
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  searchContainer: {
    marginBottom: 20,
  },
  count: {
    fontSize: 14,
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
  },
  pageText: {
    fontSize: 14,
  },
  center: {
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 20,
  },
});
