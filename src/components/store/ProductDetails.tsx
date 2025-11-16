
import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store/cartStore";
import { ShoppingCart, Clock, Gift } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface ProductDetailsProps {
  product: Product | null;
  isLoading: boolean;
}

const ProductDetails = ({ product, isLoading }: ProductDetailsProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    
    // Simulate network delay
    setTimeout(() => {
      addItem(product, quantity);
      setIsAdding(false);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-1/3" />
        <div className="mt-6 pt-6 border-t border-border">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!product) return null;
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
      
      <div className="mb-4 flex items-center gap-2">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
          {product.type}
        </span>
        <span className="text-muted-foreground text-sm">
          {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
        </span>
      </div>
      
      <p className="text-muted-foreground mb-6">
        {product.description || 'No description available for this product.'}
      </p>
      
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-3xl font-bold">{product.price} JC</span>
        {product.jest_coin_price && product.jest_coin_price < product.price && (
          <span className="text-lg text-muted-foreground line-through">
            {product.price} JC
          </span>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-r-none"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <Input 
              type="number" 
              min="1"
              value={quantity} 
              onChange={handleQuantityChange}
              className="h-10 w-16 text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-l-none"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
          
          <span className="text-sm text-muted-foreground">
            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </span>
        </div>
        
        <Button 
          className="w-full"
          size="lg"
          disabled={isAdding || product.stock <= 0}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            "Adding to Cart..."
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
      
      <GlassCard className="mt-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Delivery</span>
            </div>
            <span className="text-sm">Immediate</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Type</span>
            </div>
            <span className="text-sm capitalize">{product.type}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProductDetails;
