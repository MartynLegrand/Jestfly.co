
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { processCheckoutPayment } from '@/services/checkout/checkoutService';
import { useCart } from '@/lib/store/cartStore';
import { checkoutFormSchema, CheckoutFormValues } from './checkoutFormSchema';
import { useStripePayment } from './useStripePayment';
import { useShippingDetails } from './useShippingDetails';

export const useCheckoutForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wallet, refreshWallet } = useWallet();
  const { toast } = useToast();
  const { items, total, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  
  // Initialize form with default values
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: user?.profile?.display_name || '',
      email: user?.email || '',
      paymentMethod: 'jestcoin',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });
  
  const walletBalance = wallet?.balance || 0;
  const currentPaymentMethod = form.watch('paymentMethod');
  const insufficientFunds = currentPaymentMethod === 'jestcoin' && walletBalance < total;
  
  // Use our custom hooks for shipping and payment
  const { hasPhysicalProduct, prepareShippingAddress } = useShippingDetails(items);
  const stripePayment = useStripePayment({
    paymentMethod: currentPaymentMethod,
    userId: user?.id,
    clearCart
  });
  
  const onSubmit = async (data: CheckoutFormValues) => {
    if (!user) {
      toast({
        title: 'Não autenticado',
        description: 'Por favor, faça login para finalizar a compra',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar a compra',
        variant: 'destructive',
      });
      return;
    }
    
    if (data.paymentMethod === 'jestcoin' && insufficientFunds) {
      toast({
        title: 'Saldo insuficiente',
        description: 'Você não possui JestCoins suficientes para esta compra',
        variant: 'destructive',
      });
      return;
    }
    
    setProcessing(true);
    stripePayment.setProcessing(true);
    
    try {
      // Prepare shipping address if needed
      const shippingAddress = prepareShippingAddress(data);
      
      // Process the payment
      const paymentResult = await processCheckoutPayment({
        userId: user.id,
        items,
        paymentMethod: data.paymentMethod,
        customerInfo: {
          name: data.name,
          email: data.email,
          shippingAddress
        }
      });
      
      if (paymentResult.success) {
        // If this is a Stripe payment that requires confirmation
        if (paymentResult.requiresAction && paymentResult.clientSecret && paymentResult.paymentIntentId && paymentResult.orderId) {
          stripePayment.setPaymentIntentData({
            clientSecret: paymentResult.clientSecret,
            paymentIntentId: paymentResult.paymentIntentId,
            orderId: paymentResult.orderId
          });
          setProcessing(false);
          return;
        }
        
        toast({
          title: 'Compra finalizada com sucesso!',
          description: 'Seu pedido foi realizado. Acompanhe o status em "Meus Pedidos"',
        });
        
        clearCart();
        
        if (data.paymentMethod === 'jestcoin') {
          refreshWallet();
        }
        
        navigate('/store/orders');
      } else {
        throw new Error(paymentResult.message || 'Erro ao processar pagamento');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Falha ao finalizar compra',
        description: error.message || 'Ocorreu um erro ao processar o pagamento',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
      stripePayment.setProcessing(false);
    }
  };
  
  return {
    form,
    processing: processing || stripePayment.processing,
    walletBalance,
    total,
    insufficientFunds,
    hasPhysicalProduct,
    paymentIntent: stripePayment.paymentIntent,
    stripePromise: stripePayment.stripePromise,
    onSubmit: form.handleSubmit(onSubmit),
    handleStripePaymentConfirmation: stripePayment.handleStripePaymentConfirmation,
  };
};

// Re-export the types from the schema file for convenience
export type { CheckoutFormValues as FormValues } from './checkoutFormSchema';
