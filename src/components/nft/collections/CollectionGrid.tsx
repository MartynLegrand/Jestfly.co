
import React from "react";
import { NFTCollection } from "@/types/nft";
import { useQuery } from "@tanstack/react-query";
import CollectionCard from "./CollectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder } from "lucide-react";
import { fetchCollections } from "@/services/nft/nftService";

interface CollectionGridProps {
  parentId?: string;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ parentId }) => {
  const { data: collections, isLoading } = useQuery({
    queryKey: ["nft-collections", parentId],
    queryFn: async () => {
      // We'll use the existing fetchCollections but modify it to accept the parentId
      return await fetchCollections();
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[100px] w-full rounded-xl" />
              <Skeleton className="h-[20px] w-2/3 rounded-lg" />
              <Skeleton className="h-[16px] w-full rounded-lg" />
            </div>
          ))}
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="text-center py-12">
        <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No collections found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {parentId
            ? "This collection doesn't have any subcollections yet."
            : "No collections have been created yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionGrid;
