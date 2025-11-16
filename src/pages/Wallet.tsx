
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import GlassCard from "@/components/ui/GlassCard";
import WalletDisplay from "@/components/wallet/WalletDisplay";
import TransactionList from "@/components/wallet/TransactionList";
import TransferModal from "@/components/wallet/TransferModal";
import ReceiveModal from "@/components/wallet/ReceiveModal";
import RewardDisplay from "@/components/wallet/RewardDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart4, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";

const Wallet = () => {
  const { user, loading } = useAuth();
  const { refreshWallet, refreshTransactions, isLoading: walletLoading } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState<'all' | 'received' | 'sent'>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  React.useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to access your wallet.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, loading, navigate, toast]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshWallet();
    await refreshTransactions();
    toast({
      title: "Refreshed",
      description: "Your wallet and transactions have been updated",
    });
    setRefreshing(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Your Wallet</h1>
            <p className="text-muted-foreground">
              Manage your JestCoins and track your transactions
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={walletLoading || refreshing}
            className="animate-fade-in"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <WalletDisplay 
              onTransfer={() => setTransferModalOpen(true)}
              onReceive={() => setReceiveModalOpen(true)}
            />
          </div>
          <div>
            <GlassCard className="h-full flex flex-col justify-center items-center p-6">
              <BarChart4 className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-1">JestCoin Stats</h3>
              <p className="text-muted-foreground text-sm text-center mb-4">
                View detailed stats about your JestCoin activity
              </p>
              <Button variant="outline" size="sm" onClick={() => navigate("/jest-coin")}>
                View Stats
              </Button>
            </GlassCard>
          </div>
        </div>

        {/* New Rewards Section */}
        <div className="mb-8 animate-fade-in">
          <RewardDisplay />
        </div>

        <GlassCard className="mb-8 animate-scale-in">
          <Tabs defaultValue="all" onValueChange={(value) => setTransactionFilter(value as any)}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="received">Received</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <TransactionList filter="all" />
            </TabsContent>
            
            <TabsContent value="received" className="mt-0">
              <TransactionList filter="received" />
            </TabsContent>
            
            <TabsContent value="sent" className="mt-0">
              <TransactionList filter="sent" />
            </TabsContent>
          </Tabs>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <GlassCard className="flex items-center p-6 gap-4 hover-scale">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Send JestCoins</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Transfer JestCoins to other users
              </p>
              <Button size="sm" onClick={() => setTransferModalOpen(true)}>Send Now</Button>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center p-6 gap-4 hover-scale">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Receive JestCoins</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your details to receive JestCoins
              </p>
              <Button size="sm" onClick={() => setReceiveModalOpen(true)}>Receive Now</Button>
            </div>
          </GlassCard>
        </div>
      </div>

      <TransferModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
      />

      <ReceiveModal
        open={receiveModalOpen}
        onOpenChange={setReceiveModalOpen}
      />
    </MainLayout>
  );
};

export default Wallet;
