
import { useState, useEffect } from 'react';
import { CartItem } from '@/types';

export const useShippingDetails = (items: CartItem[]) => {
  const [hasPhysicalProduct, setHasPhysicalProduct] = useState(false);

  useEffect(() => {
    // Check if there are any physical products that require shipping
    const hasPhysical = items.some(item => item.product.type === 'physical');
    setHasPhysicalProduct(hasPhysical);
  }, [items]);

  // Prepare shipping address for the API
  const prepareShippingAddress = (formData: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }) => {
    if (!hasPhysicalProduct) return undefined;
    
    return {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
      country: formData.country,
    };
  };

  return {
    hasPhysicalProduct,
    prepareShippingAddress
  };
};
