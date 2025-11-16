
import { supabase } from '@/lib/supabase/client';
import { DashboardStats } from './types';

/**
 * Get dashboard stats for the analytics page
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) throw usersError;
    
    // Get demo submissions count
    const { count: demoSubmissions, error: demosError } = await supabase
      .from('demo_submissions')
      .select('*', { count: 'exact', head: true });
      
    if (demosError) throw demosError;
    
    // Get daily active users (users who logged in today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: activeDailyUsers, error: activeUsersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_login', today.toISOString());
      
    if (activeUsersError) throw activeUsersError;
    
    // Get order count
    const { count: orderCount, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
      
    if (ordersError) throw ordersError;
    
    // Get total revenue
    const { data: orders, error: revenueError } = await supabase
      .from('orders')
      .select('total')
      .eq('status', 'completed');
      
    if (revenueError) throw revenueError;
    
    const revenueAmount = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    
    return {
      totalUsers: totalUsers || 0,
      activeDailyUsers: activeDailyUsers || 0,
      demoSubmissions: demoSubmissions || 0,
      orderCount: orderCount || 0,
      revenueAmount
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalUsers: 0,
      activeDailyUsers: 0,
      demoSubmissions: 0,
      orderCount: 0,
      revenueAmount: 0
    };
  }
};
