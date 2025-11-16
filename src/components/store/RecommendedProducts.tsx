import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { getRelatedProducts } from '@/lib/store/productService';
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendedProductsProps {
  productId: string;
  title?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({ 
  productId,
  title = "Produtos Recomendados"
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendedProducts = async () => {
      setLoading(true);
      try {
        const data = await getRelatedProducts(productId);
        setProducts(data);
      } catch (error) {
        console.error('Error loading recommended products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadRecommendedProducts();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-9 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
