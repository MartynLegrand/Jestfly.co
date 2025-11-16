
import { useState, useEffect } from 'react';
import { getAllDemoCategories } from '@/lib/demo/demoService';
import { DemoCategory } from '@/types';

/**
 * Custom hook for managing demo categories
 * 
 * @returns Categories state and handlers
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<DemoCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(null);
      
      const data = await getAllDemoCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategoriesError('Não foi possível carregar as categorias');
    } finally {
      setLoadingCategories(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  const retryLoadCategories = () => {
    fetchCategories();
  };
  
  return {
    categories,
    selectedCategories,
    setSelectedCategories,
    loadingCategories,
    categoriesError,
    handleCategoryToggle,
    retryLoadCategories
  };
};
