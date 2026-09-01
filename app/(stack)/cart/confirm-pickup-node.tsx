import {
  Stack,
  useRouter,
} from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useNodes } from '@/hooks/use-nodes';
import { useProducts } from '@/hooks/use-products';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCartStore } from '@/stores/cart.store';

type SelectedOption =
  | { type: 'delivery' }
  | { type: 'node'; id: number }
  | null;

export default function CartConfirmPickupNodeScreen() {
  const router = useRouter();

  const {
    cart,
    loadCart,
  } = useCartStore();

  const {
    nodes,
    loading: nodesLoading,
    error: nodesError,
  } = useNodes();

  const background = useThemeColor({}, 'background');
  const tab = useThemeColor({}, 'tab');
  const button = useThemeColor({}, 'tabIconDefault');
  const white = useThemeColor({}, 'buttonText');

  /*
   * Opción de entrega seleccionada.
   *
   * Puede ser:
   * - Delivery
   * - Un nodo de retiro
   * - Ninguna
   */
  const [selectedOption, setSelectedOption] =
    useState<SelectedOption>(null);

  useEffect(() => {
    loadCart();
  }, []);

  /*
   * Productos del carrito.
   */
  const productIds = useMemo(
    () => cart.map(item => item.productId),
    [cart]
  );

  const productsOptions = useMemo(
    () => ({ ids: productIds }),
    [productIds]
  );

  const {
    products,
    loading: productsLoading,
  } = useProducts(productsOptions);

  /*
   * ¿Algún producto necesita frío?
   */
  const needsCold = useMemo(() => {
    return products.some(
      product => product.needCold === true
    );
  }, [products]);

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

      return (
        acc +
        product.price * cartItem.quantity
      );
    }, 0);
  }, [products, cart]);

  /*
   * Nodos disponibles.
   */
  const availableNodes = useMemo(() => {
    return nodes.filter(node => {
      /*
       * Excluir nodos eliminados.
       */
      if (node.deletedAt !== null) {
        return false;
      }

      /*
       * Excluir nodos internos/no seleccionables.
       */
      const nodeName = node.name.toUpperCase();

      if (
        nodeName.startsWith('NO ELEGIR') ||
        nodeName.startsWith('DELIVERY')
      ) {
        return false;
      }

      /*
       * Si algún producto necesita frío,
       * solamente nodos con heladera.
       */
      if (
        needsCold &&
        node.hasFridge !== true
      ) {
        return false;
      }

      return true;
    });
  }, [nodes, needsCold]);

  const loading =
    nodesLoading || productsLoading;

  /*
   * Si el carrito quedó vacío,
   * volvemos al carrito.
   */
  useEffect(() => {
    if (
      !productsLoading &&
      cart.length === 0
    ) {
      router.replace('/cart');
    }
  }, [
    cart,
    productsLoading,
  ]);

  /*
   * Continuar según la opción seleccionada.
   */
  const continuePurchase = () => {
    if (!selectedOption) {
      return;
    }

    /*
     * DELIVERY
     */
    if (selectedOption.type === 'delivery') {
      router.push('/cart/confirm-delivery');
      return;
    }

    /*
     * NODO DE RETIRO
     */
    router.push({
      pathname: '/cart/confirm-final',
      params: {
        nodeId: selectedOption.id.toString(),
      },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Forma de entrega',
        }}
      />

      <ThemedView
        style={[
          styles.container,
          { backgroundColor: background },
        ]}
      >
        <FlatList
          data={availableNodes}
          keyExtractor={item =>
            item.id.toString()
          }
          contentContainerStyle={
            styles.list
          }

          /*
           * HEADER
           */
          ListHeaderComponent={
            <View style={styles.header}>

              {/* DELIVERY */}
              <View style={styles.deliverySection}>
                <ThemedText type="subtitle">
                  ¿Preferís recibir tu pedido?
                </ThemedText>

                <Pressable
                  style={[
                    styles.optionCard,
                    selectedOption?.type ===
                      'delivery' &&
                      styles.selectedOptionCard,
                  ]}
                  onPress={() =>
                    setSelectedOption({
                      type: 'delivery',
                    })
                  }
                >
                  <View
                    style={
                      styles.optionHeader
                    }
                  >
                    <View
                      style={
                        styles.optionInfo
                      }
                    >
                      <ThemedText
                        style={
                          styles.optionTitle
                        }
                      >
                        🚚 Enviar a domicilio
                      </ThemedText>

                      <ThemedText>
                        Recibí tu compra en tu
                        domicilio
                      </ThemedText>
                    </View>

                    {selectedOption?.type ===
                      'delivery' && (
                      <ThemedText
                        style={
                          styles.selectedText
                        }
                      >
                        ✓
                      </ThemedText>
                    )}
                  </View>
                </Pressable>
              </View>

              {/* SEPARADOR */}
              <View
                style={
                  styles.sectionSeparator
                }
              />

              {/* NODOS */}
              <View
                style={
                  styles.nodesSection
                }
              >
                <ThemedText type="subtitle">
                  ¿Preferís retirar tu pedido
                  personalmente?
                </ThemedText>

                {needsCold && (
                  <ThemedText
                    style={
                      styles.coldMessage
                    }
                  >
                    ❄️ Tu compra contiene productos que necesitan
                    frío. Solo se muestran nodos con heladera.
                  </ThemedText>
                )}
              </View>
            </View>
          }

          /*
           * Si no hay nodos.
           */
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                style={styles.loader}
              />
            ) : nodesError ? (
              <ThemedText
                style={styles.error}
              >
                {nodesError}
              </ThemedText>
            ) : (
              <ThemedText
                style={styles.error}
              >
                No hay nodos de retiro
                disponibles para esta
                compra.
              </ThemedText>
            )
          }

          /*
           * NODOS
           */
          renderItem={({ item }) => {
            const selected =
              selectedOption?.type ===
                'node' &&
              selectedOption.id === item.id;

            return (
              <Pressable
                style={[
                  styles.nodeCard,
                  selected &&
                    styles.selectedNodeCard,
                ]}
                onPress={() =>
                  setSelectedOption({
                    type: 'node',
                    id: item.id,
                  })
                }
              >
                <View
                  style={
                    styles.nodeHeader
                  }
                >
                  <ThemedText
                    style={
                      styles.nodeName
                    }
                  >
                    {item.name}
                  </ThemedText>

                  {selected && (
                    <ThemedText
                      style={
                        styles.selectedText
                      }
                    >
                      ✓
                    </ThemedText>
                  )}
                </View>

                <ThemedText>
                  {item.address.street}{' '}
                  {item.address.number ?? ''}
                </ThemedText>

                {item.address
                  .betweenStreets && (
                  <ThemedText>
                    Entre{' '}
                    {
                      item.address
                        .betweenStreets
                    }
                  </ThemedText>
                )}

                {item.phone && (
                  <ThemedText>
                    📞 {item.phone}
                  </ThemedText>
                )}

                {item.hasFridge && (
                  <ThemedText>
                    ❄️ Tiene heladera
                  </ThemedText>
                )}
              </Pressable>
            );
          }}
        />

        {/* FOOTER */}
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
            disabled={!selectedOption}
            style={[
              styles.confirmButton,
              {
                backgroundColor:
                  selectedOption
                    ? button
                    : '#9ca3af',
              },
            ]}
            onPress={continuePurchase}
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
    paddingBottom: 110,
  },

  header: {
    marginBottom: 8,
  },

  /*
   * DELIVERY
   */
  deliverySection: {
    gap: 12,
  },

  /*
   * OPCIONES
   */
  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  selectedOptionCard: {
    borderWidth: 2,
  },

  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionInfo: {
    flex: 1,
    gap: 4,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  /*
   * SEPARADOR
   */
  sectionSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 28,
  },

  /*
   * NODOS
   */
  nodesSection: {
    gap: 10,
    marginBottom: 12,
  },

  coldMessage: {
    marginTop: 4,
  },

  loader: {
    marginTop: 30,
  },

  error: {
    marginTop: 20,
  },

  nodeCard: {
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 5,
  },

  selectedNodeCard: {
    borderWidth: 2,
  },

  nodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nodeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },

  selectedText: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  /*
   * FOOTER
   */
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
    fontSize: 20,
    fontWeight: '800',
  },

  confirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
  },
});