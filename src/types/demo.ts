
import { UserProfile } from './user';

// Demo submission related types
export type DemoStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface DemoSubmission {
  id: string;
  user_id: string;
  title: string;
  artist_name: string;
  email: string;
  audio_url: string;
  additional_audio_urls?: string[];
  genre?: string;
  biography?: string;
  social_links?: Record<string, string>;
  status: DemoStatus;
  created_at: string;
  updated_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  user?: UserProfile;
  feedback?: DemoFeedback[];
  categories?: DemoCategory[];
}

export interface DemoFeedback {
  id: string;
  submission_id: string;
  reviewer_id: string;
  rating: number;
  comment?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  reviewer?: UserProfile;
}

export interface DemoCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
