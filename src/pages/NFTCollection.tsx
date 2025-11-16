
import React from "react";
import { useParams } from "react-router-dom";
import Container from "@/components/ui/Container";
import CollectionHeader from "@/components/nft/collections/CollectionHeader";
import CollectionGrid from "@/components/nft/collections/CollectionGrid";
import NFTGrid from "@/components/nft/NFTGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchNFTsByCollection } from "@/services/nft/nftService";
import { useQuery } from "@tanstack/react-query";

const NFTCollection: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: nfts, refetch } = useQuery({
    queryKey: ["collection-nfts", id],
    queryFn: () => fetchNFTsByCollection(id || ""),
    enabled: !!id,
  });

  if (!id) {
    return (
      <div className="min-h-screen py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Collection Not Found</h1>
            <p className="text-muted-foreground">
              The collection you're looking for doesn't exist.
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <CollectionHeader collectionId={id} />
      
      <Container>
        <Tabs defaultValue="nfts" className="mt-8">
          <TabsList>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
            <TabsTrigger value="subcollections">Subcollections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nfts" className="mt-6">
            {nfts && <NFTGrid nfts={nfts} onNFTsUpdate={refetch} />}
          </TabsContent>
          
          <TabsContent value="subcollections" className="mt-6">
            <CollectionGrid parentId={id} />
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default NFTCollection;
