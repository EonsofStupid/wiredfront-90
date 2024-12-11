import type { BaseAction } from './common';
import type { AsyncState } from './state';
import type { DashboardMetric } from '../dashboard/metrics';
import type { AnalyticsData } from '../dashboard/analytics';

export interface DataState extends AsyncState {
  readonly metrics: Readonly<Record<string, DashboardMetric>>;
  readonly analytics: Readonly<AnalyticsData> | null;
  readonly lastFetch: number | null;
}

export interface DataActions {
  readonly fetchMetrics: () => Promise<void>;
  readonly updateMetric: (id: string, data: Partial<DashboardMetric>) => void;
  readonly clearCache: () => void;
}

export type DataStore = Readonly<DataState & DataActions>;

export type DataActionType =
  | 'SET_METRICS'
  | 'UPDATE_METRIC'
  | 'CLEAR_CACHE';

export type DataAction = 
  | BaseAction<'SET_METRICS', Record<string, DashboardMetric>>
  | BaseAction<'UPDATE_METRIC', { id: string; data: Partial<DashboardMetric> }>
  | BaseAction<'CLEAR_CACHE'>;