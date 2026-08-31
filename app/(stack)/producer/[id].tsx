import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProductGrid } from '@/components/grids/product-grid';
import { ImageCarousel } from '@/components/image-carousel';
import { CustomModal } from '@/components/modals/custom-modal';
import { ProductDetail } from '@/components/product-detail';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProducer } from '@/hooks/use-producer';

export default function ProducerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const producerId = Number(id);

  const { producer, loading, error } = useProducer(producerId);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: producer?.name ?? 'Productor' }} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <ThemedText color="subtext" style={styles.message}>
            Cargando productor...
          </ThemedText>
        ) : error || !producer ? (
          <ThemedText color="subtext" style={styles.message}>
            No se pudo cargar el productor.
          </ThemedText>
        ) : (
          <>
            {!!producer.images?.length && (
              <View style={styles.carousel}>
                <ImageCarousel
                  images={producer.images.map((img) => img.value)}
                  height={200}
                />
              </View>
            )}

            <ThemedText type="title" color="title" style={styles.name}>
              {producer.name}
            </ThemedText>

            {!!producer.origin && (
              <ThemedText color="tint" style={styles.origin}>
                {producer.origin}
              </ThemedText>
            )}

            {!!producer.description && (
              <ThemedText color="subtext" style={styles.description}>
                {producer.description.trim()}
              </ThemedText>
            )}

            {!!producer.tags?.length && (
              <View style={styles.tags}>
                {producer.tags.map((tag) => (
                  <View key={tag.id} style={styles.tag}>
                    <ThemedText style={styles.tagText}>{tag.description}</ThemedText>
                  </View>
                ))}
              </View>
            )}

            <ThemedText type="subtitle" color="title" style={styles.sectionTitle}>
              Sus productos
            </ThemedText>

            {producer.products && producer.products.length > 0 ? (
              <ProductGrid
                products={producer.products}
                onSelectProduct={(pid) => setSelectedProductId(pid)}
              />
            ) : (
              <ThemedText color="subtext" style={styles.message}>
                Este productor todavía no tiene productos cargados.
              </ThemedText>
            )}
          </>
        )}
      </ScrollView>

      <CustomModal
        visible={selectedProductId !== null}
        onClose={() => setSelectedProductId(null)}
      >
        {selectedProductId !== null && (
          <ProductDetail
            productId={selectedProductId}
            onClose={() => setSelectedProductId(null)}
          />
        )}
      </CustomModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 },
  carousel: { borderRadius: 14, overflow: 'hidden', marginBottom: 16 },
  name: { marginBottom: 4 },
  origin: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 21, marginBottom: 14 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  sectionTitle: { marginBottom: 14 },
  message: { textAlign: 'center', marginTop: 20 },
});
