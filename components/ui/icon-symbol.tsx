/** Este componente es un ejemplo de cómo mapear los íconos de SF Symbols a Material Icons para usarlos en Android y web.
 * Basicamente los iconos los definimos en SF Symbols, y luego los mapeamos a Material Icons usando el objeto MAPPING. 
 * Esto nos permite usar los mismos nombres de iconos en toda la app, y tener una apariencia consistente en todas las plataformas.
 * Si el mapeo no se hace correctamente o no existe, no se rendizara el icono en Android y web, pero si en iOS. Por eso es importante mantener el mapeo actualizado.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * En esta seccion agregar el mapeo de SF a Android, siguiendo estas reglas:
 * - ver Material Icons en (https://icons.expo.fyi) con el filtro de Material Icons.
 * - ver SF Symbols en (https://developer.apple.com/sf-symbols/).
 */
const MAPPING = {
  'house.fill': 'home', // Para inicio, un icono de casa.
  'person.crop.circle': 'account-circle', // Para cuenta, un icono de persona dentro de un círculo.
  'person.3.fill': 'groups', // Para productores, 3 personas agrupadas.
  'gearshape.fill': 'settings',
  'cart.fill': 'shopping-cart', // Para carrito, un icono de carrito de compras.
  'shippingbox.fill': 'inventory', // Para productos, un icono de caja de envío.
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'arrow.right': 'arrow-forward', // Flecha del botón de búsqueda (SearchBar).
  'info': 'info', // Para nosotros, un icono de información.
  'trash.fill': 'delete', // Para eliminar, un icono de tacho de basura.
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
