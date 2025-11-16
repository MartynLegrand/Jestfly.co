
import { UserProfile } from './user';

// Community types for posts and comments
export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at?: string;
  author?: UserProfile;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at?: string;
  author?: UserProfile;
}
