import { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';

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

  /* ================= CATEGORY STACK ================= */
  const [categoryStack, setCategoryStack] = useState<Category[]>([]);

  const currentCategory = categoryStack.at(-1) ?? null;
  const isRoot = currentCategory === null;

  /* ================= PRODUCTS ================= */
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(0);

  /* ================= PRODUCT DETAIL ================= */
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const subcategories = currentCategory
    ? getChildren(currentCategory.id)
    : [];

  /* ================= FETCH ================= */
  const fetchUrl = (categoryId: number, page: number) => {
    const url = new URL(buildProductUrl(categoryId));
    url.searchParams.set('range', `${page},${PAGE_SIZE}`);
    return url.toString();
  };

  useEffect(() => {
    if (!currentCategory) return;

    fetch(fetchUrl(currentCategory.id, page))
      .then((res) => res.json())
      .then((json) => setProducts(json.page ?? []))
      .catch(console.error);
  }, [currentCategory, page]);

  /* ================= CATEGORY CLICK ================= */
  const handleSelectCategory = (category: Category) => {
    setCategoryStack((prev) => [...prev, category]);
    setPage(0);
    setSelectedProductId(null);
  };

  /* ================= BACK ================= */
  const handleBack = () => {
    setCategoryStack((prev) => prev.slice(0, -1));
    setPage(0);
    setSelectedProductId(null);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.searchContainer}>
          <SearchBar />
        </View>

        {/* ROOT CATEGORIES */}
        {isRoot && (
          <CategoryGrid
            categories={rootCategories}
            onPress={handleSelectCategory}
          />
        )}

        {/* CATEGORY VIEW */}
        {!isRoot && (
          <>
            {/* BACK */}
            <AnimatedButton
              title="← Volver"
              onPress={handleBack}
              style={styles.backButton}
            />

            <ThemedText style={styles.title}>
              {currentCategory?.name}
            </ThemedText>

            {/* SUBCATEGORIES */}
            {subcategories.length > 0 && (
              <CategoryGrid
                categories={subcategories}
                onPress={handleSelectCategory}
              />
            )}

            {/* PRODUCTS */}
            <ProductGrid
              products={products}
              onSelectProduct={setSelectedProductId}
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
        )}
      </ScrollView>

      {/* MODAL PRODUCT DETAIL */}
      <Modal
        visible={selectedProductId !== null}
        animationType="slide"
        onRequestClose={() => setSelectedProductId(null)}
      >
        {selectedProductId !== null && (
          <ProductDetail
            productId={selectedProductId}
            onClose={() => setSelectedProductId(null)}
          />
        )}
      </Modal>
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
});