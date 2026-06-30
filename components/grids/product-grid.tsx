import { Product, ProductCard } from '@/components/product-card';
import { Dimensions, StyleSheet, View } from 'react-native';

type Props = {
  products: Product[];
  onSelectProduct: (id: number) => void;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 24;
const GAP = 12;

// ancho para 2 columnas
const ITEM_WIDTH = (SCREEN_WIDTH - PADDING * 2 - GAP) / 2;

export function ProductGrid({ products, onSelectProduct }: Props) {
  return (
    <View style={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          width={ITEM_WIDTH}
          onPress={onSelectProduct}
        />
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
});