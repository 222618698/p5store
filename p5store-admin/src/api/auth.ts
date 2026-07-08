import { apiClient } from './client';
import type { AuthResponse, LoginRequest } from '@/types';

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/v1/auth/login', payload);
  return data;
}
