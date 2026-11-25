import {
    StyleSheet
} from 'react-native';

import { Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


export default function PickupNodeScreen() {

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen options={{ title: 'Elegir nodo de retiro' }} />
        <ThemedText type="title">
          WIP Elegir nodo de retiro
        </ThemedText>
      <ThemedView style={styles.container}>

      </ThemedView>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});