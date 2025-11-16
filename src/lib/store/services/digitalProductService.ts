
import { supabase } from '@/lib/supabase';

// Get digital product details
export const getDigitalProductDetails = async (productId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('digital_products')
      .select('*')
      .eq('product_id', productId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching digital product details:", error);
    return null;
  }
};

// Register digital product download
export const registerDigitalProductDownload = async (
  productId: string,
  userId: string,
  orderId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_downloads')
      .insert({
        digital_product_id: productId,
        user_id: userId,
        order_id: orderId,
        download_date: new Date().toISOString()
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error registering digital product download:", error);
    return false;
  }
};
