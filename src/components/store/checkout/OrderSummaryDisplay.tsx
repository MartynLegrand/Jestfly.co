
import React from 'react';
import { Separator } from "@/components/ui/separator";

interface OrderSummaryDisplayProps {
  total: number;
}

const OrderSummaryDisplay: React.FC<OrderSummaryDisplayProps> = ({ total }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Resumo do Pedido</h3>
      
      <div className="rounded-md border p-4 space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{total.toFixed(2)} JC</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Frete</span>
          <span>0.00 JC</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{total.toFixed(2)} JC</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryDisplay;
