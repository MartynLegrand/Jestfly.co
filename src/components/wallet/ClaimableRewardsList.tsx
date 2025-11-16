
import React, { useState } from "react";
import { UserReward } from "@/types/rewards";
import { Button } from "@/components/ui/button";
import { Coins, Check, RefreshCw } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { claimReward } from "@/lib/rewards/rewardsService";
import { useToast } from "@/hooks/use-toast";

interface ClaimableRewardsListProps {
  rewards: UserReward[];
  onRefresh: () => void;
}

const ClaimableRewardsList: React.FC<ClaimableRewardsListProps> = ({ rewards, onRefresh }) => {
  const { toast } = useToast();
  const [claimingIds, setClaimingIds] = useState<Set<string>>(new Set());

  const handleClaim = async (rewardId: string) => {
    setClaimingIds(prev => new Set(prev).add(rewardId));
    
    try {
      const success = await claimReward(rewardId);
      
      if (success) {
        toast({
          title: "Reward claimed",
          description: "JestCoins have been added to your wallet!",
          variant: "default",
        });
        onRefresh();
      } else {
        toast({
          title: "Failed to claim reward",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setClaimingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(rewardId);
        return newSet;
      });
    }
  };

  if (rewards.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted-foreground">No claimable rewards at the moment.</p>
        <p className="text-sm text-muted-foreground mt-1">Complete activities to earn JestCoins!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-lg">Claimable Rewards</h3>
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>
      
      {rewards.map((reward) => (
        <GlassCard key={reward.id} className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">{reward.activity?.name}</h4>
                <p className="text-sm text-muted-foreground">{reward.activity?.description}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-semibold text-lg">+{reward.amount} JC</div>
              <Button 
                size="sm" 
                onClick={() => handleClaim(reward.id)}
                disabled={claimingIds.has(reward.id)}
                className="mt-1"
              >
                {claimingIds.has(reward.id) ? (
                  <>
                    <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Claiming...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Claim
                  </>
                )}
              </Button>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default ClaimableRewardsList;
