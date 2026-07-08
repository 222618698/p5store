import { apiClient } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types';

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/v1/auth/login', payload);
  return data;
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/v1/auth/register', payload);
  return data;
}
