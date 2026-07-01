import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = 'Buscar productos...',
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.tabIconDefault,
        },
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.title + '99'}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        style={[
          styles.input,
          {
            color: colors.title,
            backgroundColor: 'transparent',
            textAlignVertical: 'center',
          },
        ]}
      />

      <Pressable onPress={onSubmit} style={styles.button}>
        <IconSymbol
          name="arrow.right"
          size={18}
          color={colors.title}
        />
      </Pressable>
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
    borderWidth: 2,
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  button: {
    padding: 6,
    borderRadius: 8,
  },
});