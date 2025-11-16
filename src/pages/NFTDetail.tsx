
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import NFTViewer from "@/components/nft/NFTViewer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";

const NFTDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: nft, isLoading } = useQuery({
    queryKey: ['nft', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nfts')
        .select(`
          *,
          creator:creator_id(id, username, display_name, avatar),
          owner:owner_id(id, username, display_name, avatar),
          collection:collection_id(id, name, thumbnail_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: transactions } = useQuery({
    queryKey: ['nft-transactions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nft_transactions')
        .select(`
          *,
          seller:seller_id(username, display_name, avatar),
          buyer:buyer_id(username, display_name, avatar)
        `)
        .eq('nft_id', id)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const handleBuyNFT = async () => {
    if (!nft || !user) return;

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
          description: "NFT purchased successfully"
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <Container>
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-pulse text-lg">Loading NFT details...</div>
          </div>
        </Container>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">NFT Not Found</h1>
            <p className="mb-6">The NFT you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/nft-gallery">Back to Gallery</Link>
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const isOwner = user && user.id === nft.owner_id;

  return (
    <div className="min-h-screen py-20">
      <Container>
        <div className="mb-6">
          <Link to="/nft-gallery" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Gallery
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm border p-4">
            <NFTViewer nft={nft} />
          </div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{nft.title}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-muted-foreground mb-4">{nft.description}</p>
              <div className="flex items-center mb-2">
                <span className="text-muted-foreground mr-2">Creator:</span>
                <Link to={`/community/profile/${nft.creator.username}`} className="font-medium hover:text-primary">
                  {nft.creator.display_name || nft.creator.username}
                </Link>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-muted-foreground mr-2">Owner:</span>
                <Link to={`/community/profile/${nft.owner.username}`} className="font-medium hover:text-primary">
                  {nft.owner.display_name || nft.owner.username}
                </Link>
              </div>
              {nft.collection && (
                <div className="flex items-center mb-2">
                  <span className="text-muted-foreground mr-2">Collection:</span>
                  <Link to={`/nft/collection/${nft.collection.id}`} className="font-medium hover:text-primary">
                    {nft.collection.name}
                  </Link>
                </div>
              )}
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">Created:</span>
                <span>{formatDistanceToNow(new Date(nft.created_at), { addSuffix: true })}</span>
              </div>
            </div>

            {nft.is_for_sale ? (
              <div className="mb-6 p-4 border rounded-lg bg-background/50 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current price</p>
                    <p className="text-3xl font-bold">{nft.price} JC</p>
                  </div>
                  {!isOwner && (
                    <Button onClick={handleBuyNFT}>Buy Now</Button>
                  )}
                </div>
                {nft.royalty_percentage > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Includes {nft.royalty_percentage}% creator royalty
                  </p>
                )}
              </div>
            ) : (
              <div className="mb-6 p-4 border rounded-lg bg-background/50 backdrop-blur-sm">
                <p className="text-center text-muted-foreground">This NFT is not currently for sale</p>
              </div>
            )}

            {isOwner && !nft.is_for_sale && (
              <Button className="w-full mb-6">List for Sale</Button>
            )}

            {transactions && transactions.length > 0 && (
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b bg-muted/50">
                  <h3 className="font-medium">Transaction History</h3>
                </div>
                <div className="divide-y">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {tx.price} JC
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(tx.transaction_date), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          <span className="text-muted-foreground">From: </span>
                          <Link to={`/community/profile/${tx.seller.username}`} className="hover:text-primary">
                            {tx.seller.display_name || tx.seller.username}
                          </Link>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">To: </span>
                          <Link to={`/community/profile/${tx.buyer.username}`} className="hover:text-primary">
                            {tx.buyer.display_name || tx.buyer.username}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NFTDetail;
