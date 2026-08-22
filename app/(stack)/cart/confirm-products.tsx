import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useProducts } from '@/hooks/use-products';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCartStore } from '@/stores/cart.store';

export default function CartConfirmProductsScreen() {
  const router = useRouter();

  const {
    cart,
    loadCart,
  } = useCartStore();

  const background = useThemeColor({}, 'background');
  const tab = useThemeColor({}, 'tab');
  const button = useThemeColor({}, 'tabIconDefault');
  const white = useThemeColor({}, 'buttonText');

  useEffect(() => {
    loadCart();
  }, []);

  /*
   * IDs de los productos presentes en el carrito.
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
   */
  const {
    products,
    loading: productsLoading,
  } = useProducts(productsOptions);

  /*
   * Total de la compra.
   */
  const total = useMemo(() => {
    return products.reduce((acc, product) => {
      const cartItem = cart.find(
        item => item.productId === product.id
      );

      if (!cartItem) {
        return acc;
      }

      return acc + product.price * cartItem.quantity;
    }, 0);
  }, [products, cart]);

  /*
   * Si el carrito quedó vacío, volvemos al carrito.
   */
  useEffect(() => {
    if (
      !productsLoading &&
      cart.length === 0
    ) {
      router.replace('/cart');
    }
  }, [cart, productsLoading]);

  /*
   * Continuar al selector de nodo.
   *
   * Si ya existe un nodeId, lo pasamos para que
   * la pantalla pueda mostrarlo como seleccionado.
   */
  const selectPickupNode = () => {
    router.push('/cart/confirm-pickup-node');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Revisión de productos',
        }}
      />

      <ThemedView
        style={[
          styles.container,
          { backgroundColor: background },
        ]}
      >
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.header}>
              <ThemedText type="subtitle">
                Revisá los productos antes de continuar.
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => {
            const cartItem = cart.find(
              cartItem => cartItem.productId === item.id
            );

            if (!cartItem) {
              return null;
            }

            return (
              <View style={styles.productRow}>
                <View style={styles.productInfo}>
                  <ThemedText style={styles.productName}>
                    {item.title}
                  </ThemedText>

                  <ThemedText>
                    Cantidad: {cartItem.quantity}
                  </ThemedText>

                  {item.needCold && (
                    <ThemedText style={styles.coldText}>
                      ❄️ Requiere frío
                    </ThemedText>
                  )}
                </View>

                <ThemedText style={styles.productPrice}>
                  ${item.price * cartItem.quantity}
                </ThemedText>
              </View>
            );
          }}
        />

        <View
          style={[
            styles.footer,
            { backgroundColor: tab },
          ]}
        >
          <View>
            <ThemedText
              style={styles.total}
              type="title"
            >
              Total: ${total}
            </ThemedText>
          </View>

          <Pressable
            style={[
              styles.continueButton,
              { backgroundColor: button },
            ]}
            onPress={selectPickupNode}
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
      </ThemedView>
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
  },

  header: {
    marginBottom: 24,
    gap: 8,
  },

  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },

  productInfo: {
    flex: 1,
    gap: 4,
  },

  productName: {
    fontSize: 16,
    fontWeight: '700',
  },

  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 16,
  },

  coldText: {
    marginTop: 2,
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

  totalLabel: {
    fontSize: 14,
  },

  total: {
    fontSize: 20,
    fontWeight: '800',
  },

  continueButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
});