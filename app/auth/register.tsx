
import { Stack, useRouter } from 'expo-router';
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

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-user';
import { useColorScheme } from '@/hooks/use-color-scheme';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen() {
  const router = useRouter();

  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const { apiFetch } = useAuth();

  /* ---------------- FORM STATE ---------------- */

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [apartment, setApartment] = useState('');
  const [floor, setFloor] = useState('');
  const [addressDescription, setAddressDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- REGISTER ---------------- */

  const handleRegister = async () => {
    setError(null);

    // Validaciones obligatorias
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !passwordConfirmation ||
      !street.trim() ||
      !number.trim()
    ) {
      setError('Completa todos los campos obligatorios');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError('El correo no tiene un formato válido');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        description: null,
        image: null,
        encryptedPassword: password,
        passwordConfirmation,
        phone: phone.trim(),
        address: {
          street: street.trim(),
          number: number.trim(),
          apartment: apartment.trim() || null,
          floor: floor.trim() || null,
          description: addressDescription.trim() || null,
          latitude: null,
          longitude: null,
        },
      };

      const response = await apiFetch('/user/signup', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify(payload),
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        // La respuesta podría no contener JSON.
      }

        if (!response.ok) {
        if (response.status === 500) {
            throw new Error(
            'No se pudo crear la cuenta. Es posible que el correo electrónico ya esté registrado. Verifica tus datos e inténtalo nuevamente.'
            );
        }

        throw new Error(
            data?.message ||
            data?.error ||
            'Ocurrió un error al crear tu cuenta.'
        );
        }

      Alert.alert(
        '¡Registro exitoso!',
        'Tu cuenta fue creada correctamente. Ya puedes iniciar sesión.',
        [
          {
            text: 'Ir al login',
            onPress: () => router.back(),
          },
        ],
      );

    } catch (err: any) {
        setError(err.message ?? 'Ocurrió un error durante el registro');
    } finally {
        setLoading(false);
    }
  };

  /* ---------------- INPUT HELPER ---------------- */

  const inputStyle = [
    styles.input,
    {
      borderColor: theme.tabIconDefault,
      color: theme.text,
    },
  ];

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Crear cuenta',
          headerBackTitle: 'Volver',
        }}
      />

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

            {/* TITLE */}

            <ThemedText type="title" style={styles.title}>
              Crear cuenta
            </ThemedText>

            <ThemedText style={styles.subtitle}>
              Completa tus datos para registrarte en La Justa.
            </ThemedText>

            {/* PERSONAL DATA */}

            <ThemedText style={styles.sectionTitle}>
              Datos personales
            </ThemedText>

            <TextInput
              placeholder="Nombre *"
              placeholderTextColor={theme.tabIconDefault}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              returnKeyType="next"
              style={inputStyle}
            />

            <TextInput
              placeholder="Apellido *"
              placeholderTextColor={theme.tabIconDefault}
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              returnKeyType="next"
              style={inputStyle}
            />

            <TextInput
              placeholder="Correo electrónico *"
              placeholderTextColor={theme.tabIconDefault}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              style={inputStyle}
            />

            <TextInput
              placeholder="Teléfono *"
              placeholderTextColor={theme.tabIconDefault}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              returnKeyType="next"
              style={inputStyle}
            />

            {/* PASSWORD */}

            <ThemedText style={styles.sectionTitle}>
              Seguridad
            </ThemedText>

            <TextInput
              placeholder="Contraseña *"
              placeholderTextColor={theme.tabIconDefault}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="next"
              style={inputStyle}
            />

            <TextInput
              placeholder="Confirmar contraseña *"
              placeholderTextColor={theme.tabIconDefault}
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="next"
              style={inputStyle}
            />

            {/* ADDRESS */}

            <ThemedText style={styles.sectionTitle}>
              Dirección
            </ThemedText>

            <TextInput
              placeholder="Calle *"
              placeholderTextColor={theme.tabIconDefault}
              value={street}
              onChangeText={setStreet}
              returnKeyType="next"
              style={inputStyle}
            />

            <TextInput
              placeholder="Número *"
              placeholderTextColor={theme.tabIconDefault}
              value={number}
              onChangeText={setNumber}
              keyboardType="default"
              returnKeyType="next"
              style={inputStyle}
            />

            <View style={styles.row}>
              <TextInput
                placeholder="Piso"
                placeholderTextColor={theme.tabIconDefault}
                value={floor}
                onChangeText={setFloor}
                style={[inputStyle, styles.halfInput]}
              />

              <TextInput
                placeholder="Departamento"
                placeholderTextColor={theme.tabIconDefault}
                value={apartment}
                onChangeText={setApartment}
                style={[inputStyle, styles.halfInput]}
              />
            </View>

            <TextInput
              placeholder="Descripción adicional de la dirección"
              placeholderTextColor={theme.tabIconDefault}
              value={addressDescription}
              onChangeText={setAddressDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={[inputStyle, styles.descriptionInput]}
            />

            {/* ERROR */}

            {error && (
              <ThemedText style={styles.error}>
                {error}
              </ThemedText>
            )}

            {/* REGISTER BUTTON */}

            <Pressable
              style={[
                styles.button,
                { backgroundColor: theme.tabIconDefault },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
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
                  Registrarme
                </ThemedText>
              )}
            </Pressable>

            {/* LOGIN LINK */}

            <View style={styles.loginContainer}>
              <ThemedText style={styles.loginText}>
                ¿Ya tienes una cuenta?
              </ThemedText>

              <Pressable
                onPress={() => router.back()}
                disabled={loading}
              >
                <ThemedText
                  style={[
                    styles.loginLink,
                    { color: theme.tabIconDefault },
                  ]}
                >
                  Iniciar sesión
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
  },

  container: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
  },

  title: {
    textAlign: 'center',
    marginBottom: 6,
    fontSize: 24,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 18,
    opacity: 0.7,
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 9,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 9,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  halfInput: {
    flex: 1,
  },

  descriptionInput: {
    minHeight: 70,
  },

  button: {
    marginTop: 12,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    fontWeight: '700',
    fontSize: 15,
  },

  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 18,
  },

  loginText: {
    fontSize: 13,
  },

  loginLink: {
    fontSize: 13,
    fontWeight: '700',
  },
});