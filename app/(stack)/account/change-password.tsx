import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Stack } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type FormState = {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordScreen() {
  const [form, setForm] = useState<FormState>({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const primaryColor = useThemeColor({}, 'tabIconDefault');
  const disabledColor = useThemeColor({}, 'subtext');

  /* --------- SANITIZACIÓN (sin espacios, tabs, enters) --------- */
  const sanitize = (value: string) =>
    value.replace(/\s/g, '');

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: sanitize(value),
    }));
  };

  /* ---------------- VALIDACIONES ---------------- */

  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const passwordsFilled =
    form.currentPassword &&
    form.newPassword &&
    form.confirmPassword;

  const passwordsMatch =
    form.newPassword === form.confirmPassword;

  const newPasswordValid =
    form.newPassword.length >= 8;

  const formValid =
    emailValid &&
    passwordsFilled &&
    passwordsMatch &&
    newPasswordValid;

  const canSubmit = !!formValid;

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen options={{ title: 'Cambiar contraseña' }} />

      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Input
              label="Correo *"
              value={form.email}
              onChange={(v) => updateField('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Contraseña actual *"
              value={form.currentPassword}
              onChange={(v) =>
                updateField('currentPassword', v)
              }
              secureTextEntry
            />

            <Input
              label="Nueva contraseña *"
              value={form.newPassword}
              onChange={(v) =>
                updateField('newPassword', v)
              }
              secureTextEntry
              hint="Mínimo 8 caracteres"
            />

            <Input
              label="Confirmar nueva contraseña *"
              value={form.confirmPassword}
              onChange={(v) =>
                updateField('confirmPassword', v)
              }
              secureTextEntry
              error={
                form.confirmPassword.length > 0 &&
                !passwordsMatch
                  ? 'Las contraseñas no coinciden'
                  : undefined
              }
            />
          </View>

          {/* BOTÓN CONFIRMAR */}
          <Pressable
            disabled={!canSubmit}
            style={[
              styles.saveButton,
              {
                backgroundColor: canSubmit
                  ? primaryColor
                  : disabledColor,
                opacity: canSubmit ? 1 : 0.6,
              },
            ]}
            onPress={() => {
              console.log('Cambio de contraseña:', form);
            }}
          >
            <ThemedText
              style={{ color: '#fff' }}
              type="defaultSemiBold"
            >
              Confirmar
            </ThemedText>
          </Pressable>
        </ScrollView>
      </ThemedView>
    </>
  );
}

/* ---------------- INPUT ---------------- */

function Input({
  label,
  value,
  onChange,
  keyboardType,
  secureTextEntry,
  hint,
  error,
  autoCapitalize = 'none',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
  hint?: string;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) {
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const textColor = useThemeColor({}, 'text');
  const errorColor = useThemeColor({}, 'tint');

  return (
    <View style={styles.inputContainer}>
      <ThemedText>{label}</ThemedText>

      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        spellCheck={false}
        style={[
          styles.input,
          {
            borderColor: error ? errorColor : borderColor,
            color: textColor,
          },
        ]}
      />

      {hint && !error && (
        <ThemedText style={styles.hint}>
          {hint}
        </ThemedText>
      )}

      {error && (
        <ThemedText style={styles.error}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    padding: 24,
    paddingBottom: 48,
    gap: 16,
  },

  form: {
    gap: 12,
  },

  inputContainer: {
    gap: 4,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },

  hint: {
    fontSize: 12,
    opacity: 0.7,
  },

  error: {
    fontSize: 12,
    color: '#d32f2f',
  },

  saveButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});