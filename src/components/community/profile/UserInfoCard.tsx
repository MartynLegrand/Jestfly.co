
import React from "react";
import { UserProfile } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import { AtSign, Calendar, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserInfoCardProps {
  user: UserProfile;
  joinDate: string | null;
}

const UserInfoCard = ({ user, joinDate }: UserInfoCardProps) => {
  return (
    <GlassCard className="mt-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">User Info</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <AtSign className="h-4 w-4 text-muted-foreground" />
          <span>@{user.username}</span>
        </div>
        
        {joinDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined {formatDistanceToNow(new Date(joinDate), { addSuffix: true })}</span>
          </div>
        )}
        
        {user.social_links && Object.entries(user.social_links).length > 0 && (
          <div className="pt-3 border-t">
            <h4 className="text-xs text-muted-foreground mb-2">Social Links</h4>
            <div className="space-y-2">
              {Object.entries(user.social_links).map(([key, value]) => 
                value ? (
                  <div key={key} className="flex items-center gap-2">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    <a 
                      href={value.startsWith('http') ? value : `https://${value}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </a>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default UserInfoCard;
