
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, CreditCard, Wallet } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { processJestCoinPayment } from '@/lib/booking/bookingService';
import { useToast } from '@/hooks/use-toast';

interface BookingPaymentFlowProps {
  bookingId: string;
  amount: number;
  jestCoinAmount: number;
  onPaymentComplete: (paymentId: string) => void;
  onCancel: () => void;
}

const BookingPaymentFlow: React.FC<BookingPaymentFlowProps> = ({
  bookingId,
  amount,
  jestCoinAmount,
  onPaymentComplete,
  onCancel
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'jest_coin'>('jest_coin');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!user?.id) {
      setError('You must be logged in to make a payment');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      if (paymentMethod === 'jest_coin') {
        const result = await processJestCoinPayment(user.id, bookingId, jestCoinAmount);
        
        if (result.success && result.transaction_id) {
          toast({
            title: 'Payment Successful',
            description: 'Your booking has been confirmed.',
          });
          onPaymentComplete(result.transaction_id);
        } else {
          setError(result.message || 'Payment failed. Please try again.');
        }
      } else {
        // For demonstration purposes, we'll simulate a credit card payment
        setTimeout(() => {
          toast({
            title: 'Payment Successful',
            description: 'Your booking has been confirmed.',
          });
          onPaymentComplete('simulated-cc-payment');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'An unexpected error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="jest_coin" onValueChange={(value) => setPaymentMethod(value as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jest_coin">
              <Wallet className="h-4 w-4 mr-2" />
              JestCoin
            </TabsTrigger>
            <TabsTrigger value="credit_card">
              <CreditCard className="h-4 w-4 mr-2" />
              Credit Card
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="jest_coin" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm">
                Pay with JestCoin, our digital currency. You'll be charged:
              </p>
              
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-2xl font-bold">{jestCoinAmount} JestCoins</p>
                <p className="text-sm text-muted-foreground">Equivalent to ${amount}</p>
              </div>
              
              <Alert className="bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Make sure you have enough JestCoins in your wallet before proceeding.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          <TabsContent value="credit_card" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm">
                Pay securely using your credit or debit card. You'll be charged:
              </p>
              
              <div className="bg-muted p-4 rounded-md text-center">
                <p className="text-2xl font-bold">${amount}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Accepted Cards</p>
                <div className="flex gap-2">
                  <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Visa</div>
                  <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">Mastercard</div>
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-xs">American Express</div>
                </div>
              </div>
              
              <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                <Check className="h-4 w-4 mr-2" />
                <AlertDescription>
                  All credit card information is encrypted and securely processed.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
        
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : `Pay ${paymentMethod === 'jest_coin' ? `${jestCoinAmount} JestCoins` : `$${amount}`}`}
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full"
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingPaymentFlow;
