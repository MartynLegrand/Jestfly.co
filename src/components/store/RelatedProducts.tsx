
import React, { useState, useEffect } from 'react';
import { fetchRelatedProducts, fetchProductById } from '@/services/store/productService';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface RelatedProductsProps {
  productId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ productId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      if (!productId) return;
      
      setLoading(true);
      try {
        const numericProductId = parseInt(productId, 10);
        // Get the product first to get its category
        const product = await fetchProductById(numericProductId);
        if (product) {
          const relatedProducts = await fetchRelatedProducts(numericProductId, product.categoryId);
          // Convert to the correct Product type and then set state
          const typedProducts: Product[] = relatedProducts.map(p => ({
            id: p.id.toString(), // Convert number id to string to match Product type
            title: p.name || '',
            description: p.description || '',
            price: p.price,
            image_url: p.images && p.images.length > 0 ? p.images[0] : '',
            is_featured: p.featured || false,
            inStock: p.inStock || false,
            createdAt: p.createdAt || new Date().toISOString(),
            updatedAt: p.updatedAt || new Date().toISOString(),
            // Add any other required properties from the Product type
            type: "physical", // Default value
            stock: p.inStock ? 10 : 0, // Default value based on inStock
            created_at: p.createdAt || new Date().toISOString(),
            updated_at: p.updatedAt || new Date().toISOString()
          }));
          setProducts(typedProducts);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [productId]);
  
  if (loading || products.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default RelatedProducts;
