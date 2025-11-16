
import React from "react";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, Star, Award } from "lucide-react";

interface Reward {
  id: string;
  title: string;
  description: string;
  amount: number;
  icon: React.ElementType;
  claimed: boolean;
}

const mockRewards: Reward[] = [
  {
    id: "reward-1",
    title: "Welcome Bonus",
    description: "Thanks for joining JESTFLY!",
    amount: 50,
    icon: Trophy,
    claimed: true,
  },
  {
    id: "reward-2",
    title: "Profile Completion",
    description: "Fill out your profile to earn JestCoins",
    amount: 25,
    icon: Star,
    claimed: false,
  },
  {
    id: "reward-3",
    title: "First Transfer",
    description: "Make your first JestCoin transfer",
    amount: 20,
    icon: Gift,
    claimed: false,
  },
  {
    id: "reward-4",
    title: "Community Participation",
    description: "Participate in community discussions",
    amount: 30,
    icon: Award,
    claimed: false,
  },
];

interface RewardDisplayProps {
  isLoading?: boolean;
}

const RewardDisplay: React.FC<RewardDisplayProps> = ({ isLoading = false }) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <GlassCard className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">JestCoin Rewards</h3>
        <p className="text-sm text-muted-foreground">Earn more coins by completing tasks</p>
      </div>
      
      <div className="space-y-4">
        {mockRewards.map((reward) => {
          const Icon = reward.icon;
          return (
            <div key={reward.id} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{reward.title}</p>
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                </div>
              </div>
              <div>
                {reward.claimed ? (
                  <div className="text-sm text-muted-foreground bg-secondary py-1 px-3 rounded-full">
                    Claimed +{reward.amount} JC
                  </div>
                ) : (
                  <Button size="sm" variant="outline">
                    Claim +{reward.amount} JC
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default RewardDisplay;
