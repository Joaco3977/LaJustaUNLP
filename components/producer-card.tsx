import { ImageCarousel } from '@/components/image-carousel';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { Producer } from '@/hooks/use-producers';
import {
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

type Props = {
  producer: Producer;
  onPress?: () => void;
};

// Color de marca para las etiquetas (verde La Justa).
const TAG_GREEN = '#2e7d32';

export function ProducerCard({ producer, onPress }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const imageUrls = producer.images?.map((img) => img.value) ?? [];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.detailBackground },
      ]}
    >
      <ImageCarousel images={imageUrls} height={180} />

      <View style={styles.content}>
        <ThemedText style={styles.name}>{producer.name}</ThemedText>

        {!!producer.origin && (
          <ThemedText style={[styles.origin, { color: theme.tint }]}>
            {producer.origin}
          </ThemedText>
        )}

        {!!producer.description && (
          <ThemedText style={[styles.description, { color: theme.subtext }]}>
            {producer.description.trim()}
          </ThemedText>
        )}

        {!!producer.tags?.length && (
          <View style={styles.tags}>
            {producer.tags.map((tag) => (
              <View key={tag.id} style={[styles.tag, { backgroundColor: TAG_GREEN }]}>
                <ThemedText style={styles.tagText}>{tag.description}</ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    // Sombra igual que la card de productos (product-card.tsx)
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  content: {
    padding: 14,
    gap: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  origin: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
