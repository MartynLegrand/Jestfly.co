
import { supabase } from '@/lib/supabase';
import { ProductRating } from '@/types/store';

// Get product ratings
export const getProductRatings = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('product_ratings')
      .select('*, user:user_id(display_name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    return [];
  }
};

// Add or update product rating
export const rateProduct = async (
  productId: string, 
  userId: string, 
  rating: number, 
  review?: string
) => {
  try {
    // Check if user already rated this product
    const { data: existingRating, error: checkError } = await supabase
      .from('product_ratings')
      .select('id')
      .eq('product_id', productId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingRating) {
      // Update existing rating
      const { error } = await supabase
        .from('product_ratings')
        .update({ 
          rating, 
          review, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingRating.id);
      
      if (error) throw error;
    } else {
      // Insert new rating
      const { error } = await supabase
        .from('product_ratings')
        .insert({ 
          product_id: productId, 
          user_id: userId, 
          rating, 
          review 
        });
      
      if (error) throw error;
    }
    
    // Update product's average rating
    await updateProductAverageRating(productId);
    
    return { success: true };
  } catch (error) {
    console.error("Error rating product:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to submit rating" 
    };
  }
};

// Update product's average rating
const updateProductAverageRating = async (productId: string) => {
  try {
    // Get all ratings for this product
    const { data: ratings, error } = await supabase
      .from('product_ratings')
      .select('rating')
      .eq('product_id', productId);
    
    if (error) throw error;
    
    if (ratings && ratings.length > 0) {
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      const avg = sum / ratings.length;
      
      // Update product with new average rating and count
      await supabase
        .from('products')
        .update({
          average_rating: parseFloat(avg.toFixed(1)),
          rating_count: ratings.length
        })
        .eq('id', productId);
    }
  } catch (error) {
    console.error("Error updating product average rating:", error);
  }
};

// Alias for rateProduct to avoid errors in code that uses submitProductRating
export const submitProductRating = rateProduct;
