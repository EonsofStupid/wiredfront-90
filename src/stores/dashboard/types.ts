import { DashboardMetric } from "@/types/dashboard/common";

export interface DashboardState {
  metrics: DashboardMetric[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  selectedPanel: string | null;
}

export interface DashboardActions {
  setMetrics: (metrics: DashboardMetric[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedPanel: (panelId: string | null) => void;
  fetchMetrics: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

export type DashboardStore = DashboardState & DashboardActions;