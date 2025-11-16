
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import NFTGrid from "@/components/nft/NFTGrid";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const NFTGallery = () => {
  const { user } = useAuth();
  const { data: nfts, refetch } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfts')
        .select(`
          *,
          creator:creator_id(username, display_name, avatar),
          owner:owner_id(username, display_name, avatar),
          collection:collection_id(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen py-20">
      <Container>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">NFT Gallery</h1>
            <p className="text-muted-foreground">
              Discover and collect unique digital artworks
            </p>
          </div>
          
          {user && (
            <Button asChild>
              <Link to="/nft/mint">
                <Plus className="mr-2 h-4 w-4" /> Create NFT
              </Link>
            </Button>
          )}
        </div>

        {nfts && <NFTGrid nfts={nfts} onNFTsUpdate={refetch} />}
      </Container>
    </div>
  );
};

export default NFTGallery;
