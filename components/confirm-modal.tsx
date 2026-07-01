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

  confirmText?: string;
  cancelText?: string;

  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  visible,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}: Props) {
  const detailBackground = useThemeColor(
    {},
    'detailBackground'
  );
  const borderColor = useThemeColor(
    {},
    'tabIconDefault'
  );
  const textColor = useThemeColor({}, 'text');
  const cancelButton = useThemeColor(
    {},
    'cancelButton'
  );
  const confirmButton = useThemeColor(
    {},
    'confirmButton'
  );
  const buttonText = useThemeColor(
    {},
    'buttonText'
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* OVERLAY OSCURO */}
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
              style={[
                styles.description,
                { color: textColor },
              ]}
            >
              {description}
            </ThemedText>
          )}

          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              style={[
                styles.button,
                { backgroundColor: cancelButton },
              ]}
            >
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: buttonText },
                ]}
              >
                {cancelText}
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={[
                styles.button,
                { backgroundColor: confirmButton },
              ]}
            >
              <ThemedText
                style={[
                  styles.buttonText,
                  { color: buttonText },
                ]}
              >
                {confirmText}
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 90,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});