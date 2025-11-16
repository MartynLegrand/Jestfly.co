
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DemoSubmission } from '@/types';
import { addDemoFeedback } from '@/lib/demo/feedbackService';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Star, StarIcon } from 'lucide-react';

interface FeedbackFormProps {
  submission: DemoSubmission;
  onFeedbackSubmitted?: () => void;
}

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, { message: 'O comentário deve ter pelo menos 10 caracteres' }),
  is_public: z.boolean().default(false),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

const FeedbackForm: React.FC<FeedbackFormProps> = ({ submission, onFeedbackSubmitted }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      is_public: false,
    },
  });
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    form.setValue('rating', newRating, { shouldValidate: true });
  };
  
  const onSubmit = async (data: FeedbackFormData) => {
    if (!user) {
      toast({
        title: 'Não autenticado',
        description: 'Você precisa estar logado para enviar feedback.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addDemoFeedback({
        submission_id: submission.id,
        reviewer_id: user.id,
        rating: data.rating,
        comment: data.comment,
        is_public: data.is_public,
      });
      
      toast({
        title: 'Feedback enviado',
        description: 'Seu feedback foi registrado com sucesso.',
      });
      
      form.reset();
      setRating(0);
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (error) {
      toast({
        title: 'Erro ao enviar feedback',
        description: 'Não foi possível enviar seu feedback. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">Adicionar Feedback</CardTitle>
        <CardDescription>
          Avalie esta demo e forneça um feedback construtivo para o artista.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={() => (
                <FormItem>
                  <FormLabel>Avaliação</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-yellow-500 focus:outline-none"
                          onClick={() => handleRatingChange(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          {star <= (hoverRating || rating) ? (
                            <StarIcon className="h-6 w-6 fill-yellow-500" />
                          ) : (
                            <Star className="h-6 w-6" />
                          )}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentário</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Escreva seu feedback para o artista..." 
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
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-normal">
                      Tornar este feedback público para o artista
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
