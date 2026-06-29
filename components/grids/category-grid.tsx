import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Category } from '@/hooks/use-categories';

const PADDING = 24;
const COLUMN_GAP = 12;
const ROW_GAP = 30;
const MAX_COLUMNS = 4;

const SCREEN_WIDTH = Dimensions.get('window').width;
const AVAILABLE_WIDTH = SCREEN_WIDTH - PADDING * 2;

const ITEM_SIZE =
  (AVAILABLE_WIDTH - COLUMN_GAP * (MAX_COLUMNS - 1)) /
  MAX_COLUMNS;

const CATEGORY_IMAGES: Record<number, any> = {
  1: require('@/assets/images/categories/ofertas.png'),
  2: require('@/assets/images/categories/ProductosArtesanales.png'),
  3: require('@/assets/images/categories/VerdurasYFrutas.png'),
  4: require('@/assets/images/categories/AlimentosBasicos.png'),
  5: require('@/assets/images/categories/HarinasYPanificados.png'),
  6: require('@/assets/images/categories/Huevos.png'),
  7: require('@/assets/images/categories/Frutas.png'),
  8: require('@/assets/images/categories/Verduras.png'),
  9: require('@/assets/images/categories/Yerbas.png'),
  10: require('@/assets/images/categories/AlimentosDulces.png'),
  12: require('@/assets/images/categories/CondimentosYEspecias.png'),
  13: require('@/assets/images/categories/CarnesYEmbutidos.png'),
  14: require('@/assets/images/categories/Cerdo.png'),
  15: require('@/assets/images/categories/Pollo.png'),
  16: require('@/assets/images/categories/Bebidas.png'),
  17: require('@/assets/images/categories/ChocolatesYAlfajores.png'),
  18: require('@/assets/images/categories/CondimentosYEspecias.png'),
  19: require('@/assets/images/categories/SemillasYSnacks.png'),
  20: require('@/assets/images/categories/ConservasSalsasYTriturados.png'),
  21: require('@/assets/images/categories/Harinas.png'),
  22: require('@/assets/images/categories/CosmeticaEHigiene.png'),
  23: require('@/assets/images/categories/ObjetosArtesanales.png'),
  24: require('@/assets/images/categories/LegumbresGranosYSemillas.png'),
  25: require('@/assets/images/categories/PlantasYFlores.png'),
  26: require('@/assets/images/categories/PastasSecas.png'),
  27: require('@/assets/images/categories/Lacteos.png'),
  28: require('@/assets/images/categories/CafeYTe.png'),
  29: require('@/assets/images/categories/FrutosSecosYSnacks.png'),
  30: require('@/assets/images/categories/Galletitas.png'),
  31: require('@/assets/images/categories/Pan.png'),
  32: require('@/assets/images/categories/AceiteVinagre.png'),
  33: require('@/assets/images/categories/Libros.png'),
  34: require('@/assets/images/categories/Conejo.png'),
  35: require('@/assets/images/categories/Pre-pizzas.png'),
  36: require('@/assets/images/categories/AzucarYMiel.png'),
  37: require('@/assets/images/categories/TartasYBudines.png'),
  38: require('@/assets/images/categories/Fideos.png'),
  39: require('@/assets/images/categories/ArrozYPolenta.png'),
  40: require('@/assets/images/categories/Cerveza.png'),
  42: require('@/assets/images/categories/Jugos.png'),
  43: require('@/assets/images/categories/Vinos.png'),
  44: require('@/assets/images/categories/MermeladasYDulces.png'),
  46: require('@/assets/images/categories/Girgolas.png'),
  47: require('@/assets/images/categories/GinYVermut.png'),
  48: require('@/assets/images/categories/BolsonDeVerdura.png'),
  49: require('@/assets/images/categories/Embutidos.png'),
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
        const isLastColumn =
          (index + 1) % MAX_COLUMNS === 0;

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

            <ThemedText
              style={styles.cardText}
              numberOfLines={2}
            >
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
    minHeight: ITEM_SIZE + 40,
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
    width: '100%',
  },
});