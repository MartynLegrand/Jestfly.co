import { NFT, NFTCollection, NFTTransaction } from '@/types/nft';
import { supabase } from '@/lib/supabase/client';
import blockchainService from './blockchainService';

// Fetch an NFT by its ID
export const fetchNFTById = async (id: string): Promise<NFT | null> => {
  const { data, error } = await supabase
    .from('nfts')
    .select(`
      *,
      creator:creator_id(id, username, display_name, avatar_url),
      owner:owner_id(id, username, display_name, avatar_url),
      collection:collection_id(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching NFT:', error);
    return null;
  }

  return data as unknown as NFT;
};

// Fetch all NFTs
export const fetchNFTs = async (limit = 20, offset = 0): Promise<NFT[]> => {
  const { data, error } = await supabase
    .from('nfts')
    .select(`
      *,
      creator:creator_id(id, username, display_name, avatar_url),
      owner:owner_id(id, username, display_name, avatar_url),
      collection:collection_id(*)
    `)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }

  return data as unknown as NFT[];
};

// Fetch NFTs by collection ID
export const fetchNFTsByCollection = async (collectionId: string): Promise<NFT[]> => {
  const { data, error } = await supabase
    .from('nfts')
    .select(`
      *,
      creator:creator_id(id, username, display_name, avatar_url),
      owner:owner_id(id, username, display_name, avatar_url),
      collection:collection_id(*)
    `)
    .eq('collection_id', collectionId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching NFTs by collection:', error);
    return [];
  }

  return data as unknown as NFT[];
};

// Fetch NFTs by creator ID
export const fetchNFTsByCreator = async (creatorId: string): Promise<NFT[]> => {
  const { data, error } = await supabase
    .from('nfts')
    .select(`
      *,
      creator:creator_id(id, username, display_name, avatar_url),
      owner:owner_id(id, username, display_name, avatar_url),
      collection:collection_id(*)
    `)
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching NFTs by creator:', error);
    return [];
  }

  return data as unknown as NFT[];
};

// Fetch NFTs by owner ID
export const fetchNFTsByOwner = async (ownerId: string): Promise<NFT[]> => {
  const { data, error } = await supabase
    .from('nfts')
    .select(`
      *,
      creator:creator_id(id, username, display_name, avatar_url),
      owner:owner_id(id, username, display_name, avatar_url),
      collection:collection_id(*)
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching NFTs by owner:', error);
    return [];
  }

  return data as unknown as NFT[];
};

// Fetch a collection by its ID
export const fetchCollectionById = async (id: string): Promise<NFTCollection | null> => {
  const { data, error } = await supabase
    .from('nft_collections')
    .select(`
      *,
      creator:creator_id(id, username, display_name, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching collection:', error);
    return null;
  }

  return data as unknown as NFTCollection;
};

// Fetch all collections
export const fetchCollections = async (limit = 20, offset = 0): Promise<NFTCollection[]> => {
  const { data, error } = await supabase
    .from('nft_collections')
    .select(`
      *,
      creator:creator_id(id, username, display_name, avatar_url)
    `)
    .range(offset, offset + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching collections:', error);
    return [];
  }

  return data as unknown as NFTCollection[];
};

// Fetch transactions for an NFT
export const fetchNFTTransactions = async (nftId: string): Promise<NFTTransaction[]> => {
  const { data, error } = await supabase
    .from('nft_transactions')
    .select(`
      *,
      from_user:from_user_id(id, username, display_name, avatar_url),
      to_user:to_user_id(id, username, display_name, avatar_url)
    `)
    .eq('nft_id', nftId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching NFT transactions:', error);
    return [];
  }

  return data as unknown as NFTTransaction[];
};

// Purchase an NFT with JestCoin
export const purchaseNFT = async (nftId: string, price: number): Promise<{ success: boolean; error?: string }> => {
  try {
    // Mock implementation - would connect to blockchain/payment processing in production
    console.log(`Purchasing NFT ${nftId} for ${price} JestCoin`);
    
    // Simulate a successful purchase
    return { success: true };
  } catch (error) {
    console.error('Error purchasing NFT:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Make an offer on an NFT
export const makeOffer = async (nftId: string, offerId: string, amount: number): Promise<{ success: boolean; error?: string }> => {
  try {
    // Mock implementation - would connect to offer system in production
    console.log(`Making offer ${offerId} on NFT ${nftId} for ${amount} JestCoin`);
    
    // Simulate a successful offer
    return { success: true };
  } catch (error) {
    console.error('Error making offer on NFT:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// List an NFT for sale
export const listNFTForSale = async (nftId: string, price: number): Promise<{ success: boolean; error?: string }> => {
  try {
    // Mock implementation - would connect to blockchain/marketplace in production
    console.log(`Listing NFT ${nftId} for sale at ${price} JC`);
    
    const { data, error } = await supabase
      .from('nfts')
      .update({ 
        is_for_sale: true,
        price: price 
      })
      .eq('id', nftId);
      
    if (error) throw error;
    
    // Simulate a successful listing
    return { success: true };
  } catch (error) {
    console.error('Error listing NFT for sale:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Export blockchainService to fix the import error in the test file
export { blockchainService };
