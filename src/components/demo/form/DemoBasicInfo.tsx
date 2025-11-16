
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormData } from '../hooks/useSubmissionForm';

const DemoBasicInfo: React.FC = () => {
  const { control } = useFormContext<FormData>();
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título da Música</FormLabel>
            <FormControl>
              <Input placeholder="Digite o título da sua música" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="artist_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Artista/Banda</FormLabel>
            <FormControl>
              <Input placeholder="Digite seu nome artístico ou da banda" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="genre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gênero Principal</FormLabel>
            <FormControl>
              <Input placeholder="Ex: House, Techno, Hip Hop, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DemoBasicInfo;
