import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Category = {
  id: string;
  title: string;
  image: any;
};

/* ===== CONFIG DEL GRID ===== */
const PADDING = 24;
const COLUMN_GAP = 12;
const ROW_GAP = 30;
const MAX_COLUMNS = 4;

const SCREEN_WIDTH = Dimensions.get('window').width;
const AVAILABLE_WIDTH = SCREEN_WIDTH - PADDING * 2;

const ITEM_SIZE =
  (AVAILABLE_WIDTH - COLUMN_GAP * (MAX_COLUMNS - 1)) / MAX_COLUMNS;

/* ===== DATA DE LAS CATEGORIAS ===== */
const CATEGORIES: Category[] = [
  { id: '1', title: 'Verduras', image: require('@/assets/images/categories/categorySample.png') },
  { id: '2', title: 'Frutas', image: require('@/assets/images/categories/categorySample.png') },
  { id: '3', title: 'Lácteos', image: require('@/assets/images/categories/categorySample.png') },
  { id: '4', title: 'Panadería', image: require('@/assets/images/categories/categorySample.png') },
  { id: '5', title: 'Bebidas', image: require('@/assets/images/categories/categorySample.png') },
  { id: '6', title: 'Carnes', image: require('@/assets/images/categories/categorySample.png') },
  { id: '7', title: 'Almacén', image: require('@/assets/images/categories/categorySample.png') },
  { id: '8', title: 'Ofertas', image: require('@/assets/images/categories/categorySample.png') },
  { id: '9', title: 'Higiene', image: require('@/assets/images/categories/categorySample.png') },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <SearchBar />

        <View style={styles.sectionHeader}>
          <ThemedText type="title" style={[styles.title, { color: colors.text }]}>
            Explorá nuestras categorías
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: colors.subtext }]}>
            Elegí, comprá y disfrutá
          </ThemedText>
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {CATEGORIES.map((item, index) => {
            const isLastColumn = (index + 1) % MAX_COLUMNS === 0;

            return (
              <View
                key={item.id}
                style={[
                  styles.card,
                  {
                    width: ITEM_SIZE,
                    marginRight: isLastColumn ? 0 : COLUMN_GAP,
                    marginBottom: ROW_GAP,
                  },
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.image}
                />

                <ThemedText style={styles.cardText} numberOfLines={2}>
                  {item.title}
                </ThemedText>
              </View>
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
    height: ITEM_SIZE, // 👈 cuadrada SIEMPRE
    borderRadius: 14,
    resizeMode: 'cover',
  },

  cardText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
});