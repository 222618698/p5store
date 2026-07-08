import { apiClient } from './client';
import type { DiscountPreviewRequest, DiscountPreviewResponse } from '@/types';

export async function validatePromoCode(
  payload: DiscountPreviewRequest
): Promise<DiscountPreviewResponse> {
  const { data } = await apiClient.post<DiscountPreviewResponse>(
    '/v1/discounts/validate',
    payload
  );
  return data;
}
