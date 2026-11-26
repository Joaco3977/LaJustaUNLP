import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Animated,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-user';
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

  const logoSize = Math.min(width * 0.65, 260);
  const smallLogoSize = 88;

  /* ---------------- KEYBOARD ANIMATION ---------------- */

  const keyboardAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios'
        ? 'keyboardWillShow'
        : 'keyboardDidShow';

    const hideEvent =
      Platform.OS === 'ios'
        ? 'keyboardWillHide'
        : 'keyboardDidHide';

    const animateKeyboard = (visible: boolean) => {
      Animated.timing(keyboardAnimation, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    };

    const showSubscription = Keyboard.addListener(
      showEvent,
      () => animateKeyboard(true),
    );

    const hideSubscription = Keyboard.addListener(
      hideEvent,
      () => animateKeyboard(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardAnimation]);

  /* ---------------- ANIMATED VALUES ---------------- */

  const animatedLogoSize = keyboardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [logoSize, smallLogoSize],
  });

  const animatedLogoWrapperHeight = keyboardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [logoSize, smallLogoSize],
  });

  const animatedLogoMargin = keyboardAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 12],
  });

  /* ---------------- LOGIN ---------------- */

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

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={[
          styles.keyboardContainer,
          { backgroundColor: theme.background },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            {/* LOGO ANIMADO */}
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  height: animatedLogoWrapperHeight,
                  marginBottom: animatedLogoMargin,
                },
              ]}
            >
              <Animated.Image
                source={logo}
                style={{
                  width: animatedLogoSize,
                  height: animatedLogoSize,
                  resizeMode: 'contain',
                }}
              />
            </Animated.View>

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
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              style={styles.input}
            />

            {/* PASSWORD */}
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              style={styles.input}
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
                loading && styles.buttonDisabled,
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

            {/* REGISTER */}
            <View style={styles.registerContainer}>
              <ThemedText style={styles.registerText}>
                ¿No tienes una cuenta?
              </ThemedText>

              <Pressable
                onPress={() => router.push('/auth/register')}
                disabled={loading}
              >
                <ThemedText
                  style={[
                    styles.registerLink,
                    { color: theme.tabIconDefault },
                  ]}
                >
                  Regístrate
                </ThemedText>
              </Pressable>
            </View>

            {/* RECOVER PASSWORD */}
            <View style={styles.recoverContainer}>
              <ThemedText style={styles.recoverText}>
                ¿Olvidaste tu contraseña?
              </ThemedText>

              <Pressable
                onPress={() => router.push('/auth/recover-password')}
                disabled={loading}
              >
                <ThemedText
                  style={[
                    styles.recoverLink,
                    { color: theme.tabIconDefault },
                  ]}
                >
                  Recuperar
                </ThemedText>
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
  },

  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
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

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 5,
  },

  recoverContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 5,
  },

  recoverText: {
    fontSize: 14,
  },

  recoverLink: {
    fontSize: 14,
    fontWeight: '700',
  },

  registerText: {
    fontSize: 14,
  },

  registerLink: {
    fontSize: 14,
    fontWeight: '700',
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 4,
  },
});