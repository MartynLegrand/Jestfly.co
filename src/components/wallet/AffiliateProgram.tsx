
import React, { useState, useEffect } from "react";
import { AffiliateProgram } from "@/types/rewards";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Copy, Check, Share2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserReferrals, getUserReferralCode } from "@/lib/rewards/rewardsService";

interface AffiliateProgramProps {
  userId: string;
}

const AffiliateProgramComponent: React.FC<AffiliateProgramProps> = ({ userId }) => {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<AffiliateProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadReferralInfo = async () => {
      setIsLoading(true);
      try {
        // Get referral code
        const code = await getUserReferralCode(userId);
        setReferralCode(code);
        
        // Get referrals
        const userReferrals = await getUserReferrals(userId);
        setReferrals(userReferrals);
      } catch (error) {
        console.error("Error loading referral information:", error);
        toast({
          title: "Error",
          description: "Failed to load referral information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      loadReferralInfo();
    }
  }, [userId, toast]);

  const handleCopy = () => {
    if (!referralCode) return;
    
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
      variant: "default",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!referralCode) return;
    
    const shareText = `Join JESTFLY using my referral code: ${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join JESTFLY',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      
      toast({
        title: "Copied share text!",
        description: "Share text copied to clipboard.",
        variant: "default",
      });
    }
  };

  const calculateTotalEarned = () => {
    return referrals.reduce((total, referral) => {
      return total + (referral.reward_claimed ? referral.reward_amount : 0);
    }, 0);
  };

  const calculatePendingRewards = () => {
    return referrals.reduce((total, referral) => {
      return total + (referral.reward_claimed ? 0 : referral.reward_amount);
    }, 0);
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Referral Program</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input 
              value={referralCode} 
              readOnly 
              placeholder="Loading referral code..."
              className="font-medium"
              disabled={isLoading}
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCopy}
              disabled={isLoading || !referralCode}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleShare}
              disabled={isLoading || !referralCode}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Share your referral code with friends to earn JestCoins when they join.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <h4 className="text-sm text-muted-foreground mb-1">Total Referrals</h4>
              <p className="text-2xl font-bold">{referrals.length}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-center">
              <h4 className="text-sm text-green-800 dark:text-green-400 mb-1">Rewards Earned</h4>
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {calculateTotalEarned()} JC
              </p>
            </div>
          </div>
          
          {/* Action buttons for sharing */}
          <div className="flex gap-2 mt-4">
            <Button className="flex-1" onClick={handleShare} disabled={isLoading || !referralCode}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Link
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleCopy} disabled={isLoading || !referralCode}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Code
            </Button>
          </div>
        </div>
      </GlassCard>
      
      {/* Referral stats and history */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Your Referrals</h3>
          {calculatePendingRewards() > 0 && (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded text-sm text-yellow-800 dark:text-yellow-400">
              {calculatePendingRewards()} JC pending
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-muted-foreground">Loading referrals...</p>
          </div>
        ) : referrals.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <UserPlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium mb-2">No referrals yet</h4>
            <p className="text-muted-foreground">
              Share your referral code with friends to start earning rewards.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div key={referral.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{referral.referred_user?.display_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">@{referral.referred_user?.username || 'user'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-lg">{referral.reward_amount} JC</p>
                  <p className={`text-xs ${referral.reward_claimed ? 'text-green-600' : 'text-yellow-600'}`}>
                    {referral.reward_claimed ? 'Claimed' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AffiliateProgramComponent;
