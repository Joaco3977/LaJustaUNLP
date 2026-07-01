import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useCartStore } from '@/stores/cart.store';
import { useFavoritesStore } from '@/stores/favorites.store';

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'light';

  const loadFavorites = useFavoritesStore((state) => state.loadFavorites);
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    loadFavorites();
    loadCart();
  }, []);

  const theme = {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),

      background: Colors[scheme].background,
      card: Colors[scheme].tab,
      text: Colors[scheme].text,
      border: Colors[scheme].card,
      primary: Colors[scheme].tint,
    },
  };

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[scheme].tab,
          },
          headerTintColor: Colors[scheme].tabName,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}