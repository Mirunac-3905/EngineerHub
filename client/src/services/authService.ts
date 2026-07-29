import { api } from './api';
import type { User } from '@/types';

// Auth service — POST /api/auth/*
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },
  async resetPassword(
    token: string,
    password: string,
    email: string,
  ): Promise<{ message: string }> {
    const { data } = await api.post('/auth/reset-password', {
      token,
      password,
      email,
    });
    return data;
  },
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
  async getMe(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};
