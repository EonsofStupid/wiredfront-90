export type MetricStatus = 'success' | 'warning' | 'error';
export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
  timeframe: TimeFrame;
  status?: MetricStatus;
}

export interface MetricsPanel {
  metrics: DashboardMetric[];
  isLoading?: boolean;
}