
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/use-product";
import ProductLayout from "@/components/store/ProductLayout";
import ProductView from "@/components/store/ProductView";
import ProductNotFound from "@/components/store/ProductNotFound";
import { Skeleton } from "@/components/ui/skeleton";

const StoreProduct = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <ProductLayout>
      <ProductView />
    </ProductLayout>
  );
};

export default StoreProduct;
