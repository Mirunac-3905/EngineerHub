import { api } from './api';
import type { Settings } from '@/types';

// GET/PUT /api/settings
export const settingsService = {
  get: async () => {
    const { data } = await api.get<Settings>('/settings');
    return data;
  },
  update: async (payload: Partial<Settings>) => {
    const { data } = await api.put<Settings>('/settings', payload);
    return data;
  },
};
