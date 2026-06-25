import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { NewsItem } from '@/hooks/use-news';
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

const noImage = require('@/assets/images/no-image.png');

// Colores de marca de La Justa, fijos (no cambian con el tema).
const ACCENT_ORANGE = '#e07b4a';
const LINK_GREEN = '#2e7d32';

type Props = {
  item: NewsItem;
};

export function NewsCard({ item }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handlePress = () => {
    const url = item.url?.trim();
    if (url) Linking.openURL(url);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.card, { backgroundColor: theme.background, borderColor: theme.icon }]}
    >
      {/* Línea naranja de acento arriba de cada tarjeta, igual que la web */}
      <View style={styles.accent} />

      <View style={styles.row}>
        {/* IMAGEN */}
        <Image
          source={item.image?.value ? { uri: item.image.value } : noImage}
          style={styles.image}
          resizeMode="cover"
        />

        {/* CONTENIDO */}
        <View style={styles.content}>
          <ThemedText style={[styles.title, { color: theme.tint }]} numberOfLines={3}>
            {item.title}
          </ThemedText>

          {!!item.subtitle?.trim() && (
            <ThemedText style={styles.subtitle} numberOfLines={2}>
              {item.subtitle.trim()}
            </ThemedText>
          )}

          {!!item.text?.trim() && (
            <ThemedText
              style={[styles.text, { color: theme.subtext }]}
              numberOfLines={3}
            >
              {item.text.trim()}
            </ThemedText>
          )}

          {!!item.url?.trim() && (
            <ThemedText
              style={[styles.url, { color: LINK_GREEN }]}
              numberOfLines={2}
            >
              {item.url.trim()}
            </ThemedText>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 1,
  },
  accent: {
    height: 4,
    backgroundColor: ACCENT_ORANGE,
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  text: {
    fontSize: 12,
    lineHeight: 17,
  },
  url: {
    fontSize: 11,
    marginTop: 4,
  },
});
