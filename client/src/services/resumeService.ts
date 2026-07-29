import { api } from './api';
import type { Resume } from '@/types';

// GET/POST/PUT/DELETE /api/resume — file upload handled by Multer on the backend.
export const resumeService = {
  get: async () => {
    const { data } = await api.get<Resume | null>('/resume');
    return data;
  },
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const { data } = await api.post<Resume>('/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  replace: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    const { data } = await api.put<Resume>('/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  delete: async () => {
    await api.delete('/resume');
  },
};
