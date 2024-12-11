import { AnalyticsData } from './analytics';
import { DashboardMetric } from './metrics';

export interface DashboardData {
  metrics: DashboardMetric[];
  analytics: AnalyticsData;
  userSettings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  dashboardLayout: DashboardLayout;
  visibleMetrics: string[];
}

export interface DashboardLayout {
  panels: PanelConfig[];
}

export interface PanelConfig {
  id: string;
  type: 'metrics' | 'analytics' | 'custom';
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DashboardProps {
  initialData?: DashboardData;
  refreshInterval?: number;
  onMetricClick?: (metricId: string) => void;
}

export { DashboardMetric } from './metrics';