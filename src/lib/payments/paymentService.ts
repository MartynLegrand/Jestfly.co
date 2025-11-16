
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'jestcoin' | 'paypal' | 'stripe';
  name: string;
  details?: Record<string, any>;
}

export interface PaymentDetails {
  amount: number;
  orderId: string;
  paymentMethod: PaymentMethod;
  customerId: string;
}

/**
 * Process a payment for an order
 */
export const processPayment = async (details: PaymentDetails) => {
  try {
    console.log("Processing payment:", details);
    
    // For now, we're simulating payment processing
    // In a production environment, this would connect to Stripe/PayPal/etc.
    const { paymentMethod, amount, orderId, customerId } = details;
    
    // Process different payment methods
    if (paymentMethod.type === 'jestcoin') {
      return await processJestCoinPayment(details);
    } else if (paymentMethod.type === 'stripe') {
      return await processStripePayment(details);
    } else {
      // Simulate an external payment processing
      await simulatePaymentProcessing();
      
      // Record the payment in the database
      const { data, error } = await supabase
        .from('payments')
        .insert({
          order_id: orderId,
          customer_id: customerId,
          amount,
          payment_method: paymentMethod.type,
          status: 'completed',
          payment_details: paymentMethod.details || {}
        });
      
      if (error) throw error;
      
      // Update order status
      await updateOrderStatus(orderId, 'paid');
      
      return {
        success: true,
        transactionId: Math.random().toString(36).substring(2, 15),
        message: "Payment processed successfully"
      };
    }
  } catch (error) {
    console.error("Payment processing error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Payment processing failed"
    };
  }
};

/**
 * Process a payment using JestCoin
 */
const processJestCoinPayment = async (details: PaymentDetails) => {
  try {
    const { amount, orderId, customerId } = details;
    
    // Check user's JestCoin balance
    const { data: walletData, error: walletError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', customerId)
      .single();
      
    if (walletError) throw walletError;
    
    if (!walletData || walletData.balance < amount) {
      return {
        success: false,
        message: "Insufficient JestCoin balance"
      };
    }
    
    // Use Supabase function to handle the transaction
    const { data, error } = await supabase.rpc(
      'transfer_jestcoin',
      {
        sender_id: customerId,
        // Store admin wallet ID should be configured properly in a real implementation
        receiver_id: process.env.STORE_ADMIN_WALLET_ID || 'system',
        amount,
        description: `Payment for order ${orderId}`
      }
    );
    
    if (error) throw error;
    
    // Update order status
    await updateOrderStatus(orderId, 'paid');
    
    // Create a notification for the user
    await createOrderStatusNotification(
      customerId,
      orderId,
      'Order Confirmed',
      'Your payment has been processed successfully. We are preparing your order.'
    );
    
    return {
      success: true,
      transactionId: data.transaction_id,
      message: "JestCoin payment processed successfully"
    };
  } catch (error) {
    console.error("JestCoin payment error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "JestCoin payment failed"
    };
  }
};

/**
 * Process a payment using Stripe
 */
const processStripePayment = async (details: PaymentDetails) => {
  try {
    const { amount, orderId, customerId } = details;
    
    // Create a payment intent in Stripe through our Supabase edge function
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: {
        amount: Math.round(amount * 100), // Stripe requires amount in cents
        currency: 'usd',
        order_id: orderId,
        customer_id: customerId
      }
    });
    
    if (error) throw error;
    
    // Store the payment intent details in our database
    const { error: dbError } = await supabase
      .from('payment_intents')
      .insert({
        order_id: orderId,
        user_id: customerId,
        stripe_payment_intent_id: data.paymentIntentId,
        stripe_client_secret: data.clientSecret,
        amount,
        currency: 'usd',
        status: 'awaiting_payment'
      });
    
    if (dbError) throw dbError;
    
    // Update order status
    await updateOrderStatus(orderId, 'processing');
    
    return {
      success: true,
      clientSecret: data.clientSecret,
      paymentIntentId: data.paymentIntentId,
      requiresAction: true,
      message: "Stripe payment intent created"
    };
  } catch (error) {
    console.error("Stripe payment error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Stripe payment failed"
    };
  }
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

/**
 * Create a notification for order status updates
 */
export const createOrderStatusNotification = async (
  userId: string,
  orderId: string,
  title: string,
  message: string
) => {
  try {
    const { error } = await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type: 'order_update',
        reference_id: orderId,
        reference_type: 'order'
      });
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
};

/**
 * Simulate payment processing delay
 */
const simulatePaymentProcessing = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

/**
 * Confirm a Stripe payment intent after client-side confirmation
 */
export const confirmStripePayment = async (
  paymentIntentId: string,
  orderId: string,
  customerId: string
) => {
  try {
    // Confirm payment through our edge function
    const { data, error } = await supabase.functions.invoke('confirm-payment', {
      body: {
        payment_intent_id: paymentIntentId
      }
    });
    
    if (error) throw error;
    
    if (data.status === 'succeeded') {
      // Update payment intent status in our database
      await supabase
        .from('payment_intents')
        .update({
          status: 'succeeded',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_payment_intent_id', paymentIntentId);
      
      // Update order status
      await updateOrderStatus(orderId, 'paid');
      
      // Create notification
      await createOrderStatusNotification(
        customerId,
        orderId,
        'Payment Successful',
        'Your payment has been processed successfully. We are preparing your order.'
      );
      
      return {
        success: true,
        message: "Payment confirmed successfully"
      };
    } else {
      return {
        success: false,
        message: `Payment status: ${data.status}`
      };
    }
  } catch (error) {
    console.error("Error confirming Stripe payment:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Payment confirmation failed"
    };
  }
};
