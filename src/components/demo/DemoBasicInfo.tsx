
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

const DemoBasicInfo: React.FC = () => {
  const form = useFormContext();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título da Música</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Summer Vibes" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="artist_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Artista/Banda</FormLabel>
            <FormControl>
              <Input placeholder="Ex: DJ Awesome" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="genre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gênero Musical</FormLabel>
            <FormControl>
              <Input placeholder="Ex: House, Techno, Pop" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DemoBasicInfo;
