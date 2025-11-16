
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAudioUpload } from './useAudioUpload';
import { useCategories } from './useCategories';
import { useSubmissionHandler } from './useSubmissionHandler';

/**
 * Form schema for demo submission validation
 */
const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres' }),
  artist_name: z.string().min(2, { message: 'O nome do artista deve ter pelo menos 2 caracteres' }),
  genre: z.string().optional(),
  biography: z.string().max(1000, { message: 'A biografia deve ter no máximo 1000 caracteres' }).optional(),
  social_links: z.string().max(500, { message: 'Links devem ter no máximo 500 caracteres' }).optional(),
  categories: z.array(z.string()).optional(),
  agree_terms: z.boolean().refine(val => val === true, {
    message: 'Você deve concordar com os termos e condições',
  }),
});

export type FormData = z.infer<typeof formSchema>;

/**
 * Main hook for the demo submission form.
 * Combines audio upload, categories, and submission functionality.
 * 
 * @returns All state and handlers needed for the submission form
 */
export const useSubmissionForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Initialize the form with React Hook Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      artist_name: '',
      genre: '',
      biography: '',
      social_links: '',
      categories: [],
      agree_terms: false,
    },
  });
  
  // Incorporate the specialized hooks
  const { 
    audioFiles, 
    addAudioFiles,
    removeAudioFile,
    clearAudioFiles,
    audioPreviews, 
    uploadProgress, 
    uploadAudios,
    isUploading
  } = useAudioUpload(user?.id);
  
  const {
    categories,
    selectedCategories,
    loadingCategories,
    categoriesError,
    handleCategoryToggle,
    retryLoadCategories
  } = useCategories();
  
  const {
    isSubmitting,
    setIsSubmitting,
    submitDemo
  } = useSubmissionHandler();

  /**
   * Main form submission handler
   */
  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: 'Não autenticado',
        description: 'Você precisa estar logado para enviar uma demo.',
        variant: 'destructive',
      });
      return;
    }
    
    if (audioFiles.length === 0) {
      toast({
        title: 'Arquivo de áudio obrigatório',
        description: 'Por favor, selecione pelo menos um arquivo de áudio para enviar.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const audioUrls = await uploadAudios();
      if (audioUrls.length === 0) {
        throw new Error('Não foi possível obter a URL do áudio após o upload');
      }
      
      // Create a submission data object with required properties
      const submissionData = {
        title: data.title,               // Required field
        artist_name: data.artist_name,   // Required field
        genre: data.genre,               // Optional
        biography: data.biography,       // Optional
        social_links: data.social_links, // Optional
        audio_urls: audioUrls            // Now an array of URLs
      };
      
      const success = await submitDemo(submissionData, audioUrls[0], selectedCategories, audioUrls);
      
      if (success) {
        form.reset();
        clearAudioFiles();
        
        // Switch to the list tab
        const listTab = document.querySelector('[data-value="list"]');
        if (listTab && listTab instanceof HTMLElement) {
          listTab.click();
        }
      }
    } catch (error) {
      // The error is already handled in the specialized hooks
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    audioFiles,
    addAudioFiles,
    removeAudioFile,
    clearAudioFiles,
    audioPreviews,
    uploadProgress,
    categories,
    loadingCategories,
    categoriesError,
    retryLoadCategories,
    selectedCategories,
    handleCategoryToggle,
    onSubmit
  };
};
