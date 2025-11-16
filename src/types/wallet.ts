
// Wallet and transaction related types
export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: "credit" | "debit";
  transaction_type?: "transfer" | "reward" | "purchase" | "refund" | "nft_purchase" | "nft_sale" | "nft_royalty";
  reference_id?: string;
  reference_type?: string;
  description: string;
  created_at: string;
}
