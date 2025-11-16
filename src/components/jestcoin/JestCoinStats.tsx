
import React, { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import GlassCard from "@/components/ui/GlassCard";
import { TrendingUp, ArrowRight, History, Award } from "lucide-react";
import { getWalletStats } from "@/lib/wallet"; // Updated to import from the new wallet module
import { format } from "date-fns";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}

const StatCard = ({ title, value, icon: Icon }: StatCardProps) => (
  <div className="bg-card rounded-lg shadow-sm border p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
  </div>
);

const JestCoinStats = () => {
  const { wallet } = useWallet();
  const [stats, setStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    transactionCount: 0,
    lastTransactionDate: null as string | null,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Fetch wallet stats
  useEffect(() => {
    const fetchStats = async () => {
      if (wallet) {
        setIsLoadingStats(true);
        try {
          const walletStats = await getWalletStats(wallet.id);
          setStats(walletStats);
        } catch (error) {
          console.error("Error fetching wallet stats:", error);
        } finally {
          setIsLoadingStats(false);
        }
      }
    };
    
    fetchStats();
  }, [wallet]);

  return (
    <GlassCard className="mb-8">
      <h2 className="text-xl font-semibold mb-6">Your JestCoin Stats</h2>
      {isLoadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg shadow-sm border p-4">
              <div className="animate-pulse">
                <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Received" 
            value={`${stats.totalReceived} JC`} 
            icon={TrendingUp} 
          />
          <StatCard 
            title="Total Sent" 
            value={`${stats.totalSent} JC`} 
            icon={ArrowRight} 
          />
          <StatCard 
            title="Transactions" 
            value={stats.transactionCount} 
            icon={History} 
          />
          <StatCard 
            title="Last Transaction" 
            value={stats.lastTransactionDate 
              ? format(new Date(stats.lastTransactionDate), "MMM d, yyyy") 
              : "None"} 
            icon={Award} 
          />
        </div>
      )}
    </GlassCard>
  );
};

export default JestCoinStats;
