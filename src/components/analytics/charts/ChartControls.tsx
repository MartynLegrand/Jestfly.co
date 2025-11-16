
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, RefreshCw, Maximize2 } from 'lucide-react';
import { ChartType } from '../types/chart-types';

interface ChartControlsProps {
  chartType: ChartType;
  setChartType: (value: ChartType) => void;
  allowTypeChange: boolean;
  onRefresh?: () => void;
  loading: boolean;
  allowDownload: boolean;
  onDownload: () => void;
  onToggleFullscreen: () => void;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  setChartType,
  allowTypeChange,
  onRefresh,
  loading,
  allowDownload,
  onDownload,
  onToggleFullscreen
}) => {
  return (
    <div className="flex gap-2 items-center">
      {allowTypeChange && (
        <Select 
          value={chartType} 
          onValueChange={(value: ChartType) => setChartType(value)}
        >
          <SelectTrigger className="h-8 w-[90px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="line">Linha</SelectItem>
            <SelectItem value="area">Área</SelectItem>
            <SelectItem value="bar">Barras</SelectItem>
            <SelectItem value="pie">Pizza</SelectItem>
            <SelectItem value="radar">Radar</SelectItem>
          </SelectContent>
        </Select>
      )}
      <div className="flex gap-1">
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        )}
        {allowDownload && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onDownload}
            disabled={loading}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={onToggleFullscreen}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
