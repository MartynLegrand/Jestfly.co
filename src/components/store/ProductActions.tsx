
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Share } from 'lucide-react';

interface ProductActionsProps {
  inStock: boolean;
  onAddToCart: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({ inStock, onAddToCart }) => {
  return (
    <div className="flex gap-4 pt-4">
      <Button
        className="flex-1"
        size="lg"
        onClick={onAddToCart}
        disabled={!inStock}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
      <Button variant="outline" size="icon">
        <Share className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ProductActions;
