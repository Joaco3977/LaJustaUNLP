import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Work in Progress</ThemedText>

      <ThemedText type="subtitle" style={styles.subtitle}>
        Aquí se construirá la sección Cuenta
      </ThemedText>

      <ThemedText type="default" style={styles.note}>
        Pantalla solo para desarrollo
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  subtitle: {
    textAlign: 'center',
  },
  note: {
    opacity: 0.6,
  },
});