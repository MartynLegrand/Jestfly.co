
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { CartItem } from "@/types";
import { createOrder } from "@/lib/store/orderService";

export const useCartCheckout = (clearCart: () => void) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (items: CartItem[], totalPrice: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to complete your purchase",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await createOrder(user.id, items, totalPrice);
      
      if (result.success) {
        toast({
          title: "Order placed successfully",
          description: "Your order has been placed and is being processed.",
        });
        clearCart();
        navigate(`/store/orders`);
      } else {
        throw new Error(result.error || "Failed to place order");
      }
    } catch (error: any) {
      toast({
        title: "Checkout failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleCheckout
  };
};
