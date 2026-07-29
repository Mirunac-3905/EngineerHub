import { api } from './api';
import type { CodingProfile } from '@/types';

// GET/POST/PUT/DELETE /api/coding
export const codingService = {
  getAll: async () => {
    const { data } = await api.get<CodingProfile[]>('/coding');
    return data;
  },
  create: async (payload: Partial<CodingProfile>) => {
    const { data } = await api.post<CodingProfile>('/coding', payload);
    return data;
  },
  update: async (id: string, payload: Partial<CodingProfile>) => {
    const { data } = await api.put<CodingProfile>(`/coding/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/coding/${id}`);
  },
};
