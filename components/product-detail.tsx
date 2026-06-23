import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

const noImage = require('@/assets/images/no-image.png');

type Props = {
  productId: number;
  onClose: () => void;
};

type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  brand?: string;
  stock?: number;
  unit?: {
    code?: string;
  };
  unitQuantity?: number;
  unitDescription?: string;
  images?: { value: string }[];
  producer?: { name?: string };
  categories?: { id: number; name: string }[];
};

export function ProductDetail({ productId, onClose }: Props) {
  const [product, setProduct] = useState<Product | null>(null);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    fetch(`https://www.lajustaunlp.com.ar/api/product/${productId}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [productId]);

  if (!product) return null;

  const image =
    product.images?.[0]?.value
      ? { uri: product.images[0].value }
      : noImage;

  const unitInfo =
    product.unit?.code && product.unitQuantity
      ? `${product.unitQuantity} ${product.unit.code}`
      : null;

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* CLOSE BUTTON */}
        <ThemedText onPress={onClose} style={styles.close}>
          ✕ Cerrar
        </ThemedText>

        <Image source={image} style={styles.image} />

        <ThemedText style={styles.price}>
          ${product.price}
        </ThemedText>

        {!!product.description && (
          <ThemedText style={styles.section}>
            {product.description}
          </ThemedText>
        )}

        {!!product.producer?.name && (
          <ThemedText style={styles.section}>
            Productor: {product.producer.name}
          </ThemedText>
        )}

        {!!product.categories?.length && (
          <View style={styles.section}>
            <ThemedText>Categorías:</ThemedText>
            {product.categories.map((c) => (
              <ThemedText key={c.id}>• {c.name}</ThemedText>
            ))}
          </View>
        )}

        {!!product.brand && (
          <ThemedText style={styles.section}>
            Marca: {product.brand}
          </ThemedText>
        )}

        {!!unitInfo && (
          <ThemedText style={styles.section}>
            Unidad: {unitInfo}
            {product.unitDescription ? ` (${product.unitDescription})` : ''}
          </ThemedText>
        )}

        <ThemedText style={styles.section}>
          Stock disponible: {product.stock ?? 0}
        </ThemedText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  close: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 12,
  },

  price: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },

  section: {
    marginTop: 8,
    fontSize: 14,
  },
});