import { ThemedText } from '@/components/themed-text';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';

type Product = {
  id: number;
  title: string;
  price: number;
  images?: { value: string }[];
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 24;
const GAP = 12;

const ITEM_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  return (
    <View style={styles.grid}>
      {products.map((item) => {
        const image = item.images?.[0]?.value;

        return (
          <Pressable key={item.id} style={styles.card}>
            <Image
              source={{ uri: image }}
              style={styles.image}
            />

            <ThemedText
              numberOfLines={2}
              style={styles.title}
            >
              {item.title}
            </ThemedText>

            <ThemedText style={styles.price}>
              ${item.price}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  card: {
    width: ITEM_WIDTH,
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 12,
  },
  title: {
    fontSize: 12,
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
});