import { apiClient } from './client';
import type { OrderResponse, PayPalOrderResponse, PlaceOrderRequest } from '@/types';

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

export async function createPayPalOrder(
  userId: number,
  orderId: number
): Promise<PayPalOrderResponse> {
  const { data } = await apiClient.post<PayPalOrderResponse>(
    `/v1/users/${userId}/orders/${orderId}/paypal/create`
  );
  return data;
}

export async function capturePayPalOrder(userId: number, orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.post<OrderResponse>(
    `/v1/users/${userId}/orders/${orderId}/paypal/capture`
  );
  return data;
}
