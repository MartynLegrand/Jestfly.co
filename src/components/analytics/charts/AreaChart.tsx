
import React from 'react';
import { 
  AreaChart as RechartsAreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BaseChartProps, commonAxisProps, commonGridProps, commonTooltipProps } from '../types/chart-types';

export const AreaChart: React.FC<BaseChartProps> = ({ 
  data, 
  color = '#3b82f6',
  showLegend = false 
}) => {
  return (
    <RechartsAreaChart 
      data={data}
      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
        </linearGradient>
      </defs>
      <CartesianGrid {...commonGridProps} />
      <XAxis dataKey="name" {...commonAxisProps} />
      <YAxis {...commonAxisProps} />
      <Tooltip {...commonTooltipProps} />
      {showLegend && <Legend />}
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke={color} 
        fillOpacity={1}
        fill="url(#colorGradient)" 
        activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
      />
    </RechartsAreaChart>
  );
};
