
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      <GlassCard className="relative aspect-square overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[activeIndex]}
            alt={`Product image ${activeIndex + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
            No images available
          </div>
        )}

        {images.length > 1 && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={handlePrev}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
              onClick={handleNext}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </GlassCard>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                index === activeIndex ? 'border-primary' : 'border-transparent'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
