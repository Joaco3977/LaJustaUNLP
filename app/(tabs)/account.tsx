import { router } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AnimatedButton } from '@/components/animated-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuthStore } from '@/stores/auth.store';

export default function AccountScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <ThemedView style={styles.container}>
      {/* Saludo */}
      <ThemedText type="title" style={styles.title}>
        ¡Hola {user?.firstName}!
      </ThemedText>

      {/* Opciones */}
      <ThemedView style={styles.menu}>
        <AnimatedButton
          title="Mis datos personales"
          onPress={() => router.push('/account/personal-data')}
          icon={{ type: 'material', name: 'person' }}
          style={styles.fullWidthButton}
        />

        <AnimatedButton
          title="Cambiar contraseña"
          onPress={() => router.push('/account/change-password')}
          icon={{ type: 'material', name: 'lock' }}
          style={styles.fullWidthButton}
        />

        <AnimatedButton
          title="Mis compras"
          onPress={() => router.push('/account/orders')}
          icon={{ type: 'material', name: 'receipt-long' }}
          style={styles.fullWidthButton}
        />

        <AnimatedButton
          title="Nodos de retiro"
          onPress={() => router.push('/account/pickup-nodes')}
          icon={{ type: 'material', name: 'location-on' }}
          style={styles.fullWidthButton}
        />

        <AnimatedButton
          title="Ayuda"
          onPress={() => router.push('/account/help')}
          icon={{ type: 'material', name: 'help-outline' }}
          style={styles.fullWidthButton}
        />

        <AnimatedButton
          title="Cerrar sesión"
          onPress={() => useAuthStore.getState().logout()}
          icon={{ type: 'material', name: 'logout' }}
          style={styles.fullWidthButton}
        />
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

  fullWidthButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});