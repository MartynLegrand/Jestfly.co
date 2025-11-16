
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantityControlProps {
  quantity: number;
  productId: string;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ 
  quantity, 
  productId, 
  onUpdateQuantity 
}) => {
  return (
    <div className="flex items-center">
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-r-none"
        onClick={() => onUpdateQuantity(
          productId, 
          Math.max(1, quantity - 1)
        )}
      >
        -
      </Button>
      <Input 
        type="number" 
        min="1"
        value={quantity} 
        onChange={(e) => onUpdateQuantity(
          productId, 
          parseInt(e.target.value) || 1
        )}
        className="h-8 w-12 text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button 
        variant="outline" 
        size="icon" 
        className="h-8 w-8 rounded-l-none"
        onClick={() => onUpdateQuantity(
          productId, 
          quantity + 1
        )}
      >
        +
      </Button>
    </div>
  );
};

export default QuantityControl;
