
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { formatDistanceToNow } from "date-fns";
import { ShoppingCart, Heart } from "lucide-react";
import { NFT } from "@/types";

interface NFTCardProps {
  nft: NFT;
  onBuy?: () => void;
  onLike?: () => void;
}

const NFTCard = ({ nft, onBuy, onLike }: NFTCardProps) => {
  const { user } = useAuth();
  // Use both new and old property names with fallbacks
  const isOwner = user?.id === (nft.ownerAddress || nft.owner_id || (nft.owner && nft.owner.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="overflow-hidden">
        <Link to={`/nft/${nft.id}`} className="block">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={nft.image_url || nft.imageUrl || nft.thumbnail_url || nft.media_url}
              alt={nft.name || nft.title || "NFT"}
              className="object-cover w-full h-full transition-transform hover:scale-105"
            />
            {(nft.isForSale || nft.is_for_sale) && (
              <div className="absolute top-2 right-2 bg-primary/90 text-white px-2 py-1 rounded-full text-sm">
                For Sale
              </div>
            )}
          </div>
        </Link>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg truncate">{nft.name || nft.title}</h3>
            <button
              onClick={onLike}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <div className="text-sm text-muted-foreground mb-4">
            Created {formatDistanceToNow(new Date(nft.created_at || nft.createdAt || ""), { addSuffix: true })}
          </div>

          <div className="flex justify-between items-center">
            {(nft.isForSale || nft.is_for_sale) ? (
              <>
                <div className="text-primary font-semibold">
                  {nft.price} JC
                </div>
                {!isOwner && (
                  <Button onClick={onBuy} size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                )}
              </>
            ) : (
              <div className="text-muted-foreground">Not for sale</div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default NFTCard;
