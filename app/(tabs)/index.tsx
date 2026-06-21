import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/* ===== TYPES ===== */
type Category = {
  id: number;
  name: string;
  parent: {
    id: number;
  } | null;
};

/* ===== CONFIG GRID ===== */
const PADDING = 24;
const COLUMN_GAP = 12;
const ROW_GAP = 30;
const MAX_COLUMNS = 4;

const SCREEN_WIDTH = Dimensions.get('window').width;
const AVAILABLE_WIDTH = SCREEN_WIDTH - PADDING * 2;

const ITEM_SIZE =
  (AVAILABLE_WIDTH - COLUMN_GAP * (MAX_COLUMNS - 1)) / MAX_COLUMNS;

/* ===== IMÁGENES ===== */
const CATEGORY_IMAGES: Record<number, any> = {
  1: require('@/assets/images/categories/categorySample.png'),
  2: require('@/assets/images/categories/categorySample.png'),
  3: require('@/assets/images/categories/categorySample.png'),
  4: require('@/assets/images/categories/categorySample.png'),
  5: require('@/assets/images/categories/categorySample.png'),
  6: require('@/assets/images/categories/categorySample.png'),
  7: require('@/assets/images/categories/categorySample.png'),
  8: require('@/assets/images/categories/categorySample.png'),
  9: require('@/assets/images/categories/categorySample.png'),
};

const FALLBACK_IMAGE = require('@/assets/images/categories/categorySample.png');

/* ===== API ===== */
const CATEGORY_ENDPOINT =
  'https://www.lajustaunlp.com.ar/api/category?properties=%5B%7B%22key%22%3A%22deletedAt%22%2C%22value%22%3A%22%22%7D%5D&sort=id%2CASC';

/* ===== PRODUCT URL ===== */
const buildProductUrl = (categoryId: number) => {
  const properties = encodeURIComponent(
    JSON.stringify([
      { key: 'categories.id', value: categoryId },
      { key: 'deletedAt', value: 'null' },
    ])
  );

  return `https://www.lajustaunlp.com.ar/api/product?properties=${properties}&range=0,12&sort=id,ASC`;
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH ONCE ===== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(CATEGORY_ENDPOINT);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        const all: Category[] = json.page ?? [];

        setAllCategories(all);

        const mainCategories = all.filter(
          (cat) => cat.parent === null
        );

        setCategories(mainCategories);
      } catch (error) {
        console.error('Error cargando categorías', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* ===== CHILD CATEGORIES ===== */
  const getChildCategories = (parentId: number) => {
    return allCategories.filter(
      (cat) => cat.parent?.id === parentId
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <SearchBar />

        <View style={styles.sectionHeader}>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            Explorá nuestras categorías
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.subtext }]}>
            Elegí, comprá y disfrutá
          </ThemedText>
        </View>

        <View style={styles.grid}>
          {!loading &&
            categories.map((item, index) => {
              const isLastColumn = (index + 1) % MAX_COLUMNS === 0;
              const imageSource =
                CATEGORY_IMAGES[item.id] ?? FALLBACK_IMAGE;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    const url = buildProductUrl(item.id);
                    console.log('URL productos:', url);

                    const children = getChildCategories(item.id);

                    console.log(
                      `Hijos de "${item.name}"`,
                      children.map((c) => ({
                        id: c.id,
                        name: c.name,
                      }))
                    );
                  }}
                  style={[
                    styles.card,
                    {
                      width: ITEM_SIZE,
                      marginRight: isLastColumn ? 0 : COLUMN_GAP,
                      marginBottom: ROW_GAP,
                    },
                  ]}
                >
                  <Image source={imageSource} style={styles.image} />

                  <ThemedText style={styles.cardText} numberOfLines={2}>
                    {item.name}
                  </ThemedText>
                </Pressable>
              );
            })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PADDING,
  },
  scroll: {
    paddingBottom: 24,
  },
  sectionHeader: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    alignItems: 'center',
  },
  image: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 14,
    resizeMode: 'cover',
  },
  cardText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
});