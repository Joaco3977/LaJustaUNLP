import type { PropertyFilter } from '@/types';

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://www.lajustaunlp.com.ar/api';

type QueryValue = string | number | boolean | undefined | null;

export function buildUrl(
  path: string,
  params?: Record<string, QueryValue>
): string {
  const url = new URL(`${API_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

export function propertiesParam(filters: PropertyFilter[]): string {
  return JSON.stringify(filters);
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, QueryValue>
): Promise<T> {
  const res = await fetch(buildUrl(path, params));

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
