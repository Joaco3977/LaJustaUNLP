import { AnimatedButton } from '@/components/animated-button';
import { AfterBuyModal } from '@/components/modals/after-buy-modal';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { ThemedText } from '@/components/themed-text';
import { ImageZoomModal } from '@/components/ui/image-zoom-modal';
import { ScrollFadeOverlay } from '@/components/ui/scroll-fade-overlay';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useCartStore } from '@/stores/cart.store';
import { useFavoritesStore } from '@/stores/favorites.store';
import { useRouter } from 'expo-router';

import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

const heartOutline = require('@/assets/images/icons/no-favorito.png');
const heartFilled = require('@/assets/images/icons/si-favorito.png');
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

type ModalFlow = 'none' | 'confirm' | 'afterBuy';

export function ProductDetail({ productId, onClose }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageOpen, setImageOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [modalFlow, setModalFlow] = useState<ModalFlow>('none');

  const { addToCart } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const router = useRouter();

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const detailBackground = useThemeColor({}, 'detailBackground');
  const tabIconDefault = useThemeColor({}, 'tabIconDefault');
  const white = useThemeColor({}, 'buttonText');

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

  const closeFlow = () => setModalFlow('none');

  const handleBuy = () => {
    if (!product) return;

    addToCart(product.id, quantity);

    setModalFlow('afterBuy');
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: detailBackground },
      ]}
    >
      <ThemedText style={[styles.label, { color: text }]}>
        {title}
      </ThemedText>
      {children}
    </View>
  );

  return (
    <View style={[styles.overlay, { backgroundColor: background }]}>
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
              { backgroundColor: background },
            ]}
          >
            <Image
              source={image}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>

          <View style={styles.priceRow}>
            <ThemedText style={[styles.price, { color: text }]}>
              ${product.price}
            </ThemedText>

            <Pressable
              onPress={() => toggleFavorite(product.id)}
              hitSlop={10}
            >
              <Image
                source={favorite ? heartFilled : heartOutline}
                style={styles.heartIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {!!product.title && (
            <Section title="Titulo">
              <ThemedText style={[styles.value, { color: text }]}>
                {product.title}
              </ThemedText>
            </Section>
          )}

          {!!product.description && (
            <Section title="Descripción">
              <ThemedText style={[styles.value, { color: text }]}>
                {product.description}
              </ThemedText>
            </Section>
          )}

          {!!product.producer?.name && (
            <Section title="Productor">
              <ThemedText style={[styles.value, { color: text }]}>
                {product.producer.name}
              </ThemedText>
            </Section>
          )}

          {!!product.brand && (
            <Section title="Marca">
              <ThemedText style={[styles.value, { color: text }]}>
                {product.brand}
              </ThemedText>
            </Section>
          )}

          {!!product.categories?.length && (
            <Section title="Categorías">
              {product.categories.map((c) => (
                <ThemedText
                  key={c.id}
                  style={[styles.value, { color: text }]}
                >
                  • {c.name}
                </ThemedText>
              ))}
            </Section>
          )}

          <Section title="Stock disponible">
            <ThemedText style={[styles.value, { color: text }]}>
              {stock} unidades
            </ThemedText>
          </Section>

          {!!product.unit?.description &&
            !!product.unitQuantity &&
            !!product.unit?.code && (
              <Section title={product.unit.description}>
                <ThemedText style={[styles.value, { color: text }]}>
                  {product.unitQuantity} {product.unit.code}
                </ThemedText>
              </Section>
            )}

          <View style={styles.buyContainer}>
            {stock === 0 ? (
              <ThemedText style={styles.noStock}>
                Sin stock disponible
              </ThemedText>
            ) : (
              <>
                <View
                  style={[
                    styles.quantityRow,
                    { backgroundColor: detailBackground },
                  ]}
                >
                  <Pressable
                    style={[
                      styles.qtyButton,
                      { backgroundColor: tabIconDefault },
                    ]}
                    onPress={decrease}
                  >
                    <ThemedText
                      style={[styles.qtyButtonText, { color: white }]}
                    >
                      ←
                    </ThemedText>
                  </Pressable>

                  <ThemedText style={styles.quantity}>
                    {quantity}
                  </ThemedText>

                  <Pressable
                    style={[
                      styles.qtyButton,
                      { backgroundColor: tabIconDefault },
                    ]}
                    onPress={increase}
                  >
                    <ThemedText
                      style={[styles.qtyButtonText, { color: white }]}
                    >
                      →
                    </ThemedText>
                  </Pressable>
                </View>

                <Pressable
                  style={[
                    styles.buyButton,
                    { backgroundColor: tabIconDefault },
                  ]}
                  onPress={() => setModalFlow('confirm')}
                >
                  <ThemedText
                    style={[
                      styles.buyButtonText,
                      { color: white },
                    ]}
                  >
                    AGREGAR AL CARRITO
                  </ThemedText>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>

        <ScrollFadeOverlay
          scrollY={scrollY}
          color={background}
        />
      </View>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        visible={modalFlow === 'confirm'}
        title="Agregar al carrito"
        description={`¿Querés agregar ${quantity} unidad(es) de este producto?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        onCancel={closeFlow}
        onConfirm={handleBuy}
      />

      {/* AFTER BUY MODAL */}
      <AfterBuyModal
        visible={modalFlow === 'afterBuy'}
        onClose={closeFlow}
        onGoToCart={() => {
          setModalFlow('none');
          router.push('/cart');
        }}
      />

      {/* IMAGE ZOOM */}
      <ImageZoomModal
        visible={imageOpen}
        image={image}
        onClose={() => setImageOpen(false)}
        backgroundColor={background}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1 },
  scrollWrapper: { flex: 1 },
  container: { padding: 16, paddingBottom: 40 },

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

  image: { width: '100%', height: '100%' },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  price: { fontSize: 26, fontWeight: '800' },
  heart: { fontSize: 26 },

  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  heartIcon: {
    width: 32,
    height: 32,
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

  value: { fontSize: 14, lineHeight: 20 },

  buyContainer: {
    marginTop: 18,
    paddingTop: 18,
    alignItems: 'center',
    gap: 12,
  },

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: 14,
  },

  qtyButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  qtyButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },

  quantity: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'center',
  },

  buyButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },

  buyButtonText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  noStock: {
    color: '#ef4444',
    fontWeight: '600',
  },
});