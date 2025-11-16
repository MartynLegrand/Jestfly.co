
import React from 'react';
import { useLocation, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminHeader from '@/components/admin/AdminHeader';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import CreateDemoUsers from '@/components/admin/CreateDemoUsers';

const AdminDashboard = () => {
  const { isAdmin, user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      
      <Routes>
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<CreateDemoUsers />} />
        <Route path="*" element={
          <div className="container mx-auto py-12 text-center">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-muted-foreground mb-8">
              Welcome to the JestFly admin dashboard. Select a section from the menu above.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <DashboardCard 
                title="Users" 
                count="---"
                to="/admin/users"
                description="Manage user accounts and permissions"
              />
              <DashboardCard 
                title="Products" 
                count="---"
                to="/admin/products"
                description="Manage store products and inventory"
              />
              <DashboardCard 
                title="Orders" 
                count="---"
                to="/admin/orders"
                description="View and manage customer orders"
              />
              <DashboardCard 
                title="Analytics" 
                count="---"
                to="/admin/analytics"
                description="Platform usage statistics and reports"
              />
              <DashboardCard 
                title="Demos" 
                count="---"
                to="/admin/demos"
                description="Review and manage demo submissions"
              />
              <DashboardCard 
                title="Settings" 
                count="---"
                to="/admin/settings"
                description="Platform configuration and settings"
              />
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  count: string;
  description: string;
  to: string;
}

const DashboardCard = ({ title, count, description, to }: DashboardCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="bg-card rounded-lg shadow-sm p-6 border border-border hover:border-primary/50 cursor-pointer transition-all"
      onClick={() => navigate(to)}
    >
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-2">{count}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default AdminDashboard;
