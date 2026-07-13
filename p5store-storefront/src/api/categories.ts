import { apiClient } from './client';
import type { CategoryResponse } from '@/types';

export async function getCategories(): Promise<CategoryResponse[]> {
  const { data } = await apiClient.get<CategoryResponse[]>('/v1/categories');
  return data;
}
