
import {
  Stack,
  useRouter,
} from 'expo-router';

import { useEffect, useState } from 'react';

import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import { useThemeColor } from '@/hooks/use-theme-color';
import { useCartStore } from '@/stores/cart.store';

type DeliveryOption = 'delivery' | 'pickup';

export default function CartConfirmPickupNodeScreen() {
  const router = useRouter();

  const [selectedOption, setSelectedOption] =
    useState<DeliveryOption | null>(null);

  const cart = useCartStore(state => state.cart);
  const loadCart = useCartStore(state => state.loadCart);

  const background = useThemeColor({}, 'background');
  const tab = useThemeColor({}, 'tab');
  const white = useThemeColor({}, 'buttonText');

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  /*
   * SI EL CARRITO QUEDÓ VACÍO,
   * VOLVEMOS AL CARRITO.
   */
  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/cart');
    }
  }, [cart, router]);

  /*
   * CONTINUAR SEGÚN LA OPCIÓN SELECCIONADA
   */
  const handleContinue = () => {
    if (selectedOption === 'delivery') {
      router.push('/cart/delivery/confirm-delivery');
      return;
    }

    if (selectedOption === 'pickup') {
      // NODOS DE RETIRO EN LISTA
      // router.push('/cart/pickup/confirm-pickup-node-list');

      // NODOS DE RETIRO EN MAPA
      router.push('/cart/pickup/confirm-pickup-node-map');
    }
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
        <View style={styles.content}>

          {/* DELIVERY */}
          <View style={styles.section}>
            <ThemedText type="subtitle">
              ¿Preferís recibir tu pedido?
            </ThemedText>

            <Pressable
              style={[
                styles.optionCard,
                selectedOption === 'delivery' &&
                  styles.selectedOptionCard,
              ]}
              onPress={() => setSelectedOption('delivery')}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionTitleContainer}>
                  <IconSymbol
                    name="truck.box.fill"
                    size={26}
                    color="#2E7D32"
                  />

                  <ThemedText style={styles.optionTitle}>
                    Enviar a domicilio
                  </ThemedText>
                </View>

                {selectedOption === 'delivery' && (
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={24}
                    color="#2E7D32"
                  />
                )}
              </View>

              <ThemedText style={styles.description}>
                Recibí tu compra directamente en tu domicilio.
              </ThemedText>
            </Pressable>
          </View>

          {/* SEPARADOR */}
          <View style={styles.sectionSeparator} />

          {/* RETIRO PERSONAL */}
          <View style={styles.section}>
            <ThemedText type="subtitle">
              ¿Preferís retirar tu pedido personalmente?
            </ThemedText>

            <Pressable
              style={[
                styles.optionCard,
                selectedOption === 'pickup' &&
                  styles.selectedOptionCard,
              ]}
              onPress={() => setSelectedOption('pickup')}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionTitleContainer}>
                  <IconSymbol
                    name="mappin.and.ellipse"
                    size={26}
                    color="#2E7D32"
                  />

                  <ThemedText style={styles.optionTitle}>
                    Retirar en un nodo
                  </ThemedText>
                </View>

                {selectedOption === 'pickup' && (
                  <IconSymbol
                    name="checkmark.circle.fill"
                    size={24}
                    color="#2E7D32"
                  />
                )}
              </View>

              <ThemedText style={styles.description}>
                Elegí el punto de retiro que te resulte más cómodo.
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* BOTÓN CONTINUAR */}
        <Pressable
          style={[
            styles.continueButton,
            selectedOption === null && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedOption === null}
        >
          <ThemedText style={styles.continueButtonText}>
            Continuar
          </ThemedText>
        </Pressable>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  content: {
    padding: 16,
    gap: 24,
  },

  section: {
    gap: 12,
  },

  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },

  selectedOptionCard: {
    borderColor: '#2E7D32',
    borderWidth: 2,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
  },

  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },

  sectionSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },

  footer: {
    paddingBottom: 32,
  },

  continueButton: {
    height: 48,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
