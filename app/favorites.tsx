import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { ConfirmModal } from '@/components/confirm-modal';
import { ProductGrid } from '@/components/grids/product-grid';
import { Product } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFavoritesStore } from '@/stores/favorites.store';

export default function FavoritesScreen() {
  const { favorites, loadFavorites, removeFavorite } =
    useFavoritesStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const subtextColor = useThemeColor({}, 'subtext');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    if (favorites.length === 0) {
      setProducts([]);
      return;
    }

    const loadProducts = async () => {
      try {
        setLoading(true);

        const responses = await Promise.all(
          favorites.map(id =>
            fetch(
              `https://www.lajustaunlp.com.ar/api/product/${id}`
            ).then(res => res.json())
          )
        );

        setProducts(responses);
      } catch (error) {
        console.warn('Error loading favorites', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [favorites]);

  return (
    <>
      <Stack.Screen options={{ title: 'Favoritos' }} />

      <ThemedView style={[styles.container, { backgroundColor }]}>
        {favorites.length === 0 ? (
          <ThemedText
            style={[
              styles.emptyText,
              { color: subtextColor },
            ]}
          >
            Todavía no marcaste ningún producto como favorito.
            {'\n\n'}
            Una vez que lo hagas, se mostrarán aquí.
          </ThemedText>
        ) : loading ? (
          <ActivityIndicator color={tintColor} />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <ProductGrid
              products={products}
              onSelectProduct={() => {}}
              showDelete
              onDeleteProduct={(id) =>
                setSelectedProductId(id)
              }
            />
          </ScrollView>
        )}
      </ThemedView>

      <ConfirmModal
        visible={selectedProductId !== null}
        title="¿Eliminar de favoritos?"
        description="Este producto dejará de aparecer en tu lista de favoritos."
        cancelText="Cancelar"
        confirmText="Eliminar"
        onCancel={() => setSelectedProductId(null)}
        onConfirm={() => {
          if (selectedProductId !== null) {
            removeFavorite(selectedProductId);
            setSelectedProductId(null);
          }
        }}
      />
    </>
  );
}

const styles = {
  container: {
    flex: 1,
    marginTop: 12,
    paddingHorizontal: 24,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  emptyText: {
    textAlign: 'center' as const,
    marginTop: 48,
  },
};