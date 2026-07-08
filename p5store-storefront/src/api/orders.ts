import { apiClient } from './client';
import type { OrderResponse, PlaceOrderRequest } from '@/types';

export async function getUserOrders(userId: number): Promise<OrderResponse[]> {
  const { data } = await apiClient.get<OrderResponse[]>(`/v1/users/${userId}/orders`);
  return data;
}

export async function getOrderById(orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.get<OrderResponse>(`/v1/orders/${orderId}`);
  return data;
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderResponse> {
  const { data } = await apiClient.get<OrderResponse>(`/v1/orders/number/${orderNumber}`);
  return data;
}

export async function placeOrder(
  userId: number,
  payload: PlaceOrderRequest
): Promise<OrderResponse> {
  const { data } = await apiClient.post<OrderResponse>(
    `/v1/users/${userId}/orders`,
    payload
  );
  return data;
}

export async function cancelOrder(userId: number, orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.post<OrderResponse>(
    `/v1/users/${userId}/orders/${orderId}/cancel`
  );
  return data;
}
