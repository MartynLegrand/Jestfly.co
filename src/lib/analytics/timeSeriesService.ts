
import { supabase } from '@/lib/supabase/client';
import { TimeSeriesData } from './types';

/**
 * Get time series data for a specific metric
 */
export const getTimeSeriesData = async (
  metricName: string,
  days: number = 30
): Promise<TimeSeriesData[]> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('analytics_aggregates')
      .select('*')
      .eq('metric_name', metricName)
      .gte('period_start', startDate.toISOString())
      .order('period_start', { ascending: true });
      
    if (error) throw error;
    
    return (data || []).map(item => ({
      name: new Date(item.period_start).toLocaleDateString(),
      value: item.value
    }));
  } catch (error) {
    console.error(`Error fetching time series data for ${metricName}:`, error);
    return [];
  }
};

/**
 * Get metrics by dimension
 */
export const getMetricsByDimension = async (
  metricName: string,
  dimension: string
): Promise<{name: string, value: number}[]> => {
  try {
    const { data, error } = await supabase
      .from('analytics_aggregates')
      .select('*')
      .eq('metric_name', metricName)
      .eq('dimension', dimension)
      .order('value', { ascending: false });
      
    if (error) throw error;
    
    return (data || []).map(item => ({
      name: item.dimension_value || 'Unknown',
      value: item.value
    }));
  } catch (error) {
    console.error(`Error fetching dimension data for ${metricName}:`, error);
    return [];
  }
};
