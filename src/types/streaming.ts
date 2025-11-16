
export type StreamStatus = 'offline' | 'live' | 'scheduled' | 'ended';
export type StreamType = 'live' | 'vod' | 'premiere';

export interface StreamChannel {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  banner_url?: string;
  is_verified: boolean;
  follower_count: number;
  created_at: string;
  updated_at: string;
  settings?: {
    theme_color?: string;
    chat_rules?: string[];
    moderation_level?: 'low' | 'medium' | 'high';
    subscription_enabled?: boolean;
    subscription_price?: number;
    [key: string]: any;
  };
}

export interface LiveStream {
  id: string;
  channel_id: string;
  title: string;
  description?: string;
  status: StreamStatus;
  stream_type: StreamType;
  scheduled_start?: string;
  started_at?: string;
  ended_at?: string;
  thumbnail_url?: string;
  stream_key?: string;
  playback_url?: string;
  viewer_count: number;
  peak_viewers: number;
  chat_enabled: boolean;
  replay_available: boolean;
  created_at: string;
  updated_at: string;
  metadata?: {
    tags?: string[];
    category?: string;
    is_mature?: boolean;
    [key: string]: any;
  };
  channel?: StreamChannel;
}

export interface StreamChatMessage {
  id: string;
  stream_id: string;
  user_id: string;
  message: string;
  is_highlighted: boolean;
  is_deleted: boolean;
  created_at: string;
  author?: {
    username: string;
    display_name: string;
    avatar_url?: string;
    is_mod?: boolean;
    is_subscriber?: boolean;
  };
}

export interface StreamDonation {
  id: string;
  stream_id: string;
  donor_id: string;
  amount: number;
  message?: string;
  transaction_id?: string;
  created_at: string;
  donor?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface StreamMetrics {
  id: string;
  stream_id: string;
  timestamp: string;
  viewer_count: number;
  chat_message_count: number;
  donation_amount: number;
  peak_viewers: number;
  average_watch_time: number;
  unique_chatters: number;
  metrics_data?: Record<string, any>;
}
