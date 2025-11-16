
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProductOptionsProps {
  sizes?: string[];
  colors?: string[];
  selectedSize: string | null;
  selectedColor: string | null;
  quantity: number;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  quantity,
  setSelectedSize,
  setSelectedColor,
  incrementQuantity,
  decrementQuantity,
}) => {
  return (
    <div className="space-y-6">
      {sizes && sizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                type="button"
                variant={selectedSize === size ? "default" : "outline"}
                className="min-w-[3rem]"
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {colors && colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <Button
                key={color}
                type="button"
                variant={selectedColor === color ? "default" : "outline"}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium mb-3">Quantity</h3>
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= 10}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;
