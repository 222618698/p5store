import { apiClient } from './client';
import type { Page, ProductResponse } from '@/types';

export interface GetProductsParams {
  page?: number;
  size?: number;
  sort?: string;
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<Page<ProductResponse>> {
  const { data } = await apiClient.get<Page<ProductResponse>>('/v1/products', {
    params,
  });
  return data;
}

export async function getProductById(id: number): Promise<ProductResponse> {
  const { data } = await apiClient.get<ProductResponse>(`/v1/products/${id}`);
  return data;
}

export async function getFeatured(): Promise<ProductResponse[]> {
  const { data } = await apiClient.get<ProductResponse[]>('/v1/products/featured');
  return data;
}

export async function getNewArrivals(): Promise<ProductResponse[]> {
  const { data } = await apiClient.get<ProductResponse[]>('/v1/products/new-arrivals');
  return data;
}

export async function searchProducts(q: string): Promise<ProductResponse[]> {
  const { data } = await apiClient.get<ProductResponse[]>('/v1/products/search', {
    params: { q },
  });
  return data;
}

export async function getProductsByCategory(categoryId: number): Promise<ProductResponse[]> {
  const { data } = await apiClient.get<ProductResponse[]>(
    `/v1/products/category/${categoryId}`
  );
  return data;
}
