import { useEffect, useState } from 'react';

import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  Alert,
  Keyboard,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';

import {
  Map,
  Camera,
  ViewAnnotation,
} from '@maplibre/maplibre-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useDeliveryStore } from '@/stores/delivery.store';

/* ---------------- CONFIGURACIÓN ---------------- */

// Estilo de mapa OpenFreeMap (sin API key).
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

// Ciudad fija.
const CITY = 'La Plata, Buenos Aires, Argentina';

export default function DeliveryScreen() {
  const router = useRouter();

  /* ---------------- STORE ---------------- */

  const {
    warehouse,
    deliveryAddress,
    hasLocatedDelivery,
    loadDelivery,
    setDeliveryAddress,
    setDeliveryCoordinate,
  } = useDeliveryStore();

  const {
    street,
    streetNumber,
    floor,
    apartment,
    coordinate,
  } = deliveryAddress;

  // Si todavía no existe una coordenada guardada,
  // el marcador del domicilio comienza en el almacén.
  const deliveryCoordinate = coordinate ?? warehouse.coordinate;

  /* ---------------- MAPA ---------------- */

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    warehouse.coordinate.longitude,
    warehouse.coordinate.latitude,
  ]);

  const [mapZoom, setMapZoom] = useState(14);

  /* ---------------- RECUPERAR DIRECCIÓN ---------------- */

  useEffect(() => {
    let isMounted = true;

    async function initializeDelivery() {
      await loadDelivery();

      if (!isMounted) {
        return;
      }

      // Recuperar el estado actualizado del store.
      const savedDelivery = useDeliveryStore.getState();

      const savedCoordinate =
        savedDelivery.deliveryAddress.coordinate;

      if (savedCoordinate) {
        // Si existe una dirección guardada,
        // centrar el mapa en esa ubicación.
        setMapCenter([
          savedCoordinate.longitude,
          savedCoordinate.latitude,
        ]);

        setMapZoom(17);
      } else {
        // Si es la primera compra, mostrar el almacén.
        setMapCenter([
          warehouse.coordinate.longitude,
          warehouse.coordinate.latitude,
        ]);

        setMapZoom(14);
      }
    }

    initializeDelivery();

    return () => {
      isMounted = false;
    };
  }, [loadDelivery, warehouse.coordinate]);

  /* ---------------- BUSCAR DIRECCIÓN ---------------- */

  async function searchAddress() {
    Keyboard.dismiss();

    if (!street.trim() || !streetNumber.trim()) {
      Alert.alert(
        'Dirección incompleta',
        'Ingresá la calle y el número de tu domicilio.'
      );

      return;
    }

    try {
      const address = `${street.trim()} ${streetNumber.trim()}, ${CITY}`;

      const query = encodeURIComponent(address);

      const url =
        `https://photon.komoot.io/api/?q=${query}` +
        `&limit=5` +
        `&lat=${warehouse.coordinate.latitude}` +
        `&lon=${warehouse.coordinate.longitude}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent':
            'LaJustaApp/1.0 (https://www.lajustaunlp.com.ar)',
        },
      });

      console.log('URL:', url);
      console.log('HTTP Status:', response.status);
      console.log('Headers:', response.headers);

      const responseText = await response.text();

      console.log('Respuesta del servidor:', responseText);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`
        );
      }

      const data = JSON.parse(responseText);

      console.log('Resultados Photon:', data.features);

      if (!data.features || data.features.length === 0) {
        Alert.alert(
          'Dirección no encontrada',
          'No encontramos esa dirección en La Plata. Revisá la calle y el número.'
        );

        return;
      }

      // Photon devuelve las coordenadas como:
      // [longitud, latitud].
      const [longitude, latitude] =
        data.features[0].geometry.coordinates;

      const newCoordinate = {
        latitude: Number(latitude),
        longitude: Number(longitude),
      };

      if (
        !Number.isFinite(newCoordinate.latitude) ||
        !Number.isFinite(newCoordinate.longitude)
      ) {
        throw new Error('Las coordenadas recibidas no son válidas.');
      }

      // Guardar coordenadas en el store.
      // Esta acción también habilita hasLocatedDelivery.
      setDeliveryCoordinate(newCoordinate);

      // Centrar el mapa en el domicilio.
      setMapCenter([
        newCoordinate.longitude,
        newCoordinate.latitude,
      ]);

      setMapZoom(17);
    } catch (error) {
      console.error('Error buscando dirección:', error);

      Alert.alert(
        'Error',
        'No se pudo buscar la dirección. Intentá nuevamente.'
      );
    }
  }

  /* ---------------- MOVER MARCADOR ---------------- */

  function handleMarkerDragEnd(event: any) {
    const coordinates = event.nativeEvent?.lngLat;

    if (!coordinates || coordinates.length < 2) {
      return;
    }

    const [longitude, latitude] = coordinates;

    const newCoordinate = {
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    if (
      !Number.isFinite(newCoordinate.latitude) ||
      !Number.isFinite(newCoordinate.longitude)
    ) {
      return;
    }

    setDeliveryCoordinate(newCoordinate);
  }

  /* ---------------- TOCAR MAPA ---------------- */

  function handleMapPress(event: any) {
    const coordinates = event.nativeEvent?.lngLat;

    if (!coordinates || coordinates.length < 2) {
      return;
    }

    const [longitude, latitude] = coordinates;

    const newCoordinate = {
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    if (
      !Number.isFinite(newCoordinate.latitude) ||
      !Number.isFinite(newCoordinate.longitude)
    ) {
      return;
    }

    setDeliveryCoordinate(newCoordinate);
  }

  /* ---------------- CONTINUAR ---------------- */

  const canContinue =
    hasLocatedDelivery &&
    street.trim().length > 0 &&
    streetNumber.trim().length > 0 &&
    coordinate !== null;

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    console.log('Datos de entrega:', {
      ...deliveryAddress,
      street: street.trim(),
      streetNumber: streetNumber.trim(),
      floor: floor.trim(),
      apartment: apartment.trim(),
      city: 'La Plata',
      province: 'Buenos Aires',
      latitude: coordinate!.latitude,
      longitude: coordinate!.longitude,
    });

    router.push('/cart/delivery/confirm-delivery-final');
  }

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen
        options={{ title: 'Dirección de entrega' }}
      />

      <ThemedView style={styles.container}>

        {/* DESCRIPCIÓN */}

        <ThemedText style={styles.description}>
          Ingresá tu domicilio y ubicá el punto exacto de entrega en el mapa.
        </ThemedText>

        {/* FORMULARIO */}

        <View style={styles.addressContainer}>

          <TextInput
            style={styles.input}
            placeholder="Calle"
            value={street}
            onChangeText={value =>
              setDeliveryAddress({ street: value })
            }
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            placeholder="Número"
            value={streetNumber}
            onChangeText={value =>
              setDeliveryAddress({ streetNumber: value })
            }
            keyboardType="number-pad"
          />

          <View style={styles.optionalFields}>

            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Piso (opcional)"
              value={floor}
              onChangeText={value =>
                setDeliveryAddress({ floor: value })
              }
            />

            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Departamento (opcional)"
              value={apartment}
              onChangeText={value =>
                setDeliveryAddress({ apartment: value })
              }
              autoCapitalize="characters"
            />

          </View>

          {/* BUSCAR */}

          <Pressable
            style={[
              styles.searchButton,
              (!street.trim() || !streetNumber.trim()) &&
                styles.searchButtonDisabled,
            ]}
            onPress={searchAddress}
            disabled={!street.trim() || !streetNumber.trim()}
          >
            <Text style={styles.searchButtonText}>
              Buscar en el mapa
            </Text>
          </Pressable>

        </View>

        {/* MAPA */}

        <View style={styles.mapSection}>

          <View style={styles.mapContainer}>

            <Map
              style={styles.map}
              mapStyle={MAP_STYLE}
              onPress={handleMapPress}
            >

              <Camera
                center={mapCenter}
                zoom={mapZoom}
              />

              {/* ALMACÉN FIJO */}

              <ViewAnnotation
                lngLat={[
                  warehouse.coordinate.longitude,
                  warehouse.coordinate.latitude,
                ]}
                anchor="bottom"
              >
                <View style={styles.warehouseMarker}>
                  <Text style={styles.markerText}>
                    A
                  </Text>
                </View>
              </ViewAnnotation>

              {/* DOMICILIO */}

              <ViewAnnotation
                lngLat={[
                  deliveryCoordinate.longitude,
                  deliveryCoordinate.latitude,
                ]}
                anchor="bottom"
                draggable
                onDragEnd={handleMarkerDragEnd}
              >
                <View style={styles.deliveryMarker}>
                  <Text style={styles.markerText}>
                    D
                  </Text>
                </View>
              </ViewAnnotation>

            </Map>

          </View>

        </View>

        {/* BOTÓN CONTINUAR */}

        <Pressable
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text style={styles.continueButtonText}>
            Continuar
          </Text>
        </Pressable>

      </ThemedView>
    </>
  );
}

/* ---------------- ESTILOS ---------------- */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 14,
  },

  description: {
    marginBottom: 6,
  },

  addressContainer: {
    flex: 3,
    gap: 6,
    minHeight: 0,
  },

  input: {
    flex: 1,
    minHeight: 0,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 14,
    color: '#222222',
    backgroundColor: '#FFFFFF',
  },

  optionalFields: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'row',
    gap: 8,
  },

  searchButton: {
    flex: 0.7,
    minHeight: 0,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  mapSection: {
    flex: 6,
    minHeight: 0,
    marginTop: 8,
    marginBottom: 8,
  },

  continueButton: {
    flex: 0.7,
    minHeight: 0,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchButtonDisabled: {
    backgroundColor: '#383838',
    opacity: 0.5,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  mapContainer: {
    flex: 1,
    minHeight: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },

  map: {
    flex: 1,
  },

  warehouseMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1976D2', // Azul
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  deliveryMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D32F2F', // Rojo
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  markerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  continueButtonDisabled: {
    backgroundColor: '#AAAAAA',
  },

  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

});
