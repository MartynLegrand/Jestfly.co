
import React from 'react';
import { CartItem } from "@/types";
import CartItemImage from './CartItemImage';
import QuantityControl from './QuantityControl';
import CartItemPrice from './CartItemPrice';

interface CartItemDetailsProps {
  item: CartItem;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
}

const CartItemDetails: React.FC<CartItemDetailsProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem 
}) => {
  return (
    <div className="flex gap-4">
      <CartItemImage 
        imageUrl={item.product.image_url} 
        title={item.product.title} 
      />
      
      <div className="flex-grow">
        <h3 className="font-medium">{item.product.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          {item.product.type}
        </p>
        
        <div className="flex items-center justify-between">
          {onUpdateQuantity && (
            <QuantityControl 
              quantity={item.quantity} 
              productId={item.product.id} 
              onUpdateQuantity={onUpdateQuantity} 
            />
          )}
          
          <CartItemPrice 
            price={item.product.price} 
            quantity={item.quantity} 
            productId={item.product.id} 
            onRemoveItem={onRemoveItem} 
          />
        </div>
      </div>
    </div>
  );
};

export default CartItemDetails;
