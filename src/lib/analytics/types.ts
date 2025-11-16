
export type EventType = 
  | 'page_view' 
  | 'demo_submission' 
  | 'login' 
  | 'signup' 
  | 'post_created'
  | 'product_viewed'
  | 'order_completed';

export type AnalyticsMetric = {
  metric_name: string;
  value: number;
  period_start: string;
  period_end: string;
  dimension?: string;
  dimension_value?: string;
};

export type DashboardStats = {
  totalUsers: number;
  activeDailyUsers: number;
  demoSubmissions: number;
  orderCount: number;
  revenueAmount: number;
};

export type TimeSeriesData = {
  name: string;
  value: number;
  secondaryValue?: number; // Support for multi-series charts
};
