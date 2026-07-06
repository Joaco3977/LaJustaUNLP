import {
    Modal,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  visible: boolean;

  title: string;
  description?: string;

  buttonText?: string;
  onClose: () => void;
};

export function InfoModal({
  visible,
  title,
  description,
  buttonText = 'Entendido',
  onClose,
}: Props) {
  const detailBackground = useThemeColor({}, 'detailBackground');
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const textColor = useThemeColor({}, 'text');
  const buttonColor = useThemeColor({}, 'confirmButton');
  const buttonTextColor = useThemeColor({}, 'buttonText');

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
            {title}
          </ThemedText>

          {!!description && (
            <ThemedText
              style={[styles.description, { color: textColor }]}
            >
              {description}
            </ThemedText>
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={[
                styles.button,
                { backgroundColor: buttonColor },
              ]}
            >
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: buttonTextColor },
                ]}
              >
                {buttonText}
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
    gap: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
  },

  actions: {
    marginTop: 12,
    alignItems: 'flex-end',
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});