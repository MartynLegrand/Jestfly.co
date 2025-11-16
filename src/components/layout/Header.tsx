
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserAvatar from '@/components/ui/UserAvatar';
import { 
  Home, 
  ShoppingCart, 
  Music, 
  Image, 
  Wallet, 
  BarChart, 
  User,
  Menu,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
  Briefcase
} from 'lucide-react';
import MobileMenu from './MobileMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const routes = [
    { path: '/community', label: 'Community', icon: <Home className="w-4 h-4" /> },
    { path: '/store', label: 'Store', icon: <ShoppingCart className="w-4 h-4" /> },
    { path: '/demo-submission', label: 'Submit Demo', icon: <Music className="w-4 h-4" /> },
    { path: '/nft-gallery', label: 'NFT Gallery', icon: <Image className="w-4 h-4" /> },
    { path: '/jestcoin', label: 'JestCoin', icon: <Wallet className="w-4 h-4" /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart className="w-4 h-4" /> },
    { path: '/career', label: 'Career Planning', icon: <Briefcase className="w-4 h-4" /> },
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center text-xl font-bold text-purple-600"
            >
              JESTFLY
            </Link>
          </div>

          {/* Desktop navigation with icons only */}
          <nav className="hidden md:flex space-x-1">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`p-2 rounded-md text-sm font-medium flex items-center justify-center transition-colors ${
                  location.pathname === route.path
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={route.label}
              >
                {route.icon}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserAvatar user={{ display_name: user.displayName || (user.profile?.display_name || 'User'), avatar: user.avatar || user.profile?.avatar }} size="sm" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || (user.profile?.display_name || 'User')}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLoginClick}
                  className="flex items-center"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleRegisterClick}
                  className="flex items-center"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Register</span>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        routes={routes}
        user={user}
        onLogout={logout}
      />
    </header>
  );
};

export default Header;
