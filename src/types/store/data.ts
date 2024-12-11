import type { DashboardMetric } from '../dashboard/metrics';
import type { AnalyticsData } from '../dashboard/analytics';

export interface DataStore {
  metrics: Record<string, DashboardMetric>;
  analytics: AnalyticsData | null;
  lastFetch: number | null;
  fetchMetrics: () => Promise<void>;
  updateMetric: (id: string, data: Partial<DashboardMetric>) => void;
  clearCache: () => void;
}

export type DataAction = 
  | { type: 'SET_METRICS'; payload: Record<string, DashboardMetric> }
  | { type: 'UPDATE_METRIC'; payload: { id: string; data: Partial<DashboardMetric> } }
  | { type: 'CLEAR_CACHE' };