
import { CartItem } from '@/types';
import { createOrder, createOrderItems, updateOrderShippingInfo } from './orderService';
import { processOrderPayment, PaymentResult } from './paymentProcessingService';

/**
 * The main checkout process that coordinates order creation and payment
 */
export const processCheckoutPayment = async ({
  userId,
  items,
  paymentMethod,
  customerInfo
}: {
  userId: string;
  items: CartItem[];
  paymentMethod: string;
  customerInfo: {
    name: string;
    email: string;
    shippingAddress?: Record<string, any>;
  };
}): Promise<PaymentResult> => {
  try {
    // Calculate total from items (as a safeguard)
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    // Create the order
    const order = await createOrder(userId, total, paymentMethod);
    
    // Add all items to the order
    await createOrderItems(order.id, items);
    
    // If there's a shipping address, update the order
    if (customerInfo.shippingAddress) {
      await updateOrderShippingInfo(
        order.id, 
        customerInfo.shippingAddress, 
        { name: customerInfo.name, email: customerInfo.email }
      );
    }
    
    // Process the payment
    const paymentResult = await processOrderPayment(
      order.id,
      userId,
      total,
      paymentMethod
    );
    
    return {
      success: paymentResult.success,
      orderId: order.id,
      requiresAction: paymentResult.requiresAction || false,
      clientSecret: paymentResult.clientSecret,
      paymentIntentId: paymentResult.paymentIntentId,
      message: paymentResult.message
    };
  } catch (error) {
    console.error("Checkout processing error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to process checkout"
    };
  }
};

// Re-export necessary functions from the smaller services
export { 
  createOrder, 
  createOrderItems,
  getUserOrders,
  getOrderDetails,
  getOrderItems 
} from './orderService';

export { 
  canDownloadDigitalProduct 
} from './digitalProductService';

export { 
  processOrderPayment, 
  confirmOrderPayment,
  updateOrderStatus 
} from './paymentProcessingService';

export { 
  createOrderStatusNotification 
} from './notificationService';

// Also export the PaymentResult type
export type { PaymentResult } from './paymentProcessingService';
