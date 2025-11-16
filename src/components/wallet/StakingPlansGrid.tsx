
import React, { useState } from "react";
import { StakingPlan, UserStaking } from "@/types/rewards";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Coins, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { createStake } from "@/lib/rewards/rewardsService";
import { format, addDays } from "date-fns";

interface StakingPlansGridProps {
  plans: StakingPlan[];
  userStakes: UserStaking[];
  userId: string;
  onRefresh: () => void;
}

const StakingPlansGrid: React.FC<StakingPlansGridProps> = ({ 
  plans, 
  userStakes, 
  userId,
  onRefresh
}) => {
  const { wallet } = useWallet();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<StakingPlan | null>(null);
  const [stakeAmount, setStakeAmount] = useState<number>(0);
  const [isCreatingStake, setIsCreatingStake] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setStakeAmount(value);
    }
  };

  const handleCreateStake = async () => {
    if (!selectedPlan || stakeAmount <= 0) return;
    
    // Check if amount meets minimum
    if (stakeAmount < selectedPlan.minimum_amount) {
      toast({
        title: "Invalid amount",
        description: `Minimum amount is ${selectedPlan.minimum_amount} JestCoins.`,
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has enough balance
    if (wallet && wallet.balance < stakeAmount) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough JestCoins for this stake.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreatingStake(true);
    
    try {
      const success = await createStake(userId, selectedPlan.id, stakeAmount);
      
      if (success) {
        toast({
          title: "Stake created successfully",
          description: `Your JestCoins are now staked for ${selectedPlan.duration_days} days.`,
          variant: "default",
        });
        setSelectedPlan(null);
        setStakeAmount(0);
        onRefresh();
      } else {
        toast({
          title: "Failed to create stake",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating stake:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingStake(false);
    }
  };

  const calculateExpectedReturn = (amount: number, interestRate: number) => {
    return amount + (amount * interestRate / 100);
  };

  if (plans.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted-foreground">No staking plans available at the moment.</p>
        <p className="text-sm text-muted-foreground mt-1">Check back later for new opportunities!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <GlassCard key={plan.id} className="p-5">
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Duration:</span>
                </div>
                <span className="font-medium">{plan.duration_days} days</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Interest Rate:</span>
                </div>
                <span className="font-medium text-green-600">{plan.interest_rate}%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm">
                  <Coins className="h-4 w-4 mr-1" />
                  <span>Minimum Amount:</span>
                </div>
                <span className="font-medium">{plan.minimum_amount} JC</span>
              </div>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={() => {
                setSelectedPlan(plan);
                setStakeAmount(plan.minimum_amount);
              }}
            >
              Stake JestCoins
            </Button>
          </GlassCard>
        ))}
      </div>
      
      {/* Active Stakes Section */}
      {userStakes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Active Stakes</h3>
          <div className="space-y-4">
            {userStakes.map((stake) => {
              const endDate = new Date(stake.end_date);
              const now = new Date();
              const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
              
              return (
                <GlassCard key={stake.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{stake.plan?.name}</h4>
                      <p className="text-sm flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Ends on {format(new Date(stake.end_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-lg">{stake.amount} JC</div>
                      <div className="text-xs text-green-600">
                        +{stake.interest_earned || (stake.amount * (stake.plan?.interest_rate || 0) / 100)} JC expected
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                      <span>{stake.plan?.interest_rate}% interest rate</span>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded text-xs flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {daysRemaining} days remaining
                    </div>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Staking dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stake JestCoins - {selectedPlan?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stake-amount">Amount to Stake (JC)</Label>
              <Input
                id="stake-amount"
                type="number"
                min={selectedPlan?.minimum_amount || 0}
                step="1"
                value={stakeAmount}
                onChange={handleAmountChange}
              />
              <p className="text-xs text-muted-foreground">
                Minimum stake: {selectedPlan?.minimum_amount} JC
              </p>
            </div>
            
            <GlassCard className="p-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Interest Rate:</span>
                  <span className="font-medium text-green-600">{selectedPlan?.interest_rate}%</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="font-medium">{selectedPlan?.duration_days} days</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>End Date:</span>
                  <span className="font-medium">
                    {selectedPlan ? format(addDays(new Date(), selectedPlan.duration_days), 'MMM dd, yyyy') : ''}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Expected Return:</span>
                  <span className="font-medium text-green-600">
                    {selectedPlan ? calculateExpectedReturn(stakeAmount, selectedPlan.interest_rate).toFixed(2) : 0} JC
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Profit:</span>
                  <span className="font-medium text-green-600">
                    {selectedPlan ? (calculateExpectedReturn(stakeAmount, selectedPlan.interest_rate) - stakeAmount).toFixed(2) : 0} JC
                  </span>
                </div>
              </div>
            </GlassCard>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md text-yellow-800 dark:text-yellow-400 text-sm">
              <AlertCircle className="h-4 w-4 inline-block mr-1" />
              <span>
                Once staked, your JestCoins will be locked for {selectedPlan?.duration_days} days.
              </span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlan(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateStake} 
              disabled={isCreatingStake || stakeAmount < (selectedPlan?.minimum_amount || 0)}
            >
              {isCreatingStake ? (
                <>
                  <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Staking...
                </>
              ) : (
                'Stake JestCoins'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StakingPlansGrid;
