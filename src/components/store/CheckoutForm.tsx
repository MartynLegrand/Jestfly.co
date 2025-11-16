
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { useCheckoutForm } from '@/hooks/checkout/useCheckoutForm';
import PersonalInfoForm from './checkout/PersonalInfoForm';
import PaymentMethodSelector from './checkout/PaymentMethodSelector';
import OrderSummaryDisplay from './checkout/OrderSummaryDisplay';
import ShippingAddressForm from './checkout/ShippingAddressForm';
import StripePaymentForm from './checkout/StripePaymentForm';

const CheckoutForm = () => {
  const { 
    form, 
    processing, 
    walletBalance, 
    total, 
    insufficientFunds,
    hasPhysicalProduct,
    paymentIntent,
    onSubmit,
    handleStripePaymentConfirmation
  } = useCheckoutForm();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>
          Complete sua compra fornecendo seus dados abaixo.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {paymentIntent ? (
          <StripePaymentForm
            clientSecret={paymentIntent.clientSecret}
            onSuccess={handleStripePaymentConfirmation}
            onCancel={() => window.location.reload()}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <PersonalInfoForm form={form} />
              
              {hasPhysicalProduct && (
                <ShippingAddressForm form={form} />
              )}
              
              <PaymentMethodSelector 
                form={form} 
                walletBalance={walletBalance} 
                total={total} 
              />
              
              <OrderSummaryDisplay total={total} />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={processing || insufficientFunds}
              >
                {processing ? 'Processando...' : `Pagar ${total.toFixed(2)} JC`}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;
