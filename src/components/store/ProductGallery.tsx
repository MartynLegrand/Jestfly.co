
import { Product } from "@/types";
import { Gift, Music, Paintbrush, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGalleryProps {
  product: Product | null;
  isLoading: boolean;
}

const ProductGallery = ({ product, isLoading }: ProductGalleryProps) => {
  const getProductIcon = () => {
    if (!product) return <Gift className="h-10 w-10" />;
    
    switch (product.type) {
      case 'digital': return <Music className="h-10 w-10" />;
      case 'nft': return <Paintbrush className="h-10 w-10" />;
      case 'experience': return <Calendar className="h-10 w-10" />;
      default: return <Gift className="h-10 w-10" />;
    }
  };

  if (isLoading) {
    return <Skeleton className="aspect-square rounded-lg" />;
  }
  
  return (
    <div>
      {product?.image_url ? (
        <img 
          src={product.image_url} 
          alt={product.title}
          className="rounded-lg w-full aspect-square object-cover"
        />
      ) : (
        <div className="rounded-lg w-full aspect-square bg-secondary/50 flex items-center justify-center">
          {getProductIcon()}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
