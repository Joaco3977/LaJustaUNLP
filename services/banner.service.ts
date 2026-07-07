import { apiGet } from '@/services/api';
import type { Banner } from '@/types';

export function getHomeBanner() {
  return apiGet<Banner[]>('/banner');
}
