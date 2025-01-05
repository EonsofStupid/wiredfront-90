import { DashboardStore } from './types';

export const selectMetrics = (state: DashboardStore) => state.metrics;
export const selectIsLoading = (state: DashboardStore) => state.isLoading;
export const selectError = (state: DashboardStore) => state.error;
export const selectLastUpdated = (state: DashboardStore) => state.lastUpdated;
export const selectSelectedPanel = (state: DashboardStore) => state.selectedPanel;