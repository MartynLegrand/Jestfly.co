
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Types
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartContextType {
  cart: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number, options?: { size?: string; color?: string }) => void;
  updateQuantity: (itemId: number, quantity: number, options?: { size?: string; color?: string }) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  subtotal: number;
}

// Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number; size?: string; color?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number; size?: string; color?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' };

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => 
          item.id === newItem.id && 
          item.size === newItem.size && 
          item.color === newItem.color
      );
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
        };
        return { ...state, items: updatedItems, isOpen: true };
      } else {
        // Add new item
        return { 
          ...state, 
          items: [...state.items, newItem],
          isOpen: true 
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          item => 
            !(item.id === action.payload.id && 
              item.size === action.payload.size && 
              item.color === action.payload.color)
        )
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity, size, color } = action.payload;
      return {
        ...state,
        items: state.items.map(item => 
          item.id === id && item.size === size && item.color === color 
            ? { ...item, quantity } 
            : item
        )
      };
    }
    
    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }
    
    case 'OPEN_CART': {
      return { ...state, isOpen: true };
    }
    
    case 'CLOSE_CART': {
      return { ...state, isOpen: false };
    }
    
    default:
      return state;
  }
};

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], isOpen: false }, () => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart 
      ? { ...JSON.parse(savedCart), isOpen: false } 
      : { items: [], isOpen: false };
  });
  
  const { toast } = useToast();
  
  // Calculate total items and subtotal
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify({ items: cart.items }));
  }, [cart.items]);
  
  // Actions
  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };
  
  const removeFromCart = (itemId: number, options?: { size?: string; color?: string }) => {
    dispatch({ 
      type: 'REMOVE_ITEM', 
      payload: { 
        id: itemId,
        size: options?.size,
        color: options?.color
      } 
    });
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    });
  };
  
  const updateQuantity = (itemId: number, quantity: number, options?: { size?: string; color?: string }) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { 
        id: itemId, 
        quantity,
        size: options?.size,
        color: options?.color
      } 
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };
  
  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook for using the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
