
import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { BaseChartProps, commonAxisProps, commonGridProps, commonTooltipProps } from '../types/chart-types';

export const BarChart: React.FC<BaseChartProps> = ({ 
  data, 
  color = '#3b82f6', 
  secondaryColor = '#10b981',
  showLegend = false 
}) => {
  return (
    <RechartsBarChart 
      data={data}
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
    >
      <CartesianGrid {...commonGridProps} />
      <XAxis dataKey="name" {...commonAxisProps} />
      <YAxis {...commonAxisProps} />
      <Tooltip {...commonTooltipProps} />
      {showLegend && <Legend />}
      <Bar 
        dataKey="value" 
        fill={color} 
        radius={[4, 4, 0, 0]} 
        animationDuration={1000}
        barSize={data.length > 10 ? 15 : 30}
      />
      {data[0] && data[0].secondaryValue !== undefined && (
        <Bar 
          dataKey="secondaryValue" 
          fill={secondaryColor} 
          radius={[4, 4, 0, 0]} 
          animationDuration={1000}
          barSize={data.length > 10 ? 15 : 30}
        />
      )}
    </RechartsBarChart>
  );
};
