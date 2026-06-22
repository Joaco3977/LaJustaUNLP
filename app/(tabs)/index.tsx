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

export default function HomeScreen() {
  const {
    rootCategories,
    getChildren,
    loading,
  } = useCategories();

  /* ===== CATEGORY STACK ===== */
  const [stack, setStack] = useState<Category[]>([]);

  const currentCategory =
    stack.length > 0 ? stack[stack.length - 1] : null;

  const visibleCategories = currentCategory
    ? getChildren(currentCategory.id)
    : rootCategories;

  const handlePress = (category: Category) => {
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

    setStack((prev) => [...prev, category]);
  };

  const handleBack = () => {
    setStack((prev) => prev.slice(0, -1));
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.searchContainer}>
          <SearchBar />
        </View>

        {/* ===== BACK BUTTON ===== */}
        {currentCategory && (
          <Pressable onPress={handleBack}>
            <ThemedText style={styles.back}>
              ← Volver
            </ThemedText>
          </Pressable>
        )}

        {/* ===== TITLE ===== */}
        {currentCategory && (
          <ThemedText style={styles.title}>
            {currentCategory.name}
          </ThemedText>
        )}

        {/* ===== CATEGORY GRID ===== */}
        {!loading && (
          <CategoryGrid
            categories={visibleCategories}
            onPress={handlePress}
          />
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