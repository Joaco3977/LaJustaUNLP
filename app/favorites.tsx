import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ConfirmModal } from '@/components/confirm-modal';
import { Product, ProductCard } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useFavoritesStore } from '@/stores/favorites.store';

const GAP = 12;
const PADDING = 16;

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

// altura mínima REAL de la ProductCard
const CARD_MIN_HEIGHT = ITEM_WIDTH + 36 + 96;

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

      <ThemedView
        style={[styles.container, { backgroundColor }]}
      >
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
          <FlatList
            data={products}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.list}
            columnWrapperStyle={{
              gap: GAP,
              marginBottom: GAP,
            }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.cardWrapper,
                  {
                    width: ITEM_WIDTH,
                    minHeight: CARD_MIN_HEIGHT,
                  },
                ]}
              >
                <ProductCard
                  product={item}
                  width={ITEM_WIDTH}
                  onPress={() => {}}
                />

                <Pressable
                  style={styles.trashButton}
                  onPress={() =>
                    setSelectedProductId(item.id)
                  }
                >
                  <IconSymbol
                    name="trash.fill"
                    size={16}
                    color="#fff"
                  />
                </Pressable>
              </View>
            )}
          />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PADDING,
  },

  list: {
    paddingBottom: 20,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 48,
  },

  cardWrapper: {
    position: 'relative',
  },

  trashButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff6f43a6',
    borderRadius: 16,
    padding: 6,
    zIndex: 20,
    elevation: 4,
  },
});