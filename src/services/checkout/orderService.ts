
import { supabase } from '@/lib/supabase';
import { CartItem, Order, OrderItem } from '@/types';

/**
 * Creates a new order in the database
 */
export const createOrder = async (
  userId: string, 
  total: number, 
  paymentMethod: string
) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total: total,
      status: paymentMethod === 'jestcoin' ? 'processing' : 'pending',
      payment_method: paymentMethod
    })
    .select()
    .single();
    
  if (orderError) throw orderError;
  
  return order;
};

/**
 * Add items to an order
 */
export const createOrderItems = async (
  orderId: string,
  items: CartItem[]
) => {
  const orderItems = items.map(item => ({
    order_id: orderId,
    product_id: item.product.id,
    quantity: item.quantity,
    price_at_time: item.product.price,
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
    
  if (itemsError) throw itemsError;
};

/**
 * Get all orders for a user
 */
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

/**
 * Get details of a specific order
 */
export const getOrderDetails = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
};

/**
 * Get all items in a specific order
 */
export const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  try {
    const { data, error } = await supabase
      .from('order_items')
      .select('*, product:products(*)')
      .eq('order_id', orderId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching order items:", error);
    return [];
  }
};

/**
 * Update order with shipping information and customer details
 */
export const updateOrderShippingInfo = async (
  orderId: string,
  shippingAddress: Record<string, any>,
  customerInfo: { name: string, email: string }
) => {
  const { error } = await supabase
    .from('orders')
    .update({ 
      shipping_address: shippingAddress,
      metadata: { customer_name: customerInfo.name, customer_email: customerInfo.email }
    })
    .eq('id', orderId);
    
  if (error) throw error;
};
