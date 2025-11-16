
import React, { useState, useEffect } from 'react';
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { fetchUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, subscribeToNotifications } from "@/services/notifications/notificationService";
import { UserNotification } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const data = await fetchUserNotifications(user.id);
      setNotifications(data);
      updateUnreadCount(data);
    };

    fetchNotifications();

    // Subscribe to new notifications
    const unsubscribe = subscribeToNotifications(user.id, (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const updateUnreadCount = (notificationList: UserNotification[]) => {
    const count = notificationList.filter(notification => !notification.is_read).length;
    setUnreadCount(count);
  };

  const handleNotificationClick = async (notification: UserNotification) => {
    if (!notification.is_read) {
      await markNotificationAsRead(notification.id);
      setNotifications(prev =>
        prev.map(item =>
          item.id === notification.id ? { ...item, is_read: true } : item
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    // Handle navigation based on notification type
    if (notification.reference_type === 'order' && notification.reference_id) {
      window.location.href = `/store/orders/${notification.reference_id}`;
    }

    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    await markAllNotificationsAsRead(user.id);
    setNotifications(prev =>
      prev.map(item => ({ ...item, is_read: true }))
    );
    setUnreadCount(0);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!user) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative px-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={handleMarkAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <>
            {notifications.slice(0, 10).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`py-3 px-4 cursor-pointer ${!notification.is_read ? 'bg-secondary/50' : ''}`}
              >
                <div className="flex flex-col space-y-1 w-full">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm truncate">
                      {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
            {notifications.length > 10 && (
              <DropdownMenuItem asChild>
                <a href="/notifications" className="w-full text-center text-sm py-2 text-muted-foreground">
                  Ver todas as notificações
                </a>
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
