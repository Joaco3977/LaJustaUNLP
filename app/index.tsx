import { useAuthStore } from '@/stores/auth.store';
import { Redirect } from 'expo-router';

export default function Index() {
  const token = useAuthStore(state => state.token);
  const hydrated = useAuthStore(state => state.hydrated);

  console.log('[Index] hydrated:', hydrated);
  console.log('[Index] token:', token ? 'EXISTS' : 'NULL');

  if (!hydrated) return null;

  return token ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/auth" />
  );
}