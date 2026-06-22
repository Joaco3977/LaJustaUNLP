import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Category } from '@/hooks/use-categories';

/* ===== GRID CONFIG ===== */
const PADDING = 24;
const COLUMN_GAP = 12;
const ROW_GAP = 30;
const MAX_COLUMNS = 4;

const SCREEN_WIDTH = Dimensions.get('window').width;
const AVAILABLE_WIDTH = SCREEN_WIDTH - PADDING * 2;

const ITEM_SIZE =
  (AVAILABLE_WIDTH - COLUMN_GAP * (MAX_COLUMNS - 1)) /
  MAX_COLUMNS;

/* ===== IMAGES ===== */
const CATEGORY_IMAGES: Record<number, any> = {
  1: require('@/assets/images/categories/categorySample.png'),
  2: require('@/assets/images/categories/categorySample.png'),
  3: require('@/assets/images/categories/categorySample.png'),
};

const FALLBACK_IMAGE = require('@/assets/images/categories/categorySample.png');

type Props = {
  categories: Category[];
  onPress: (category: Category) => void;
};

export function CategoryGrid({ categories, onPress }: Props) {
  return (
    <View style={styles.grid}>
      {categories.map((item, index) => {
        const isLastColumn = (index + 1) % MAX_COLUMNS === 0;
        const imageSource =
          CATEGORY_IMAGES[item.id] ?? FALLBACK_IMAGE;

        return (
          <Pressable
            key={item.id}
            onPress={() => onPress(item)}
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
            <ThemedText style={styles.cardText}>
              {item.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  cardText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
});