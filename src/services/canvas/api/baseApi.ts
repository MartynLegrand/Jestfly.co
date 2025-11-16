
import { supabase } from '@/integrations/supabase/client';

export const db = supabase;

export function handleApiError(error: any, errorMessage: string): never {
  console.error(errorMessage, error);
  throw new Error(`${errorMessage} ${error.message || 'Unknown error'}`);
}
