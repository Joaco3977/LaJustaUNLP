import { ReactNode, useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  backgroundColor?: string;
  duration?: number;
};

export function CustomModal({
  visible,
  onClose,
  children,
  backgroundColor = 'rgba(0,0,0,0.5)',
  duration = 200,
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.75,
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 50,
          duration: duration * 0.75,
          useNativeDriver: true,
        }),
      ]).start();
    }

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity,
          backgroundColor,
        },
      ]}
    >
      {/* BACKDROP */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      {/* CONTENT */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateY: translate }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },

  content: {
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
});