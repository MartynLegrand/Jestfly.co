
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics/eventTracking';
import { createDemoSubmission } from '@/lib/demo/demoService';
import { DemoStatus } from '@/types/demo';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { tryCatch } from '@/utils/error-utils';

/**
 * Custom hook for handling demo submission creation.
 * Manages submission state and error handling.
 * 
 * @returns Submission handlers and state
 */
export const useSubmissionHandler = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Processes social links from form text input to structured object
   */
  const processSocialLinks = (socialLinksText: string | undefined): Record<string, string> => {
    const socialLinksObj: Record<string, string> = {};
    
    if (socialLinksText) {
      const links = socialLinksText.split('\n').filter(link => link.trim());
      links.forEach((link, index) => {
        let key = `link${index+1}`;
        try {
          const url = new URL(link.trim());
          key = url.hostname.replace('www.', '').split('.')[0];
        } catch (e) {
          key = `link${index+1}`;
        }
        socialLinksObj[key] = link.trim();
      });
    }
    
    return socialLinksObj;
  };

  /**
   * Creates a demo submission in the database
   */
  const submitDemo = async (
    formData: {
      title: string;
      artist_name: string;
      genre?: string;
      biography?: string;
      social_links?: string;
      audio_urls?: string[];
    },
    primaryAudioUrl: string,
    selectedCategories: string[],
    additionalAudioUrls?: string[]
  ) => {
    if (!user) {
      return false;
    }
    
    const socialLinksObj = processSocialLinks(formData.social_links);
    
    const submissionData = {
      title: formData.title,
      artist_name: formData.artist_name,
      genre: formData.genre,
      biography: formData.biography,
      social_links: socialLinksObj,
      audio_url: primaryAudioUrl,
      additional_audio_urls: additionalAudioUrls && additionalAudioUrls.length > 1 ? 
        additionalAudioUrls.slice(1) : // Skip the primary audio URL which is already saved in audio_url
        [],
      user_id: user.id,
      status: 'pending' as DemoStatus,
    };
    
    // Create demo submission with error handling
    const [result, submissionError] = await tryCatch(async () => {
      return await createDemoSubmission(submissionData, selectedCategories);
    });

    if (submissionError) {
      handleError(submissionError, 'Falha ao enviar a demo');
      return false;
    }
    
    const audioCount = (additionalAudioUrls?.length || 1);
    
    trackEvent('demo_submission', {
      title: formData.title,
      artist_name: formData.artist_name,
      genre: formData.genre,
      categories: selectedCategories,
      audio_count: audioCount
    });
    
    toast({
      title: 'Demo enviada com sucesso!',
      description: `Sua demo com ${audioCount} ${audioCount > 1 ? 'arquivos' : 'arquivo'} foi enviada e será avaliada por nossa equipe.`,
    });
    
    return true;
  };

  return {
    isSubmitting,
    setIsSubmitting,
    submitDemo
  };
};
