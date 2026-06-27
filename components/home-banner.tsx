import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type Banner = {
  title?: string;
  subtitle?: string;
};

type Props = {
  banner: Banner | null;
};

export function HomeBanner({ banner }: Props) {
  if (!banner) return null;

  return (
    <View style={styles.container}>
      {banner.title && (
        <ThemedText style={styles.title}>
          {banner.title}
        </ThemedText>
      )}

      {banner.subtitle && (
        <ThemedText style={styles.subtitle}>
          {banner.subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});