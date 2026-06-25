import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { ProducerCard } from '@/components/producer-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProducers } from '@/hooks/use-producers';

const PAGE_SIZE = 10;

export default function ProducersScreen() {
  const [page, setPage] = useState(0);
  const { producers, total, loading, error, refetch } = useProducers(page, PAGE_SIZE);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* CONTADOR */}
        {!loading && !error && total > 0 && (
          <ThemedText style={styles.count}>
            {total} productores
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
            No hay productores para mostrar
          </ThemedText>
        ) : (
          producers.map((producer) => (
            <ProducerCard key={producer.id} producer={producer} />
          ))
        )}

        {/* PAGINACIÓN */}
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
