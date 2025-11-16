
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { DemoCategory } from '@/types';

interface CategoriesSelectionProps {
  categories: DemoCategory[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
}

const CategoriesSelection: React.FC<CategoriesSelectionProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle
}) => {
  return (
    <div>
      <FormLabel>Categorias</FormLabel>
      <div className="mt-2 bg-card rounded-md border p-4">
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => onCategoryToggle(category.id)}
                />
                <label 
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoriesSelection;
