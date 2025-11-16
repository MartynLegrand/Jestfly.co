
// Store-related types for products and orders
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  jest_coin_price?: number;
  stock: number;
  type: "digital" | "physical" | "nft" | "experience";
  image_url?: string;
  is_digital?: boolean;
  is_featured?: boolean;
  average_rating?: number;
  rating_count?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled" | "paid" | "shipped" | "delivered";
  payment_method?: string;
  payment_details?: Record<string, any>;
  shipping_address?: Record<string, any>;
  tracking_number?: string;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price_at_time: number;
  created_at?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parent_id?: string;
  is_active: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductRating {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
}

export interface DigitalProduct {
  id: string;
  product_id: string;
  file_path: string;
  file_size?: number;
  file_type?: string;
  version?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserDownload {
  id: string;
  user_id: string;
  digital_product_id: string;
  order_id: string;
  download_date: string;
}

export interface PaymentIntent {
  id: string;
  order_id: string;
  user_id: string;
  stripe_payment_intent_id?: string;
  stripe_client_secret?: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  reference_id?: string;
  reference_type?: string;
  created_at: string;
}
