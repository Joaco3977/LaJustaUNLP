import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { Product, ProductCard } from '@/components/product-card';
import { ProductDetail } from '@/components/product-detail';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { CustomModal } from '@/components/modals/custom-modal';

import { useProducts } from '@/hooks/use-products';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCartStore } from '@/stores/cart.store';

const GRID_GAP = 12;
const HORIZONTAL_PADDING = 16;

export default function CartScreen() {
  const {
    cart,
    loadCart,
  } = useCartStore();

  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null);

  const tab = useThemeColor({}, 'tab');
  const background = useThemeColor({}, 'background');
  const button = useThemeColor({}, 'tabIconDefault');
  const white = useThemeColor({}, 'buttonText');

  const router = useRouter();

  const { width } = useWindowDimensions();

  useEffect(() => {
    loadCart();
  }, []);

  /*
   * IDs de productos actualmente presentes en el carrito.
   */
  const productIds = useMemo(
    () => cart.map(item => item.productId),
    [cart]
  );

  const productsOptions = useMemo(
    () => ({ ids: productIds }),
    [productIds]
  );

  /*
   * Traemos los productos actualizados.
   * El stock y el precio vienen de la fuente actual.
   */
  const { products, loading } = useProducts(productsOptions);

  /*
   * Total del carrito.
   */
  const total = useMemo(() => {
    return products.reduce((acc, product) => {
      const cartItem = cart.find(
        item => item.productId === product.id
      );

      if (!cartItem) return acc;

      const stock = product.stock ?? 0;

      if (stock === 0) return acc;

      return acc + product.price * cartItem.quantity;
    }, 0);
  }, [products, cart]);

  /*
   * PRODUCT DETAIL
   */
  const openProduct = (id: number) => {
    setSelectedProductId(id);
  };

  const closeProduct = () => {
    setSelectedProductId(null);
  };

  /*
   * Ancho de cada card para 2 columnas.
   */
  const cardWidth =
    (width - HORIZONTAL_PADDING * 2 - GRID_GAP) / 2;

  return (
    <>
      <Stack.Screen options={{ title: 'Carrito' }} />

      <ThemedView
        style={[
          styles.container,
          { backgroundColor: background },
        ]}
      >
        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText type="title">
              Tu carrito está vacío
            </ThemedText>

            <ThemedText type="subtitle">
              Agregá productos para continuar
            </ThemedText>

            <Pressable
              style={[
                styles.emptyButton,
                { backgroundColor: button },
              ]}
              onPress={() => router.push('/products')}
            >
              <ThemedText
                style={{
                  color: white,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                Ver productos
              </ThemedText>
            </Pressable>
          </View>
        ) : loading && products.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText>
              Cargando productos...
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={products}
            numColumns={2}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
            columnWrapperStyle={styles.row}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                width={cardWidth}
                onPress={openProduct}
              />
            )}
          />
        )}
      </ThemedView>

      {/* MODAL DETALLE PRODUCTO */}
      <CustomModal
        visible={selectedProductId !== null}
        onClose={closeProduct}
      >
        {selectedProductId !== null && (
          <ProductDetail
            productId={selectedProductId}
            onClose={closeProduct}
          />
        )}
      </CustomModal>

      {/* FOOTER */}
      {cart.length > 0 && selectedProductId === null && (
        <View
          style={[
            styles.footer,
            { backgroundColor: tab },
          ]}
        >
          <ThemedText
            style={styles.total}
            type="title"
          >
            Total: ${total}
          </ThemedText>

          <Pressable
            style={[
              styles.continueButton,
              { backgroundColor: button },
            ]}
            onPress={() =>
              router.push('/cart/confirm-products')
            }
          >
            <ThemedText
              style={{
                color: white,
                fontSize: 16,
                fontWeight: 'bold',
              }}
            >
              Continuar
            </ThemedText>
          </Pressable>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    padding: HORIZONTAL_PADDING,
    paddingBottom: 120,
    gap: GRID_GAP,
  },

  row: {
    gap: GRID_GAP,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },

  emptyButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },

  total: {
    fontSize: 18,
    fontWeight: '800',
  },

  continueButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },
});