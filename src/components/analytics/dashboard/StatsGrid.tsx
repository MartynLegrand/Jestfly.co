
import React from 'react';
import { Users, Activity, Music, DollarSign } from 'lucide-react';
import { DashboardStats } from '@/lib/analytics/types';
import AnalyticsCard from '@/components/analytics/AnalyticsCard';

interface StatsGridProps {
  stats: DashboardStats;
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnalyticsCard
        title="Total Users"
        value={stats.totalUsers.toLocaleString()}
        icon={<Users className="h-4 w-4" />}
      />
      <AnalyticsCard
        title="Active Users Today"
        value={stats.activeDailyUsers.toLocaleString()}
        icon={<Activity className="h-4 w-4" />}
      />
      <AnalyticsCard
        title="Demo Submissions"
        value={stats.demoSubmissions.toLocaleString()}
        icon={<Music className="h-4 w-4" />}
      />
      <AnalyticsCard
        title="Revenue"
        value={`$${stats.revenueAmount.toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4" />}
      />
    </div>
  );
};

export default StatsGrid;
