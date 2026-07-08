import { apiClient } from './client';
import type { CartResponse } from '@/types';

export async function getCart(userId: number): Promise<CartResponse> {
  const { data } = await apiClient.get<CartResponse>(`/v1/users/${userId}/cart`);
  return data;
}

export async function addCartItem(
  userId: number,
  productId: number,
  quantity: number
): Promise<CartResponse> {
  const { data } = await apiClient.post<CartResponse>(`/v1/users/${userId}/cart/items`, {
    productId,
    quantity,
  });
  return data;
}

export async function updateCartItem(
  userId: number,
  productId: number,
  quantity: number
): Promise<CartResponse> {
  const { data } = await apiClient.patch<CartResponse>(
    `/v1/users/${userId}/cart/items/${productId}`,
    null,
    { params: { quantity } }
  );
  return data;
}

export async function removeCartItem(
  userId: number,
  productId: number
): Promise<CartResponse> {
  const { data } = await apiClient.delete<CartResponse>(
    `/v1/users/${userId}/cart/items/${productId}`
  );
  return data;
}

export async function clearCart(userId: number): Promise<void> {
  await apiClient.delete(`/v1/users/${userId}/cart`);
}
