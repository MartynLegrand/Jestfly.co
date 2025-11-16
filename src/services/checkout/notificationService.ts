
import { supabase } from '@/lib/supabase';

/**
 * Create a notification for order status updates
 */
export const createOrderStatusNotification = async (
  userId: string,
  orderId: string,
  title: string,
  message: string
) => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type: 'order_update',
        reference_id: orderId,
        reference_type: 'order'
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};
