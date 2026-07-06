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
  const user = useAuthStore((state) => state.user);

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    apartment: '',
    floor: '',
  });

  /* --------- AUTORELLENO DESDE AUTH STORE --------- */
  useEffect(() => {
    if (!user) return;

    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      street: user.address?.street ?? '',
      number: user.address?.number ?? '',
      apartment: user.address?.apartment ?? '',
      floor: user.address?.floor ?? '',
    });
  }, [user]);

  const primaryColor = useThemeColor({}, 'tint');
  const disabledColor = useThemeColor({}, 'tabIconDefault');

  const updateField = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ---------------- VALIDACIONES ---------------- */

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const phoneValid = /^[0-9]{6,15}$/.test(form.phone);

  const requiredFilled =
    form.firstName &&
    form.lastName &&
    form.email &&
    form.phone &&
    form.street &&
    form.number;

  const formValid = requiredFilled && emailValid && phoneValid;

  const hasChanges =
    user &&
    (
      form.firstName !== (user.firstName ?? '') ||
      form.lastName !== (user.lastName ?? '') ||
      form.email !== (user.email ?? '') ||
      form.phone !== (user.phone ?? '') ||
      form.street !== (user.address?.street ?? '') ||
      form.number !== (user.address?.number ?? '') ||
      form.apartment !== (user.address?.apartment ?? '') ||
      form.floor !== (user.address?.floor ?? '')
    );

  const canSubmit = !!(formValid && hasChanges);

  /* ---------------- UI ---------------- */

  return (
    <>
      <Stack.Screen options={{ title: 'Mis datos personales' }} />

      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Input label="Nombre *" value={form.firstName} onChange={(v) => updateField('firstName', v)} />
            <Input label="Apellido *" value={form.lastName} onChange={(v) => updateField('lastName', v)} />
            <Input label="Correo *" value={form.email} onChange={(v) => updateField('email', v)} keyboardType="email-address" />
            <Input label="Teléfono *" value={form.phone} onChange={(v) => updateField('phone', v)} keyboardType="phone-pad" />

            <Input label="Calle *" value={form.street} onChange={(v) => updateField('street', v)} />
            <Input label="Número *" value={form.number} onChange={(v) => updateField('number', v)} keyboardType="numeric" />

            <Input label="Depto" value={form.apartment} onChange={(v) => updateField('apartment', v)} />
            <Input label="Piso" value={form.floor} onChange={(v) => updateField('floor', v)} keyboardType="numeric" />
          </View>

          {/* BOTÓN GUARDAR */}
          <Pressable
            disabled={!canSubmit}
            style={[
              styles.saveButton,
              {
                backgroundColor: canSubmit ? primaryColor : disabledColor,
                opacity: canSubmit ? 1 : 0.6,
              },
            ]}
            onPress={() => {
              console.log('Datos actualizados:', form);
            }}
          >
            <ThemedText style={{ color: '#fff' }} type="defaultSemiBold">
              Guardar cambios
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}) {
  const borderColor = useThemeColor({}, 'tabIconDefault');
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.inputContainer}>
      <ThemedText>{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={[
          styles.input,
          { borderColor, color: textColor },
        ]}
      />
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

  saveButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});