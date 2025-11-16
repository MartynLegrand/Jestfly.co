
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { useNavigate } from "react-router-dom";

const EmptyOrderState = () => {
  const navigate = useNavigate();
  
  return (
    <GlassCard className="p-12 text-center">
      <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
      <p className="text-muted-foreground mb-6">
        You haven't placed any orders yet. Start shopping to see your orders here.
      </p>
      <Button onClick={() => navigate("/store")}>
        Browse Store
      </Button>
    </GlassCard>
  );
};

export default EmptyOrderState;
