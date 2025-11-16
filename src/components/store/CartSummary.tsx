
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store/cartStore";
import GlassCard from "@/components/ui/GlassCard";

interface CartSummaryProps {
  totalItems: number;
  totalPrice: number; // This should match the property used in StoreCart
  isProcessing: boolean;
  onCheckout: () => void;
}

const CartSummary = ({ totalItems, totalPrice, isProcessing, onCheckout }: CartSummaryProps) => {
  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <ShoppingBag className="mr-2 h-5 w-5" />
        Order Summary
      </h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Items ({totalItems})</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      
      <Button 
        className="w-full" 
        size="lg"
        disabled={isProcessing}
        onClick={onCheckout}
      >
        {isProcessing ? "Processing..." : "Proceed to Checkout"}
      </Button>
      
      <p className="text-xs text-center mt-4 text-muted-foreground">
        Taxes and shipping calculated at checkout
      </p>
    </GlassCard>
  );
};

export default CartSummary;
