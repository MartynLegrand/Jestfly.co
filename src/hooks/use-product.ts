
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/lib/store/productService';
import { Product } from '@/types';

export interface UseProductProps {
  id: string;
}

export const useProduct = (props: UseProductProps | string) => {
  const productId = typeof props === 'string' ? props : props.id;
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  return {
    product,
    isLoading,
    error
  };
};
