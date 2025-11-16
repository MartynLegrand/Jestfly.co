
import { supabase } from "@/lib/supabase";

// Get wallet statistics
export const getWalletStats = async (walletId: string) => {
  console.log("Fetching wallet stats for:", walletId);
  
  try {
    // Get total sent
    const { data: sentData, error: sentError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('wallet_id', walletId)
      .lt('amount', 0);
    
    if (sentError) throw sentError;
    
    // Get total received
    const { data: receivedData, error: receivedError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('wallet_id', walletId)
      .gt('amount', 0);
    
    if (receivedError) throw receivedError;
    
    // Calculate totals
    const totalSent = sentData?.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) || 0;
    const totalReceived = receivedData?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
    
    // Get transaction count
    const { count, error: countError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('wallet_id', walletId);
    
    if (countError) throw countError;
    
    // Get last transaction date
    const { data: lastTxData, error: lastTxError } = await supabase
      .from('transactions')
      .select('created_at')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (lastTxError && lastTxError.code !== 'PGRST116') throw lastTxError;
    
    return {
      totalSent,
      totalReceived,
      transactionCount: count || 0,
      lastTransactionDate: lastTxData?.created_at || null,
    };
  } catch (error) {
    console.error("Error getting wallet stats:", error);
    
    // Fallback mock stats
    return {
      totalSent: 0,
      totalReceived: 0,
      transactionCount: 0,
      lastTransactionDate: null,
    };
  }
};
