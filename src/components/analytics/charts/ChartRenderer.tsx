
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { AreaChart } from './AreaChart';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';
import { RadarChart } from './RadarChart';
import { ChartType, BaseChartProps } from '../types/chart-types';

interface ChartRendererProps extends BaseChartProps {
  chartType: ChartType;
  loading: boolean;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  chartType,
  data,
  color,
  secondaryColor,
  showLegend,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="animate-spin h-8 w-8 text-muted-foreground opacity-70" />
      </div>
    );
  }

  const chartProps = {
    data,
    color,
    secondaryColor,
    showLegend
  };

  switch (chartType) {
    case 'area':
      return <AreaChart {...chartProps} />;
    case 'bar':
      return <BarChart {...chartProps} />;
    case 'pie':
      return <PieChart {...chartProps} />;
    case 'radar':
      return <RadarChart {...chartProps} />;
    default:
      return <LineChart {...chartProps} />;
  }
};
