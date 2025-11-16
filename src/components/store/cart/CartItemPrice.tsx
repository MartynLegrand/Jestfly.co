
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CartItemPriceProps {
  price: number;
  quantity: number;
  productId: string;
  onRemoveItem?: (productId: string) => void;
}

const CartItemPrice: React.FC<CartItemPriceProps> = ({ 
  price, 
  quantity, 
  productId, 
  onRemoveItem 
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="font-medium">
        {price * quantity} JC
      </span>
      {onRemoveItem && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onRemoveItem(productId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CartItemPrice;
