
import React from "react";
import { NFTCollection } from "@/types";
import { fetchCollectionById } from "@/services/nft/nftService";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, CheckCircle, Image } from "lucide-react";

interface CollectionHeaderProps {
  collectionId: string;
}

const CollectionHeader: React.FC<CollectionHeaderProps> = ({ collectionId }) => {
  const { data: collection, isLoading } = useQuery({
    queryKey: ["nft-collection", collectionId],
    queryFn: () => fetchCollectionById(collectionId),
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="relative">
          <Skeleton className="w-full h-48" />
          <div className="absolute -bottom-12 left-6">
            <Skeleton className="w-24 h-24 rounded-full" />
          </div>
        </div>
        <div className="mt-16 space-y-2">
          <Skeleton className="w-1/3 h-8" />
          <Skeleton className="w-2/3 h-4" />
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Collection Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The collection you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/nft/gallery">Back to Gallery</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="h-48 bg-gradient-to-tr from-primary/20 to-muted-foreground/10">
          {collection.banner_url ? (
            <img
              src={collection.banner_url}
              alt={collection.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <div className="absolute -bottom-12 left-6">
          <Avatar className="h-24 w-24 border-4 border-background">
            <img
              src={collection.thumbnail_url || "/placeholder.svg"}
              alt={collection.name}
              className="object-cover"
            />
          </Avatar>
        </div>
      </div>

      <div className="pt-16 px-6">
        {/* Only render parent navigation if parent exists */}
        {collection.parent && (
          <div className="flex items-center mb-1 gap-2">
            <Link
              to={`/nft/collection/${collection.parent.id}`}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to {collection.parent.name}
            </Link>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          {/* Use verified property (is_verified is an alias) */}
          {collection.verified && (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
        </div>
        
        <p className="text-muted-foreground max-w-2xl">
          {collection.description || "No description available"}
        </p>

        <div className="flex gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{collection.nft_count || 0}</p>
            <p className="text-sm text-muted-foreground">Items</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{collection.floor_price || 0} JC</p>
            <p className="text-sm text-muted-foreground">Floor Price</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{collection.total_volume || 0} JC</p>
            <p className="text-sm text-muted-foreground">Volume Traded</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionHeader;
