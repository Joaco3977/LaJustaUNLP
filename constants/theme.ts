import { Platform } from 'react-native';

const tintColorLight = '#ff7043';
const laJustaGreen = '#1b5e20';

const baseTheme = {
  outOfStockRibon: '#ff0000',
  outOfStockRibonText: '#fff',
  brandText: '#ff7043',
  stockText: '#ff7043',
  unitDescriptionText: '#6d4c41',
  priceBackground: '#ffca28',
  unitBackground: '#88b24e',
  bannerBackground: '#fdd6ca',
  buttonText: '#ffffff',
  confirmButton: '#a5db5a',
  cancelButton: '#ee5858',
};

export const Colors = {
  light: {
    ...baseTheme,
    tab: '#eeeeee',
    tabName: laJustaGreen,
    title: '#1b5e20',
    text: '#11181C',
    subtext: '#56595c',
    background: '#ffffff',
    card: '#ffffff',
    detailBackground: '#dddddd',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: laJustaGreen,
    tabIconSelected: tintColorLight,
  },
  dark: {
    ...baseTheme,
    tab: '#eeeeee',
    tabName: laJustaGreen,
    title: '#1b5e20',
    text: '#11181C',
    subtext: '#56595c',
    background: '#ffffff',
    card: '#ffffff',
    detailBackground: '#dddddd',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: laJustaGreen,
    tabIconSelected: tintColorLight,
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
