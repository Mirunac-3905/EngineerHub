import { api } from './api';
import type { Task } from '@/types';

// GET/POST/PUT/DELETE /api/tasks
export const taskService = {
  getAll: async () => {
    const { data } = await api.get<Task[]>('/tasks');
    return data;
  },
  create: async (title: string) => {
    const { data } = await api.post<Task>('/tasks', { title });
    return data;
  },
  update: async (id: string, updates: Partial<Task>) => {
    const { data } = await api.put<Task>(`/tasks/${id}`, updates);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};
