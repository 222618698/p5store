import { apiClient } from './client';
import type { RatingSummaryResponse, ReviewRequest, ReviewResponse } from '@/types';

export async function getProductReviews(productId: number): Promise<ReviewResponse[]> {
  const { data } = await apiClient.get<ReviewResponse[]>(
    `/v1/products/${productId}/reviews`
  );
  return data;
}

export async function getRatingSummary(
  productId: number
): Promise<RatingSummaryResponse> {
  const { data } = await apiClient.get<RatingSummaryResponse>(
    `/v1/products/${productId}/reviews/summary`
  );
  return data;
}

export async function submitReview(
  productId: number,
  payload: ReviewRequest
): Promise<ReviewResponse> {
  const { data } = await apiClient.post<ReviewResponse>(
    `/v1/products/${productId}/reviews`,
    payload
  );
  return data;
}
