
import { ShoppingBag } from "lucide-react";
import { OrderItem } from "@/types";

interface OrderItemListProps {
  items: OrderItem[];
  isLoading: boolean;
}

const OrderItemList = ({ items, isLoading }: OrderItemListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4">
          <div className="h-12 w-12 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="h-6 w-6 text-primary/50" />
          </div>
          <div className="flex-grow">
            <p className="font-medium">{item.product?.title || "Product"}</p>
            <p className="text-sm text-muted-foreground">
              Quantity: {item.quantity}
            </p>
          </div>
          <div className="font-medium">
            {item.price_at_time * item.quantity} JC
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderItemList;
