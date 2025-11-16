
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/ui/UserAvatar";
import FollowButton from "./FollowButton";
import { getFollowersCount, getFollowingCount } from "@/lib/community/followService";

interface UserProfileCardProps {
  user: UserProfile;
  minimal?: boolean;
}

const UserProfileCard = ({ user, minimal = false }: UserProfileCardProps) => {
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  
  useEffect(() => {
    const fetchFollowCounts = async () => {
      try {
        const followers = await getFollowersCount(user.id);
        const following = await getFollowingCount(user.id);
        
        setFollowersCount(followers);
        setFollowingCount(following);
      } catch (error) {
        console.error("Error fetching follow counts:", error);
      }
    };
    
    fetchFollowCounts();
  }, [user.id]);
  
  return (
    <Card>
      <CardContent className={minimal ? "p-3" : "p-6"}>
        <div className={`flex ${minimal ? "items-center gap-3" : "flex-col items-center text-center"}`}>
          <UserAvatar 
            user={user} 
            size={minimal ? "md" : "xl"} 
            className={minimal ? "" : "mb-3"} 
          />
          
          <div className={minimal ? "flex-1" : ""}>
            <h3 className="font-semibold">{user.display_name}</h3>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            
            {!minimal && user.bio && (
              <p className="mt-2 text-sm">{user.bio}</p>
            )}
            
            {!minimal && (
              <div className="flex justify-center gap-8 mt-4 mb-4">
                <div className="text-center">
                  <p className="font-semibold">{followersCount}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{followingCount}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            )}
            
            {minimal && (
              <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                <span>{followersCount} followers</span>
                <span>•</span>
                <span>{followingCount} following</span>
              </div>
            )}
          </div>
          
          {minimal && (
            <FollowButton userId={user.id} size="sm" />
          )}
        </div>
        
        {!minimal && (
          <div className="mt-3">
            <FollowButton userId={user.id} variant="secondary" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
