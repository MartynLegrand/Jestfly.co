
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cartStore";
import { useCartCheckout } from "@/hooks/use-cart-checkout";
import CartItemList from "@/components/store/CartItemList";
import CartSummary from "@/components/store/CartSummary";
import EmptyCart from "@/components/store/EmptyCart";

const StoreCart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart,
    totalItems,
    total // Use 'total' instead of 'totalPrice'
  } = useCartStore();
  
  const { isProcessing, handleCheckout } = useCartCheckout(clearCart);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Your Cart</h1>
      <p className="text-muted-foreground mb-8">
        Review your items and proceed to checkout
      </p>
      
      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <CartItemList 
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/store")}>
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>
          
          <div>
            <CartSummary 
              totalItems={totalItems}
              totalPrice={total} // Change totalPrice to total
              isProcessing={isProcessing}
              onCheckout={() => handleCheckout(items, total)} // Change totalPrice to total
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreCart;
