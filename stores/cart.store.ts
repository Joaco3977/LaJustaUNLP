import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, StateCreator } from 'zustand';

export type CartItem = {
  productId: number;
  quantity: number;
};

type CartState = {
  cart: CartItem[];

  loadCart: () => Promise<void>;

  addToCart: (
    productId: number,
    stock: number,
    quantity?: number
  ) => void;

  removeFromCart: (productId: number) => void;

  increaseQuantity: (
    productId: number,
    stock: number
  ) => void;

  decreaseQuantity: (productId: number) => void;

  getTotalItems: () => number;
  getItemQuantity: (productId: number) => number;

  clearCart: () => void;
};

const CART_STORAGE_KEY = 'cart';

const cartStoreCreator: StateCreator<CartState> = (set, get) => ({
  cart: [],

  loadCart: async () => {
    try {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsedCart: CartItem[] = JSON.parse(storedCart);

        // Evitamos cargar datos inválidos desde AsyncStorage.
        const validCart = parsedCart.filter(
          item =>
            Number.isInteger(item.productId) &&
            item.productId > 0 &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        );

        set({ cart: validCart });
      }
    } catch (error) {
      console.warn('Error loading cart from storage', error);
    }
  },

  addToCart: (productId, stock, quantity = 1) => {
    if (stock <= 0 || quantity <= 0) return;

    const { cart } = get();

    const existingItem = cart.find(
      item => item.productId === productId
    );

    let updatedCart: CartItem[];

    if (existingItem) {
      const newQuantity = Math.min(
        existingItem.quantity + quantity,
        stock
      );

      updatedCart = cart.map(item =>
        item.productId === productId
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          productId,
          quantity: Math.min(quantity, stock),
        },
      ];
    }

    set({ cart: updatedCart });

    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(updatedCart)
    );
  },

  increaseQuantity: (productId, stock) => {
    if (stock <= 0) return;

    const updatedCart = get().cart.map(item => {
      if (item.productId !== productId) {
        return item;
      }

      if (item.quantity >= stock) {
        return item;
      }

      return {
        ...item,
        quantity: item.quantity + 1,
      };
    });

    set({ cart: updatedCart });

    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(updatedCart)
    );
  },

  decreaseQuantity: productId => {
    const updatedCart = get().cart.map(item => {
      if (item.productId !== productId) {
        return item;
      }

      // Nunca baja de 1.
      if (item.quantity <= 1) {
        return item;
      }

      return {
        ...item,
        quantity: item.quantity - 1,
      };
    });

    set({ cart: updatedCart });

    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(updatedCart)
    );
  },

  removeFromCart: productId => {
    const updatedCart = get().cart.filter(
      item => item.productId !== productId
    );

    set({ cart: updatedCart });

    AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(updatedCart)
    );
  },

  getTotalItems: () => {
    return get().cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  },

  getItemQuantity: productId => {
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

export const useCartStore = create<CartState>(cartStoreCreator);