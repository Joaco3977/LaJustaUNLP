import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { ProductGrid } from '@/components/grids/product-grid';
import { ProductDetail } from '@/components/product-detail';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomModal } from '@/components/ui/custom-modal';

import { ScrollFadeOverlay } from '@/components/ui/scroll-fade-overlay';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [banner, setBanner] = useState<any>(null);

  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null);

  const [scrollY, setScrollY] = useState(0);

  const openProduct = (id: number) => setSelectedProductId(id);
  const closeProduct = () => setSelectedProductId(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);

      try {
        const url = new URL('https://www.lajustaunlp.com.ar/api/product');

        url.searchParams.set(
          'properties',
          JSON.stringify([
            { key: 'isPromotion', value: true },
            { key: 'deletedAt', value: 'null' },
          ])
        );

        url.searchParams.set('sort', 'id,ASC');

        const res = await fetch(url.toString());
        const json = await res.json();

        setProducts(json.page ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch('https://www.lajustaunlp.com.ar/api/banner');
        const json = await res.json();

        setBanner(json?.[0] ?? null);
      } catch (e) {
        console.error(e);
      }
    };

    fetchBanner();
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {banner && (
        <View style={styles.bannerContainer}>
          {banner.title && (
            <ThemedText style={styles.bannerTitle}>
              {banner.title}
            </ThemedText>
          )}

          {banner.subtitle && (
            <ThemedText style={styles.bannerSubtitle}>
              {banner.subtitle}
            </ThemedText>
          )}
        </View>
      )}

      <View style={[styles.separator, { backgroundColor: theme.icon }]} />

      <ThemedText style={styles.title}>
        Destacados de la semana!
      </ThemedText>

      <View style={styles.scrollWrapper}>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            setScrollY(event.nativeEvent.contentOffset.y);
          }}
        >
          {loading ? (
            <ThemedText>Cargando promociones...</ThemedText>
          ) : products.length > 0 ? (
            <>
              <ProductGrid
                products={products}
                onSelectProduct={openProduct}
              />

              <View style={styles.moreContainer}>
                <AnimatedButton
                  title="Ver más"
                  onPress={() => router.push('/(tabs)/products')}
                />
              </View>
            </>
          ) : (
            <ThemedText style={styles.empty}>
              No hay productos en promoción
            </ThemedText>
          )}
        </ScrollView>

        <ScrollFadeOverlay
          scrollY={scrollY}
          color={theme.background}
        />

      </View>

      <CustomModal
        visible={selectedProductId !== null}
        onClose={closeProduct}
      >
        {selectedProductId !== null && (
          <ProductDetail
            productId={selectedProductId}
            onClose={closeProduct}
          />
        )}
      </CustomModal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  scrollWrapper: {
    flex: 1,
    position: 'relative',
  },

  scroll: {
    paddingBottom: 40,
  },

  bannerContainer: {
    marginBottom: 10,
  },

  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },

  bannerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },

  separator: {
    height: 1,
    marginVertical: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },

  moreContainer: {
    marginTop: 24,
    alignItems: 'center',
    alignSelf: 'center',
  },

  empty: {
    marginTop: 20,
    opacity: 0.6,
    textAlign: 'center',
  },
});