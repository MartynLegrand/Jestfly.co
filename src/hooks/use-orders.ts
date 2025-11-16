
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderItem } from "@/types";
import { fetchUserOrders, fetchOrderItems } from "@/lib/store/orderService";

export const useOrders = (userId: string | undefined) => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<{[key: string]: OrderItem[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadOrders = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchUserOrders(userId);
        setOrders(data);
      } catch (error: any) {
        toast({
          title: "Error loading orders",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [userId, toast]);
  
  const handleExpandOrder = async (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    
    setExpandedOrder(orderId);
    
    // Only fetch if we don't already have the items
    if (!orderItems[orderId]) {
      try {
        const items = await fetchOrderItems(orderId);
        setOrderItems(prev => ({
          ...prev,
          [orderId]: items
        }));
      } catch (error: any) {
        toast({
          title: "Error loading order details",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };
  
  return {
    orders,
    expandedOrder,
    orderItems,
    isLoading,
    handleExpandOrder
  };
};
