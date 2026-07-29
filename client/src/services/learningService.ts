import { api } from './api';
import type { LearningTopic } from '@/types';

// GET/POST/PUT/DELETE /api/learning
export const learningService = {
  getAll: async () => {
    const { data } = await api.get<LearningTopic[]>('/learning');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<LearningTopic>(`/learning/${id}`);
    return data;
  },
  create: async (payload: Partial<LearningTopic>) => {
    const { data } = await api.post<LearningTopic>('/learning', payload);
    return data;
  },
  update: async (id: string, payload: Partial<LearningTopic>) => {
    const { data } = await api.put<LearningTopic>(`/learning/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/learning/${id}`);
  },
};
