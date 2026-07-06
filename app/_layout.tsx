import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { useFavoritesStore } from '@/stores/favorites.store';

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'light';

  const loadAuth = useAuthStore(state => state.loadAuth);
  const loadCart = useCartStore(state => state.loadCart);
  const loadFavorites = useFavoritesStore(state => state.loadFavorites);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await loadAuth();
        await loadCart();
        await loadFavorites();
      } finally {
        setReady(true);
      }
    };

    init();
  }, []);

  if (!ready) return null;

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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(stack)" />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}