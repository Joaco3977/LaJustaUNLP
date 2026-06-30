import { AnimatedButton } from '@/components/animated-button';
import { ThemedText } from '@/components/themed-text';
import { ImageZoomModal } from '@/components/ui/image-zoom-modal';
import { ScrollFadeOverlay } from '@/components/ui/scroll-fade-overlay';
import { Colors } from '@/constants/theme';
import { useFavoritesStore } from '@/stores/favorites.store';

import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
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
    description?: string;
  };
  unitQuantity?: number;
  unitDescription?: string;
  images?: { value: string }[];
  producer?: { name?: string };
  categories?: { id: number; name: string }[];
};

export function ProductDetail({ productId, onClose }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageOpen, setImageOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const { isFavorite, toggleFavorite } = useFavoritesStore();

  useEffect(() => {
    fetch(`https://www.lajustaunlp.com.ar/api/product/${productId}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch(console.error);
  }, [productId]);

  if (!product) return null;

  const stock = product.stock ?? 0;

  const image =
    product.images?.[0]?.value
      ? { uri: product.images[0].value }
      : noImage;

  const favorite = isFavorite(product.id);

  const increase = () =>
    setQuantity((q) => Math.min(q + 1, stock));
  const decrease = () =>
    setQuantity((q) => Math.max(q - 1, 1));

  const handleBuy = () => {
    console.log(
      `intentando agregar al carrito el producto con ID: ${product.id}, cantidad: ${quantity}`
    );
  };

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
      <View style={styles.scrollWrapper}>
        <ScrollView
          contentContainerStyle={styles.container}
          onScroll={(e) =>
            setScrollY(e.nativeEvent.contentOffset.y)
          }
          scrollEventThrottle={16}
        >
          <AnimatedButton
            title="← Volver"
            onPress={onClose}
            style={styles.close}
          />

          <Pressable
            onPress={() => setImageOpen(true)}
            style={[
              styles.imageWrapper,
              { backgroundColor: theme.background },
            ]}
          >
            <Image
              source={image}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>

          {/* PRECIO + FAVORITO */}
          <View style={styles.priceRow}>
            <ThemedText
              style={[styles.price, { color: theme.text }]}
            >
              ${product.price}
            </ThemedText>

            <Pressable
              onPress={() => toggleFavorite(product.id)}
              hitSlop={10}
            >
              <ThemedText
                style={[
                  styles.heart,
                  {
                    color: favorite
                      ? '#fca5a5' // rojo pastel
                      : theme.icon,
                  },
                ]}
              >
                {favorite ? '❤️' : '🤍'}
              </ThemedText>
            </Pressable>
          </View>

          {!!product.description && (
            <Section title="Descripción">
              <ThemedText
                style={[styles.value, { color: theme.text }]}
              >
                {product.description}
              </ThemedText>
            </Section>
          )}

          {!!product.producer?.name && (
            <Section title="Productor">
              <ThemedText
                style={[styles.value, { color: theme.text }]}
              >
                {product.producer.name}
              </ThemedText>
            </Section>
          )}

          {!!product.brand && (
            <Section title="Marca">
              <ThemedText
                style={[styles.value, { color: theme.text }]}
              >
                {product.brand}
              </ThemedText>
            </Section>
          )}

          {!!product.categories?.length && (
            <Section title="Categorías">
              {product.categories.map((c) => (
                <ThemedText
                  key={c.id}
                  style={[styles.value, { color: theme.text }]}
                >
                  • {c.name}
                </ThemedText>
              ))}
            </Section>
          )}

          <Section title="Stock disponible">
            <ThemedText
              style={[styles.value, { color: theme.text }]}
            >
              {stock} unidades
            </ThemedText>
          </Section>

          {!!product.unit?.description &&
            !!product.unitQuantity &&
            !!product.unit?.code && (
              <Section title={product.unit.description}>
                <ThemedText
                  style={[styles.value, { color: theme.text }]}
                >
                  {product.unitQuantity} {product.unit.code}
                </ThemedText>
              </Section>
            )}

          <View style={styles.buyContainer}>
            {stock === 0 ? (
              <ThemedText
                style={{ color: '#ef4444', fontWeight: '600' }}
              >
                Sin stock disponible
              </ThemedText>
            ) : (
              <>
                <View style={styles.quantityRow}>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={decrease}
                  >
                    <ThemedText style={styles.qtyButtonText}>
                      ←
                    </ThemedText>
                  </Pressable>

                  <ThemedText style={styles.quantity}>
                    {quantity}
                  </ThemedText>

                  <Pressable
                    style={styles.qtyButton}
                    onPress={increase}
                  >
                    <ThemedText style={styles.qtyButtonText}>
                      →
                    </ThemedText>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.buyButton}
                  onPress={handleBuy}
                >
                  <ThemedText style={styles.buyButtonText}>
                    AGREGAR AL CARRITO
                  </ThemedText>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>

        <ScrollFadeOverlay
          scrollY={scrollY}
          color={theme.background}
        />
      </View>

      <ImageZoomModal
        visible={imageOpen}
        image={image}
        onClose={() => setImageOpen(false)}
        backgroundColor={theme.background}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },

  scrollWrapper: {
    flex: 1,
    position: 'relative',
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

  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  price: {
    fontSize: 26,
    fontWeight: '800',
  },

  heart: {
    fontSize: 26,
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

  buyContainer: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
    gap: 12,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  qtyButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  qtyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  quantity: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'center',
  },

  buyButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },

  buyButtonText: {
    color: 'white',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});