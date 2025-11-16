
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchNFTById, fetchNFTMetadata, blockchainService } from "@/services/nft/nftService";
import { Loader, ExternalLink, Copy, CheckCircle, Clock, Tag, Info, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import NFTActionButtons from "./NFTActionButtons";
import NFTAttributeGrid from "./NFTAttributeGrid";
import NFTTransactionHistory from "./NFTTransactionHistory";

const NFTViewer = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: nft, isLoading: isLoadingNFT } = useQuery({
    queryKey: ["nft", id],
    queryFn: () => fetchNFTById(id || ""),
    enabled: !!id
  });

  const { data: metadata, isLoading: isLoadingMetadata } = useQuery({
    queryKey: ["nft-metadata", nft?.metadata],
    queryFn: () => fetchNFTMetadata(nft?.metadata || ""),
    enabled: !!nft?.metadata
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["nft-transactions", id],
    queryFn: () => blockchainService.getNFTTransactionHistory(id || ""),
    enabled: !!id
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The NFT ID has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNFT = () => {
    if (navigator.share) {
      navigator.share({
        title: nft?.title || "NFT on JestFly",
        text: `Check out this NFT: ${nft?.title}`,
        url: window.location.href,
      });
    } else {
      copyToClipboard(window.location.href);
      toast({
        title: "Link copied",
        description: "Share this link with others to show them this NFT.",
      });
    }
  };

  if (isLoadingNFT) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="text-center py-12">
        <div className="bg-muted/30 rounded-lg p-8">
          <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">NFT Not Found</h2>
          <p className="text-muted-foreground">
            The NFT you're looking for doesn't exist or has been removed.
          </p>
          <Button className="mt-6" variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* NFT Image/Media Section */}
        <div className="rounded-xl overflow-hidden bg-card border shadow-sm">
          <div className="aspect-square relative">
            {nft.type === "video" ? (
              <video
                src={nft.media_url}
                className="w-full h-full object-cover"
                controls
                autoPlay
                loop
                muted
              />
            ) : nft.type === "audio" ? (
              <div className="relative w-full h-full flex flex-col justify-between">
                <img
                  src={nft.thumbnail_url || "/placeholder.svg"}
                  alt={nft.title}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute bottom-0 w-full bg-black/50 p-4">
                  <audio src={nft.media_url} controls className="w-full" />
                </div>
              </div>
            ) : (
              <img
                src={nft.media_url}
                alt={nft.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* NFT Info Section */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{nft.title}</h1>
                {nft.verified && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>
                  Created{" "}
                  {formatDistanceToNow(new Date(nft.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareNFT()}
                title="Share NFT"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(nft.id)}
                title="Copy NFT ID"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Creator and Owner Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Creator</p>
              <div className="flex items-center gap-2">
                <Avatar src={nft.creator?.avatar} fallback={nft.creator?.display_name?.[0] || "C"} />
                <div>
                  <p className="font-medium">{nft.creator?.display_name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{nft.creator?.username}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current Owner</p>
              <div className="flex items-center gap-2">
                <Avatar src={nft.owner?.avatar} fallback={nft.owner?.display_name?.[0] || "O"} />
                <div>
                  <p className="font-medium">{nft.owner?.display_name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{nft.owner?.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Collection Info */}
          {nft.collection && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Collection</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  {nft.collection.name}
                </Badge>
              </div>
            </div>
          )}

          {/* Price and action buttons */}
          <div className="mb-6">
            {nft.is_for_sale ? (
              <div className="bg-muted/30 rounded-lg p-4 mb-4">
                <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold">{nft.price} JC</p>
                </div>
              </div>
            ) : (
              <div className="bg-muted/30 rounded-lg p-4 mb-4">
                <p className="text-muted-foreground">Not for sale</p>
              </div>
            )}

            <NFTActionButtons nft={nft} />
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Description</p>
            <p className="text-sm">{nft.description}</p>
          </div>

          <a
            href={blockchainService.getExplorerUrl(nft.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-primary hover:underline mb-6"
          >
            <Shield className="h-4 w-4" />
            <span>View on blockchain</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Metadata and Transactions Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            {isLoadingMetadata ? (
              <div className="flex justify-center py-8">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            ) : metadata?.attributes ? (
              <NFTAttributeGrid attributes={metadata.attributes} />
            ) : (
              <div className="bg-muted/30 rounded-lg p-6 text-center">
                <Info className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p>No metadata attributes available for this NFT</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="history">
            {isLoadingTransactions ? (
              <div className="flex justify-center py-8">
                <Loader className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <NFTTransactionHistory transactions={transactions || []} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NFTViewer;
