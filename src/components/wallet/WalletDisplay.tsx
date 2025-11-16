
import React from "react";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Coins, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";

interface WalletDisplayProps {
  onTransfer?: () => void;
  onReceive?: () => void;
  minimal?: boolean;
}

const WalletDisplay = ({ onTransfer, onReceive, minimal = false }: WalletDisplayProps) => {
  const { wallet, isLoading } = useWallet();
  const [animating, setAnimating] = React.useState(false);

  // Animation effect when balance changes
  React.useEffect(() => {
    if (wallet) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [wallet?.balance]);

  if (isLoading) {
    return (
      <div className="p-6 rounded-lg bg-gradient">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-10 w-48" />
        {!minimal && (
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="p-6 rounded-lg bg-gradient">
        <p className="text-muted-foreground">Wallet not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg bg-gradient text-white">
      <div className="flex items-center gap-2">
        <Coins className="text-white/80 h-5 w-5" />
        <p className="text-sm text-white/80">Your Balance</p>
      </div>
      <p className={`text-3xl font-bold mt-1 ${animating ? 'animate-pulse text-green-300' : ''}`}>
        {wallet.balance.toLocaleString()} JC
      </p>
      
      {!minimal && (
        <>
          <div className="mt-2 mb-4">
            <div className="bg-white/10 h-1 w-full rounded-full overflow-hidden">
              <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(100, wallet.balance / 10)}%` }}></div>
            </div>
            <div className="flex justify-between mt-1">
              <p className="text-xs text-white/60">0 JC</p>
              <p className="text-xs text-white/60">1000 JC</p>
            </div>
          </div>
        
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={onTransfer} 
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              size="sm"
            >
              <ArrowUpRight className="mr-1 h-4 w-4" /> Send
            </Button>
            <Button 
              onClick={onReceive}
              className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              size="sm"
            >
              <ArrowDownLeft className="mr-1 h-4 w-4" /> Receive
            </Button>
          </div>
        </>
      )}
      
      {minimal && (
        <div className="mt-2 flex items-center">
          <TrendingUp className="h-4 w-4 text-white/60 mr-1" />
          <span className="text-xs text-white/60">Last update: {new Date().toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};

export default WalletDisplay;
