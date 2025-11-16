
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { useNavigate } from "react-router-dom";

const EmptyCart = () => {
  const navigate = useNavigate();
  
  return (
    <GlassCard className="p-12 text-center">
      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6">
        Looks like you haven't added any items to your cart yet.
      </p>
      <Button onClick={() => navigate("/store")}>
        Browse Store
      </Button>
    </GlassCard>
  );
};

export default EmptyCart;
