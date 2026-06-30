import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, StateCreator } from 'zustand';

// Definicion de la interfaz del estado de favoritos
type FavoritesState = {
  favorites: number[]; // solo IDs de productos, a diferencia del carrito que tiene cantidad

  loadFavorites: () => Promise<void>;

  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (productId: number) => void;

  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
};

// Nombre unico del almacenamiento para los favoritos
const FAVORITES_STORAGE_KEY = 'favorites';

// Definicion del creador del estado de favoritos
const favoritesStoreCreator: StateCreator<FavoritesState> = (set, get) => ({
  favorites: [],

  loadFavorites: async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(
        FAVORITES_STORAGE_KEY
      );
      if (storedFavorites) {
        set({ favorites: JSON.parse(storedFavorites) });
      }
    } catch (error) {
      console.warn('Error loading favorites from storage', error);
    }
  },

  addFavorite: (productId: number) => {
    const { favorites } = get();
    if (favorites.includes(productId)) return;

    const updatedFavorites = [...favorites, productId];
    set({ favorites: updatedFavorites });
    AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(updatedFavorites)
    );
  },

  removeFavorite: (productId: number) => {
    const updatedFavorites = get().favorites.filter(
      id => id !== productId
    );

    set({ favorites: updatedFavorites });
    AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(updatedFavorites)
    );
  },

  toggleFavorite: (productId: number) => {
    const { favorites } = get();

    const updatedFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];

    set({ favorites: updatedFavorites });
    AsyncStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(updatedFavorites)
    );
  },

  isFavorite: (productId: number) => {
    return get().favorites.includes(productId);
  },

  clearFavorites: () => {
    set({ favorites: [] });
    AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
  },
});

// Creacion del store de favoritos usando Zustand
export const useFavoritesStore =
  create<FavoritesState>(favoritesStoreCreator);