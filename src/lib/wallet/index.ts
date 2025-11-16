
// Re-export all wallet service functions to ensure proper connections
import { fetchUserWallet, subscribeToWalletUpdates } from './walletApi';
import { fetchWalletTransactions, subscribeToTransactionUpdates } from './transactionApi';
import { transferJestCoins, transferJestCoin } from './transferService';
import { searchUsers } from './userService';
import { getWalletStats } from './statsService';

export {
  fetchUserWallet,
  fetchWalletTransactions,
  subscribeToWalletUpdates,
  subscribeToTransactionUpdates,
  transferJestCoins,
  transferJestCoin,
  searchUsers,
  getWalletStats
};
