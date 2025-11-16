
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassCard from '@/components/ui/GlassCard';
import ProductReviews from './ProductReviews';

interface ProductDetailTabsProps {
  productId: number;
  description: string;
  fullDescription?: string;
  specifications?: Record<string, string>;
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({
  productId,
  description,
  fullDescription,
  specifications,
}) => {
  return (
    <Tabs defaultValue="details" className="mb-12">
      <TabsList className="mb-6">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-4">
        <GlassCard>
          <h3 className="text-lg font-medium mb-4">Product Details</h3>
          <div className="prose max-w-none">
            <p>{fullDescription || description}</p>
          </div>
        </GlassCard>
      </TabsContent>
      
      <TabsContent value="specifications" className="space-y-4">
        <GlassCard>
          <h3 className="text-lg font-medium mb-4">Specifications</h3>
          {specifications ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="font-medium">{key}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No specifications available for this product.</p>
          )}
        </GlassCard>
      </TabsContent>
      
      <TabsContent value="reviews">
        <ProductReviews productId={productId} />
      </TabsContent>
    </Tabs>
  );
};

export default ProductDetailTabs;
