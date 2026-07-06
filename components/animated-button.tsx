import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { SFSymbol } from 'expo-symbols';

/* =========================
   Tipos de icono soportados
   ========================= */

type ButtonIcon =
  | {
      type: 'sf';
      name: SFSymbol;
      size?: number;
    }
  | {
      type: 'material';
      name: keyof typeof MaterialIcons.glyphMap;
      size?: number;
    };

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;

  // Flecha volver opcional (solo si no hay icono)
  showBackIcon?: boolean;

  // Icono opcional con prioridad
  icon?: ButtonIcon;
};

export function AnimatedButton({
  title,
  onPress,
  disabled,
  style,
  showBackIcon,
  icon,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.tabIconDefault },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {/* Icono custom (prioridad) */}
      {icon?.type === 'sf' && (
        <IconSymbol
          name={icon.name}
          size={icon.size ?? 20}
          color={colors.buttonText}
        />
      )}

      {icon?.type === 'material' && (
        <MaterialIcons
          name={icon.name}
          size={icon.size ?? 20}
          color={colors.buttonText}
        />
      )}

      {/* Flecha volver (solo si no hay icono) */}
      {showBackIcon && !icon && (
        <IconSymbol
          name="arrow.left"
          size={16}
          color={colors.buttonText}
        />
      )}

      <ThemedText
        style={[
          styles.text,
          { color: colors.buttonText },
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

    alignSelf: 'flex-start',
    width: 'auto',
  },

  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },

  disabled: {
    opacity: 0.4,
  },

  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});