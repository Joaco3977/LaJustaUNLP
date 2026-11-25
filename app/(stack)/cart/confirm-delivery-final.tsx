import { useEffect, useMemo, useState } from 'react';

import {
  StyleSheet,
  View,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';

import { Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useDeliveryStore } from '@/stores/delivery.store';
import { useCartStore } from '@/stores/cart.store';
import { useProducts } from '@/hooks/use-products';

/* ---------------- PRECIOS DE PRUEBA ---------------- */

const precioBase = 5000;
const precioKm = 100;

const formatoPrecio = (precio: number) =>
  precio.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function DeliveryFinalScreen() {
  const { loadDelivery } = useDeliveryStore();

  const cart = useCartStore(state => state.cart);
  const loadCart = useCartStore(state => state.loadCart);
  const getTotalItems = useCartStore(
    state => state.getTotalItems
  );

  const productIds = useMemo(
    () => cart.map(item => item.productId),
    [cart]
  );

  const {
    products,
    loading: productsLoading,
  } = useProducts({
    ids: productIds,
  });

  const [distance, setDistance] = useState<number | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- CARGAR CARRITO ---------------- */

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /* ---------------- CALCULAR DISTANCIA ---------------- */

  useEffect(() => {
    let isMounted = true;

    async function calculateDistance() {
      try {
        setLoadingDistance(true);
        setError(null);
        setDistance(null);

        await loadDelivery();

        const savedDelivery = useDeliveryStore.getState();

        const origin = savedDelivery.warehouse.coordinate;
        const destination =
          savedDelivery.deliveryAddress.coordinate;

        if (!destination) {
          throw new Error(
            'No se encontró la ubicación del domicilio.'
          );
        }

        const coordinates =
          `${origin.longitude},${origin.latitude};` +
          `${destination.longitude},${destination.latitude}`;

        const url =
          `https://router.project-osrm.org/route/v1/driving/${coordinates}` +
          '?overview=false';

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        if (
          data.code !== 'Ok' ||
          !data.routes ||
          data.routes.length === 0
        ) {
          throw new Error(
            'No se encontró una ruta entre los puntos.'
          );
        }

        const distanceInKm =
          data.routes[0].distance / 1000;

        if (isMounted) {
          setDistance(distanceInKm);
        }
      } catch (err) {
        console.error('Error calculando recorrido:', err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo calcular la distancia.'
          );
        }
      } finally {
        if (isMounted) {
          setLoadingDistance(false);
        }
      }
    }

    calculateDistance();

    return () => {
      isMounted = false;
    };
  }, [loadDelivery]);

  /* ---------------- SUBTOTAL PRODUCTOS ---------------- */

  const subtotalProductos = useMemo(() => {
    return cart.reduce((total, cartItem) => {
      const product = products?.find(
        item => item.id === cartItem.productId
      );

      if (!product) {
        return total;
      }

      return total + product.price * cartItem.quantity;
    }, 0);
  }, [cart, products]);

  const totalItems = getTotalItems();

  /* ---------------- PRECIO ENVÍO Y TOTAL ---------------- */

  const precioEnvio =
    distance !== null
      ? precioBase + precioKm * distance
      : null;

  const totalPedido =
    precioEnvio !== null
      ? subtotalProductos + precioEnvio
      : null;

  /* ---------------- ESTADOS ---------------- */

  const carritoVacio = cart.length === 0;

  const faltanProductos =
    !productsLoading &&
    cart.some(cartItem =>
      !products?.some(
        product => product.id === cartItem.productId
      )
    );

  const puedeTerminarPedido =
    !carritoVacio &&
    !productsLoading &&
    !loadingDistance &&
    !error &&
    !faltanProductos &&
    precioEnvio !== null;

  /* ---------------- TERMINAR PEDIDO ---------------- */

  function handleFinishOrder() {
    if (!puedeTerminarPedido) {
      return;
    }

    Alert.alert(
      'Confirmar pedido',
      'La pantalla está lista, pero todavía falta conectar el servicio que registra la compra en el servidor.'
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen
        options={{ title: 'Resumen del pedido' }}
      />

      <ThemedView style={styles.container}>
        <View style={styles.content}>
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

          {/* ENVÍO */}

          <View style={styles.card}>
            <ThemedText style={styles.sectionTitle}>
              Envío a domicilio
            </ThemedText>

            {loadingDistance ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator />

                <ThemedText>
                  Calculando recorrido...
                </ThemedText>
              </View>
            ) : error ? (
              <>
                <ThemedText style={styles.error}>
                  {error}
                </ThemedText>

                <Pressable
                  style={styles.retryButton}
                  onPress={() => {
                    setDistance(null);
                    setError(null);
                    setLoadingDistance(true);

                    // El efecto de cálculo se vuelve a
                    // ejecutar al cambiar la ubicación.
                    // Para reintentar manualmente, se
                    // puede extraer calculateDistance.
                  }}
                >
                  <ThemedText style={styles.retryText}>
                    Revisar ubicación
                  </ThemedText>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.row}>
                  <ThemedText style={styles.label}>
                    Distancia
                  </ThemedText>

                  <ThemedText style={styles.value}>
                    {distance?.toFixed(2)} km
                  </ThemedText>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <ThemedText style={styles.label}>
                    Costo de envío
                  </ThemedText>

                  <ThemedText style={styles.value}>
                    {precioEnvio !== null
                      ? formatoPrecio(precioEnvio)
                      : 'No disponible'}
                  </ThemedText>
                </View>
              </>
            )}
          </View>

          {/* TOTAL */}

          <View style={styles.totalCard}>
            <ThemedText style={styles.sectionTitle}>
              Total del pedido
            </ThemedText>

            {loadingDistance || productsLoading ? (
              <ThemedText style={styles.totalLoading}>
                Calculando total...
              </ThemedText>
            ) : error || faltanProductos ? (
              <ThemedText style={styles.error}>
                No se pudo calcular el total.
              </ThemedText>
            ) : (
              <ThemedText style={styles.totalPrice}>
                {totalPedido !== null
                  ? formatoPrecio(totalPedido)
                  : 'No disponible'}
              </ThemedText>
            )}
          </View>
        </View>

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

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 16,
    gap: 14,
  },

  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    gap: 12,
  },

  totalCard: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    gap: 10,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  label: {
    fontSize: 15,
    color: '#555555',
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },

  divider: {
    height: 1,
    backgroundColor: '#D8D8D8',
  },

  totalPrice: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  totalLoading: {
    fontSize: 16,
    color: '#555555',
  },

  loadingContainer: {
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },

  error: {
    color: '#D32F2F',
    fontSize: 14,
  },

  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },

  retryText: {
    color: '#333333',
    fontWeight: '600',
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  finishButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  finishButtonDisabled: {
    backgroundColor: '#A5A5A5',
  },

  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});