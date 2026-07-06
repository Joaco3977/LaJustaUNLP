import { Stack } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useNodes } from '@/hooks/use-nodes';

export default function PickupNodesScreen() {
  const { nodes, loading, error } = useNodes();

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen options={{ title: 'Nodos de retiro' }} />

      <ThemedView style={styles.container}>

        {loading && (
          <ActivityIndicator size="large" />
        )}

        {error && (
          <ThemedText style={styles.error}>
            {error}
          </ThemedText>
        )}

        <FlatList
          data={nodes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ThemedView style={styles.card}>
              <ThemedText type="defaultSemiBold">
                {item.name}
              </ThemedText>

              <ThemedText>
                {item.address.street} {item.address.number ?? ''}
              </ThemedText>

              {item.phone && (
                <ThemedText>
                  📞 {item.phone}
                </ThemedText>
              )}

              {item.hasFridge && (
                <ThemedText>
                  🧊 Tiene heladera
                </ThemedText>
              )}
            </ThemedView>
          )}
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  list: {
    paddingTop: 12,
    gap: 12,
  },
  card: {
    padding: 12,
    borderRadius: 10,
    gap: 4,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});