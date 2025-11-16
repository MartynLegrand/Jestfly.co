
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/store';

// Get products with optional filter by category
export const getProducts = async (categoryId?: string, search?: string, limit = 50, page = 1): Promise<Product[]> => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply limit if provided
    if (limit) {
      query = query.range((page - 1) * limit, page * limit - 1);
    }
    
    // Apply category filter if provided
    if (categoryId) {
      const { data: mappings } = await supabase
        .from('product_category_mappings')
        .select('product_id')
        .eq('category_id', categoryId);
      
      if (mappings && mappings.length > 0) {
        const productIds = mappings.map(m => m.product_id);
        query = query.in('id', productIds);
      }
    }
    
    // Apply search filter if provided
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 6): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

// Get product categories
export const getProductCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
};
