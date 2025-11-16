import React, { useState } from 'react';
import { NFT } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Gift, 
  Tag, 
  AlertTriangle,
  Info,
  Wallet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { purchaseNFT, makeOffer, listNFTForSale } from '@/services/nft/nftService';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NFTActionButtonsProps {
  nft: NFT;
  onActionComplete?: () => void;
}

const NFTActionButtons: React.FC<NFTActionButtonsProps> = ({ 
  nft, 
  onActionComplete 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { wallet, balance } = useWallet();
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isMakingOffer, setIsMakingOffer] = useState(false);
  const [isListing, setIsListing] = useState(false);
  const [isGifting, setIsGifting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  const [offerAmount, setOfferAmount] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [shareOption, setShareOption] = useState('link');
  const [shareMessage, setShareMessage] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isOwner = user?.id === nft.owner_id || 
                  (nft.owner && typeof nft.owner === 'object' && user?.id === nft.owner.id);
                  
  const canPurchase = (nft.is_for_sale || nft.isForSale) && !isOwner && wallet && balance >= (nft.price || 0);
  const canMakeOffer = !isOwner && wallet;
  const canList = isOwner && !(nft.is_for_sale || nft.isForSale);
  const canGift = isOwner;
  
  const handlePurchase = async () => {
    if (!user || !wallet) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to purchase this NFT",
        variant: "destructive",
      });
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsPurchasing(true);
    
    try {
      const result = await purchaseNFT(nft.id, nft.price || 0);
      
      if (result.success) {
        setSuccess("Purchase successful! The NFT is now in your collection.");
        toast({
          title: "Purchase successful",
          description: "The NFT is now in your collection",
        });
        
        if (onActionComplete) {
          onActionComplete();
        }
      } else {
        setError(result.error || "Failed to purchase NFT");
        toast({
          title: "Purchase failed",
          description: result.error || "Failed to purchase NFT",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      toast({
        title: "Purchase failed",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };
  
  const handleMakeOffer = async () => {
    if (!user || !wallet) {
      toast({
        title: "Authentication required",
        description: "Please connect your wallet to make an offer",
        variant: "destructive",
      });
      return;
    }
    
    setError(null);
    setSuccess(null);
    
    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid offer amount");
      return;
    }
    
    if (amount > balance) {
      setError("Insufficient balance to make this offer");
      return;
    }
    
    try {
      const result = await makeOffer(nft.id, user.id, amount);
      
      if (result.success) {
        setSuccess("Your offer has been submitted successfully!");
        toast({
          title: "Offer submitted",
          description: "Your offer has been sent to the owner",
        });
        
        setOfferAmount('');
        setIsMakingOffer(false);
        
        if (onActionComplete) {
          onActionComplete();
        }
      } else {
        setError(result.error || "Failed to submit offer");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };
  
  const handleListForSale = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to list this NFT for sale",
        variant: "destructive",
      });
      return;
    }
    
    setError(null);
    setSuccess(null);
    
    const price = parseFloat(listingPrice);
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }
    
    try {
      const result = await listNFTForSale(nft.id, price);
      
      if (result.success) {
        setSuccess("Your NFT has been listed for sale!");
        toast({
          title: "NFT listed",
          description: `Your NFT is now listed for ${price} JC`,
        });
        
        setListingPrice('');
        setIsListing(false);
        
        if (onActionComplete) {
          onActionComplete();
        }
      } else {
        setError(result.error || "Failed to list NFT for sale");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  };
  
  const handleGift = () => {
    if (!giftRecipient.trim()) {
      setError("Please enter a recipient address or username");
      return;
    }
    
    toast({
      title: "Gift sent",
      description: "Your NFT has been gifted successfully",
    });
    
    setGiftRecipient('');
    setGiftMessage('');
    setIsGifting(false);
    
    if (onActionComplete) {
      onActionComplete();
    }
  };
  
  const handleShare = () => {
    const url = `${window.location.origin}/nft/${nft.id}`;
    
    if (shareOption === 'link') {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "NFT link copied to clipboard",
      });
    } else {
      window.open(`https://${shareOption}.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareMessage)}`, '_blank');
    }
    
    setIsSharing(false);
  };
  
  const renderCollectionInfo = () => {
    if (!nft?.collection) return null;
    
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Collection:</span>
        <span className="font-medium text-foreground">{nft.collection.name}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {(nft.is_for_sale || nft.isForSale) && !isOwner && (
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => setIsPurchasing(true)}
          disabled={!canPurchase}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Buy Now for {nft.price} JC
        </Button>
      )}
      
      {isOwner && !(nft.is_for_sale || nft.isForSale) && (
        <Button 
          className="w-full" 
          size="lg"
          onClick={() => setIsListing(true)}
        >
          <Tag className="mr-2 h-4 w-4" />
          List for Sale
        </Button>
      )}
      
      <div className="flex flex-wrap gap-2">
        {!isOwner && (
          <Button 
            variant="outline" 
            onClick={() => setIsMakingOffer(true)}
            disabled={!canMakeOffer}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Make Offer
          </Button>
        )}
        
        {isOwner && (
          <Button 
            variant="outline" 
            onClick={() => setIsGifting(true)}
          >
            <Gift className="mr-2 h-4 w-4" />
            Gift
          </Button>
        )}
        
        <Button variant="outline">
          <Heart className="mr-2 h-4 w-4" />
          Favorite
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => setIsSharing(true)}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
      
      {renderCollectionInfo()}
      
      <Dialog open={isPurchasing} onOpenChange={setIsPurchasing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase NFT</DialogTitle>
            <DialogDescription>
              You are about to purchase "{nft.name}" for {nft.price} JC
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <Info className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex items-center justify-between">
              <span>Your balance:</span>
              <span className="font-bold">{balance} JC</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Price:</span>
              <span className="font-bold">{nft.price} JC</span>
            </div>
            
            <div className="flex items-center justify-between border-t pt-2">
              <span>Remaining balance:</span>
              <span className="font-bold">{balance - (nft.price || 0)} JC</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPurchasing(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} disabled={!canPurchase || !!success}>
              Confirm Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isMakingOffer} onOpenChange={setIsMakingOffer}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make an Offer</DialogTitle>
            <DialogDescription>
              Make an offer to purchase "{nft.name}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <Info className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="offerAmount">Your Offer (JC)</Label>
              <Input
                id="offerAmount"
                type="number"
                min="0"
                step="0.01"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <p className="text-xs text-muted-foreground">
                Your current balance: {balance} JC
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMakingOffer(false)}>
              Cancel
            </Button>
            <Button onClick={handleMakeOffer} disabled={!offerAmount || !!success}>
              Submit Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isListing} onOpenChange={setIsListing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List NFT for Sale</DialogTitle>
            <DialogDescription>
              Set a price to list "{nft.name}" for sale
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <Info className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="listingPrice">Price (JC)</Label>
              <Input
                id="listingPrice"
                type="number"
                min="0"
                step="0.01"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                placeholder="Enter price"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsListing(false)}>
              Cancel
            </Button>
            <Button onClick={handleListForSale} disabled={!listingPrice || !!success}>
              List for Sale
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isGifting} onOpenChange={setIsGifting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gift NFT</DialogTitle>
            <DialogDescription>
              Send "{nft.name}" as a gift to another user
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="giftRecipient">Recipient Address or Username</Label>
              <Input
                id="giftRecipient"
                value={giftRecipient}
                onChange={(e) => setGiftRecipient(e.target.value)}
                placeholder="Enter wallet address or username"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="giftMessage">Message (Optional)</Label>
              <Textarea
                id="giftMessage"
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Add a personal message"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGifting(false)}>
              Cancel
            </Button>
            <Button onClick={handleGift} disabled={!giftRecipient}>
              Send Gift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSharing} onOpenChange={setIsSharing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share NFT</DialogTitle>
            <DialogDescription>
              Share "{nft.name}" with others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shareOption">Share via</Label>
              <Select value={shareOption} onValueChange={setShareOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Copy Link</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {shareOption !== 'link' && (
              <div className="space-y-2">
                <Label htmlFor="shareMessage">Message (Optional)</Label>
                <Textarea
                  id="shareMessage"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Add a message"
                  rows={3}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSharing(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare}>
              {shareOption === 'link' ? 'Copy Link' : 'Share'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NFTActionButtons;
