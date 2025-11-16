
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormValues } from '@/hooks/checkout/useCheckoutForm';
import { UseFormReturn } from 'react-hook-form';
import { CreditCard, Coins, CreditCardIcon } from 'lucide-react';

interface PaymentMethodSelectorProps {
  form: UseFormReturn<FormValues>;
  walletBalance: number;
  total: number;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  form, 
  walletBalance, 
  total 
}) => {
  const insufficientFunds = walletBalance < total;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Método de Pagamento</h3>
      
      <FormField
        control={form.control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-2"
              >
                <div className={`flex items-center space-x-2 rounded-md border p-3 
                  ${insufficientFunds ? 'opacity-50' : 'cursor-pointer'}`}
                >
                  <RadioGroupItem value="jestcoin" id="jestcoin" disabled={insufficientFunds} />
                  <Label htmlFor="jestcoin" className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center">
                      <Coins className="mr-2 h-4 w-4" />
                      JestCoin
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {insufficientFunds 
                        ? `Saldo insuficiente (${walletBalance} JC)` 
                        : `Saldo disponível: ${walletBalance} JC`}
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Cartão de Crédito
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Visa, Mastercard, etc.</div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center">
                      <CreditCardIcon className="mr-2 h-4 w-4" />
                      Stripe (Recomendado)
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Pagamento seguro via Stripe</div>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PaymentMethodSelector;
