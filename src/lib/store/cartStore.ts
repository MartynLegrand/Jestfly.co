
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  totalItems: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity: number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set({
            items: currentItems.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            items: [...currentItems, { product, quantity }]
          });
        }
      },
      
      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        set({
          items: get().items.map(item => 
            item.product.id === productId 
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      get total() {
        return get().items.reduce(
          (total, item) => total + (item.product.price * item.quantity), 
          0
        );
      },
      
      get totalItems() {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'jestfly-cart',
    }
  )
);

// Export as alias for compatibility
export const useCart = useCartStore;
