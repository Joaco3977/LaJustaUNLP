import { useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const noImage = require('@/assets/images/no-image.png');

type Props = {
  images: string[]; // URLs de las imágenes
  height?: number;
};

export function ImageCarousel({ images, height = 180 }: Props) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  // Sin imágenes o con una sola: no hace falta carrusel.
  if (images.length === 0) {
    return (
      <Image source={noImage} style={[styles.single, { height }]} resizeMode="cover" />
    );
  }

  if (images.length === 1) {
    return (
      <Image source={{ uri: images[0] }} style={[styles.single, { height }]} resizeMode="cover" />
    );
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width === 0) return;
    const current = Math.round(e.nativeEvent.contentOffset.x / width);
    if (current !== index) setIndex(current);
  };

  return (
    <View
      style={{ height }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((uri, i) => (
          <Image
            key={i}
            source={{ uri }}
            style={{ width, height }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* PUNTITOS indicadores */}
      <View style={styles.dots}>
        {images.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  single: {
    width: '100%',
  },
  dots: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});
