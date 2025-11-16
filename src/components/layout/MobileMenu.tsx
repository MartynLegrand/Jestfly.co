
import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUser } from '@/types';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/ui/UserAvatar';
import { X, LogOut, LogIn, UserPlus } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  routes: { path: string; label: string; icon: React.ReactNode }[];
  user: AuthUser | null;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  routes,
  user,
  onLogout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white md:hidden">
      <div className="flex flex-col h-full overflow-y-auto pb-12">
        <div className="flex justify-between items-center p-4 border-b">
          <Link to="/" className="text-lg font-bold text-purple-600" onClick={onClose}>
            JESTFLY
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close menu">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="p-4 border-b">
          {user ? (
            <div className="flex items-center space-x-3">
              <UserAvatar 
                user={{ display_name: user.displayName || (user.profile?.display_name || 'User'), avatar: user.avatar || user.profile?.avatar }} 
                size="md" 
              />
              <div className="flex-1">
                <p className="font-medium">{user.displayName || (user.profile?.display_name || 'User')}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex justify-between">
              <Button asChild variant="outline" size="sm">
                <Link to="/login" onClick={onClose}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link to="/register" onClick={onClose}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Register</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {routes.map((route) => (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                  onClick={onClose}
                >
                  {route.icon}
                  <span className="ml-3">{route.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
