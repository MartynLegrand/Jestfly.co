
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormData } from '../hooks/useSubmissionForm';

const TermsAgreement: React.FC = () => {
  const { control } = useFormContext<FormData>();
  
  return (
    <FormField
      control={control}
      name="agree_terms"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormDescription>
              Eu concordo com os termos e condições para submissão de demos. Entendo que minha música será avaliada pela equipe da JESTFLY e posso receber feedback sobre o material enviado.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TermsAgreement;
