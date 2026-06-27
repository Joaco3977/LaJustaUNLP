import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { ProductGrid } from '@/components/grids/product-grid';
import { ProductDetail } from '@/components/product-detail';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomModal } from '@/components/ui/custom-modal';
import { ScrollFadeOverlay } from '@/components/ui/scroll-fade-overlay';

import { HomeBanner } from '@/components/home-banner';

import { useHomeBanner } from '@/hooks/use-home-banner';
import { usePromotions } from '@/hooks/use-promotions';

import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const { products, loading } = usePromotions();
  const banner = useHomeBanner();

  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null);

  const [scrollY, setScrollY] = useState(0);

  const openProduct = (id: number) =>
    setSelectedProductId(id);

  const closeProduct = () =>
    setSelectedProductId(null);

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.scrollWrapper}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) =>
            setScrollY(
              event.nativeEvent.contentOffset.y
            )
          }
        >
          {/* BANNER */}
          <HomeBanner banner={banner} />

          <View
            style={[
              styles.separator,
              { backgroundColor: theme.icon },
            ]}
          />

          <ThemedText style={styles.title}>
            Destacados de la semana!
          </ThemedText>

          {loading ? (
            <ThemedText>
              Cargando promociones...
            </ThemedText>
          ) : products.length > 0 ? (
            <>
              <ProductGrid
                products={products}
                onSelectProduct={openProduct}
              />

              <View style={styles.moreContainer}>
                <AnimatedButton
                  title="Ver más"
                  onPress={() =>
                    router.push('/(tabs)/products')
                  }
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
    overflow: 'hidden',
  },

  scroll: {
    paddingBottom: 40,
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