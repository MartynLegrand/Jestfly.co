
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, ShoppingBag, BarChart2, FileAudio, Settings, CreditCard
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminHeader = () => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="bg-background border-b mb-6">
      <div className="container mx-auto py-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          
          <nav className="flex overflow-x-auto pb-2">
            <NavLinkItem to="/admin/users" icon={<Users size={16} />} label="Users" />
            <NavLinkItem to="/admin/products" icon={<ShoppingBag size={16} />} label="Products" />
            <NavLinkItem to="/admin/orders" icon={<CreditCard size={16} />} label="Orders" />
            <NavLinkItem to="/admin/analytics" icon={<BarChart2 size={16} />} label="Analytics" />
            <NavLinkItem to="/admin/demos" icon={<FileAudio size={16} />} label="Demos" />
            <NavLinkItem to="/admin/settings" icon={<Settings size={16} />} label="Settings" />
          </nav>
        </div>
      </div>
    </div>
  );
};

interface NavLinkItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavLinkItem = ({ to, icon, label }: NavLinkItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `inline-flex items-center mr-6 px-3 py-2 rounded-md text-sm font-medium
         ${isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
        `
      }
    >
      <span className="mr-2">{icon}</span>
      {label}
    </NavLink>
  );
};

export default AdminHeader;
