import { apiClient } from './client';
import type { ContactMessageRequest, ContactMessageResponse } from '@/types';

export async function submitContactMessage(
  payload: ContactMessageRequest
): Promise<ContactMessageResponse> {
  const { data } = await apiClient.post<ContactMessageResponse>('/v1/contact-messages', payload);
  return data;
}
