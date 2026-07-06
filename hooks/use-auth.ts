import { useAuthStore } from '@/stores/auth.store';
import { useCallback } from 'react';

type ApiFetchOptions = RequestInit & {
  skipAuth?: boolean;
};

const API_BASE_URL = 'https://lajustaunlp.com.ar/api';

export function useAuth() {
  const logout = useAuthStore(state => state.logout);

  const apiFetch = useCallback(
    async (
      endpoint: string,
      options: ApiFetchOptions = {}
    ) => {
      const { skipAuth, headers, ...rest } = options;

      const token = useAuthStore.getState().token;

      const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
          ...rest,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(headers || {}),
            ...(token && !skipAuth
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );

      // Token vencido o inválido
      if (response.status === 401 && !skipAuth) {
        await logout();
        throw new Error('Sesión expirada');
      }

      return response;
    },
    [logout]
  );

  return { apiFetch };
}