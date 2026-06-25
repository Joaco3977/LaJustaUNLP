import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme
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
  buildAllProductsUrl,
  buildProductUrl,
  useCategories,
} from '@/hooks/use-categories';

import { Colors } from '@/constants/theme';

const PAGE_SIZE = 12;

type SortOption =
  | 'default'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc';

export default function ProductsScreen() {
  const { rootCategories, getChildren } = useCategories();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [categoryStack, setCategoryStack] = useState<Category[]>([]);
  const currentCategory = categoryStack.at(-1) ?? null;
  const isRoot = currentCategory === null;

  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null);

  // SEARCH
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // SORT
  const [sortOption, setSortOption] =
    useState<SortOption>('default');
  const [sortOpen, setSortOpen] = useState(false);

  // SCROLL
  const [scrollY, setScrollY] = useState(0);

  const subcategories = currentCategory
    ? getChildren(currentCategory.id)
    : [];

  const isIdle =
    isRoot && !isSearching && categoryStack.length === 0;

  const mode: 'idle' | 'category' | 'search' =
    searchQuery.trim()
      ? 'search'
      : isIdle
        ? 'idle'
        : 'category';

  const sortParam: Record<SortOption, string> = {
    default: 'id,ASC',
    price_asc: 'price,ASC',
    price_desc: 'price,DESC',
    name_asc: 'title,ASC',
    name_desc: 'title,DESC',
  };

  const sortLabel: Record<SortOption, string> = {
    default: 'Predeterminado',
    price_asc: 'Precio ↑',
    price_desc: 'Precio ↓',
    name_asc: 'A → Z',
    name_desc: 'Z → A',
  };

  useEffect(() => {
    if (mode === 'idle') return;

    const fetchProducts = async () => {
      setLoadingProducts(true);

      try {
        let url: URL;

        if (mode === 'search') {
          const text = searchQuery.trim();
          if (!text) return;

          url = new URL(
            'https://www.lajustaunlp.com.ar/api/product'
          );

          url.searchParams.set('filter', `"${text}"`);
          url.searchParams.set(
            'properties',
            JSON.stringify([
              { key: 'deletedAt', value: 'null' },
            ])
          );
        } else {
          const baseUrl = currentCategory
            ? buildProductUrl(currentCategory.id)
            : buildAllProductsUrl();

          url = new URL(baseUrl);
        }

        url.searchParams.set(
          'range',
          `${page},${PAGE_SIZE}`
        );
        url.searchParams.set(
          'sort',
          sortParam[sortOption]
        );

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
  }, [mode, page, currentCategory, searchQuery, sortOption]);

  const openProduct = (id: number) =>
    setSelectedProductId(id);

  const closeProduct = () =>
    setSelectedProductId(null);

  const handleSelectCategory = (category: Category) => {
    setSearchText('');
    setSearchQuery('');
    setIsSearching(false);
    setPage(0);
    setProducts([]);
    setCategoryStack((prev) => [...prev, category]);
  };

  const handleBack = () => {
    setSearchText('');
    setSearchQuery('');
    setIsSearching(false);
    setPage(0);
    setProducts([]);
    setCategoryStack((prev) => prev.slice(0, -1));
  };

  const handleBackFromSearch = () => {
    setSearchText('');
    setSearchQuery('');
    setIsSearching(false);
    setPage(0);
    setProducts([]);
  };

  const executeSearch = () => {
    const text = searchText.trim();

    if (!text) {
      setSearchQuery('');
      setIsSearching(false);
      setProducts([]);
      setPage(0);
      return;
    }

    setSearchQuery(text);
    setIsSearching(true);
    setPage(0);
  };

  const showProducts = !isIdle;
  const showPagination =
    !isIdle && products.length > 0;

  const showEmptyState =
    showProducts &&
    !loadingProducts &&
    products.length === 0;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.scrollWrapper}>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) =>
            setScrollY(
              e.nativeEvent.contentOffset.y
            )
          }
        >
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              onSubmit={executeSearch}
            />
          </View>

          {(!isRoot || isSearching) && (
            <>
              <AnimatedButton
                title="← Volver"
                onPress={
                  isSearching
                    ? handleBackFromSearch
                    : handleBack
                }
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
                      onPress={
                        handleSelectCategory
                      }
                    />
                  )}
                </>
              )}
            </>
          )}

          {isRoot && !isSearching && (
            <CategoryGrid
              categories={rootCategories}
              onPress={handleSelectCategory}
            />
          )}

          {products.length > 0 && (
            <View style={styles.sortContainer}>
              <Pressable
                onPress={() =>
                  setSortOpen((v) => !v)
                }
                style={styles.dropdownHeader}
              >
                <ThemedText>
                  Ordenar por...
                </ThemedText>
                <ThemedText>▼</ThemedText>
              </Pressable>

              {sortOpen && (
                <View style={styles.dropdown}>
                  {(Object.keys(
                    sortLabel
                  ) as SortOption[]).map((key) => (
                    <Pressable
                      key={key}
                      onPress={() => {
                        setSortOption(key);
                        setPage(0);
                        setSortOpen(false);
                      }}
                      style={[
                        styles.dropdownItem,
                        sortOption === key &&
                          styles.dropdownItemActive,
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.dropdownText,
                          sortOption === key &&
                            styles.dropdownTextActive,
                        ]}
                      >
                        {sortLabel[key]}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}

          {showProducts &&
            (loadingProducts ? (
              <ThemedText>
                Cargando productos...
              </ThemedText>
            ) : (
              <ProductGrid
                products={products}
                onSelectProduct={openProduct}
              />
            ))}

          {showEmptyState && (
            <ThemedText style={styles.empty}>
              No se encontraron productos
            </ThemedText>
          )}

          {showPagination && (
            <View style={styles.pagination}>
              {page > 0 ? (
                <AnimatedButton
                  title="← Anterior"
                  onPress={() =>
                    setPage(page - 1)
                  }
                />
              ) : (
                <View style={{ width: 100 }} />
              )}

              <ThemedText>
                Página {page + 1}
              </ThemedText>

              {products.length === PAGE_SIZE ? (
                <AnimatedButton
                  title="Siguiente →"
                  onPress={() =>
                    setPage(page + 1)
                  }
                />
              ) : (
                <View style={{ width: 100 }} />
              )}
            </View>
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
  container: { flex: 1, padding: 24 },

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

  sortContainer: {
    marginBottom: 12,
    zIndex: 10,
  },

  dropdownHeader: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownItemActive: {
    backgroundColor: '#16a34a',
  },

  dropdownText: {
    fontSize: 13,
    color: '#374151',
  },

  dropdownTextActive: {
    color: 'white',
    fontWeight: '700',
  },
});