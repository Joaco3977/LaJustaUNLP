import {
    Modal,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  visible: boolean;
  onClose: () => void;
  onGoToCart?: () => void;
};

export function AfterBuyModal({
  visible,
  onClose,
  onGoToCart,
}: Props) {
  const router = useRouter();

  const detailBackground = useThemeColor({}, 'detailBackground');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const textColor = useThemeColor({}, 'text');
  const buttonPrimary = useThemeColor({}, 'tabIconDefault');
  const buttonSecondary = useThemeColor({}, 'title');
  const buttonText = useThemeColor({}, 'buttonText');

  const handleContinue = () => {
    onClose();
  };

  const handleGoCart = () => {
    onClose();

    if (onGoToCart) {
      onGoToCart();
      return;
    }

    router.push('/cart');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ThemedView
          style={[
            styles.modal,
            {
              backgroundColor: detailBackground,
              borderColor,
            },
          ]}
        >
          <ThemedText
            style={[styles.title, { color: textColor }]}
          >
            Se han agregado los productos al carrito
          </ThemedText>

          <View style={styles.actions}>
            <Pressable
              onPress={handleContinue}
              style={[
                styles.button,
                { backgroundColor: buttonSecondary },
              ]}
            >
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: buttonText },
                ]}
              >
                Seguir comprando
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={handleGoCart}
              style={[
                styles.button,
                { backgroundColor: buttonPrimary },
              ]}
            >
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: buttonText },
                ]}
              >
                Ir al carrito
              </ThemedText>
            </Pressable>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: '85%',
    padding: 20,
    borderRadius: 18,
    borderWidth: 2,
    gap: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },

  actions: {
    marginTop: 8,
    gap: 12,
  },

  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});