import { useState } from 'react';
import {
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
import { CustomModal } from '@/components/ui/custom-modal';
import { ScrollFadeOverlay } from '@/components/ui/scroll-fade-overlay';

import {
  Category,
  useCategories,
} from '@/hooks/use-categories';

import { useProducts } from '@/hooks/use-products';
import { useSearchBar } from '@/hooks/use-search-bar';
import { useThemeColor } from '@/hooks/use-theme-color';

const PAGE_SIZE = 12;

export default function ProductsScreen() {
  const { rootCategories, getChildren } = useCategories();

  // ✅ Color proveniente del theme activo (layout)
  const backgroundColor = useThemeColor({}, 'background');

  const [categoryStack, setCategoryStack] = useState<Category[]>([]);
  const currentCategory = categoryStack.at(-1) ?? null;
  const isRoot = currentCategory === null;

  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null);

  const [page, setPage] = useState(0);

  const {
    searchText,
    products: searchProducts,
    loading: searching,
    setSearchText,
    submitSearch,
    clearSearch,
  } = useSearchBar({
    pageSize: PAGE_SIZE,
    initialPage: page,
  });

  const isSearching = searchText.trim().length > 0;

  const { products, loading, hasMore } = useProducts({
    page,
    size: PAGE_SIZE,
    categoryId:
      currentCategory && currentCategory.id !== 0
        ? currentCategory.id
        : null,
  });

  const visibleProducts = isSearching
    ? searchProducts
    : products;

  const [scrollY, setScrollY] = useState(0);

  const subcategories = currentCategory
    ? getChildren(currentCategory.id)
    : [];

  const openProduct = (id: number) =>
    setSelectedProductId(id);

  const closeProduct = () =>
    setSelectedProductId(null);

  const handleSelectCategory = (category: Category) => {
    clearSearch();
    setPage(0);
    setCategoryStack((prev) => [...prev, category]);
  };

  const handleBack = () => {
    clearSearch();
    setPage(0);
    setCategoryStack((prev) => prev.slice(0, -1));
  };

  const showProducts = !isRoot || isSearching;

  const goPrevPage = () => {
    setPage((p) => Math.max(0, p - 1));
  };

  const showTitle = !isRoot || isSearching;

  const titleText = isSearching
    ? `Buscando: "${searchText}"`
    : currentCategory?.name ?? '';

  return (
    <ThemedView style={styles.container}>
      <View style={styles.scrollWrapper}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) =>
            setScrollY(e.nativeEvent.contentOffset.y)
          }
        >
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              onSubmit={() => {
                setPage(0);
                submitSearch();
              }}
            />
          </View>

          {!isRoot && (
            <AnimatedButton
              title="← Volver"
              onPress={handleBack}
              style={styles.backButton}
            />
          )}

          {isRoot && !isSearching && (
            <CategoryGrid
              categories={rootCategories}
              onPress={handleSelectCategory}
            />
          )}

          {showTitle && (
            <ThemedText style={styles.title}>
              {titleText}
            </ThemedText>
          )}

          {!isSearching && subcategories.length > 0 && (
            <CategoryGrid
              categories={subcategories}
              onPress={handleSelectCategory}
            />
          )}

          {showProducts &&
            (loading || searching ? (
              <ThemedText>
                Cargando productos...
              </ThemedText>
            ) : (
              <ProductGrid
                products={visibleProducts}
                onSelectProduct={openProduct}
              />
            ))}

          {showProducts &&
            !loading &&
            !searching &&
            visibleProducts.length === 0 && (
              <ThemedText style={styles.empty}>
                No se encontraron productos
              </ThemedText>
            )}

          {showProducts &&
            !loading &&
            !searching &&
            visibleProducts.length > 0 && (
              <View style={styles.pagination}>
                <AnimatedButton
                  title="Anterior"
                  onPress={goPrevPage}
                  disabled={page === 0}
                />

                <ThemedText style={styles.pageText}>
                  Página {page + 1}
                </ThemedText>

                <AnimatedButton
                  title="Siguiente"
                  onPress={() =>
                    setPage((p) => p + 1)
                  }
                  disabled={!hasMore}
                />
              </View>
            )}
        </ScrollView>

        <ScrollFadeOverlay
          scrollY={scrollY}
          color={backgroundColor}
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

  searchContainer: {
    marginBottom: 20,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    marginBottom: 16,
  },

  pagination: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },

  pageText: {
    fontSize: 14,
  },

  empty: {
    marginTop: 20,
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});