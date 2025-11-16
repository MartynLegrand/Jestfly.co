
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer } from 'recharts';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChartControls } from './charts/ChartControls';
import { ChartRenderer } from './charts/ChartRenderer';
import { downloadChartAsCSV } from './utils/chart-utils';
import { ChartType, AnalyticsChartProps } from './types/chart-types';

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  data,
  type = 'line',
  color = '#3b82f6',
  height = 300,
  description,
  allowTypeChange = false,
  loading = false,
  onRefresh,
  allowDownload = false,
  secondaryColor = '#10b981',
  dateFormat = 'MMM dd',
  showLegend = false
}) => {
  const [chartType, setChartType] = useState<ChartType>(type);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  useEffect(() => {
    setChartType(type);
  }, [type]);

  const handleDownload = () => {
    downloadChartAsCSV(data, title);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const chartContent = (
    <div style={{ height: `${height}px` }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ChartRenderer
          chartType={chartType}
          data={data}
          color={color}
          secondaryColor={secondaryColor}
          showLegend={showLegend}
          loading={loading}
        />
      </ResponsiveContainer>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs mt-1">{description}</CardDescription>
          )}
        </div>
        
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <DialogTrigger asChild>
            <span className="hidden">Open</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[80vw] h-[80vh]">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 h-full w-full">
              <ResponsiveContainer width="100%" height="90%">
                <ChartRenderer
                  chartType={chartType}
                  data={data}
                  color={color}
                  secondaryColor={secondaryColor}
                  showLegend={showLegend}
                  loading={loading}
                />
              </ResponsiveContainer>
            </div>
          </DialogContent>
        </Dialog>

        <ChartControls
          chartType={chartType}
          setChartType={setChartType}
          allowTypeChange={allowTypeChange}
          onRefresh={onRefresh}
          loading={loading}
          allowDownload={allowDownload}
          onDownload={handleDownload}
          onToggleFullscreen={toggleFullscreen}
        />
      </CardHeader>
      <CardContent>
        {chartContent}
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
