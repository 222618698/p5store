import { apiClient } from './client';
import type { OrderResponse, OrderStatus, Page } from '@/types';

export interface GetOrdersParams {
  page?: number;
  size?: number;
}

export async function getAllOrders(
  params: GetOrdersParams = {}
): Promise<Page<OrderResponse>> {
  const { data } = await apiClient.get<Page<OrderResponse>>('/v1/orders', { params });
  return data;
}

export async function getOrderById(orderId: number): Promise<OrderResponse> {
  const { data } = await apiClient.get<OrderResponse>(`/v1/orders/${orderId}`);
  return data;
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderResponse> {
  const { data } = await apiClient.get<OrderResponse>(
    `/v1/orders/number/${orderNumber}`
  );
  return data;
}

export async function updateOrderStatus(
  orderId: number,
  status: OrderStatus
): Promise<OrderResponse> {
  const { data } = await apiClient.patch<OrderResponse>(
    `/v1/orders/${orderId}/status`,
    null,
    { params: { status } }
  );
  return data;
}
