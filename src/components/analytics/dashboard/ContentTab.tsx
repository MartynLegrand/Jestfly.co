
import React from 'react';
import { TimeSeriesData } from '@/lib/analytics/types';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';
import AnalyticsCard from '@/components/analytics/AnalyticsCard';

interface ContentTabProps {
  demoSubmissionsData: TimeSeriesData[];
}

const ContentTab: React.FC<ContentTabProps> = ({ demoSubmissionsData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AnalyticsChart
        title="Demo Submissions (Last 30 Days)"
        data={demoSubmissionsData}
        type="area"
        color="#10b981"
        description="Daily count of new demo submissions"
      />
      <AnalyticsCard
        title="Content Analytics"
        value="Coming Soon"
        description="This feature is currently under development"
        className="h-[300px] flex flex-col justify-center items-center"
      />
    </div>
  );
};

export default ContentTab;
