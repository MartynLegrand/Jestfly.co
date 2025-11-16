
import React from 'react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { BaseChartProps, commonAxisProps, commonGridProps, commonTooltipProps } from '../types/chart-types';

export const LineChart: React.FC<BaseChartProps> = ({ 
  data, 
  color = '#3b82f6', 
  secondaryColor = '#10b981',
  showLegend = false 
}) => {
  return (
    <RechartsLineChart 
      data={data}
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
    >
      <CartesianGrid {...commonGridProps} />
      <XAxis dataKey="name" {...commonAxisProps} />
      <YAxis {...commonAxisProps} />
      <Tooltip {...commonTooltipProps} />
      {showLegend && <Legend />}
      <Line 
        type="monotone" 
        dataKey="value" 
        stroke={color} 
        strokeWidth={2}
        activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
        dot={data.length > 10 ? false : { strokeWidth: 1, stroke: '#fff', r: 3 }}
        animationDuration={1000}
      />
      {data[0] && data[0].secondaryValue !== undefined && (
        <Line 
          type="monotone" 
          dataKey="secondaryValue" 
          stroke={secondaryColor} 
          strokeWidth={2}
          activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
          dot={data.length > 10 ? false : { strokeWidth: 1, stroke: '#fff', r: 3 }}
          animationDuration={1000}
        />
      )}
    </RechartsLineChart>
  );
};
