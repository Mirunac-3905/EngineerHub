import { api } from './api';
import type { Research } from '@/types';

// GET/POST/PUT/DELETE /api/research
export const researchService = {
  getAll: async () => {
    const { data } = await api.get<Research[]>('/research');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<Research>(`/research/${id}`);
    return data;
  },
  create: async (payload: Partial<Research>) => {
    const { data } = await api.post<Research>('/research', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Research>) => {
    const { data } = await api.put<Research>(`/research/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/research/${id}`);
  },
};
