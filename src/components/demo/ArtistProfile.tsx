
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const ArtistProfile: React.FC = () => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="biography"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Biografia do Artista</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Conte-nos um pouco sobre você ou sua banda..." 
                rows={4}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="social_links"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Links de Redes Sociais</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Instagram, SoundCloud, Spotify, etc... (um por linha)" 
                rows={3}
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
