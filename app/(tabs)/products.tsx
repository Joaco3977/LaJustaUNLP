import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { CategoryGrid } from '@/components/grids/category-grid';
import { ProductGrid } from '@/components/grids/product-grid';
import { ProductDetail } from '@/components/product-detail';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import {
  Category,
  buildProductUrl,
  useCategories,
} from '@/hooks/use-categories';

const PAGE_SIZE = 12;

export default function ProductsScreen() {
  const { rootCategories, getChildren } = useCategories();

  const [categoryStack, setCategoryStack] = useState<Category[]>([]);
  const currentCategory = categoryStack.at(-1) ?? null;
  const isRoot = currentCategory === null;

  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // 🎬 Animaciones modal
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalTranslate = useRef(new Animated.Value(50)).current;

  const subcategories = currentCategory
    ? getChildren(currentCategory.id)
    : [];

  const fetchUrl = (categoryId: number, page: number) => {
    const url = new URL(buildProductUrl(categoryId));
    url.searchParams.set('range', `${page},${PAGE_SIZE}`);
    return url.toString();
  };

  useEffect(() => {
    if (!currentCategory) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);

      try {
        const res = await fetch(fetchUrl(currentCategory.id, page));
        const json = await res.json();

        setProducts(json.page ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [currentCategory, page]);

  // 🟢 OPEN MODAL
  const openProduct = (id: number) => {
    setSelectedProductId(id);

    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🔴 CLOSE MODAL
  const closeProduct = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(modalTranslate, {
        toValue: 50,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSelectedProductId(null);
    });
  };

  const handleSelectCategory = (category: Category) => {
    setCategoryStack((prev) => [...prev, category]);
    setPage(0);
    setSelectedProductId(null);
  };

  const handleBack = () => {
    setCategoryStack((prev) => prev.slice(0, -1));
    setPage(0);
    setSelectedProductId(null);
  };

  const hasProducts = products.length > 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.searchContainer}>
          <SearchBar />
        </View>

        {/* ROOT */}
        {isRoot && (
          <CategoryGrid
            categories={rootCategories}
            onPress={handleSelectCategory}
          />
        )}

        {/* CATEGORY VIEW */}
        {!isRoot && (
          <>
            <AnimatedButton
              title="← Volver"
              onPress={handleBack}
              style={styles.backButton}
            />

            <ThemedText style={styles.title}>
              {currentCategory?.name}
            </ThemedText>

            {subcategories.length > 0 && (
              <CategoryGrid
                categories={subcategories}
                onPress={handleSelectCategory}
              />
            )}

            {/* LOADING */}
            {loadingProducts ? (
              <ThemedText>Cargando productos...</ThemedText>
            ) : hasProducts ? (
              <>
                <ProductGrid
                  products={products}
                  onSelectProduct={openProduct}
                />

                {/* PAGINATION */}
                <View style={styles.pagination}>
                  {page > 0 ? (
                    <AnimatedButton
                      title="← Anterior"
                      onPress={() => setPage(page - 1)}
                    />
                  ) : (
                    <View style={{ width: 100 }} />
                  )}

                  <ThemedText>Página {page + 1}</ThemedText>

                  {products.length === PAGE_SIZE ? (
                    <AnimatedButton
                      title="Siguiente →"
                      onPress={() => setPage(page + 1)}
                    />
                  ) : (
                    <View style={{ width: 100 }} />
                  )}
                </View>
              </>
            ) : (
              <ThemedText style={styles.empty}>
                Actualmente no hay productos disponibles en la categoría seleccionada
              </ThemedText>
            )}
          </>
        )}
      </ScrollView>

      {/* 🧠 CUSTOM OVERLAY MODAL */}
      {selectedProductId !== null && (
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: modalOpacity },
          ]}
        >
          {/* BACKDROP */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeProduct}
          />

          {/* CONTENT */}
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: modalTranslate }],
              },
            ]}
          >
            <ProductDetail
              productId={selectedProductId}
              onClose={closeProduct}
            />
          </Animated.View>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  scroll: { paddingBottom: 40 },
  searchContainer: { marginBottom: 20 },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    marginBottom: 16,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  empty: {
    marginTop: 20,
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
});