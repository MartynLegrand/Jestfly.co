
import { supabase } from '@/lib/supabase';
import { processPayment, confirmStripePayment } from '@/lib/payments/paymentService';
import { createOrderStatusNotification } from './notificationService';

// Define a specific return type for payment processing
export interface PaymentResult {
  success: boolean;
  message?: string;
  transactionId?: string;
  requiresAction?: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  orderId?: string;
}

/**
 * Process payment for an order
 */
export const processOrderPayment = async (
  orderId: string,
  customerId: string,
  amount: number,
  paymentMethod: string
): Promise<PaymentResult> => {
  return await processPayment({
    orderId,
    customerId,
    amount,
    paymentMethod: {
      id: '1',
      type: paymentMethod as 'credit_card' | 'jestcoin' | 'stripe',
      name: paymentMethod === 'credit_card' 
        ? 'Credit Card' 
        : paymentMethod === 'jestcoin'
        ? 'JestCoin'
        : 'Stripe',
    },
  });
};

/**
 * Confirm a payment intent (primarily for Stripe)
 */
export const confirmOrderPayment = async (
  paymentIntentId: string,
  orderId: string,
  userId: string
): Promise<PaymentResult> => {
  return await confirmStripePayment(paymentIntentId, orderId, userId);
};

/**
 * Update the status of an order
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId);
      
    if (error) throw error;
    
    // Get user_id from order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('user_id')
      .eq('id', orderId)
      .single();
      
    if (orderError) throw orderError;
    
    // Create a notification for the user
    let title = '';
    let message = '';
    
    switch (status) {
      case 'paid':
        title = 'Payment Received';
        message = 'Your payment has been processed successfully.';
        break;
      case 'processing':
        title = 'Order Processing';
        message = 'Your order is being processed.';
        break;
      case 'shipped':
        title = 'Order Shipped';
        message = 'Your order has been shipped.';
        break;
      case 'delivered':
        title = 'Order Delivered';
        message = 'Your order has been delivered.';
        break;
      case 'cancelled':
        title = 'Order Cancelled';
        message = 'Your order has been cancelled.';
        break;
      default:
        title = 'Order Updated';
        message = `Your order status has been updated to ${status}.`;
    }
    
    if (title && message) {
      await createOrderStatusNotification(orderData.user_id, orderId, title, message);
    }
    
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
