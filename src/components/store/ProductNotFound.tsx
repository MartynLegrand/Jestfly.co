
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { useNavigate } from "react-router-dom";

const ProductNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <GlassCard className="p-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
      <p className="text-muted-foreground mb-6">
        We couldn't find the product you're looking for. It may have been removed or doesn't exist.
      </p>
      <Button onClick={() => navigate("/store")}>
        Back to Store
      </Button>
    </GlassCard>
  );
};

export default ProductNotFound;
