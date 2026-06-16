import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, TextInput, View } from 'react-native';

export function SearchBar() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <IconSymbol name="magnifyingglass" size={20} color={colors.text} />
      <TextInput
        placeholder="Buscar productos..."
        placeholderTextColor={colors.text + '99'}
        style={[styles.input, { color: colors.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});