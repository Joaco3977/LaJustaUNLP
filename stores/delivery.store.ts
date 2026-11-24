import AsyncStorage from '@react-native-async-storage/async-storage';
import { create, StateCreator } from 'zustand';

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type DeliveryAddress = {
  street: string;
  streetNumber: string;
  floor: string;
  apartment: string;
  city: string;
  province: string;
  coordinate: Coordinate | null;
};

export type Warehouse = {
  address: string;
  coordinate: Coordinate;
};

type DeliveryState = {
  warehouse: Warehouse;
  deliveryAddress: DeliveryAddress;
  hasLocatedDelivery: boolean;

  loadDelivery: () => Promise<void>;
  setDeliveryAddress: (address: Partial<DeliveryAddress>) => void;
  setDeliveryCoordinate: (coordinate: Coordinate) => void;
  setHasLocatedDelivery: (value: boolean) => void;
  clearDelivery: () => void;
};

const DELIVERY_STORAGE_KEY = 'delivery';

const WAREHOUSE: Warehouse = {
  address: 'Dirección del almacén de La Justa',
  coordinate: {
    latitude: -34.8987,
    longitude: -57.9503,
  },
};

const INITIAL_DELIVERY_ADDRESS: DeliveryAddress = {
  street: '',
  streetNumber: '',
  floor: '',
  apartment: '',
  city: 'La Plata',
  province: 'Buenos Aires',
  coordinate: null,
};

async function saveDelivery(
  deliveryAddress: DeliveryAddress,
  hasLocatedDelivery: boolean
) {
  try {
    await AsyncStorage.setItem(
      DELIVERY_STORAGE_KEY,
      JSON.stringify({
        deliveryAddress,
        hasLocatedDelivery,
      })
    );
  } catch (error) {
    console.warn('Error guardando los datos de entrega:', error);
  }
}

const deliveryStoreCreator: StateCreator<DeliveryState> = (set, get) => ({
  warehouse: WAREHOUSE,

  deliveryAddress: INITIAL_DELIVERY_ADDRESS,

  hasLocatedDelivery: false,

  loadDelivery: async () => {
    try {
      const storedDelivery = await AsyncStorage.getItem(
        DELIVERY_STORAGE_KEY
      );

      if (!storedDelivery) {
        return;
      }

      const parsedDelivery = JSON.parse(storedDelivery);

      const savedAddress = {
        ...INITIAL_DELIVERY_ADDRESS,
        ...parsedDelivery.deliveryAddress,
      };

      const hasValidLocation =
        parsedDelivery.hasLocatedDelivery === true &&
        savedAddress.coordinate != null;

      set({
        deliveryAddress: savedAddress,
        hasLocatedDelivery: hasValidLocation,
      });
    } catch (error) {
      console.warn('Error cargando los datos de entrega:', error);
    }
  },

  setDeliveryAddress: address => {
    const currentAddress = get().deliveryAddress;

    const streetChanged =
      address.street !== undefined &&
      address.street !== currentAddress.street;

    const streetNumberChanged =
      address.streetNumber !== undefined &&
      address.streetNumber !== currentAddress.streetNumber;

    const locationChanged = streetChanged || streetNumberChanged;

    const updatedAddress = {
      ...currentAddress,
      ...address,
    };

    const updatedHasLocatedDelivery = locationChanged
      ? false
      : get().hasLocatedDelivery;

    set({
      deliveryAddress: updatedAddress,
      hasLocatedDelivery: updatedHasLocatedDelivery,
    });

    void saveDelivery(
      updatedAddress,
      updatedHasLocatedDelivery
    );
  },

  setDeliveryCoordinate: coordinate => {
    const updatedAddress = {
      ...get().deliveryAddress,
      coordinate,
    };

    set({
      deliveryAddress: updatedAddress,
      hasLocatedDelivery: true,
    });

    void saveDelivery(updatedAddress, true);
  },

  setHasLocatedDelivery: value => {
    set({ hasLocatedDelivery: value });

    void saveDelivery(
      get().deliveryAddress,
      value
    );
  },

  clearDelivery: () => {
    set({
      deliveryAddress: INITIAL_DELIVERY_ADDRESS,
      hasLocatedDelivery: false,
    });

    void AsyncStorage.removeItem(DELIVERY_STORAGE_KEY).catch(error => {
      console.warn('Error eliminando los datos de entrega:', error);
    });
  },
});

export const useDeliveryStore = create<DeliveryState>(
  deliveryStoreCreator
);