
import React from 'react';
import ProductImageGallery from './ProductImageGallery';

interface ProductImageSectionProps {
  images: string[];
}

const ProductImageSection: React.FC<ProductImageSectionProps> = ({ images }) => {
  return <ProductImageGallery images={images} />;
};

export default ProductImageSection;
