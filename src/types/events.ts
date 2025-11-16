
// Event-related types
export type EventStatus = 'draft' | 'published' | 'canceled' | 'completed';
export type EventCategory = 'music' | 'art' | 'tech' | 'business' | 'community' | 'other';
export type RegistrationStatus = 'pending' | 'confirmed' | 'canceled' | 'attended';

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  is_online: boolean;
  online_url?: string;
  max_attendees?: number;
  price: number;
  jest_coin_price: number;
  cover_image?: string;
  organizer_id: string;
  category: EventCategory;
  status: EventStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface EventScheduleItem {
  id: string;
  event_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  speaker?: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  status: RegistrationStatus;
  ticket_code?: string;
  checked_in_at?: string;
  payment_id?: string;
  metadata?: Record<string, any>;
}
