
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserDemoSubmissions } from '@/lib/demo/demoService';
import { DemoSubmission } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useUserDemos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [demos, setDemos] = useState<DemoSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState<DemoSubmission | null>(null);
  const [viewingFeedback, setViewingFeedback] = useState(false);

  useEffect(() => {
    const fetchDemos = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const data = await getUserDemoSubmissions(user.id);
        setDemos(data);
      } catch (error) {
        console.error('Error fetching demos:', error);
        toast({
          title: 'Erro ao carregar demos',
          description: 'Não foi possível carregar suas demos. Por favor, tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDemos();
  }, [user, toast]);

  const handleSwitchToSubmit = () => {
    // Find the tab element with the value "submit" and simulate a click
    const submitTab = document.querySelector('[data-value="submit"]');
    if (submitTab && submitTab instanceof HTMLElement) {
      submitTab.click();
    }
  };

  return {
    demos,
    loading,
    selectedDemo,
    setSelectedDemo,
    viewingFeedback,
    setViewingFeedback,
    handleSwitchToSubmit
  };
};
