import { ThemedText } from '@/components/themed-text';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useCartStore } from '@/stores/cart.store';
import type { Product, ProductImage } from '@/types';

export type { Product } from '@/types';

const noImage = require('@/assets/images/no-image.png');

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

  const stock = product.stock ?? 0;
  const outOfStock = stock === 0;

  const quantity = useCartStore(state =>
    state.getItemQuantity(product.id)
  );

  const addToCart = useCartStore(state => state.addToCart);
  const increaseQuantity = useCartStore(state => state.increaseQuantity);
  const decreaseQuantity = useCartStore(state => state.decreaseQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);

  const handleAddToCart = () => {
    if (stock <= 0) return;

    addToCart(product.id, 1);
  };

  const handleIncrease = () => {
    if (quantity >= stock) return;

    increaseQuantity(product.id);
  };

  const handleDecrease = () => {
    if (quantity <= 1) return;

    decreaseQuantity(product.id);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

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
            <ThemedText
              type="unitDescriptionText"
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

      {/* Acciones del carrito */}
      {!outOfStock && (
        <View
          style={[
            styles.cartActions,
            { backgroundColor: theme.card },
          ]}
        >
          {quantity === 0 ? (
            <Pressable
              onPress={handleAddToCart}
              style={styles.addToCartButton}
              hitSlop={4}
            >
              <MaterialIcons
                name="shopping-cart"
                size={20}
                color="#555"
              />
            </Pressable>
          ) : (
            <View style={styles.quantityControls}>
              <Pressable
                onPress={handleDecrease}
                style={styles.quantityButton}
                hitSlop={4}
              >
                <MaterialIcons
                  name="arrow-back"
                  size={18}
                  color="#555"
                />
              </Pressable>

              <ThemedText
                type="defaultSemiBold"
                color="text"
                style={styles.quantityText}
              >
                {quantity}
              </ThemedText>

              <Pressable
                onPress={handleIncrease}
                style={[
                  styles.quantityButton,
                  quantity >= stock && styles.disabledButton,
                ]}
                disabled={quantity >= stock}
                hitSlop={4}
              >
                <MaterialIcons
                  name="arrow-forward"
                  size={18}
                  color={quantity >= stock ? '#aaa' : '#555'}
                />
              </Pressable>

              <Pressable
                onPress={handleRemove}
                style={styles.quantityButton}
                hitSlop={4}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={19}
                  color="#777"
                />
              </Pressable>
            </View>
          )}
        </View>
      )}
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

  cartActions: {
    height: 42,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addToCartButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
  },

  quantityControls: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  quantityButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  quantityText: {
    minWidth: 24,
    textAlign: 'center',
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