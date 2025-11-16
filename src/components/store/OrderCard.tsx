
import { useState } from "react";
import { Order, OrderItem } from "@/types";
import { Package, Calendar, Clock, ChevronRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import OrderItemList from "./OrderItemList";

interface OrderCardProps {
  order: Order;
  orderItems: OrderItem[] | undefined;
  isLoadingItems: boolean;
  onExpand: (orderId: string) => void;
  isExpanded: boolean;
}

const OrderCard = ({ 
  order, 
  orderItems, 
  isLoadingItems, 
  onExpand, 
  isExpanded 
}: OrderCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <GlassCard key={order.id} className="overflow-hidden">
      <div
        className="p-6 cursor-pointer"
        onClick={() => onExpand(order.id)}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <span className="text-sm text-muted-foreground">Order ID</span>
              <p className="font-medium">{order.id.substring(0, 8)}...</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${getStatusColor(order.status)}`}></span>
            <span className="capitalize">{order.status}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(order.created_at)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="font-semibold">{order.total} JC</span>
            <ChevronRight className={`h-4 w-4 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`} />
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="bg-secondary/30 p-6 border-t border-border">
          <h3 className="font-medium mb-4">Order Items</h3>
          
          <OrderItemList 
            items={orderItems || []} 
            isLoading={isLoadingItems} 
          />
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Ordered {formatDate(order.created_at)}</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-semibold">{order.total} JC</p>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default OrderCard;
