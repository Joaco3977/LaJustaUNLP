import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';

type Banner = {
  title?: string;
  subtitle?: string;
};

type Props = {
  banner: Banner | null;
};

export function HomeBanner({ banner }: Props) {
  const backgroundColor = useThemeColor({}, 'bannerBackground');

  if (!banner) return null;

  return (
    <View style={[styles.card, { backgroundColor }]}>
      {banner.title && (
        <ThemedText type="title">
          {banner.title}
        </ThemedText>
      )}

      {banner.subtitle && (
        <ThemedText type="subtitle">
          {banner.subtitle}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    elevation: 3, // Android
  },
});