
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2 } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";

interface ReceiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReceiveModal = ({ open, onOpenChange }: ReceiveModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const profileInfoRef = useRef<HTMLDivElement>(null);

  if (!user || !user.profile) {
    return null;
  }

  const handleCopy = () => {
    if (!user.profile) return;
    
    const textToCopy = `@${user.profile.username}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({
          title: "Username copied",
          description: "You can now share it with others",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to copy",
          description: "Please try again",
          variant: "destructive",
        });
      });
  };

  const handleShare = async () => {
    if (!user.profile) return;
    
    const shareData = {
      title: "Send me JestCoins",
      text: `Send JestCoins to @${user.profile.username} on JESTFLY`,
      url: window.location.origin,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Receive JestCoins</DialogTitle>
          <DialogDescription>
            Share your username with others so they can send you JestCoins.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6" ref={profileInfoRef}>
          <UserAvatar user={user.profile} size="lg" className="mb-4" />
          <h3 className="text-xl font-bold">{user.profile.display_name}</h3>
          <p className="text-muted-foreground">@{user.profile.username}</p>
          
          <div className="mt-6 w-full bg-secondary p-4 rounded-md text-center">
            <p className="text-sm text-muted-foreground mb-2">Your username</p>
            <p className="font-semibold">@{user.profile.username}</p>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" className="gap-2" onClick={handleCopy}>
            <Copy className="h-4 w-4" /> Copy Username
          </Button>
          <Button className="gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveModal;
