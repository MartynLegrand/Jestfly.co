
import React from 'react';
import RelatedProducts from './RelatedProducts';

interface ProductRelatedSectionProps {
  productId: string;
  categoryId?: string;
}

const ProductRelatedSection: React.FC<ProductRelatedSectionProps> = ({ productId }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <RelatedProducts productId={productId} />
    </div>
  );
};

export default ProductRelatedSection;
