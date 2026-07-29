import { api } from './api';
import type { AnalyticsSummary } from '@/types';

// GET /api/analytics — simple summary, no charts.
export const analyticsService = {
  getSummary: async () => {
    const { data } = await api.get<AnalyticsSummary>('/analytics');
    return data;
  },
};
