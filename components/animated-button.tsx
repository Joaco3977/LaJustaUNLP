import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;

  // opcional: si querés botón tipo "← volver"
  showBackIcon?: boolean;
};

export function AnimatedButton({
  title,
  onPress,
  disabled,
  style,
  showBackIcon,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          borderColor: colors.tabIconDefault,
          backgroundColor: colors.card,
        },
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      {showBackIcon && (
        <IconSymbol
          name="arrow.left"
          size={16}
          color={colors.title}
        />
      )}

      <ThemedText
        style={[
          styles.text,
          { color: colors.title },
        ]}
      >
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,

    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 2,

    alignSelf: 'flex-start',
    width: 'auto',
  },

  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.3,
  },

  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});