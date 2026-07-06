import { Redirect, Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    state => state.isAuthenticated
  );

  const totalItems = useCartStore(
    state => state.getTotalItems()
  );

  const theme = Colors[colorScheme];

  // GUARD DE AUTENTICACIÓN
  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        tabBarButton: HapticTab,

        tabBarStyle: {
          backgroundColor: theme.tab,
        },

        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        headerLeft: () => (
          <View style={styles.leftContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
            />
          </View>
        ),

        headerTitle: ({ children }) => (
          <ThemedText
            type="subtitle"
            style={{ color: theme.tabName }}
          >
            {children}
          </ThemedText>
        ),

        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <Pressable onPress={() => router.push('/cart')}>
              <View style={styles.cartIconWrapper}>
                <IconSymbol
                  name="cart.fill"
                  size={32}
                  color={theme.tabIconDefault}
                />

                {totalItems > 0 && (
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>
                      {totalItems}
                    </ThemedText>
                  </View>
                )}
              </View>
            </Pressable>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="products"
        options={{
          title: 'Productos',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              name="shippingbox.fill"
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="producers"
        options={{
          title: 'Productores',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              name="person.3.fill"
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: 'Nosotros',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="info" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: 'Mi Cuenta',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              name="person.crop.circle"
              size={28}
              color={color}
            />
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
  cartIconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ff7043',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});