import { api } from './api';
import type { CalendarEvent } from '@/types';

// GET/POST/PUT/DELETE /api/calendar
export const calendarService = {
  getAll: async () => {
    const { data } = await api.get<CalendarEvent[]>('/calendar');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<CalendarEvent>(`/calendar/${id}`);
    return data;
  },
  create: async (payload: Partial<CalendarEvent>) => {
    const { data } = await api.post<CalendarEvent>('/calendar', payload);
    return data;
  },
  update: async (id: string, payload: Partial<CalendarEvent>) => {
    const { data } = await api.put<CalendarEvent>(`/calendar/${id}`, payload);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/calendar/${id}`);
  },
};
