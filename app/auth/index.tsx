import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth.store';

const logo = require('@/assets/images/logo.png');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const login = useAuthStore(state => state.login);
  const { apiFetch } = useAuth();

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const logoSize = width * 0.75;

  const handleLogin = async () => {
    if (!userName || !password) {
      setError('Completa correo y contraseña');
      return;
    }

    if (!emailRegex.test(userName)) {
      setError('El correo no tiene un formato válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch('/token/generate-token', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({
          userName,
          userPassword: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      const data = await response.json();
      await login(data.value, data.user);

      router.replace('/');
    } catch (err: any) {
      setError(err.message ?? 'Error de login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View
        style={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
      >
        {/* LOGO */}
        <View style={styles.logoWrapper}>
          <Image
            source={logo}
            style={{
              width: logoSize,
              height: logoSize,
              borderRadius: logoSize / 2,
              resizeMode: 'contain',
            }}
          />
        </View>

        {/* TITLE */}
        <ThemedText type="title" style={styles.title}>
          Iniciar sesión
        </ThemedText>

        {/* EMAIL */}
        <TextInput
          placeholder="Correo electrónico"
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
          ]}
        />

        {/* PASSWORD */}
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[
            styles.input,
          ]}
        />

        {/* ERROR */}
        {error && (
          <ThemedText style={styles.error}>
            {error}
          </ThemedText>
        )}

        {/* BUTTON */}
        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.tabIconDefault },
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.buttonText} />
          ) : (
            <ThemedText
              style={[
                styles.buttonText,
                { color: theme.buttonText },
              ]}
            >
              Iniciar sesión
            </ThemedText>
          )}
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  logoWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'contain',
  },

  title: {
    textAlign: 'center',
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },

  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 4,
  },
});