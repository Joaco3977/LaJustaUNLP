import {
    StyleSheet
} from 'react-native';

import { Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';


export default function HelpScreen() {

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen options={{ title: 'Ayuda' }} />
        <ThemedText type="title">
          Work in Progress
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