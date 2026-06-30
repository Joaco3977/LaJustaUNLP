/**
 * Hook para obtener colores del theme activo
 * (definido en el layout con ThemeProvider)
 */

import { Colors } from '@/constants/theme';
import { useTheme } from '@react-navigation/native';

export function useThemeColor(
  _props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) {
  const theme = useTheme();

  /**
   * React Navigation solo expone:
   * theme.dark -> boolean
   * entonces mapeamos eso a nuestros colores
   */
  const colorSet = theme.dark
    ? Colors.dark
    : Colors.light;

  return colorSet[colorName];
}