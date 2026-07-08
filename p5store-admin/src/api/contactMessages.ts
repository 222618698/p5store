import { apiClient } from './client';
import type { ContactMessageResponse, Page } from '@/types';

export interface GetContactMessagesParams {
  page?: number;
  size?: number;
}

export async function getContactMessages(
  params: GetContactMessagesParams = {}
): Promise<Page<ContactMessageResponse>> {
  const { data } = await apiClient.get<Page<ContactMessageResponse>>('/v1/contact-messages', {
    params,
  });
  return data;
}
