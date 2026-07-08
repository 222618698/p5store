import { apiClient } from './client';
import type { AddressRequest, AddressResponse } from '@/types';

export async function getAddresses(userId: number): Promise<AddressResponse[]> {
  const { data } = await apiClient.get<AddressResponse[]>(`/v1/users/${userId}/addresses`);
  return data;
}

export async function createAddress(
  userId: number,
  payload: AddressRequest
): Promise<AddressResponse> {
  const { data } = await apiClient.post<AddressResponse>(
    `/v1/users/${userId}/addresses`,
    payload
  );
  return data;
}

export async function deleteAddress(userId: number, addressId: number): Promise<void> {
  await apiClient.delete(`/v1/users/${userId}/addresses/${addressId}`);
}
