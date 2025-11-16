import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Star, StarHalf } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getProductRatings, submitProductRating } from '@/lib/store/productService';

interface ProductRatingProps {
  productId: number;
  initialRating?: number;
  initialReviewText?: string;
  onRatingSubmitted?: () => void;
}

const ProductRating: React.FC<ProductRatingProps> = ({ productId, initialRating = 0, initialReviewText = '', onRatingSubmitted }) => {
  const [rating, setRating] = useState(initialRating);
  const [reviewText, setReviewText] = useState(initialReviewText);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleReviewTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(event.target.value);
  };

  // Fix the line that's causing the error: converting productId to string
  const handleSubmitRating = async () => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Você precisa estar logado para avaliar produtos",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      // Convert productId to string if it's a number
      await submitProductRating(String(productId), user.id, rating, reviewText);
      
      toast({
        title: "Avaliação enviada!",
        description: "Obrigado por avaliar este produto.",
      });
      
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
      
      setSubmitting(false);
    } catch (error: any) {
      console.error("Rating submission error:", error);
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message || "Ocorreu um erro ao enviar sua avaliação.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Avalie este produto</h3>
      
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(star)}
            className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
          >
            {star <= rating ? (
              <Star className="h-5 w-5" />
            ) : rating + 0.5 >= star ? (
              <StarHalf className="h-5 w-5" />
            ) : (
              <Star className="h-5 w-5 opacity-30" />
            )}
          </button>
        ))}
      </div>
      
      <Textarea
        placeholder="Escreva sua avaliação aqui..."
        value={reviewText}
        onChange={handleReviewTextChange}
        className="resize-none"
      />
      
      <Button onClick={handleSubmitRating} disabled={submitting}>
        {submitting ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </div>
  );
};

export default ProductRating;
