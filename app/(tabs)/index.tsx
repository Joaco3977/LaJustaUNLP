import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { CategoryGrid } from '@/components/category/category-grid';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  Category,
  buildProductUrl,
  useCategories,
} from '@/hooks/use-categories';

/* ===== VIEW STATE ===== */
type ViewState =
  | { type: 'ROOT' }
  | { type: 'CATEGORY'; category: Category };

export default function HomeScreen() {
  const {
    rootCategories,
    getChildren,
    loading,
  } = useCategories();

  const [view, setView] = useState<ViewState>({
    type: 'ROOT',
  });

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>

        {/* ===== ROOT CATEGORIES ===== */}
        {!loading && view.type === 'ROOT' && (
          <CategoryGrid
            categories={rootCategories}
            onPress={(category) => {
              const url = buildProductUrl(category.id);
              const children = getChildren(category.id);

              console.log('URL productos:', url);
              console.log(
                `Hijos de "${category.name}"`,
                children.map((c) => ({
                  id: c.id,
                  name: c.name,
                }))
              );

              setView({
                type: 'CATEGORY',
                category,
              });
            }}
          />
        )}

        {/* ===== CATEGORY VIEW ===== */}
        {!loading && view.type === 'CATEGORY' && (
          <>
            <Pressable
              onPress={() => setView({ type: 'ROOT' })}
            >
              <ThemedText style={styles.back}>
                ← Volver
              </ThemedText>
            </Pressable>

            <ThemedText style={styles.title}>
              {view.category.name}
            </ThemedText>

            <CategoryGrid
              categories={getChildren(view.category.id)}
              onPress={(subcategory) => {
                const url = buildProductUrl(subcategory.id);
                const children = getChildren(subcategory.id);

                console.log('URL productos:', url);
                console.log(
                  `Hijos de "${subcategory.name}"`,
                  children.map((c) => ({
                    id: c.id,
                    name: c.name,
                  }))
                );
              }}
            />
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
  back: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
});