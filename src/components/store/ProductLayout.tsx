
import { ReactNode, Suspense, useState } from "react";
import Container from "@/components/ui/Container";
import StoreHeader from "./StoreHeader";
import StoreFooter from "./StoreFooter";
import ProductSkeleton from "./ProductSkeleton";

interface ProductLayoutProps {
  children: ReactNode;
  isLoading?: boolean;
}

const ProductLayout = ({ children, isLoading = false }: ProductLayoutProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <main className="flex-1 py-12">
        <Container>
          <Suspense fallback={<ProductSkeleton />}>
            {isLoading ? <ProductSkeleton /> : children}
          </Suspense>
        </Container>
      </main>
      
      <StoreFooter />
    </div>
  );
};

export default ProductLayout;
