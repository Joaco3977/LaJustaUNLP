/**
 * Este componente es un ejemplo de cómo mapear los íconos de SF Symbols
 * a Material Icons para usarlos en Android y web.
 *
 * Los iconos se definen en SF Symbols y luego se mapean manualmente
 * a Material Icons usando el objeto MAPPING.
 */

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<
  SymbolViewProps['name'],
  ComponentProps<typeof MaterialIcons>['name']
>;

type IconSymbolName = keyof typeof MAPPING;

/**
 * Mapeo de SF Symbols → Material Icons
 *
 * - SF Symbols: https://developer.apple.com/sf-symbols/
 * - Material Icons: https://icons.expo.fyi (filtrar por Material Icons)
 */
const MAPPING = {
  /** Navegación / Tabs */
  'house.fill': 'home',
  'shippingbox.fill': 'inventory',
  'person.3.fill': 'groups',
  'info': 'info',
  'person.crop.circle': 'account-circle',

  /** Header / acciones */
  'cart.fill': 'shopping-cart',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'arrow.right': 'arrow-forward',
  'arrow.left': 'arrow-back', // ← MUY IMPORTANTE para botones "volver"

  /** Cuenta */
  'person.fill': 'person', // Mis datos personales
  'lock.fill': 'lock', // Cambiar contraseña
  'doc.text.fill': 'receipt-long', // Mis compras
  'mappin.and.ellipse': 'location-on', // Nodos de retiro
  'questionmark.circle': 'help-outline', // Ayuda
  'rectangle.portrait.and.arrow.right': 'logout', // Cerrar sesión

  /** Otros */
  'gearshape.fill': 'settings',
  'trash.fill': 'delete',
} as IconMapping;

/**
 * Icono unificado:
 * - iOS → SF Symbols
 * - Android / Web → Material Icons
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
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}