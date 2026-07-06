import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/stores/auth.store';

export default function StackLayout() {
  const scheme = useColorScheme() ?? 'light';

  const isAuthenticated = useAuthStore(
    state => state.isAuthenticated
  );

  // GUARD DE AUTENTICACIÓN
  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: Colors[scheme].tab,
        },
        headerTintColor: Colors[scheme].tabIconDefault,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    />
  );
}