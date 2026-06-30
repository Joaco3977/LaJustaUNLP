import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, StateCreator } from 'zustand';

export type CartItem = {
  productId: number;
  quantity: number;
};

// Definicion de la interfaz del estado del carrito de compras
type CartState = {
  cart: CartItem[];

  loadCart: () => Promise<void>;

  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;

  getItemQuantity: (productId: number) => number;
  clearCart: () => void;
};

// Nombre unico del almacenamiento para el carrito de compras
const CART_STORAGE_KEY = 'cart';

// Definicion del creador del estado del carrito de compras
const cartStoreCreator: StateCreator<CartState> = (set, get) => ({
  cart: [],

  loadCart: async () => {
    try {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        set({ cart: JSON.parse(storedCart) });
      }
    } catch (error) {
      console.warn('Error loading cart from storage', error);
    }
  },

  addToCart: (productId: number) => {
    const { cart } = get();
    const existingItem = cart.find(item => item.productId === productId);

    const updatedCart: CartItem[] = existingItem
      ? cart.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { productId, quantity: 1 }];

    set({ cart: updatedCart });
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  },

  increaseQuantity: (productId: number) => {
    const updatedCart = get().cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    set({ cart: updatedCart });
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  },

  decreaseQuantity: (productId: number) => {
    const updatedCart = get().cart
      .map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);

    set({ cart: updatedCart });
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  },

  removeFromCart: (productId: number) => {
    const updatedCart = get().cart.filter(
      item => item.productId !== productId
    );

    set({ cart: updatedCart });
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  },

  getItemQuantity: (productId: number) => {
    const item = get().cart.find(
      item => item.productId === productId
    );
    return item ? item.quantity : 0;
  },

  clearCart: () => {
    set({ cart: [] });
    AsyncStorage.removeItem(CART_STORAGE_KEY);
  },
});

// Creacion del store del carrito de compras usando Zustand
export const useCartStore = create<CartState>(cartStoreCreator);