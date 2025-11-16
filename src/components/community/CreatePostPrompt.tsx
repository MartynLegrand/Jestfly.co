
import GlassCard from "@/components/ui/GlassCard";
import UserAvatar from "@/components/ui/UserAvatar";
import { AuthUser } from "@/types";
import { Button } from "@/components/ui/button";

interface CreatePostPromptProps {
  user: AuthUser | null;
  onCreatePost: () => void;
}

const CreatePostPrompt = ({ user, onCreatePost }: CreatePostPromptProps) => {
  return (
    <GlassCard>
      {user ? (
        <div className="flex gap-3 items-center">
          <UserAvatar user={user.profile} />
          <div 
            className="flex-1 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={onCreatePost}
          >
            <p className="text-muted-foreground">Share something with the community...</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-2">Join the conversation!</p>
          <Button>Sign In</Button>
        </div>
      )}
    </GlassCard>
  );
};

export default CreatePostPrompt;
