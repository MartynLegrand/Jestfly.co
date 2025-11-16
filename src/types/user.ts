
// User-related types
export interface UserProfile {
  id: string;
  user_id?: string;
  username: string;
  display_name: string;
  profile_type: "admin" | "artist" | "fan" | "collaborator";
  avatar_url?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  wallet_id?: string;
  social_links?: {
    twitter?: string;
    instagram?: string;
    discord?: string;
    [key: string]: string | undefined;
  };
  created_at?: string;
  updated_at?: string;
  preferences?: {
    theme?: string;
    language?: string;
    currency?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    [key: string]: any;
  };
  // Added new fields for enhanced security
  two_factor_enabled?: boolean;
  is_verified?: boolean;
  permissions?: string[];
  roles?: string[];
}

export interface AuthUser {
  id: string;
  email?: string;
  profile: UserProfile | null;
  
  // Add these properties for backward compatibility
  avatar?: string;
  displayName?: string;
}

