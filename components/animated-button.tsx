import { ThemedText } from '@/components/themed-text';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function AnimatedButton({
  title,
  onPress,
  disabled,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <ThemedText style={styles.text}>
        {title}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'flex-start',
    width: 'auto',
  },
  pressed: {
    opacity: 0.5,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.3,
  },
  text: {
    fontSize: 14,
  },
});