import { TimeSeriesData } from '@/lib/analytics/types';

export type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'radar';

export interface BaseChartProps {
  data: TimeSeriesData[];
  color?: string;
  secondaryColor?: string;
  showLegend?: boolean;
}

export interface AnalyticsChartProps {
  title: string;
  data: TimeSeriesData[];
  type?: ChartType;
  color?: string;
  height?: number;
  description?: string;
  allowTypeChange?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
  allowDownload?: boolean;
  secondaryColor?: string;
  dateFormat?: string;
  showLegend?: boolean;
}

export const CHART_COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e', '#84cc16'];

export const commonAxisProps = {
  axisLine: false,
  tickLine: false,
  tick: { fontSize: 12 },
  tickMargin: 10
};

export const commonGridProps = {
  strokeDasharray: "3 3",
  vertical: false,
  stroke: "#27272a",
  strokeOpacity: 0.4
};

export const commonTooltipProps = {
  contentStyle: { backgroundColor: '#27272a', border: 'none', borderRadius: '0.375rem' },
  labelStyle: { fontWeight: 'bold', color: '#FFFFFF' },
  itemStyle: { color: '#FFFFFF' }
};
