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
          <ThemedText style={styles.count}>
            {isSearch
              ? `${total} resultado${total === 1 ? '' : 's'}`
              : `${total} productores`}
          </ThemedText>
        )}

        {/* ESTADOS */}
        {loading ? (
          <ThemedText style={styles.message}>Cargando productores...</ThemedText>
        ) : error ? (
          <View style={styles.center}>
            <ThemedText style={styles.message}>
              No se pudieron cargar los productores.
            </ThemedText>
            <AnimatedButton title="Reintentar" onPress={refetch} />
          </View>
        ) : producers.length === 0 ? (
          <ThemedText style={styles.message}>
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
            {hasPrev ? (
              <AnimatedButton title="← Anterior" onPress={() => setPage(page - 1)} />
            ) : (
              <View style={styles.spacer} />
            )}

            <ThemedText>
              Página {page + 1} de {totalPages}
            </ThemedText>

            {hasNext ? (
              <AnimatedButton title="Siguiente →" onPress={() => setPage(page + 1)} />
            ) : (
              <View style={styles.spacer} />
            )}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  scroll: {
    paddingBottom: 40,
  },
  searchContainer: {
    marginBottom: 20,
  },
  count: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.8,
  },
  center: {
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  spacer: {
    width: 100,
  },
});
