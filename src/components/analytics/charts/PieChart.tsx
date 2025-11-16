
import React from 'react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip,
  Legend
} from 'recharts';
import { BaseChartProps, CHART_COLORS, commonTooltipProps } from '../types/chart-types';

export const PieChart: React.FC<BaseChartProps> = ({ 
  data, 
  color = '#3b82f6',
  showLegend = false 
}) => {
  return (
    <RechartsPieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        innerRadius={30}
        fill={color}
        dataKey="value"
        nameKey="name"
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        animationDuration={1000}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
        ))}
      </Pie>
      <Tooltip {...commonTooltipProps} />
      {showLegend && <Legend />}
    </RechartsPieChart>
  );
};
