import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  scrollY: number;
  height?: number;
  fadeRange?: number;
  color: string;
};

export function ScrollFadeOverlay({
  scrollY,
  height = 28,
  fadeRange = 120,
  color,
}: Props) {
  // 0 → 1 suave (sin switch)
  const topOpacity = Math.max(0, Math.min(scrollY / fadeRange, 1));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[color, 'transparent']}
        style={[styles.top, { height, opacity: topOpacity }]}
      />

      <LinearGradient
        colors={['transparent', color]}
        style={[styles.bottom, { height }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});