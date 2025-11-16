
import React from "react";
import { NFT } from "@/types";
import NFTCard from "./NFTCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface NFTGridProps {
  nfts: NFT[];
  onNFTsUpdate?: () => void;
}

const NFTGrid = ({ nfts, onNFTsUpdate }: NFTGridProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBuyNFT = async (nft: NFT) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to purchase NFTs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('purchase_nft', {
        nft_id: nft.id,
        buyer_id: user.id,
        price: nft.price
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Success!",
          description: "NFT purchased successfully",
        });
        onNFTsUpdate?.();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          onBuy={() => handleBuyNFT(nft)}
          onLike={() => {}}
        />
      ))}
    </div>
  );
};

export default NFTGrid;
