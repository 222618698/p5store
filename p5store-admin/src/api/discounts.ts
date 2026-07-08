import { apiClient } from './client';
import type { DiscountRequest, DiscountResponse, Page } from '@/types';

export interface GetDiscountsParams {
  page?: number;
  size?: number;
}

export async function getDiscounts(
  params: GetDiscountsParams = {}
): Promise<Page<DiscountResponse>> {
  const { data } = await apiClient.get<Page<DiscountResponse>>('/v1/discounts', {
    params,
  });
  return data;
}

export async function createDiscount(
  payload: DiscountRequest
): Promise<DiscountResponse> {
  const { data } = await apiClient.post<DiscountResponse>('/v1/discounts', payload);
  return data;
}

export async function updateDiscount(
  id: string,
  payload: DiscountRequest
): Promise<DiscountResponse> {
  const { data } = await apiClient.put<DiscountResponse>(
    `/v1/discounts/${id}`,
    payload
  );
  return data;
}

export async function setDiscountActive(
  id: string,
  active: boolean
): Promise<DiscountResponse> {
  const { data } = await apiClient.patch<DiscountResponse>(
    `/v1/discounts/${id}/active`,
    { active }
  );
  return data;
}
