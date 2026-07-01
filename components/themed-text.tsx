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
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' |  'cardTitle' | 'cardInfo' | 'unitDescriptionText' | 'link';
};

export function ThemedText({
  style,
  color = 'text',
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const resolvedColor =
  type === 'title'
    ? 'title'
    : type === 'subtitle'
      ? 'subtext'
      : color;
  const textColor = useThemeColor({}, resolvedColor);

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
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 32,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  cardInfo: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  unitDescriptionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  link: {
    fontSize: 16,
    lineHeight: 30,
    textDecorationLine: 'underline',
  },
});