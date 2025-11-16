
import { useState, useEffect } from 'react';
import { confirmOrderPayment } from '@/services/checkout/checkoutService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import type { Stripe } from '@stripe/stripe-js';

interface PaymentIntentData {
  clientSecret: string;
  paymentIntentId: string;
  orderId: string;
}

interface UseStripePaymentProps {
  paymentMethod: string;
  userId?: string;
  clearCart: () => void;
}

export const useStripePayment = ({ paymentMethod, userId, clearCart }: UseStripePaymentProps) => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentData | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load Stripe dynamically when payment method is selected
  useEffect(() => {
    if (paymentMethod === 'stripe') {
      const loadStripeModule = async () => {
        try {
          const { loadStripe } = await import('@stripe/stripe-js');
          // This is a test publishable key
          const stripe = loadStripe('pk_test_51OqpJkLSp21QsDsWtWC04hkLyQkgMRGUzS5kVbMHSQVUXJSQcXRSA3mZMf2tuPq08Vzgk8VbI7O5TMM1dYLHyayf00HxwECzZT');
          setStripePromise(stripe);
        } catch (error) {
          console.error('Failed to load Stripe:', error);
        }
      };
      
      loadStripeModule();
    }
  }, [paymentMethod]);

  const setPaymentIntentData = (data: PaymentIntentData) => {
    setPaymentIntent(data);
  };
  
  const handleStripePaymentConfirmation = async () => {
    if (!paymentIntent || !userId) return;
    
    setProcessing(true);
    
    try {
      const result = await confirmOrderPayment(
        paymentIntent.paymentIntentId,
        paymentIntent.orderId,
        userId
      );
      
      if (result.success) {
        toast({
          title: 'Pagamento confirmado!',
          description: 'Seu pedido foi realizado. Acompanhe o status em "Meus Pedidos"',
        });
        
        clearCart();
        navigate('/store/orders');
      } else {
        throw new Error(result.message || 'Falha na confirmação do pagamento');
      }
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      toast({
        title: 'Falha na confirmação',
        description: error.message || 'Ocorreu um erro ao confirmar o pagamento',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
      setPaymentIntent(null);
    }
  };

  const resetPaymentIntent = () => {
    setPaymentIntent(null);
  };

  return {
    stripePromise,
    paymentIntent,
    processing,
    setPaymentIntentData,
    handleStripePaymentConfirmation,
    resetPaymentIntent,
    setProcessing
  };
};
