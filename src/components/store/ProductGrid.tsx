
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { getProducts } from '@/lib/store/productService';

interface ProductGridProps {
  category?: string;
  limit?: number;
  searchTerm?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category, limit, searchTerm }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const fetchedProducts = await getProducts(category, searchTerm, limit);
        setProducts(fetchedProducts);
      } catch (err: any) {
        setError(err.message || 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, limit, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        <span className="ml-2">Carregando produtos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
