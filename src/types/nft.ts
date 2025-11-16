// Define the NFT types
export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface NFTCollection {
  id: string;
  name: string;
  description: string;
  image_url: string;
  banner_url?: string;
  creator_id: string;
  creator?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  parent_id?: string;
  parent?: NFTCollection | null;
  floor_price?: number;
  volume?: number;
  items_count?: number;
  owners_count?: number;
  is_verified?: boolean;
  verified?: boolean;
  created_at: string;
  updated_at?: string;
  category?: string;
  external_url?: string;
  thumbnail_url?: string;
  nft_count?: number;
  total_volume?: number;
}

export interface NFT {
  id: string;
  name: string;
  title?: string;
  description: string;
  image_url: string;
  imageUrl?: string;
  media_url?: string;
  thumbnail_url?: string;
  creator_id: string;
  creator?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  owner_id: string;
  ownerAddress?: string;
  owner?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  collection_id?: string;
  collection?: NFTCollection | null;
  price?: number;
  currency?: string;
  token_id?: string;
  token_standard?: string;
  blockchain?: string;
  status: 'available' | 'sold' | 'auction' | 'offer';
  attributes?: NFTAttribute[];
  is_verified?: boolean;
  created_at: string;
  createdAt?: string;
  updated_at?: string;
  external_url?: string;
  animation_url?: string;
  is_for_sale?: boolean;
  isForSale?: boolean;
  type?: string;
  metadata?: string;
  royalty_percentage?: number;
}

export interface NFTTransaction {
  id: string;
  nft_id: string;
  from_user_id?: string;
  from_user?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  to_user_id: string;
  to_user?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  type: 'mint' | 'transfer' | 'sale' | 'offer' | 'auction';
  price?: number;
  currency?: string;
  transaction_hash?: string;
  created_at: string;
}

export interface NFTOffer {
  id: string;
  nft_id: string;
  buyer_id: string;
  buyer?: {
    id: string;
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  price: number;
  currency: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  expires_at?: string;
  created_at: string;
  updated_at?: string;
}
