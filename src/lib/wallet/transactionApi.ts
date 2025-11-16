
import { Transaction } from "@/types";
import { supabase } from "@/lib/supabase";

// Fetch wallet transactions
export const fetchWalletTransactions = async (walletId: string): Promise<Transaction[]> => {
  console.log("Fetching transactions for wallet:", walletId);
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Transactions fetch error:", error);
    
    // Return empty array if error
    return [];
  }
};

// Subscribe to transaction updates (real-time)
export const subscribeToTransactionUpdates = (
  walletId: string,
  callback: (transaction: Transaction) => void
): () => void => {
  console.log("Subscribing to transaction updates for:", walletId);
  
  const subscription = supabase
    .channel(`transactions_${walletId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'transactions',
        filter: `wallet_id=eq.${walletId}`
      }, 
      (payload) => {
        console.log("New transaction:", payload);
        callback(payload.new as Transaction);
      }
    )
    .subscribe();
  
  return () => {
    console.log("Unsubscribing from transaction updates for:", walletId);
    supabase.removeChannel(subscription);
  };
};
