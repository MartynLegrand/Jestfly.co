
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types';

export interface WalletContextType {
  wallet: {
    id: string;
    address: string;
    balance: number;
  } | null;
  balance: number;
  isLoading: boolean;
  error: Error | null;
  refreshWallet: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  transactions: Transaction[];
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  balance: 0,
  isLoading: false,
  error: null,
  refreshWallet: async () => {},
  refreshTransactions: async () => {},
  transactions: []
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<{ id: string; address: string; balance: number } | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      loadWallet();
      loadTransactions();
    } else {
      setWallet(null);
      setBalance(0);
      setTransactions([]);
    }
  }, [user]);

  const loadWallet = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch wallet from the database
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setWallet({
          id: data.id,
          address: `0x${user.id.replace(/-/g, '').substring(0, 40)}`,
          balance: data.balance || 0
        });
        setBalance(data.balance || 0);
      } else {
        // Create a new wallet if none exists
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            balance: 100 // Start with 100 JestCoins for new users
          })
          .select()
          .single();
        
        if (createError) throw createError;
        
        setWallet({
          id: newWallet.id,
          address: `0x${user.id.replace(/-/g, '').substring(0, 40)}`,
          balance: newWallet.balance || 100
        });
        setBalance(newWallet.balance || 100);
      }
    } catch (err) {
      console.error('Error loading wallet:', err);
      setError(err instanceof Error ? err : new Error('Failed to load wallet'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`wallet_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
  };

  const refreshWallet = async () => {
    if (!user || !wallet) return;
    
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setBalance(data.balance || 0);
        setWallet(prev => prev ? {...prev, balance: data.balance || 0} : null);
      }
    } catch (err) {
      console.error('Error refreshing balance:', err);
    }
  };
  
  const refreshTransactions = async () => {
    await loadTransactions();
  };

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      balance, 
      isLoading, 
      error, 
      refreshWallet, 
      refreshTransactions,
      transactions 
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
