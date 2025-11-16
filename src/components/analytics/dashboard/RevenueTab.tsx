
import React from 'react';
import { DollarSign, ShoppingCart } from 'lucide-react';
import { DashboardStats } from '@/lib/analytics/types';
import AnalyticsCard from '@/components/analytics/AnalyticsCard';

interface RevenueTabProps {
  stats: DashboardStats;
}

const RevenueTab: React.FC<RevenueTabProps> = ({ stats }) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnalyticsCard
          title="Total Revenue"
          value={`$${stats.revenueAmount.toLocaleString()}`}
          description="Total revenue from all sources"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <AnalyticsCard
          title="Total Orders"
          value={stats.orderCount.toLocaleString()}
          description="Total number of completed orders"
          icon={<ShoppingCart className="h-4 w-4" />}
        />
      </div>
      <AnalyticsCard
        title="Revenue Analytics"
        value="Coming Soon"
        description="This feature is currently under development"
        className="h-[300px] flex flex-col justify-center items-center"
      />
    </>
  );
};

export default RevenueTab;
