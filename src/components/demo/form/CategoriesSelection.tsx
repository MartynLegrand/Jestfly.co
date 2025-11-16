
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { DemoCategory } from '@/types';

interface CategoriesSelectionProps {
  categories: DemoCategory[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  loadingCategories?: boolean;
  categoriesError?: string | null;
  onRetry?: () => void;
}

const CategoriesSelection: React.FC<CategoriesSelectionProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  loadingCategories = false,
  categoriesError = null,
  onRetry
}) => {
  if (loadingCategories) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">Categorias</p>
        <div className="animate-pulse flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-muted h-6 w-16 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (categoriesError) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">Categorias</p>
        <div className="p-4 border border-destructive/20 rounded-md bg-destructive/5 text-destructive flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm">{categoriesError}</span>
          {onRetry && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto"
              onClick={onRetry}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  if (categories.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Categorias</p>
      <p className="text-xs text-muted-foreground">
        Selecione as categorias que melhor representam seu estilo musical:
      </p>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <Badge
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer py-1 px-3 ${isSelected ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => onCategoryToggle(category.id)}
            >
              {isSelected && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
              {category.name}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSelection;
