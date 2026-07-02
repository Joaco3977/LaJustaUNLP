import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Product, ProductCard } from '@/components/product-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCartStore } from '@/stores/cart.store';

const CARD_WIDTH = 140;

type CartProduct = Product & {
  cartQuantity: number;
};

export default function CartScreen() {
  const {
    cart,
    loadCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();

  const [products, setProducts] = useState<CartProduct[]>([]);

  const tab = useThemeColor({}, 'tab');
  const background = useThemeColor({}, 'background');
  const button = useThemeColor({}, 'tabIconDefault');
  const white = useThemeColor({}, 'buttonText');
  const cardBg = useThemeColor({}, 'card');

  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      setProducts([]);
      return;
    }

    const loadProducts = async () => {
      const responses = await Promise.all(
        cart.map(async (item) => {
          const product: Product = await fetch(
            `https://www.lajustaunlp.com.ar/api/product/${item.productId}`
          ).then((res) => res.json());

          return {
            ...product,
            cartQuantity: item.quantity,
          };
        })
      );

      setProducts(responses);
    };

    loadProducts();
  }, [cart]);

  // TOTAL (solo productos con stock)
  const total = useMemo(() => {
    return products.reduce((acc, p) => {
      if ((p.stock ?? 0) === 0) return acc;
      return acc + p.price * p.cartQuantity;
    }, 0);
  }, [products]);

  return (
    <>
      <Stack.Screen options={{ title: 'Carrito' }} />

      <ThemedView style={[styles.container, { backgroundColor: background }]}>
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
                style={{ color: white, fontSize: 16, fontWeight: 'bold' }}
              >
                Ver productos
              </ThemedText>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const stock = item.stock ?? 0;
              const disabled = stock === 0;

              return (
                <View
                  style={[
                    styles.cartItemCard,
                    { backgroundColor: cardBg },
                    disabled && styles.disabledRow,
                  ]}
                >
                  {/* BOTÓN ELIMINAR */}
                  <Pressable
                    style={styles.trashButton}
                    onPress={() =>
                      removeFromCart(item.id)
                    }
                  >
                    <IconSymbol
                      name="trash.fill"
                      size={16}
                      color="#fff"
                    />
                  </Pressable>

                  <View style={styles.row}>
                    <ProductCard
                      product={item}
                      width={CARD_WIDTH}
                      onPress={() => {}}
                    />

                    <View
                      style={[
                        styles.quantityBox,
                      ]}
                    >
                      <ThemedText style={{ color: button, fontSize: 20, fontWeight: 'bold' }}>
                        Cantidad
                      </ThemedText>

                      <ThemedText style={{ color: button, fontSize: 20, fontWeight: 'bold' }}>
                        {item.cartQuantity}
                      </ThemedText>

                      <View style={styles.qtyControls}>
                        <Pressable
                          disabled={
                            disabled || item.cartQuantity <= 1
                          }
                          onPress={() =>
                            decreaseQuantity(item.id)
                          }
                          style={[
                            styles.qtyButton,
                            { backgroundColor: button },
                            disabled && styles.disabledButton,
                          ]}
                        >
                          <ThemedText style={{ color: white, fontSize: 16, fontWeight: 'bold' }}>
                            -
                          </ThemedText>
                        </Pressable>

                        <Pressable
                          disabled={
                            disabled ||
                            item.cartQuantity >= stock
                          }
                          onPress={() =>
                            increaseQuantity(item.id)
                          }
                          style={[
                            styles.qtyButton,
                            { backgroundColor: button },
                            disabled && styles.disabledButton,
                          ]}
                        >
                          <ThemedText style={{ color: white, fontSize: 16, fontWeight: 'bold' }}>
                            +
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </ThemedView>

      {/* FOOTER */}
      {cart.length > 0 && (
        <View style={[styles.footer, { backgroundColor: tab }]}>
          <ThemedText style={styles.total} type="title">
            Total: ${total}
          </ThemedText>

          <Pressable
            style={[
              styles.continueButton,
              { backgroundColor: button },
            ]}
            onPress={() => console.log('TOTAL:', total)}
          >
            <ThemedText style={{ color: white, fontSize: 16, fontWeight: 'bold' }}>
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
    padding: 16,
    paddingBottom: 120,
    gap: 16,
  },

  cartItemCard: {
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },

  disabledRow: {
    opacity: 0.4,
  },

  quantityBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
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

  qtyNumber: {
    fontSize: 20,
    fontWeight: '700',
  },

  qtyControls: {
    flexDirection: 'row',
    gap: 12,
  },

  qtyButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },

  disabledButton: {
    opacity: 0.4,
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

  trashText: {
    color: '#fff',
    fontSize: 16,
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

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});