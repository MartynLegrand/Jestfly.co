
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import { getProducts } from '@/lib/store/productService';

const ShopPreview = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const productsData = await getProducts(undefined, undefined, 4);
        setProducts(productsData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className="text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <section className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shop Our Latest Products</h2>
        <Button asChild variant="outline">
          <Link to="/store">
            View All <ShoppingBag className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ShopPreview;
