import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { CategoryGrid } from '@/components/grids/category-grid';
import { ProductGrid } from '@/components/grids/product-grid';
import { ProductDetail } from '@/components/product-detail';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CustomModal } from '@/components/ui/custom-modal';

import {
  Category,
  buildAllProductsUrl,
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

  // SEARCH
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const subcategories = currentCategory
    ? getChildren(currentCategory.id)
    : [];

  // =========================
  // IDLE
  // =========================
  const isIdle = isRoot && !isSearching && categoryStack.length === 0;

  const mode: 'idle' | 'category' | 'search' =
    isSearching
      ? 'search'
      : isIdle
        ? 'idle'
        : 'category';

  // =========================
  // FETCH ÚNICO
  // =========================
  useEffect(() => {
    if (mode === 'idle') return;

    const fetchProducts = async () => {
      setLoadingProducts(true);

      try {
        let url: URL;

        if (mode === 'search') {
          const text = searchText.trim();
          if (!text) return;

          url = new URL('https://www.lajustaunlp.com.ar/api/product');

          url.searchParams.set('filter', `"${text}"`);
          url.searchParams.set(
            'properties',
            JSON.stringify([{ key: 'deletedAt', value: 'null' }])
          );
        } else {
          const baseUrl = currentCategory
            ? buildProductUrl(currentCategory.id)
            : buildAllProductsUrl();

          url = new URL(baseUrl);
        }

        url.searchParams.set('range', `${page},${PAGE_SIZE}`);
        url.searchParams.set('sort', 'id,ASC');

        const res = await fetch(url.toString());
        const json = await res.json();

        setProducts(json.page ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [mode, page, currentCategory, searchText]);

  // =========================
  // HANDLERS
  // =========================
  const openProduct = (id: number) => setSelectedProductId(id);
  const closeProduct = () => setSelectedProductId(null);

  const handleSelectCategory = (category: Category) => {
    setSearchText('');
    setIsSearching(false);
    setPage(0);
    setProducts([]);
    setCategoryStack((prev) => [...prev, category]);
  };

  const handleBack = () => {
    setSearchText('');
    setIsSearching(false);
    setPage(0);
    setProducts([]);
    setCategoryStack((prev) => prev.slice(0, -1));
  };

  const handleBackFromSearch = () => {
    setSearchText('');
    setIsSearching(false);
    setPage(0);
    setProducts([]);
  };

  const executeSearch = () => {
    const text = searchText.trim();

    if (!text) {
      setIsSearching(false);
      setProducts([]);
      setPage(0);
      return;
    }

    setPage(0);
    setIsSearching(true);
  };

  // =========================
  // UI LOGIC
  // =========================
  const showProducts = !isIdle;

  const showPagination =
    !isIdle && products.length > 0;

  const showEmptyState =
    showProducts && !loadingProducts && products.length === 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchText}
            onChangeText={(t) => {
              setSearchText(t);
              setIsSearching(false);
            }}
            onSubmit={executeSearch}
          />
        </View>

        {/* HEADER + BACK */}
        {(!isRoot || isSearching) && (
          <>
            <AnimatedButton
              title="← Volver"
              onPress={isSearching ? handleBackFromSearch : handleBack}
              style={styles.backButton}
            />

            {!isSearching && (
              <>
                <ThemedText style={styles.title}>
                  {currentCategory?.name}
                </ThemedText>

                {subcategories.length > 0 && (
                  <CategoryGrid
                    categories={subcategories}
                    onPress={handleSelectCategory}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* ROOT CATEGORIES */}
        {isRoot && !isSearching && (
          <CategoryGrid
            categories={rootCategories}
            onPress={handleSelectCategory}
          />
        )}

        {/* PRODUCTS */}
        {showProducts && (
          loadingProducts ? (
            <ThemedText>Cargando productos...</ThemedText>
          ) : (
            <ProductGrid
              products={products}
              onSelectProduct={openProduct}
            />
          )
        )}

        {/* EMPTY */}
        {showEmptyState && (
          <ThemedText style={styles.empty}>
            No se encontraron productos
          </ThemedText>
        )}

        {/* PAGINATION */}
        {showPagination && (
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
        )}

      </ScrollView>

      {/* MODAL */}
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
});