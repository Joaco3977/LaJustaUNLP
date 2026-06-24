import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  scrollY: number;
  height?: number;
  threshold?: number;
  color: string;
};

export function ScrollFadeOverlay({
  scrollY,
  height = 24,
  threshold = 80,
  color,
}: Props) {
  const clamped = Math.min(Math.max(scrollY / 0.01, 0), threshold);
  const topOpacity = 1 - Math.pow(1 - clamped / threshold, 3);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* TOP FADE */}
      <LinearGradient
        colors={[color, 'transparent']}
        style={[styles.top, { height, opacity: topOpacity }]}
      />

      {/* BOTTOM FADE (siempre visible) */}
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