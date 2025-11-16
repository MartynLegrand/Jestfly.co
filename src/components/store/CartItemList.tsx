
import React from 'react';
import { CartItem } from "@/types";
import GlassCard from "@/components/ui/GlassCard";
import CartItemDetails from './cart/CartItemDetails';
import CompactCartItem from './cart/CompactCartItem';

interface CartItemListProps {
  items: CartItem[];
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
  compact?: boolean;
}

const CartItemList: React.FC<CartItemListProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  compact 
}) => {
  return (
    <GlassCard>
      <div className="divide-y">
        {items.map(item => (
          <div key={item.product.id} className={`py-4 first:pt-0 last:pb-0 ${compact ? 'flex items-center justify-between' : ''}`}>
            {!compact ? (
              <CartItemDetails 
                item={item} 
                onUpdateQuantity={onUpdateQuantity} 
                onRemoveItem={onRemoveItem} 
              />
            ) : (
              <CompactCartItem item={item} />
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default CartItemList;
