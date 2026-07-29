import { api } from './api';
import type { Note } from '@/types';

// GET/POST/PUT/DELETE /api/notes
export const notesService = {
  getAll: async () => {
    const { data } = await api.get<Note[]>('/notes');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<Note>(`/notes/${id}`);
    return data;
  },
  create: async (payload: Partial<Note>) => {
    const { data } = await api.post<Note>('/notes', payload);
    return data;
  },
  update: async (id: string, payload: Partial<Note>) => {
    const { data } = await api.put<Note>(`/notes/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/notes/${id}`);
  },
};
