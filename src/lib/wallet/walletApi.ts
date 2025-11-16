
import { Wallet } from "@/types";
import { supabase } from "@/lib/supabase";

// Fetch a user's wallet
export const fetchUserWallet = async (userId: string): Promise<Wallet> => {
  console.log("Fetching wallet for user:", userId);

  try {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Error fetching wallet:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Wallet fetch error:", error);
    
    // Fallback mock wallet for development (if database connection fails)
    return {
      id: "mock-wallet-id",
      user_id: userId,
      balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
};

// Subscribe to wallet updates (real-time)
export const subscribeToWalletUpdates = (
  walletId: string, 
  callback: (wallet: Wallet) => void
): () => void => {
  console.log("Subscribing to wallet updates for:", walletId);
  
  const subscription = supabase
    .channel(`wallet_${walletId}`)
    .on('postgres_changes', 
      { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'wallets',
        filter: `id=eq.${walletId}`
      }, 
      (payload) => {
        console.log("Wallet updated:", payload);
        callback(payload.new as Wallet);
      }
    )
    .subscribe();
  
  return () => {
    console.log("Unsubscribing from wallet updates for:", walletId);
    supabase.removeChannel(subscription);
  };
};
