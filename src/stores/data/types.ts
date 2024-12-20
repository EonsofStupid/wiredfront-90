import type { AsyncState } from '@/types/store/state';
import type { DashboardMetric } from '@/types/dashboard/metrics';
import type { AnalyticsData } from '@/types/dashboard/analytics';

export interface DataState extends AsyncState {
  metrics: Record<string, DashboardMetric>;
  analytics: AnalyticsData | null;
  lastFetch: number | null;
}

export interface DataActions {
  fetchMetrics: () => Promise<void>;
  updateMetric: (id: string, data: Partial<DashboardMetric>) => void;
  clearCache: () => void;
}

export type DataStore = DataState & DataActions;