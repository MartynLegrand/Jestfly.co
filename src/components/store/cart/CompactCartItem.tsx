
import React from 'react';
import { CartItem } from "@/types";

interface CompactCartItemProps {
  item: CartItem;
}

const CompactCartItem: React.FC<CompactCartItemProps> = ({ item }) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm">{item.quantity} x</span>
        <span>{item.product.title}</span>
      </div>
      <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
    </>
  );
};

export default CompactCartItem;
