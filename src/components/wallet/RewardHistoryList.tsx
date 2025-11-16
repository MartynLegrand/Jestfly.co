
import React from "react";
import { UserReward } from "@/types/rewards";
import { Check, Coins, Clock } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { format } from "date-fns";

interface RewardHistoryListProps {
  rewards: UserReward[];
  limit?: number;
}

const RewardHistoryList: React.FC<RewardHistoryListProps> = ({ rewards, limit }) => {
  const displayRewards = limit ? rewards.slice(0, limit) : rewards;

  if (rewards.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted-foreground">No rewards history yet.</p>
        <p className="text-sm text-muted-foreground mt-1">Complete activities to earn rewards!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayRewards.map((reward) => (
        <GlassCard key={reward.id} className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">{reward.activity?.name}</h4>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(reward.created_at), 'MMM dd, yyyy')}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-medium text-lg">+{reward.amount} JC</div>
              <div className="text-xs flex items-center mt-1">
                {reward.claimed ? (
                  <span className="flex items-center text-green-600">
                    <Check className="h-3 w-3 mr-1" />
                    Claimed
                  </span>
                ) : (
                  <span className="flex items-center text-yellow-600">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};

export default RewardHistoryList;
