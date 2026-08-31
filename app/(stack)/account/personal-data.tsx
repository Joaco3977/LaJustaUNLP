import { useEffect, useState } from 'react';
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
import { useAuth } from '@/hooks/use-user';
import { useAuthStore } from '@/stores/auth.store';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  apartment: string;
  floor: string;
};

export default function PersonalDataScreen() {
  const user = useAuthStore(
    state => state.user
  );

  const { updateUser } = useAuth();

  const [form, setForm] =
    useState<FormState>({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      number: '',
      apartment: '',
      floor: '',
    });

  const [saving, setSaving] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  /*
   * AUTORELLENO DESDE AUTH STORE
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      street: user.address?.street ?? '',
      number: user.address?.number ?? '',
      apartment:
        user.address?.apartment ?? '',
      floor:
        user.address?.floor ?? '',
    });
  }, [user]);

  const primaryColor = useThemeColor(
    {},
    'tint'
  );

  const disabledColor = useThemeColor(
    {},
    'tabIconDefault'
  );

  /*
   * Actualizar campo.
   */
  const updateField = (
    key: keyof FormState,
    value: string
  ) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));

    /*
     * Limpiamos mensajes anteriores
     * cuando el usuario vuelve a editar.
     */
    setSuccessMessage('');
    setErrorMessage('');
  };

  /*
   * VALIDACIONES
   */
  const emailValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      form.email
    );

  const phoneValid =
    /^[0-9]{6,15}$/.test(form.phone);

  const requiredFilled =
    !!form.firstName &&
    !!form.lastName &&
    !!form.email &&
    !!form.phone &&
    !!form.street &&
    !!form.number;

  const formValid =
    requiredFilled &&
    emailValid &&
    phoneValid;

  /*
   * ¿Hay cambios respecto del usuario
   * almacenado?
   */
  const hasChanges =
    !!user &&
    (
      form.firstName !==
        (user.firstName ?? '') ||

      form.lastName !==
        (user.lastName ?? '') ||

      form.email !==
        (user.email ?? '') ||

      form.phone !==
        (user.phone ?? '') ||

      form.street !==
        (user.address?.street ?? '') ||

      form.number !==
        (user.address?.number ?? '') ||

      form.apartment !==
        (user.address?.apartment ?? '') ||

      form.floor !==
        (user.address?.floor ?? '')
    );

  const canSubmit =
    formValid &&
    hasChanges &&
    !saving;

  /*
   * GUARDAR CAMBIOS
   */
  const handleSave = async () => {
    if (!user || !canSubmit) {
      return;
    }

    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload = {
        ...user,

        firstName:
          form.firstName,

        lastName:
          form.lastName,

        email:
          form.email,

        phone:
          form.phone,

        address: {
          ...user.address,

          street:
            form.street,

          number:
            form.number,

          apartment:
            form.apartment || null,

          floor:
            form.floor || null,
        },
      };

      const updatedUser =
        await updateUser(payload);

      console.log(
        'Usuario actualizado correctamente'
      );

      console.log(
        'Respuesta:',
        updatedUser
      );

      setSuccessMessage(
        'Tus datos fueron actualizados correctamente.'
      );
    } catch (error) {
      console.error(
        'Error al actualizar usuario',
        error
      );

      setErrorMessage(
        'No se pudieron actualizar tus datos. Intentá nuevamente.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Mis datos personales',
        }}
      />

      <ThemedView
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={
            styles.scroll
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>

            <Input
              label="Nombre *"
              value={form.firstName}
              onChange={value =>
                updateField(
                  'firstName',
                  value
                )
              }
            />

            <Input
              label="Apellido *"
              value={form.lastName}
              onChange={value =>
                updateField(
                  'lastName',
                  value
                )
              }
            />

            <Input
              label="Correo *"
              value={form.email}
              onChange={value =>
                updateField(
                  'email',
                  value
                )
              }
              keyboardType="email-address"
            />

            <Input
              label="Teléfono *"
              value={form.phone}
              onChange={value =>
                updateField(
                  'phone',
                  value
                )
              }
              keyboardType="phone-pad"
            />

            <Input
              label="Calle *"
              value={form.street}
              onChange={value =>
                updateField(
                  'street',
                  value
                )
              }
            />

            <Input
              label="Número *"
              value={form.number}
              onChange={value =>
                updateField(
                  'number',
                  value
                )
              }
              keyboardType="numeric"
            />

            <Input
              label="Depto"
              value={form.apartment}
              onChange={value =>
                updateField(
                  'apartment',
                  value
                )
              }
            />

            <Input
              label="Piso"
              value={form.floor}
              onChange={value =>
                updateField(
                  'floor',
                  value
                )
              }
              keyboardType="numeric"
            />

          </View>

          {/* MENSAJE DE ÉXITO */}
          {successMessage !== '' && (
            <ThemedText
              style={styles.successMessage}
            >
              ✓ {successMessage}
            </ThemedText>
          )}

          {/* MENSAJE DE ERROR */}
          {errorMessage !== '' && (
            <ThemedText
              style={styles.errorMessage}
            >
              {errorMessage}
            </ThemedText>
          )}

          {/* BOTÓN GUARDAR */}
          <Pressable
            disabled={!canSubmit}
            style={[
              styles.saveButton,
              {
                backgroundColor:
                  canSubmit
                    ? primaryColor
                    : disabledColor,

                opacity:
                  canSubmit
                    ? 1
                    : 0.6,
              },
            ]}
            onPress={handleSave}
          >
            <ThemedText
              style={{
                color: '#fff',
                fontWeight: '600',
              }}
            >
              {saving
                ? 'Guardando...'
                : 'Guardar cambios'}
            </ThemedText>
          </Pressable>
        </ScrollView>
      </ThemedView>
    </>
  );
}

/*
 * INPUT
 */
function Input({
  label,
  value,
  onChange,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad';
}) {
  const borderColor =
    useThemeColor(
      {},
      'tabIconDefault'
    );

  const textColor =
    useThemeColor(
      {},
      'text'
    );

  return (
    <View
      style={
        styles.inputContainer
      }
    >
      <ThemedText>
        {label}
      </ThemedText>

      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={
          keyboardType
        }
        style={[
          styles.input,
          {
            borderColor,
            color: textColor,
          },
        ]}
      />
    </View>
  );
}

/*
 * STYLES
 */
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

  saveButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  successMessage: {
    marginTop: 8,
  },

  errorMessage: {
    marginTop: 8,
  },
});