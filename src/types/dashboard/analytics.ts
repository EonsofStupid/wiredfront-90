export interface TimeSeriesPoint {
  timestamp: number;
  value: number;
  label: string;
}

export interface AnalyticsPeriod {
  start: number;
  end: number;
  total: number;
  change: number;
}

export interface AnalyticsData {
  timeSeriesData: TimeSeriesPoint[];
  currentPeriod: AnalyticsPeriod;
  previousPeriod: AnalyticsPeriod;
}

export interface AnalyticsPanel {
  data: AnalyticsData;
  isLoading?: boolean;
}