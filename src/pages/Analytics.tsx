
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getDashboardStats, getTimeSeriesData, DashboardStats, TimeSeriesData } from '@/lib/analytics';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import StatsGrid from '@/components/analytics/dashboard/StatsGrid';
import OverviewCharts from '@/components/analytics/dashboard/OverviewCharts';
import UsersTab from '@/components/analytics/dashboard/UsersTab';
import ContentTab from '@/components/analytics/dashboard/ContentTab';
import RevenueTab from '@/components/analytics/dashboard/RevenueTab';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeDailyUsers: 0,
    demoSubmissions: 0,
    orderCount: 0,
    revenueAmount: 0
  });
  const [signupsData, setSignupsData] = useState<TimeSeriesData[]>([]);
  const [demoSubmissionsData, setDemoSubmissionsData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load dashboard stats
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
        
        // Load time series data
        const signups = await getTimeSeriesData('daily_signups', 30);
        setSignupsData(signups);
        
        const demoSubmissions = await getTimeSeriesData('daily_demo_submissions', 30);
        setDemoSubmissionsData(demoSubmissions);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Redirect if not admin
  if (user?.profile?.profile_type !== 'admin') {
    return (
      <Card className="p-6 max-w-md mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Access Denied</h2>
        <p>You need administrative privileges to view this page.</p>
      </Card>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | JESTFLY</title>
      </Helmet>
      
      <div className="container max-w-7xl py-8">
        <div className="flex flex-col space-y-6">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
            <p className="text-muted-foreground">
              Overview of platform performance and user engagement metrics.
            </p>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <StatsGrid stats={stats} />
              <OverviewCharts 
                signupsData={signupsData}
                demoSubmissionsData={demoSubmissionsData}
              />
            </TabsContent>
            
            <TabsContent value="users" className="space-y-4">
              <UsersTab signupsData={signupsData} />
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4">
              <ContentTab demoSubmissionsData={demoSubmissionsData} />
            </TabsContent>
            
            <TabsContent value="revenue" className="space-y-4">
              <RevenueTab stats={stats} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Analytics;
