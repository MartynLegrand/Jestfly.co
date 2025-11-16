
import { supabase } from "../supabase";
import { Order, OrderItem, CartItem } from "@/types";

export const createOrder = async (
  userId: string,
  items: CartItem[],
  total: number
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total,
        status: "pending",
      })
      .select("id")
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price_at_time: item.product.price,
    }));
    
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const fetchOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  try {
    const { data, error } = await supabase
      .from("order_items")
      .select(`
        *,
        product:products(*)
      `)
      .eq("order_id", orderId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching order items:", error);
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};

