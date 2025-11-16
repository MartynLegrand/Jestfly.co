
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { DemoFeedback, DemoSubmission } from '@/types';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for fetching and managing demo feedback
 * 
 * @param submissionId - The ID of the demo submission to fetch feedback for
 * @returns Feedback data and loading state
 */
export const useDemoFeedback = (submissionId: string) => {
  const [feedback, setFeedback] = useState<DemoFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch feedback for the submission
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!submissionId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('demo_feedback')
          .select(`
            *,
            reviewer:reviewer_id(id, username, display_name, avatar_url)
          `)
          .eq('submission_id', submissionId)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setFeedback(data || []);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback');
        toast({
          title: 'Error',
          description: 'Failed to load feedback. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeedback();
  }, [submissionId, toast]);

  // Function to refresh feedback data
  const refreshFeedback = async () => {
    if (!submissionId) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('demo_feedback')
        .select(`
          *,
          reviewer:reviewer_id(id, username, display_name, avatar_url)
        `)
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setFeedback(data || []);
    } catch (err) {
      console.error('Error refreshing feedback:', err);
      toast({
        title: 'Error',
        description: 'Failed to refresh feedback data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    feedback,
    isLoading,
    error,
    refreshFeedback
  };
};
