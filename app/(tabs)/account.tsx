import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuthStore } from '@/stores/auth.store';

export default function AccountScreen() {
  const user = useAuthStore((state) => state.user);

  const buttonBackgroundColor = useThemeColor({}, 'tabIconDefault');
  const buttonTextColor = useThemeColor({}, 'buttonText');

  return (
    <ThemedView style={styles.container}>
      {/* Saludo */}
      <ThemedText type="title" style={styles.title}>
        ¡Hola {user?.firstName}!
      </ThemedText>

      {/* Opciones */}
      <ThemedView style={styles.menu}>
        <Pressable
          style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
          onPress={() => router.push('/account/personal-data')}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.buttonText, { color: buttonTextColor }]}
          >
            Mis datos personales
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
          onPress={() => router.push('/account/orders')}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.buttonText, { color: buttonTextColor }]}
          >
            Mis compras
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
          onPress={() => router.push('/account/pickup-nodes')}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.buttonText, { color: buttonTextColor }]}
          >
            Nodos de retiro
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
          onPress={() => console.log('AYUDA')}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.buttonText, { color: buttonTextColor }]}
          >
            Ayuda
          </ThemedText>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
          onPress={() => useAuthStore.getState().logout()}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.buttonText, { color: buttonTextColor }]}
          >
            Cerrar sesión
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    marginBottom: 24,
  },
  menu: {
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 24,
  },
});