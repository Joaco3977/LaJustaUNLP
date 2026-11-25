
import { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useNodes } from '@/hooks/use-nodes';
import { useProducts } from '@/hooks/use-products';
import { useThemeColor } from '@/hooks/use-theme-color';

import { useCartStore } from '@/stores/cart.store';

export default function PickupNodeScreen() {
  const router = useRouter();

  const [selectedNodeId, setSelectedNodeId] =
    useState<number | null>(null);

  /* ---------------- TEMA ---------------- */

  const background = useThemeColor({}, 'background');
  const tab = useThemeColor({}, 'tab');

  /* ---------------- CARRITO ---------------- */

  const cart = useCartStore(state => state.cart);
  const loadCart = useCartStore(state => state.loadCart);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /* ---------------- NODOS ---------------- */

  const {
    nodes,
    loading: nodesLoading,
    error: nodesError,
  } = useNodes();

  /* ---------------- PRODUCTOS ---------------- */

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

  /* ---------------- PRODUCTOS QUE NECESITAN FRÍO ---------------- */

  const needsCold = useMemo(() => {
    return products.some(
      product => product.needCold === true
    );
  }, [products]);

  /* ---------------- TOTAL DE LA COMPRA ---------------- */

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

  /* ---------------- NODOS DISPONIBLES ---------------- */

  const availableNodes = useMemo(() => {
    return nodes.filter(node => {
      if (node.deletedAt !== null) {
        return false;
      }

      const nodeName = node.name.toUpperCase();

      if (
        nodeName.startsWith('NO ELEGIR') ||
        nodeName.startsWith('DELIVERY')
      ) {
        return false;
      }

      // Si algún producto necesita frío,
      // solamente mostramos nodos con heladera.
      if (
        needsCold &&
        node.hasFridge !== true
      ) {
        return false;
      }

      return true;
    });
  }, [nodes, needsCold]);

  const loading = nodesLoading || productsLoading;

  /* ---------------- VALIDAR CARRITO ---------------- */

  useEffect(() => {
    if (!productsLoading && cart.length === 0) {
      router.replace('/cart');
    }
  }, [cart.length, productsLoading, router]);

  /* ---------------- CONTINUAR ---------------- */

  const handleContinue = () => {
    if (selectedNodeId === null) {
      return;
    }

    router.push({
      pathname: '/cart/confirm-final',
      params: {
        nodeId: selectedNodeId.toString(),
      },
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Elegir nodo de retiro',
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
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}

          /* ---------------- HEADER ---------------- */

          ListHeaderComponent={
            <View style={styles.header}>
              <ThemedText type="subtitle">
                ¿Dónde preferís retirar tu pedido?
              </ThemedText>

              {needsCold && (
                <View style={styles.coldMessageContainer}>
                  <IconSymbol
                    name="snowflake"
                    size={20}
                    color="#2196F3"
                  />

                  <ThemedText style={styles.coldMessage}>
                    Tu compra contiene productos que necesitan frío.
                    Por eso, solo se muestran los nodos que cuentan
                    con heladera.
                  </ThemedText>
                </View>
              )}
            </View>
          }

          /* ---------------- LISTADO VACÍO ---------------- */

          ListEmptyComponent={
            loading ? (
              <ActivityIndicator
                size="large"
                style={styles.loader}
              />
            ) : nodesError ? (
              <ThemedText style={styles.error}>
                {nodesError}
              </ThemedText>
            ) : (
              <ThemedText style={styles.error}>
                No hay nodos de retiro disponibles para esta compra.
              </ThemedText>
            )
          }

          /* ---------------- LISTADO DE NODOS ---------------- */

          renderItem={({ item }) => {
            const selected = selectedNodeId === item.id;

            return (
              <Pressable
                style={[
                  styles.nodeCard,
                  selected && styles.selectedNodeCard,
                ]}
                onPress={() => setSelectedNodeId(item.id)}
              >
                <View style={styles.nodeHeader}>
                  <ThemedText style={styles.nodeName}>
                    {item.name}
                  </ThemedText>

                  {selected && (
                    <IconSymbol
                      name="checkmark.circle.fill"
                      size={24}
                      color="#2E7D32"
                    />
                  )}
                </View>

                <ThemedText>
                  {item.address.street}{' '}
                  {item.address.number ?? ''}
                </ThemedText>

                {item.address.betweenStreets && (
                  <ThemedText>
                    Entre {item.address.betweenStreets}
                  </ThemedText>
                )}
              </Pressable>
            );
          }}
        />

        {/* ---------------- FOOTER ---------------- */}

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
              styles.confirmButton,
              selectedNodeId === null &&
                styles.confirmButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={selectedNodeId === null}
          >
            <ThemedText style={styles.confirmButtonText}>
              Continuar
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </>
  );
}

/* ---------------- ESTILOS ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    padding: 16,
    paddingBottom: 110,
  },

  header: {
    gap: 12,
    marginBottom: 16,
  },

  /* PRODUCTOS QUE NECESITAN FRÍO */

  coldMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  coldMessage: {
    flex: 1,
    marginTop: 4,
  },

  /* NODOS */

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
    borderColor: '#2E7D32',
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
  },

  nodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  nodeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },

  /* ESTADOS */

  loader: {
    marginTop: 30,
  },

  error: {
    marginTop: 20,
  },

  /* FOOTER */

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
    borderRadius: 10,
    backgroundColor: '#2E7D32',
  },

  confirmButtonDisabled: {
    backgroundColor: '#AAAAAA',
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
