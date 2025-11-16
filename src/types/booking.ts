
import { UserProfile } from '.';

export type BookingStatus = 'pending' | 'confirmed' | 'canceled' | 'completed';

export type BookingCategory = 'studio' | 'consulting' | 'private';

export type BookingType = 
  | 'studio_recording' | 'studio_mixing' | 'studio_mastering' | 'studio_production'
  | 'consulting_career' | 'consulting_marketing' | 'consulting_legal' | 'consulting_technical'
  | 'private_show' | 'private_workshop' | 'private_meet_greet' | 'private_masterclass';

export interface BookingTypeInfo {
  id: string;
  name: string;
  category: BookingCategory;
  subcategory: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  jest_coin_price: number;
  requirements?: string;
  location?: string;
  resources?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_type: string;
  user_id: string;
  resource_id?: string;
  resource_type?: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  price: number;
  notes?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  location?: string;
  details?: string;
  created_at: string;
  updated_at: string;
  user?: UserProfile;
  booking_type_info?: BookingTypeInfo;
}

export interface AvailabilitySlot {
  id: string;
  resource_id: string;
  resource_type: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface BookingPayment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  booking_type: string;
  start_time: Date;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  notes?: string;
}
