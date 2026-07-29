import { api } from './api';
import type { Project } from '@/types';

// GET/POST/PUT/DELETE /api/projects
export const projectService = {
  getAll: async () => {
    const { data } = await api.get<Project[]>('/projects');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<Project>(`/projects/${id}`);
    return data;
  },
  create: async (payload: Partial<Project>) => {
    const { data } = await api.post<Project>('/projects', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Project>) => {
    const { data } = await api.put<Project>(`/projects/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },
};
