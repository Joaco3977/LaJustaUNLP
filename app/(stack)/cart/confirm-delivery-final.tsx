import { useEffect, useState } from 'react';

import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

import { Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useDeliveryStore } from '@/stores/delivery.store';

/* ---------------- PRECIOS DE PRUEBA ---------------- */

const precioBase = 1000;
const precioKm = 200;

export default function DeliveryFinalScreen() {
  const {
    loadDelivery,
  } = useDeliveryStore();

  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- CALCULAR DISTANCIA ---------------- */

  useEffect(() => {
    let isMounted = true;

    async function calculateDistance() {
      try {
        setLoading(true);
        setError(null);

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
          throw new Error(
            `Error HTTP ${response.status}`
          );
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
        console.error(
          'Error calculando recorrido:',
          err
        );

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudo calcular la distancia.'
          );
        }

      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    calculateDistance();

    return () => {
      isMounted = false;
    };
  }, [loadDelivery]);

  /* ---------------- CALCULAR PRECIO ---------------- */

  const precioTotal =
    distance !== null
      ? precioBase + precioKm * distance
      : null;

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen
        options={{ title: 'Confirmar envío' }}
      />

      <ThemedView style={styles.container}>

        {/* DISTANCIA */}

        <View style={styles.distanceContainer}>

          <ThemedText style={styles.label}>
            Distancia entre almacén y domicilio
          </ThemedText>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />

              <ThemedText>
                Calculando recorrido...
              </ThemedText>
            </View>
          ) : error ? (
            <ThemedText style={styles.error}>
              {error}
            </ThemedText>
          ) : (
            <ThemedText style={styles.distance}>
              {distance?.toFixed(2)} km
            </ThemedText>
          )}

        </View>

        {/* PRECIO TOTAL */}

        <View style={styles.priceContainer}>

          <ThemedText style={styles.label}>
            Precio total del envío
          </ThemedText>

          {loading ? (
            <ThemedText>
              Calculando precio...
            </ThemedText>
          ) : error ? (
            <ThemedText style={styles.error}>
              No disponible
            </ThemedText>
          ) : (
            <>
              <ThemedText style={styles.price}>
                ${precioTotal?.toLocaleString('es-AR', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </ThemedText>

              <ThemedText style={styles.priceDetails}>
                Precio base: ${precioBase.toLocaleString('es-AR')}
              </ThemedText>

              <ThemedText style={styles.priceDetails}>
                Precio por km: ${precioKm.toLocaleString('es-AR')}
              </ThemedText>
            </>
          )}

        </View>

      </ThemedView>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },

  distanceContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    gap: 12,
  },

  priceContainer: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    gap: 10,
  },

  label: {
    fontSize: 16,
    color: '#333333',
  },

  distance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  priceDetails: {
    fontSize: 14,
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
});