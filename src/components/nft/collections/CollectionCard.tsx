
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NFTCollection } from "@/types/nft";
import { Avatar } from "@/components/ui/avatar";
import { CircleEllipsis, CheckCircle, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";

interface CollectionCardProps {
  collection: NFTCollection;
  size?: "small" | "medium" | "large";
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection, size = "medium" }) => {
  const sizeClasses = {
    small: "max-w-[200px]",
    medium: "max-w-xs",
    large: "max-w-sm",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={sizeClasses[size]}
    >
      <Link to={`/nft/collection/${collection.id}`}>
        <GlassCard className="overflow-hidden hover:border-primary/50 transition-colors">
          <div className="relative">
            <div className="aspect-[3/1] bg-gradient-to-tr from-primary/20 to-muted-foreground/10">
              {collection.banner_url ? (
                <img
                  src={collection.banner_url}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="h-6 w-6 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-8 left-4">
              <Avatar className="h-16 w-16 border-4 border-background">
                <img
                  src={collection.thumbnail_url || "/placeholder.svg"}
                  alt={collection.name}
                  className="object-cover"
                />
              </Avatar>
            </div>
          </div>

          <div className="p-4 pt-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold text-lg">{collection.name}</h3>
                  {(collection.verified || collection.is_verified) && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {collection.description || "No description available"}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <CircleEllipsis className="h-5 w-5" />
              </Button>
            </div>

            {collection.nft_count !== undefined && (
              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-sm">
                <div>
                  <p className="font-medium">{collection.nft_count}</p>
                  <p className="text-muted-foreground text-xs">items</p>
                </div>
                <div>
                  <p className="font-medium">{collection.floor_price || 0} JC</p>
                  <p className="text-muted-foreground text-xs">floor</p>
                </div>
                <div>
                  <p className="font-medium">{collection.total_volume || 0} JC</p>
                  <p className="text-muted-foreground text-xs">volume</p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
};

export default CollectionCard;
