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

const noImage = require('@/assets/images/no-image.png');

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
  stock?: number; // ✅ agregado
};

type Props = {
  products: Product[];
  onSelectProduct: (id: number) => void;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 24;
const GAP = 12;

const ITEM_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

const getProductImage = (images?: ProductImage[]): ImageSourcePropType => {
  const imageUrl = images?.[0]?.value;
  return imageUrl ? { uri: imageUrl } : noImage;
};

const formatUnitInfo = (product: Product) => {
  if (!product.unitQuantity || !product.unit?.code) return null;
  return `${product.unitQuantity} ${product.unit.code}`;
};

export function ProductGrid({ products, onSelectProduct }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.grid}>
      {products.map((item) => {
        const unitInfo = formatUnitInfo(item);
        const outOfStock = (item.stock ?? 0) === 0; // ✅ stock check

        return (
          <Pressable
            key={item.id}
            onPress={() => onSelectProduct(item.id)}
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.icon,
              },
            ]}
          >
            {/* LAZO DE SIN STOCK */}
            {outOfStock && (
              <View style={styles.outOfStockRibbon}>
                <ThemedText style={styles.outOfStockText}>
                  SIN STOCK
                </ThemedText>
              </View>
            )}

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

  //
  outOfStockRibbon: {
    position: 'absolute',
    top: 10,
    right: -35,
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 40,
    transform: [{ rotate: '45deg' }],
    zIndex: 10,
    elevation: 10,
  },

  outOfStockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});