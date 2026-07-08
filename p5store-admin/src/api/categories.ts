import { apiClient } from './client';
import type { CategoryResponse } from '@/types';

// NOTE: com.p5store.controller has no CategoryController yet, only a
// CategoryRepository. SecurityConfig already permits GET /v1/categories/**
// though, so this is the path the backend should expose it on.
// Until that lands, ProductForm's category <select> will show a friendly
// empty state instead of crashing (see features/products/ProductForm.tsx).
export async function getCategories(): Promise<CategoryResponse[]> {
  const { data } = await apiClient.get<CategoryResponse[]>('/v1/categories');
  return data;
}
