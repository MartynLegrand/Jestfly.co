
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bell, Compass, Home } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useAuth } from "@/context/AuthContext";

interface CommunityHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const CommunityHeader = ({ searchTerm, setSearchTerm }: CommunityHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <GlassCard className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Community</h1>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts and people..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={isActive("/community") ? "default" : "outline"} 
              size="icon"
              onClick={() => navigate("/community")}
              title="Home"
            >
              <Home className="h-4 w-4" />
            </Button>
            
            <Button 
              variant={isActive("/community/explore") ? "default" : "outline"} 
              size="icon"
              onClick={() => navigate("/community/explore")}
              title="Explore"
            >
              <Compass className="h-4 w-4" />
            </Button>
            
            <Button 
              variant={isActive("/community/notifications") ? "default" : "outline"} 
              size="icon"
              onClick={() => navigate("/community/notifications")}
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default CommunityHeader;
