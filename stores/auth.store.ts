import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

/* ---------------- TYPES ---------------- */

type Address = {
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: number;
  address: Address | null;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  hydrated: boolean;

  loadAuth: () => Promise<void>;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
};

const AUTH_STORAGE_KEY = 'auth';

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  hydrated: false,

  loadAuth: async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);

        set({
          token: parsed.token,
          user: parsed.user,
          isAuthenticated: true,
        });
      }
    } catch (e) {
      console.warn('Error loading auth', e);
    } finally {
      set({ hydrated: true });
    }
  },

  login: async (token, user) => {
    const authData = { token, user };

    set({
      token,
      user,
      isAuthenticated: true,
    });

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  },

  updateUser: async (user) => {
    const token = get().token;
    if (!token) return;

    const authData = { token, user };

    set({ user });

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  },

  logout: async () => {
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });

    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  },
}));