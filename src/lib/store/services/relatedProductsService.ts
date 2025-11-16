
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/store';

// Get related products
export const getRelatedProducts = async (productId: string, limit = 4): Promise<Product[]> => {
  try {
    // First check for explicitly defined related products
    const { data: relatedIds, error: relatedError } = await supabase
      .from('related_products')
      .select('related_product_id')
      .eq('product_id', productId)
      .limit(limit);
      
    if (relatedError) throw relatedError;
    
    if (relatedIds && relatedIds.length > 0) {
      const ids = relatedIds.map(r => r.related_product_id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', ids)
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    }
    
    // If no explicit relations, get product to find its type
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError) throw productError;
    
    // Get similar products by type
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('type', product.type)
      .neq('id', productId)
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};
