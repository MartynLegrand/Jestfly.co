
import { supabase } from "@/lib/supabase";

// Transfer JestCoins to another user
export const transferJestCoins = async (
  fromUserId: string,
  toUserId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; message: string }> => {
  console.log(`Transferring ${amount} JestCoins from user ${fromUserId} to user ${toUserId}`);
  
  try {
    const { data, error } = await supabase
      .rpc('transfer_jestcoin', {
        sender_id: fromUserId,
        receiver_id: toUserId,
        amount: amount,
        description: description
      });
    
    if (error) {
      console.error("Transfer error:", error);
      return {
        success: false,
        message: error.message || "Ocorreu um erro durante a transferência"
      };
    }
    
    console.log("Transfer result:", data);
    
    if (data.success === false) {
      return {
        success: false,
        message: data.message || "Falha na transferência"
      };
    }
    
    return {
      success: true,
      message: `Transferência de ${amount} JestCoins realizada com sucesso`
    };
  } catch (error: any) {
    console.error("Transfer exception:", error);
    return {
      success: false,
      message: error.message || "Ocorreu um erro inesperado"
    };
  }
};

// For compatibility with older code
export const transferJestCoin = transferJestCoins;
