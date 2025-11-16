
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Check, Info } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface ProductBasicInfoProps {
  name: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  onSale?: boolean;
  inStock: boolean;
  freeShipping?: boolean;
  additionalInfo?: string;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  name,
  price,
  compareAtPrice,
  description,
  onSale,
  inStock,
  freeShipping,
  additionalInfo,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">{name}</h1>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold">${price.toFixed(2)}</span>
          {compareAtPrice && (
            <span className="text-muted-foreground line-through">
              ${compareAtPrice.toFixed(2)}
            </span>
          )}
          {onSale && (
            <Badge variant="destructive" className="ml-2">Sale</Badge>
          )}
        </div>

        <p className="text-muted-foreground mb-6">{description}</p>
        
        <div className="flex items-center gap-2 mb-6">
          {inStock ? (
            <>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Check className="mr-1 h-3 w-3" /> In Stock
              </Badge>
            </>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Out of Stock
            </Badge>
          )}
          
          {freeShipping && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Free Shipping
            </Badge>
          )}
        </div>
      </div>

      {additionalInfo && (
        <GlassCard className="mt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium">Additional Information</h3>
              <p className="text-sm text-muted-foreground">{additionalInfo}</p>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default ProductBasicInfo;
