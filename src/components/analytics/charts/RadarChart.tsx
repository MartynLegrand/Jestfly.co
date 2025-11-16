
import React from 'react';
import { 
  RadarChart as RechartsRadarChart, 
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';
import { BaseChartProps, commonTooltipProps } from '../types/chart-types';

export const RadarChart: React.FC<BaseChartProps> = ({ 
  data, 
  color = '#3b82f6',
  showLegend = false 
}) => {
  return (
    <RechartsRadarChart 
      cx="50%" 
      cy="50%" 
      outerRadius={80} 
      data={data}
    >
      <PolarGrid stroke="#27272a" strokeOpacity={0.4} />
      <PolarAngleAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
      <Radar 
        name="Value" 
        dataKey="value" 
        stroke={color} 
        fill={color} 
        fillOpacity={0.5} 
        animationDuration={1000}
      />
      <Tooltip {...commonTooltipProps} />
      {showLegend && <Legend />}
    </RechartsRadarChart>
  );
};
