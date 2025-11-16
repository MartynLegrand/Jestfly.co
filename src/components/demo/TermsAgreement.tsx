
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

const TermsAgreement: React.FC = () => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="agree_terms"
      render={({ field }) => (
        <FormItem className="flex items-start space-x-2 space-y-0 pt-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Eu concordo com os termos e condições
            </FormLabel>
            <p className="text-xs text-muted-foreground">
              Ao enviar, você concorda que sua música pode ser avaliada e potencialmente promovida em nossa plataforma.
            </p>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TermsAgreement;
