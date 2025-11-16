
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/store/cartStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import CheckoutForm from '@/components/store/CheckoutForm';
import CartItemList from '@/components/store/CartItemList';

const StoreCheckout = () => {
  const { items, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to cart if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/store/cart');
    }
  }, [items, navigate]);
  
  if (items.length === 0) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="p-0 mb-2"
          onClick={() => navigate('/store/cart')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>
        
        <div>
          <div className="bg-card rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Order Summary</h2>
              <span className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            <div className="space-y-4 mb-4">
              <CartItemList items={items} compact={true} />
            </div>
            
            <Separator />
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {!user && (
            <div className="mt-4 rounded-lg border p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Note:</span> You'll need to sign in to complete your purchase.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreCheckout;
