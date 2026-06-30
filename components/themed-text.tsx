import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, Text, type TextProps } from 'react-native';

/**
 * Keys válidas del theme para texto
 * (todas existen en theme.ts)
 */
type ThemeColorKey =
  | 'text'
  | 'title'
  | 'subtext'
  | 'tint'
  | 'icon'
  | 'brandText'
  | 'stockText'
  | 'unitDescriptionText'
  | 'outOfStockRibonText';

export type ThemedTextProps = TextProps & {
  /**
   * Color semántico tomado del theme
   * default: 'text'
   */
  color?: ThemeColorKey;

  /**
   * Variante tipográfica
   */
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  color = 'text',
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const textColor = useThemeColor({}, color);

  return (
    <Text
      style={[
        { color: textColor },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },

  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },

  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  link: {
    fontSize: 16,
    lineHeight: 30,
    textDecorationLine: 'underline',
  },
});