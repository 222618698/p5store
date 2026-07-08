import { apiClient } from './client';
import type { ChangePasswordRequest, UpdateProfileRequest, UserResponse } from '@/types';

export async function getUser(userId: number): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>(`/v1/users/${userId}`);
  return data;
}

export async function updateProfile(
  userId: number,
  payload: UpdateProfileRequest
): Promise<UserResponse> {
  const { data } = await apiClient.put<UserResponse>(`/v1/users/${userId}`, payload);
  return data;
}

export async function changePassword(
  userId: number,
  payload: ChangePasswordRequest
): Promise<void> {
  await apiClient.post(`/v1/users/${userId}/change-password`, payload);
}

export async function uploadAvatar(userId: number, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await apiClient.post<{ url: string }>(
    `/v1/users/${userId}/avatar`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
}
