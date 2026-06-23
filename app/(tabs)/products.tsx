import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { CategoryGrid } from '@/components/grids/category-grid';
import { ProductGrid } from '@/components/grids/product-grid';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

import {
  Category,
  buildAllProductsUrl,
  buildProductUrl,
  useCategories,
} from '@/hooks/use-categories';

const PAGE_SIZE = 12;

export default function ProductsScreen() {
  const { rootCategories, getChildren, loading } =
    useCategories();

  /* ===== CATEGORY STATE ===== */
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  /* ===== PRODUCTS STATE ===== */
  const [products, setProducts] = useState<any[]>([]);
  const [totalElements, setTotalElements] =
    useState<number>(0);
  const [loadingProducts, setLoadingProducts] =
    useState(false);

  /* ===== PAGINATION ===== */
  const [page, setPage] = useState(0);

  const totalPages = Math.max(
    1,
    Math.ceil(totalElements / PAGE_SIZE)
  );

  const isRoot = selectedCategory === null;

  const subcategories = selectedCategory
    ? getChildren(selectedCategory.id)
    : [];

  /* =========================================================
     FIX REAL DEL BACKEND: range=page,size
  ========================================================= */
  const fetchUrl = (categoryId: number, page: number) => {
    const base =
      categoryId === 0
        ? buildAllProductsUrl()
        : buildProductUrl(categoryId);

    const url = new URL(base);

    url.searchParams.set('range', `${page},${PAGE_SIZE}`);

    return url.toString();
  };

  /* ===== FETCH PRODUCTS ===== */
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      setLoadingProducts(true);

      try {
        const url = fetchUrl(
          selectedCategory.id,
          page
        );

        const res = await fetch(url);
        const json = await res.json();

        setProducts(json.page ?? []);
        setTotalElements(json.totalElements ?? 0);
      } catch (e) {
        console.error('Error productos', e);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, page]);

  /* ===== CLICK CATEGORY ===== */
  const handlePress = (category: Category) => {
    setSelectedCategory(category);
    setPage(0);
  };

  /* ===== BACK ===== */
  const handleBack = () => {
    setSelectedCategory(null);
    setProducts([]);
    setPage(0);
    setTotalElements(0);
  };

  const title = selectedCategory?.name;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>

        {/* BACK */}
        {!isRoot && (
          <AnimatedButton
            title="← Volver"
            onPress={handleBack}
            style={styles.backButton}
          />
        )}

        {/* ROOT VIEW */}
        {isRoot && (
          <CategoryGrid
            categories={rootCategories}
            onPress={handlePress}
          />
        )}

        {/* CATEGORY VIEW */}
        {!isRoot && (
          <>
            {/* TITLE */}
            <ThemedText style={styles.title}>
              {title}
            </ThemedText>

            {/* SUBCATEGORIES */}
            {subcategories.length > 0 && (
              <CategoryGrid
                categories={subcategories}
                onPress={handlePress}
              />
            )}

            {/* PRODUCTS */}
            {loadingProducts ? (
              <ThemedText>
                Cargando productos...
              </ThemedText>
            ) : products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <ThemedText>
                No hay productos disponibles
              </ThemedText>
            )}

            {/* PAGINATION */}
            {products.length > 0 && (
              <View style={styles.pagination}>
                {/* LEFT */}
                {page > 0 ? (
                  <AnimatedButton
                    title="← Anterior"
                    onPress={() => setPage(page - 1)}
                  />
                ) : (
                  <View style={{ width: 100 }} />
                )}

                {/* CENTER */}
                <ThemedText style={styles.pageText}>
                  Página {page + 1}
                </ThemedText>

                {/* RIGHT */}
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
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '500',
  },
});