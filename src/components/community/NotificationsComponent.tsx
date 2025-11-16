
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, UserPlus, Bell, BellOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Mock notification type for now
// In a real app, you would have a notifications table in your database
interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  from_user_id: string;
  from_user_name: string;
  from_user_avatar?: string;
  content: string;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
  is_read: boolean;
}

// Mock notifications for demonstration
// In a real app, you would fetch these from your database
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    from_user_id: "abc123",
    from_user_name: "DJ SoundMaster",
    content: "liked your post",
    reference_id: "post123",
    reference_type: "post",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    is_read: false
  },
  {
    id: "2",
    type: "comment",
    from_user_id: "def456",
    from_user_name: "Music Producer",
    content: "commented on your post: \"Great insights!\"",
    reference_id: "post123",
    reference_type: "post",
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    is_read: true
  },
  {
    id: "3",
    type: "follow",
    from_user_id: "ghi789",
    from_user_name: "New Fan",
    content: "started following you",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    is_read: false
  },
  {
    id: "4",
    type: "system",
    from_user_id: "system",
    from_user_name: "JESTFLY System",
    content: "Welcome to JESTFLY Community! Explore and connect with artists and fans.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    is_read: true
  }
];

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 text-red-500" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case 'mention':
      return <Bell className="h-4 w-4 text-yellow-500" />;
    case 'system':
      return <Bell className="h-4 w-4 text-primary" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const NotificationsComponent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    // Simulate loading notifications
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // In a real app, you would fetch notifications from your database
    // Example:
    /*
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("to_user_id", user?.id)
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchNotifications();
    }
    */
  }, [user]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    
    // In a real app, you would update the database
    /*
    const updateNotifications = async () => {
      try {
        const { error } = await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("to_user_id", user?.id)
          .eq("is_read", false);
          
        if (error) throw error;
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    };
    
    if (user) {
      updateNotifications();
    }
    */
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, is_read: true } : n
    ));
    
    // Navigate based on notification type
    if (notification.type === 'like' || notification.type === 'comment') {
      if (notification.reference_type === 'post' && notification.reference_id) {
        navigate(`/community/post/${notification.reference_id}`);
      }
    } else if (notification.type === 'follow') {
      navigate(`/community/profile/${notification.from_user_id}`);
    }
    
    // In a real app, you would also update the database to mark it as read
  };

  const filteredNotifications = notifications.filter(n => 
    filter === 'all' || (filter === 'unread' && !n.is_read)
  );

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-3xl mx-auto">
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Notifications</h2>
          
          <div className="flex items-center gap-3">
            <div className="flex">
              <Button
                variant={filter === 'all' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('all')}
                className="rounded-r-none"
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter('unread')}
                className="rounded-l-none"
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-md">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-1">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${!notification.is_read ? 'bg-muted/20' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <NotificationIcon type={notification.type} />
                </div>
                
                <div className="flex-1">
                  <p>
                    <span className="font-semibold">{notification.from_user_name}</span>{' '}
                    <span className="text-muted-foreground">{notification.content}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                
                {!notification.is_read && (
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-semibold mb-1">No notifications</p>
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'You have no unread notifications.' : 'You have no notifications yet.'}
            </p>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default NotificationsComponent;
