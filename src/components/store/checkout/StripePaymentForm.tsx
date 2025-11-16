
import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Initialize Stripe with a proper publishable key
// This is a test publishable key - it's fine to expose in code
const stripePromise = loadStripe('pk_test_51OqpJkLSp21QsDsWtWC04hkLyQkgMRGUzS5kVbMHSQVUXJSQcXRSA3mZMf2tuPq08Vzgk8VbI7O5TMM1dYLHyayf00HxwECzZT');

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm = ({ onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setErrorMessage(submitError.message || 'An error occurred');
        setIsLoading(false);
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/store/payment-success',
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred');
      } else {
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-500 text-sm rounded">
          {errorMessage}
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isLoading}
        >
          {isLoading ? 'Processando...' : 'Confirmar Pagamento'}
        </Button>
      </div>
    </form>
  );
};

interface StripePaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ 
  clientSecret,
  onSuccess,
  onCancel
}) => {
  if (!clientSecret) return null;

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;
