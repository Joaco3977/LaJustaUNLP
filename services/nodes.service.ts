import { apiGet } from '@/services/api';
import type { Node } from '@/types';

export function getNodes() {
  return apiGet<Node[]>('/node');
}
