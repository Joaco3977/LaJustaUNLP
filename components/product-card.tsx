import { ThemedText } from '@/components/themed-text';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

import { Colors } from '@/constants/theme';

const noImage = require('@/assets/images/no-image.png');

type ProductImage = {
  value: string;
};

type Unit = {
  code?: string;
  description?: string;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  brand?: string;
  unitQuantity?: number;
  unitDescription?: string;
  unit?: Unit;
  images?: ProductImage[];
  stock?: number;
};

type Props = {
  product: Product;
  width: number;
  onPress: (id: number) => void;
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

export function ProductCard({ product, width, onPress }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const unitInfo = formatUnitInfo(product);
  const outOfStock = (product.stock ?? 0) === 0;

  return (
    <Pressable
      onPress={() => onPress(product.id)}
      style={[
        styles.card,
        {
          width,
          backgroundColor: theme.card,
        },
      ]}
    >
      {outOfStock && (
        <View
          style={[
            styles.outOfStockRibbon,
            { backgroundColor: theme.outOfStockRibon },
          ]}
        >
          <ThemedText
            type="defaultSemiBold"
            color="outOfStockRibonText"
            style={styles.outOfStockText}
          >
            SIN STOCK
          </ThemedText>
        </View>
      )}

      <Image
        source={getProductImage(product.images)}
        style={[styles.image, { height: width }]}
      />

      <View style={styles.content}>
        <ThemedText type="cardTitle" color="title">
          {product.title}
        </ThemedText>

        {!!product.brand && (
          <ThemedText
            type="cardInfo"
            color="brandText"
            style={styles.meta}
          >
            {product.brand}
          </ThemedText>
        )}

        {!!product.unitDescription && (
          <ThemedText
            color="unitDescriptionText"
            type="unitDescriptionText"
            style={styles.meta}
          >
            {product.unitDescription}
          </ThemedText>
        )}
      </View>

      <View style={styles.footer}>
        <View
          style={[
            styles.footerSection,
            { backgroundColor: theme.unitBackground || '#e0e0e0' },
          ]}
        >
          {!!unitInfo && (
            <ThemedText type="unitDescriptionText"
              numberOfLines={1}
              color="unitDescriptionText"
            >
              {unitInfo}
            </ThemedText>
          )}
        </View>

        <View
          style={[
            styles.footerSection,
            { backgroundColor: theme.priceBackground },
          ]}
        >
          <ThemedText
            type="unitDescriptionText"
            color="text"
          >
            ${product.price}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.20,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },

  image: {
    width: '100%',
  },

  content: {
    padding: 6,
    gap: 2,
    flex: 1,
  },

  meta: {
    fontSize: 11,
    opacity: 0.7,
  },

  footer: {
    height: 36,
    flexDirection: 'row',
    overflow: 'hidden',
  },

  footerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  outOfStockRibbon: {
    position: 'absolute',
    top: 10,
    right: -35,
    paddingVertical: 4,
    paddingHorizontal: 40,
    transform: [{ rotate: '45deg' }],
    zIndex: 10,
    elevation: 10,
  },

  outOfStockText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});