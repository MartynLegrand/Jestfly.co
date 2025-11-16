
import React from 'react';
import { ShoppingCart } from "lucide-react";

interface CartItemImageProps {
  imageUrl?: string;
  title: string;
}

const CartItemImage: React.FC<CartItemImageProps> = ({ imageUrl, title }) => {
  return (
    <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full bg-primary/10 flex items-center justify-center">
          <ShoppingCart className="h-8 w-8 text-primary/50" />
        </div>
      )}
    </div>
  );
};

export default CartItemImage;
