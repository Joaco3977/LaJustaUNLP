import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

const noImage = require('@/assets/images/no-image.jpg');

type ProductImage = {
  value: string;
};

type Unit = {
  code?: string;
  description?: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  brand?: string;
  unitQuantity?: number;
  unitDescription?: string;
  unit?: Unit;
  images?: ProductImage[];
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 24;
const GAP = 12;

const ITEM_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

type Props = {
  products: Product[];
};

const getProductImage = (
  images?: ProductImage[]
): ImageSourcePropType => {
  const imageUrl = images?.[0]?.value;
  return imageUrl ? { uri: imageUrl } : noImage;
};

const formatUnitInfo = (product: Product) => {
  if (!product.unitQuantity || !product.unit?.code) return null;
  return `${product.unitQuantity} ${product.unit.code}`;
};

export function ProductGrid({ products }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.grid}>
      {products.map((item) => {
        const unitInfo = formatUnitInfo(item);

        return (
          <Pressable
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.icon,
              },
            ]}
          >
            <Image
              source={getProductImage(item.images)}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.content}>
              <ThemedText numberOfLines={2} style={styles.title}>
                {item.title}
              </ThemedText>

              {!!item.brand && (
                <ThemedText numberOfLines={1} style={styles.meta}>
                  {item.brand}
                </ThemedText>
              )}

              {!!item.unitDescription && (
                <ThemedText numberOfLines={1} style={styles.meta}>
                  {item.unitDescription}
                </ThemedText>
              )}

              {!!unitInfo && (
                <ThemedText numberOfLines={1} style={styles.meta}>
                  {unitInfo}
                </ThemedText>
              )}

              <ThemedText style={styles.price}>
                ${item.price}
              </ThemedText>
            </View>
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
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',

    // sombra iOS
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },

    // sombra Android
    elevation: 2,
  },

  image: {
    width: '100%',
    height: ITEM_WIDTH,
  },

  content: {
    padding: 10,
    gap: 2,
  },

  title: {
    fontSize: 12,
    fontWeight: '600',
  },

  meta: {
    fontSize: 11,
    opacity: 0.7,
  },

  price: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
});