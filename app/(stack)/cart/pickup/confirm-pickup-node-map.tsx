import { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';

import {
  Map,
  Camera,
  Marker,
} from '@maplibre/maplibre-react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useNodes } from '@/hooks/use-nodes';
import { useProducts } from '@/hooks/use-products';

import { useCartStore } from '@/stores/cart.store';

const MAP_STYLE =
  'https://tiles.openfreemap.org/styles/liberty';

const INITIAL_CENTER: [number, number] = [
  -57.9544,
  -34.9214,
];

export default function PickupNodeScreen() {
  const router = useRouter();

  const [selectedNodeId, setSelectedNodeId] =
    useState<number | null>(null);

  /* ---------------- Cart ---------------- */

  const {
    cart,
    loadCart,
  } = useCartStore();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /* ---------------- Products ---------------- */

  const productIds = useMemo(
    () => cart.map((item) => item.productId),
    [cart],
  );

  const productsOptions = useMemo(
    () => ({
      ids: productIds,
    }),
    [productIds],
  );

  const {
    products,
    loading: productsLoading,
  } = useProducts(productsOptions);

  const needsCold = products.some(
    (product) => product.needCold === true,
  );

  /* ---------------- Nodes ---------------- */

  const {
    nodes,
    loading: nodesLoading,
    error: nodesError,
  } = useNodes();

  const loading = nodesLoading || productsLoading;

  const availableNodes = useMemo(() => {
    return nodes.filter((node) => {
      if (node.deletedAt != null) {
        return false;
      }

      const nodeName = node.name
        .trim()
        .toUpperCase();

      if (
        nodeName.startsWith('NO ELEGIR') ||
        nodeName.startsWith('DELIVERY')
      ) {
        return false;
      }

      if (needsCold && !node.hasFridge) {
        return false;
      }

      const latitude = Number(
        node.address?.latitude,
      );

      const longitude = Number(
        node.address?.longitude,
      );

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return false;
      }

      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return false;
      }

      return true;
    });
  }, [nodes, needsCold]);

  /* ---------------- Selected node ---------------- */

  const selectedNode = useMemo(
    () =>
      availableNodes.find(
        (node) => node.id === selectedNodeId,
      ) ?? null,
    [availableNodes, selectedNodeId],
  );

  /* ---------------- Continue ---------------- */

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

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Elegir nodo de retiro',
          }}
        />

        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#2E7D32"
          />

          <ThemedText>
            Cargando nodos de retiro...
          </ThemedText>
        </ThemedView>
      </>
    );
  }

  /* ---------------- Error ---------------- */

  if (nodesError) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Elegir nodo de retiro',
          }}
        />

        <ThemedView style={styles.messageContainer}>
          <ThemedText style={styles.errorText}>
            No se pudieron cargar los nodos de retiro.
          </ThemedText>
        </ThemedView>
      </>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Elegir nodo de retiro',
        }}
      />

      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText style={styles.description}>
            Seleccioná en el mapa el lugar donde
            querés retirar tu compra.
          </ThemedText>

          {needsCold && (
            <View style={styles.coldWarning}>
              <IconSymbol
                name="snowflake"
                size={20}
                color="#1565C0"
              />

              <ThemedText style={styles.coldWarningText}>
                Tu compra contiene productos que
                necesitan frío. Solo se muestran
                nodos que cuentan con heladera.
              </ThemedText>
            </View>
          )}

          <View style={styles.mapContainer}>
            <Map
              mapStyle={MAP_STYLE}
              style={styles.map}
            >
              <Camera
                center={INITIAL_CENTER}
                zoom={12}
              />

              {availableNodes.map((node) => {
                const latitude = Number(
                  node.address.latitude,
                );

                const longitude = Number(
                  node.address.longitude,
                );

                const selected =
                  selectedNodeId === node.id;

                return (
                  <Marker
                    key={node.id.toString()}
                    id={node.id.toString()}
                    lngLat={[
                      longitude,
                      latitude,
                    ]}
                    anchor="bottom"
                    onPress={() => {
                      setSelectedNodeId(node.id);
                    }}
                  >
                    <View
                      style={[
                        styles.marker,
                        selected &&
                          styles.selectedMarker,
                      ]}
                    >
                      <IconSymbol
                        name="mappin.and.ellipse"
                        size={selected ? 28 : 24}
                        color="#FFFFFF"
                      />
                    </View>
                  </Marker>
                );
              })}
            </Map>
          </View>

          {/* ---------------- Node information ---------------- */}

          <View style={styles.nodeInfoContainer}>
            {selectedNode ? (
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
              </>
            ) : (
              <ThemedText style={styles.selectNodeText}>
                Tocá un marcador del mapa para ver
                la información del nodo.
              </ThemedText>
            )}
          </View>

          {availableNodes.length === 0 && (
            <ThemedText style={styles.errorText}>
              No hay nodos disponibles para esta compra.
            </ThemedText>
          )}
        </View>

        {/* ---------------- Continue button ---------------- */}

        <View style={styles.footer}>
          <View
            style={[
              styles.continueButton,
              selectedNodeId === null &&
                styles.disabledButton,
            ]}
            pointerEvents={
              selectedNodeId === null
                ? 'none'
                : 'auto'
            }
          >
            <ThemedText
              style={styles.continueButtonText}
              onPress={handleContinue}
            >
              Continuar
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  content: {
    flex: 1,
    padding: 16,
    gap: 12,
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
  },

  coldWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(21, 101, 192, 0.08)',
  },

  coldWarningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#1565C0',
  },

  mapContainer: {
    flex: 1,
    minHeight: 220,
    borderRadius: 12,
    overflow: 'hidden',
  },

  map: {
    flex: 1,
  },

  marker: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 5,
  },

  selectedMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1B5E20',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  nodeInfoContainer: {
    minHeight: 110,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
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

  selectNodeText: {
    fontSize: 14,
    color: '#666666',
  },

  errorText: {
    fontSize: 14,
    color: '#C62828',
    textAlign: 'center',
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  continueButton: {
    height: 50,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    backgroundColor: '#AAAAAA',
  },

  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});