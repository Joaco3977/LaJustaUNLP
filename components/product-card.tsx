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
          borderColor: theme.icon,
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
        <ThemedText
          numberOfLines={2}
          type="defaultSemiBold"
          color="title"
        >
          {product.title}
        </ThemedText>

        {!!product.brand && (
          <ThemedText
            numberOfLines={1}
            color="brandText"
            style={styles.meta}
          >
            {product.brand}
          </ThemedText>
        )}

        {!!product.unitDescription && (
          <ThemedText
            numberOfLines={1}
            color="unitDescriptionText"
            style={styles.meta}
          >
            {product.unitDescription}
          </ThemedText>
        )}

        {!!unitInfo && (
          <ThemedText
            numberOfLines={1}
            color="stockText"
            style={styles.meta}
          >
            {unitInfo}
          </ThemedText>
        )}

        <ThemedText
          type="defaultSemiBold"
          color="text"
          style={styles.price}
        >
          ${product.price}
        </ThemedText>
      </View>
    </Pressable>
  );
}

/* Estilo para card horizontal (imagen a la izquierda y info a la derecha)
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',

    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#fff',

    elevation: 2,

    height: 120,
  },

  image: {
    width: 110,
    height: '100%',
    resizeMode: 'contain',
  },

  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 3,
    justifyContent: 'flex-start',
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
  },

  meta: {
    fontSize: 11,
    opacity: 0.7,
  },

  price: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },

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
*/

// Estilo para card vertical (imagen arriba e info abajo)
const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
  },

  image: {
    width: '100%',
  },

  content: {
    padding: 10,
    gap: 2,
  },

  title: {
    fontSize: 12,
    fontWeight: '600',
    color: 'theme.title',
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

  outOfStockRibbon: {
    position: 'absolute',
    top: 10,
    right: -35,
    backgroundColor: 'theme.outOfStockRibon',
    paddingVertical: 4,
    paddingHorizontal: 40,
    transform: [{ rotate: '45deg' }],
    zIndex: 10,
    elevation: 10,
  },

  outOfStockText: {
    color: 'theme.outOfStockRibonText',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
