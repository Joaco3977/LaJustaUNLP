import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Product, ProductCard } from '@/components/product-card';
import { IconSymbol } from '@/components/ui/icon-symbol';

type Props = {
  products: Product[];
  onSelectProduct: (id: number) => void;

  // opcional: control del botón de eliminar
  showDelete?: boolean;
  onDeleteProduct?: (id: number) => void;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 24;
const GAP = 12;

// 2 columnas
const ITEM_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

export function ProductGrid({
  products,
  onSelectProduct,
  showDelete = false,
  onDeleteProduct,
}: Props) {
  return (
    <View style={styles.grid}>
      {products.map((product) => (
        <View key={product.id} style={styles.cardWrapper}>
          
          <ProductCard
            product={product}
            width={ITEM_WIDTH}
            onPress={onSelectProduct}
          />

          {showDelete && onDeleteProduct && (
            <Pressable
              style={styles.trashButton}
              onPress={() => onDeleteProduct(product.id)}
            >
              <IconSymbol
                name="trash.fill"
                size={16}
                color="#fff"
              />
            </Pressable>
          )}

        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },

  cardWrapper: {
    width: ITEM_WIDTH,
    position: 'relative',
    flexDirection: 'row',
  },

  trashButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff6f43a6',
    borderRadius: 16,
    padding: 6,
    zIndex: 20,
    elevation: 4,
  },
});