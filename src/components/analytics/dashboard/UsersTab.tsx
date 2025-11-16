
import React from 'react';
import { TimeSeriesData } from '@/lib/analytics/types';
import AnalyticsChart from '@/components/analytics/AnalyticsChart';
import AnalyticsCard from '@/components/analytics/AnalyticsCard';

interface UsersTabProps {
  signupsData: TimeSeriesData[];
}

const UsersTab: React.FC<UsersTabProps> = ({ signupsData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <AnalyticsChart
        title="User Signups (Last 30 Days)"
        data={signupsData}
        type="line"
        color="#3b82f6"
        description="Daily count of new user registrations"
      />
      <AnalyticsCard
        title="User Retention"
        value="Coming Soon"
        description="This feature is currently under development"
        className="h-[300px] flex flex-col justify-center items-center"
      />
    </div>
  );
};

export default UsersTab;
