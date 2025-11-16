
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/lib/store/cartStore";
import { ShoppingCart, Music, Paintbrush, Gift, Calendar, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addItem = useCartStore(state => state.addItem);
  const [isAdding, setIsAdding] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    
    // Simulate network delay
    setTimeout(() => {
      addItem(product, 1);
      setIsAdding(false);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    }, 500);
  };
  
  const getProductIcon = () => {
    switch (product.type) {
      case 'digital': return <Music className="h-6 w-6" />;
      case 'nft': return <Paintbrush className="h-6 w-6" />;
      case 'experience': return <Calendar className="h-6 w-6" />;
      default: return <Gift className="h-6 w-6" />;
    }
  };
  
  const renderRatingStars = () => {
    if (!product.average_rating) return null;
    
    return (
      <div className="flex items-center mt-1">
        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        <span className="text-sm ml-1 text-muted-foreground">
          {product.average_rating.toFixed(1)} 
          {product.rating_count ? ` (${product.rating_count})` : ''}
        </span>
      </div>
    );
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onClick={() => navigate(`/store/product/${product.id}`)}
    >
      <div className="relative h-48 overflow-hidden">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            {getProductIcon()}
          </div>
        )}
        <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
          {product.type}
        </div>
        {product.is_digital && (
          <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
            Digital
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
        {renderRatingStars()}
        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
          {product.description || 'No description available'}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <div className="text-lg font-bold">{product.price} JC</div>
          {product.jest_coin_price && (
            <div className="text-xs text-muted-foreground">
              Save {product.price - product.jest_coin_price} JC
            </div>
          )}
        </div>
        <Button 
          size="sm" 
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isAdding ? 'Adding...' : 'Add'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
