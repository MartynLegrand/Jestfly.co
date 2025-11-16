
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '../hooks/useSubmissionForm';

const ArtistProfile: React.FC = () => {
  const { control } = useFormContext<FormData>();
  
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="biography"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Biografia</FormLabel>
            <FormDescription>
              Conte um pouco sobre você, sua história, influências e estilo.
            </FormDescription>
            <FormControl>
              <Textarea 
                placeholder="Uma breve biografia sobre você ou sua banda..." 
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="social_links"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Redes Sociais</FormLabel>
            <FormDescription>
              Adicione links para suas redes sociais, um por linha (Instagram, Soundcloud, YouTube, etc.)
            </FormDescription>
            <FormControl>
              <Textarea 
                placeholder="https://instagram.com/seuartista
https://soundcloud.com/seuartista" 
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ArtistProfile;
