import { apiClient } from './client';
import type { Page, ProductRequest, ProductResponse } from '@/types';

export interface GetProductsParams {
  page?: number; // 0-based, matches Spring's Pageable
  size?: number;
  sort?: string; // e.g. "name,asc"
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

export async function searchProducts(q: string): Promise<ProductResponse[]> {
  const { data } = await apiClient.get<ProductResponse[]>('/v1/products/search', {
    params: { q },
  });
  return data;
}

export async function createProduct(
  payload: ProductRequest
): Promise<ProductResponse> {
  const { data } = await apiClient.post<ProductResponse>('/v1/products', payload);
  return data;
}

export async function updateProduct(
  id: number,
  payload: ProductRequest
): Promise<ProductResponse> {
  const { data } = await apiClient.put<ProductResponse>(
    `/v1/products/${id}`,
    payload
  );
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/v1/products/${id}`);
}

export async function uploadProductImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<{ url: string }>(
    '/v1/products/upload-image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
}
