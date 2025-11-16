
import { supabase } from '@/lib/supabase';

/**
 * Check if a user can download a digital product
 */
export const canDownloadDigitalProduct = async (
  productId: string,
  userId: string
): Promise<boolean> => {
  try {
    // Check if user has purchased this product and the order is paid
    const { data, error } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', userId)
      .in('status', ['paid', 'completed', 'delivered'])
      .limit(1);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return false;
    }
    
    const orderId = data[0].id;
    
    // Check if this specific product is in the order
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('id')
      .eq('order_id', orderId)
      .eq('product_id', productId)
      .limit(1);
    
    if (itemsError) throw itemsError;
    
    return Boolean(orderItems && orderItems.length > 0);
  } catch (error) {
    console.error("Error checking digital product download rights:", error);
    return false;
  }
};

/**
 * Record when a user downloads a digital product
 */
export const recordDigitalProductDownload = async (
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
    console.error("Error recording digital product download:", error);
    return false;
  }
};
