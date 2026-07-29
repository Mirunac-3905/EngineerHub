import { api } from './api';
import type { Profile } from '@/types';

// GET/PUT /api/profile
export const profileService = {
  get: async () => {
    const { data } = await api.get<Profile>('/profile');
    return data;
  },
  update: async (payload: Partial<Profile>) => {
    const { data } = await api.put<Profile>('/profile', payload);
    return data;
  },
};
