import { AnimatedButton } from '@/components/animated-button';
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

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <ThemedText style={[styles.label, { color: theme.text }]}>
        {title}
      </ThemedText>
      {children}
    </View>
  );

  return (
    <View style={[styles.overlay, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <AnimatedButton
          title="← Volver"
          onPress={onClose}
          style={styles.close}
        />

        <Image source={image} style={styles.image} />

        <ThemedText style={[styles.price, { color: theme.text }]}>
          ${product.price}
        </ThemedText>

        {/* DESCRIPCIÓN */}
        {!!product.description && (
          <Section title="Descripción">
            <ThemedText style={[styles.value, { color: theme.subtext }]}>
              {product.description}
            </ThemedText>
          </Section>
        )}

        {/* PRODUCTOR */}
        {!!product.producer?.name && (
          <Section title="Productor">
            <ThemedText style={[styles.value, { color: theme.subtext }]}>
              {product.producer.name}
            </ThemedText>
          </Section>
        )}

        {/* CATEGORÍAS */}
        {!!product.categories?.length && (
          <Section title="Categorías">
            {product.categories.map((c) => (
              <ThemedText
                key={c.id}
                style={[styles.value, { color: theme.subtext }]}
              >
                • {c.name}
              </ThemedText>
            ))}
          </Section>
        )}

        {/* MARCA */}
        {!!product.brand && (
          <Section title="Marca">
            <ThemedText style={[styles.value, { color: theme.subtext }]}>
              {product.brand}
            </ThemedText>
          </Section>
        )}

        {/* UNIDAD */}
        {!!unitInfo && (
          <Section title="Unidad">
            <ThemedText style={[styles.value, { color: theme.subtext }]}>
              {product.unitQuantity}
              {product.unitDescription
                ? ` (${product.unitDescription})`
                : ''}
            </ThemedText>
          </Section>
        )}

        {/* STOCK */}
        <Section title="Stock disponible">
          <ThemedText style={[styles.value, { color: theme.subtext }]}>
            {product.stock ?? 0} unidades
          </ThemedText>
        </Section>
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
    borderRadius: 14,
    marginBottom: 12,
  },

  price: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 14,
  },

  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

  value: {
    fontSize: 14,
    lineHeight: 20,
  },
});