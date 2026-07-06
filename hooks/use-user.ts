import { useAuthStore } from '@/stores/auth.store';
import { useCallback } from 'react';

type ApiFetchOptions = RequestInit & {
  skipAuth?: boolean;
};

const API_BASE_URL = 'https://lajustaunlp.com.ar/api';

export function useAuth() {
  const logout = useAuthStore(state => state.logout);
  const setUser = useAuthStore(state => state.updateUser);

  const apiFetch = useCallback(
    async (endpoint: string, options: ApiFetchOptions = {}) => {
      const { skipAuth, headers, ...rest } = options;

      const token = useAuthStore.getState().token;

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(headers || {}),
          ...(token && !skipAuth
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
      });

      if (response.status === 401 && !skipAuth) {
        await logout();
        throw new Error('Sesión expirada');
      }

      return response;
    },
    [logout]
  );

  /* ===================== NUEVA FUNCIÓN ===================== */

  const updateUser = useCallback(
    async (payload: any) => {
      const response = await apiFetch('/user', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }

      const updatedUser = await response.json();

      // sincronizamos el auth store con lo que devuelve la API
      setUser(updatedUser);

      return updatedUser;
    },
    [apiFetch, setUser]
  );

  return { apiFetch, updateUser };
}