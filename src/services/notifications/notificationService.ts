
import { supabase } from '@/lib/supabase';
import { UserNotification } from '@/types';

export const fetchUserNotifications = async (userId: string): Promise<UserNotification[]> => {
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

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .update({ 
        is_read: true 
      })
      .eq('id', notificationId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .update({ 
        is_read: true 
      })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
};

export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting notification:", error);
    return false;
  }
};

export const subscribeToNotifications = (
  userId: string,
  onNewNotification: (notification: UserNotification) => void
) => {
  const channel = supabase
    .channel('public:user_notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'user_notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        const newNotification = payload.new as UserNotification;
        onNewNotification(newNotification);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToOrderStatusChanges = (
  orderId: string,
  onStatusChange: (newStatus: string) => void
) => {
  const channel = supabase
    .channel('public:orders')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      },
      (payload) => {
        const newStatus = payload.new.status;
        onStatusChange(newStatus);
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};
