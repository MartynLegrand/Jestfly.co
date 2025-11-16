
import React from 'react';
import { TimeSeriesData } from '@/lib/analytics/types';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';

interface OverviewChartsProps {
  signupsData: TimeSeriesData[];
  demoSubmissionsData: TimeSeriesData[];
}

const OverviewCharts: React.FC<OverviewChartsProps> = ({
  signupsData,
  demoSubmissionsData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AnalyticsChart
        title="User Signups (Last 30 Days)"
        data={signupsData}
        type="area"
        color="#3b82f6"
      />
      <AnalyticsChart
        title="Demo Submissions (Last 30 Days)"
        data={demoSubmissionsData}
        type="bar"
        color="#10b981"
      />
    </div>
  );
};

export default OverviewCharts;
