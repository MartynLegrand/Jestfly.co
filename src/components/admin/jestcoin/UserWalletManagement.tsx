
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Coins, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface UserWallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  user: {
    username: string;
    display_name: string;
    profile_type: string;
  };
  transaction_count: number;
}

interface UserWalletManagementProps {
  onRefresh: () => void;
}

const UserWalletManagement: React.FC<UserWalletManagementProps> = ({ onRefresh }) => {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"balance" | "username" | "transaction_count">("balance");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedWallet, setSelectedWallet] = useState<UserWallet | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, [sortField, sortDirection]);

  const fetchWallets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("wallets")
        .select(`
          *,
          user:profiles!user_id(username, display_name, profile_type),
          transaction_count:transactions!wallet_id(count)
        `)
        .order(sortField === "username" ? "user(username)" : sortField, {
          ascending: sortDirection === "asc",
        });

      if (error) throw error;

      // Format the data to handle the transaction count aggregation
      const formattedData = data.map(wallet => ({
        ...wallet,
        transaction_count: wallet.transaction_count?.[0]?.count || 0
      }));

      setWallets(formattedData);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      toast({
        title: "Error",
        description: "Failed to load user wallets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: "balance" | "username" | "transaction_count") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredWallets = wallets.filter((wallet) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      wallet.user?.username?.toLowerCase().includes(searchTermLower) ||
      wallet.user?.display_name?.toLowerCase().includes(searchTermLower) ||
      wallet.balance.toString().includes(searchTermLower)
    );
  });

  const handleAdjustWallet = async () => {
    if (!selectedWallet || adjustmentAmount === 0 || !adjustmentReason) return;
    
    setIsProcessing(true);
    
    try {
      // Determine if this is a reward or deduction
      const isReward = adjustmentAmount > 0;
      
      if (isReward) {
        // Use the reward_user function
        const { data, error } = await supabase.rpc('reward_user', {
          user_id: selectedWallet.user_id,
          amount: Math.abs(adjustmentAmount),
          reward_description: adjustmentReason
        });
        
        if (error) throw error;
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to reward user');
        }
      } else {
        // For deductions, we'll use a direct update
        // Get admin user ID
        const { data: authData } = await supabase.auth.getUser();
        const adminId = authData.user?.id;
        
        if (!adminId) {
          throw new Error('Admin ID not available');
        }
        
        // Use transfer_jestcoin function to deduct coins (sending from user to admin)
        const { data, error } = await supabase.rpc('transfer_jestcoin', {
          sender_id: selectedWallet.user_id,
          receiver_id: adminId,
          amount: Math.abs(adjustmentAmount),
          description: adjustmentReason
        });
        
        if (error) throw error;
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to deduct JestCoins');
        }
      }
      
      toast({
        title: "Wallet adjusted",
        description: `Successfully ${isReward ? 'added' : 'deducted'} ${Math.abs(adjustmentAmount)} JestCoins.`,
        variant: "default",
      });
      
      // Close dialog and reset form
      setSelectedWallet(null);
      setAdjustmentAmount(0);
      setAdjustmentReason("");
      
      // Refresh the list
      fetchWallets();
      onRefresh();
    } catch (error) {
      console.error("Error adjusting wallet:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to adjust wallet.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users or wallets..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8 w-full sm:w-[300px]"
            />
          </div>
          <Button onClick={fetchWallets} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <button
                    className="flex items-center"
                    onClick={() => handleSort("balance")}
                  >
                    <span>Balance</span>
                    {sortField === "balance" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                    {sortField !== "balance" && (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center"
                    onClick={() => handleSort("transaction_count")}
                  >
                    <span>Transactions</span>
                    {sortField === "transaction_count" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                    {sortField !== "transaction_count" && (
                      <ArrowUpDown className="ml-1 h-3 w-3" />
                    )}
                  </button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Loading wallets...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredWallets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    <div className="text-muted-foreground">No wallets found</div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredWallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell>
                      <div className="font-medium">
                        {wallet.user?.display_name || "Unknown"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{wallet.user?.username || "unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs px-2 py-1 rounded bg-secondary inline-block capitalize">
                        {wallet.user?.profile_type || "unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{wallet.balance} JC</div>
                    </TableCell>
                    <TableCell>
                      {wallet.transaction_count}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedWallet(wallet)}
                      >
                        <Coins className="h-4 w-4 mr-1" />
                        Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Wallet Adjustment Dialog */}
      <Dialog open={!!selectedWallet} onOpenChange={(open) => !open && setSelectedWallet(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Wallet Balance</DialogTitle>
          </DialogHeader>

          <div className="p-4 border rounded-md mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">{selectedWallet?.user?.display_name}</div>
                <div className="text-xs text-muted-foreground">@{selectedWallet?.user?.username}</div>
              </div>
            </div>
            <div className="text-sm mt-1">
              Current Balance: <span className="font-medium">{selectedWallet?.balance} JC</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Adjustment Amount (JC)</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="pl-8"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  {adjustmentAmount >= 0 ? (
                    <ArrowUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Use positive values to add JestCoins or negative values to deduct.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Adjustment</Label>
              <Input
                id="reason"
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                placeholder="e.g., Reward for contest, Penalty for violation"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedWallet(null)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdjustWallet}
              disabled={isProcessing || adjustmentAmount === 0 || !adjustmentReason}
              variant={adjustmentAmount >= 0 ? "default" : "destructive"}
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  {adjustmentAmount >= 0 ? (
                    <>
                      <ArrowUp className="h-4 w-4 mr-1" />
                      Add {Math.abs(adjustmentAmount)} JC
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-4 w-4 mr-1" />
                      Deduct {Math.abs(adjustmentAmount)} JC
                    </>
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserWalletManagement;
