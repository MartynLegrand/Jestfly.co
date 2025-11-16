
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/lib/store/cartStore";

const CartIcon = () => {
  const navigate = useNavigate();
  const totalItems = useCartStore(state => state.totalItems);
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="relative" 
      onClick={() => navigate("/store/cart")}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      Cart
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  );
};

export default CartIcon;
