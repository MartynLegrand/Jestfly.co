
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { fetchProductById } from '@/services/store/productService';
import { useQuery } from '@tanstack/react-query';
import ProductImageSection from './ProductImageSection';
import ProductBasicInfo from './ProductBasicInfo';
import ProductOptions from './ProductOptions';
import ProductActions from './ProductActions';
import ProductDetailTabs from './ProductDetailTabs';
import ProductRelatedSection from './ProductRelatedSection';
import ProductSkeleton from './ProductSkeleton';

const ProductView = () => {
  const { productId } = useParams();
  const numericProductId = productId ? parseInt(productId, 10) : 0;
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', numericProductId],
    queryFn: () => fetchProductById(numericProductId),
    enabled: !!numericProductId,
  });

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null);
      setQuantity(1);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <ProductSkeleton />
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/store">Back to Store</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/store">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ProductImageSection images={product.images} />

          <div className="space-y-6">
            <ProductBasicInfo
              name={product.name}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              description={product.description}
              onSale={product.onSale}
              inStock={product.inStock}
              freeShipping={product.freeShipping}
              additionalInfo={product.additionalInfo}
            />

            <ProductOptions
              sizes={product.sizes}
              colors={product.colors}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
              setSelectedSize={setSelectedSize}
              setSelectedColor={setSelectedColor}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
            />

            <ProductActions 
              inStock={product.inStock}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        <ProductDetailTabs
          productId={product.id}
          description={product.description}
          fullDescription={product.fullDescription}
          specifications={product.specifications}
        />

        <ProductRelatedSection 
          productId={product.id.toString()} 
          categoryId={product.categoryId.toString()} 
        />
      </div>
    </MainLayout>
  );
};

export default ProductView;
