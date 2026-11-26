
import { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-user';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function RecoverPasswordScreen() {
  const router = useRouter();

  const scheme = useThemeColor() ?? 'light';
  const theme = Colors[scheme];

  const { apiFetch } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleRecovery = async () => {
    setError('');

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Ingresá tu correo electrónico.');
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      setError('Ingresá un correo electrónico válido.');
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch('/email/recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
        skipAuth: true,
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        // La respuesta puede no contener un JSON.
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          'No se pudo procesar la solicitud. Intentá nuevamente.'
        );
      }

      Alert.alert(
        'Solicitud enviada',
        'Si el correo ingresado está registrado, recibirás un email con las instrucciones para recuperar tu contraseña.',
        [
          {
            text: 'Volver al inicio de sesión',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al solicitar la recuperación.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Recuperar contraseña',
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.container,
              { backgroundColor: theme.background },
            ]}
          >
            <ThemedText type="title" style={styles.title}>
              Recuperar contraseña
            </ThemedText>

            <ThemedText style={styles.description}>
              Ingresa el correo que utilizaste para registrarte en La Justa, y te enviaremos un email con la información.
            </ThemedText>

            <ThemedText style={styles.label}>
              Correo electrónico
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                {
                  borderColor: theme.tabIconDefault,
                  color: theme.text,
                },
              ]}
              placeholder="ejemplo@correo.com"
              placeholderTextColor={theme.tabIconDefault}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            {error !== '' && (
              <ThemedText style={styles.error}>
                {error}
              </ThemedText>
            )}

            <Pressable
              style={[
                styles.button,
                { backgroundColor: theme.tint },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleRecovery}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.buttonText}>
                  Enviar instrucciones
                </ThemedText>
              )}
            </Pressable>

            <Pressable
              style={styles.backContainer}
              onPress={() => router.back()}
              disabled={loading}
            >
              <ThemedText
                style={[
                  styles.backText,
                  { color: theme.tabIconDefault },
                ]}
              >
                Volver al inicio de sesión
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 24,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.75,
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  backContainer: {
    alignItems: 'center',
    marginTop: 22,
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
