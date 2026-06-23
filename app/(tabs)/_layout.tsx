import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,

        headerLeft: () => (
          <View style={styles.leftContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
            />
          </View>
        ),

        headerTitle: ({ children }) => (
          <ThemedText type="subtitle">{children}</ThemedText>
        ),

        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <Pressable onPress={() => router.push('/cart')}>
              <IconSymbol
                name="cart.fill"
                size={32}
                color={Colors[colorScheme ?? 'light'].text}
              />
            </Pressable>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index" // Debe ser "index" para que sea la pantalla predeterminada
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="shippingbox.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="producers"
        options={{
          title: 'Productores',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: 'Nosotros',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: 'Mi Cuenta',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.crop.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  leftContainer: {
    paddingLeft: 16,
  },
  headerRightContainer: {
    marginRight: 16,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
});