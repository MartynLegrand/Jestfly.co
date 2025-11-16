import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { followUser, unfollowUser, isFollowing } from "@/lib/community/followService";

interface FollowButtonProps {
  userId: string;
  onFollowChange?: (isFollowing: boolean) => void;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

const FollowButton = ({ 
  userId, 
  onFollowChange,
  variant = "default",
  size = "default"
}: FollowButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [following, setFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user && user.id !== userId) {
      const checkFollowStatus = async () => {
        try {
          const followingStatus = await isFollowing(userId);
          setFollowing(followingStatus);
        } catch (error) {
          console.error("Error checking follow status:", error);
        }
      };
      
      checkFollowStatus();
    }
  }, [userId, user]);
  
  const handleToggleFollow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to follow users",
        variant: "destructive",
      });
      return;
    }
    
    if (user.id === userId) {
      toast({
        title: "Error",
        description: "You cannot follow yourself",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      if (following) {
        await unfollowUser(userId);
        toast({
          title: "Unfollowed",
          description: "You are no longer following this user",
        });
      } else {
        await followUser(userId);
        toast({
          title: "Following",
          description: "You are now following this user",
        });
      }
      
      setFollowing(!following);
      if (onFollowChange) {
        onFollowChange(!following);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to follow/unfollow user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (user?.id === userId) {
    return null;
  }
  
  return (
    <Button
      variant={following ? "outline" : variant}
      size={size}
      onClick={handleToggleFollow}
      disabled={isLoading}
      className="gap-1"
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          {size !== "sm" && "Following"}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {size !== "sm" && "Follow"}
        </>
      )}
    </Button>
  );
};

export default FollowButton;
