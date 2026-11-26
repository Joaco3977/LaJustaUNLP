
import { useEffect, useMemo } from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  Stack,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useCartStore } from '@/stores/cart.store';
import { useProducts } from '@/hooks/use-products';
import { useNodes } from '@/hooks/use-nodes';

/* ---------------- FORMATO PRECIO ---------------- */

const formatoPrecio = (precio: number) =>
  precio.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function PickupNodeFinalScreen() {
  const router = useRouter();

  const { nodeId } = useLocalSearchParams<{
    nodeId: string;
  }>();

  /* ---------------- CARRITO ---------------- */

  const cart = useCartStore(state => state.cart);
  const loadCart = useCartStore(state => state.loadCart);
  const getTotalItems = useCartStore(
    state => state.getTotalItems,
  );

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /* ---------------- PRODUCTOS ---------------- */

  const productIds = useMemo(
    () => cart.map(item => item.productId),
    [cart],
  );

  const {
    products,
    loading: productsLoading,
  } = useProducts({
    ids: productIds,
  });

  /* ---------------- NODO DE RETIRO ---------------- */

  const {
    nodes,
    loading: nodesLoading,
    error: nodesError,
  } = useNodes();

  const selectedNode = useMemo(() => {
    const parsedNodeId = Number(nodeId);

    if (!nodeId || !Number.isFinite(parsedNodeId)) {
      return null;
    }

    return (
      nodes.find(node => node.id === parsedNodeId) ??
      null
    );
  }, [nodes, nodeId]);

  /* ---------------- SUBTOTAL PRODUCTOS ---------------- */

  const subtotalProductos = useMemo(() => {
    return cart.reduce((total, cartItem) => {
      const product = products?.find(
        item => item.id === cartItem.productId,
      );

      if (!product) {
        return total;
      }

      return total + product.price * cartItem.quantity;
    }, 0);
  }, [cart, products]);

  const totalItems = getTotalItems();

  /* ---------------- ESTADOS ---------------- */

  const carritoVacio = cart.length === 0;

  const faltanProductos =
    !productsLoading &&
    cart.some(cartItem =>
      !products?.some(
        product => product.id === cartItem.productId,
      ),
    );

  const loading = productsLoading || nodesLoading;

  const puedeTerminarPedido =
    !loading &&
    !carritoVacio &&
    !faltanProductos &&
    selectedNode !== null;

  /* ---------------- ACCIONES ---------------- */

  function handleFinishOrder() {
    if (!puedeTerminarPedido) {
      return;
    }

    Alert.alert(
      'Confirmar pedido',
      'La pantalla está lista, pero todavía falta conectar el servicio que registra la compra en el servidor.',
    );
  }

  function handleChangeNode() {
    router.back();
  }

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Resumen del pedido',
        }}
      />

      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* RESUMEN PRODUCTOS */}

          <View style={styles.card}>
            <ThemedText style={styles.sectionTitle}>
              Productos
            </ThemedText>

            {productsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator />

                <ThemedText>
                  Cargando productos...
                </ThemedText>
              </View>
            ) : carritoVacio ? (
              <ThemedText style={styles.error}>
                El carrito está vacío.
              </ThemedText>
            ) : faltanProductos ? (
              <ThemedText style={styles.error}>
                No se pudieron cargar todos los productos
                del carrito.
              </ThemedText>
            ) : (
              <>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>
                    Cantidad de unidades
                  </ThemedText>

                  <ThemedText style={styles.value}>
                    {totalItems}
                  </ThemedText>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <ThemedText style={styles.label}>
                    Subtotal
                  </ThemedText>

                  <ThemedText style={styles.value}>
                    {formatoPrecio(subtotalProductos)}
                  </ThemedText>
                </View>
              </>
            )}
          </View>

          {/* RETIRO PERSONAL */}

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>
                Retiro personal
              </ThemedText>

              <IconSymbol
                name="mappin.and.ellipse"
                size={22}
                color="#2E7D32"
              />
            </View>

            {nodesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator />

                <ThemedText>
                  Cargando nodo de retiro...
                </ThemedText>
              </View>
            ) : nodesError ? (
              <ThemedText style={styles.error}>
                No se pudieron cargar los datos del nodo.
              </ThemedText>
            ) : !selectedNode ? (
              <ThemedText style={styles.error}>
                No se encontró el nodo de retiro seleccionado.
                Volvé a elegir un nodo.
              </ThemedText>
            ) : (
              <>
                <ThemedText style={styles.nodeName}>
                  {selectedNode.name}
                </ThemedText>

                {selectedNode.address?.street && (
                  <ThemedText style={styles.nodeAddress}>
                    {selectedNode.address.street}
                    {selectedNode.address.number
                      ? ` ${selectedNode.address.number}`
                      : ''}
                  </ThemedText>
                )}

                {selectedNode.address?.betweenStreets && (
                  <ThemedText style={styles.nodeDetails}>
                    Entre calles:{' '}
                    {selectedNode.address.betweenStreets}
                  </ThemedText>
                )}

                {selectedNode.phone && (
                  <View style={styles.infoRow}>
                    <IconSymbol
                      name="phone.fill"
                      size={16}
                      color="#666666"
                    />

                    <ThemedText style={styles.nodeDetails}>
                      {selectedNode.phone}
                    </ThemedText>
                  </View>
                )}

                {selectedNode.hasFridge && (
                  <View style={styles.infoRow}>
                    <IconSymbol
                      name="snowflake"
                      size={16}
                      color="#1565C0"
                    />

                    <ThemedText style={styles.nodeDetails}>
                      Cuenta con heladera
                    </ThemedText>
                  </View>
                )}

                <Pressable
                  style={styles.changeNodeButton}
                  onPress={handleChangeNode}
                >
                  <ThemedText style={styles.changeNodeText}>
                    Cambiar nodo de retiro
                  </ThemedText>
                </Pressable>
              </>
            )}
          </View>

          {/* TOTAL */}

          <View style={styles.totalCard}>
            <ThemedText style={styles.sectionTitle}>
              Total del pedido
            </ThemedText>

            {productsLoading ? (
              <ThemedText style={styles.totalLoading}>
                Calculando total...
              </ThemedText>
            ) : carritoVacio ? (
              <ThemedText style={styles.error}>
                No hay productos en el carrito.
              </ThemedText>
            ) : faltanProductos ? (
              <ThemedText style={styles.error}>
                No se pudo calcular el total.
              </ThemedText>
            ) : (
              <>
                <ThemedText style={styles.totalPrice}>
                  {formatoPrecio(subtotalProductos)}
                </ThemedText>

                <ThemedText style={styles.totalNote}>
                  Retiro personal sin costo de envío.
                </ThemedText>
              </>
            )}
          </View>
        </ScrollView>

        {/* BOTÓN INFERIOR */}

        <View style={styles.footer}>
          <Pressable
            style={[
              styles.finishButton,
              !puedeTerminarPedido &&
                styles.finishButtonDisabled,
            ]}
            disabled={!puedeTerminarPedido}
            onPress={handleFinishOrder}
          >
            <ThemedText style={styles.finishButtonText}>
              Terminar pedido
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

  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 24,
  },

  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  label: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  nodeName: {
    fontSize: 16,
    fontWeight: '700',
  },

  nodeAddress: {
    fontSize: 14,
  },

  nodeDetails: {
    fontSize: 13,
    color: '#666666',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  changeNodeButton: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 8,
  },

  changeNodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },

  totalCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(46, 125, 50, 0.06)',
    gap: 8,
  },

  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },

  totalLoading: {
    fontSize: 14,
    color: '#666666',
  },

  totalNote: {
    fontSize: 13,
    color: '#666666',
  },

  error: {
    fontSize: 14,
    color: '#C62828',
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  finishButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  finishButtonDisabled: {
    backgroundColor: '#AAAAAA',
  },

  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
