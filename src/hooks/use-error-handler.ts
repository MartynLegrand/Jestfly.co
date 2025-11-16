
/**
 * Custom hook for centralized error handling across the application.
 * Provides error state management and toast notifications for errors.
 * 
 * @returns {Object} Error handling utilities
 * @property {ErrorState} error - Current error state containing error details
 * @property {Function} handleError - Function to process and display errors
 * @property {Function} clearError - Function to reset error state
 * 
 * @example
 * const { error, handleError, clearError } = useErrorHandler();
 * 
 * try {
 *   await someOperation();
 * } catch (err) {
 *   handleError(err, 'Custom error message');
 * }
 */
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ErrorState } from '@/types/error';

export function useErrorHandler() {
  const { toast } = useToast();
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    message: null,
    details: null
  });

  /**
   * Handles errors by updating error state and showing a toast notification.
   * Can handle different error types including strings, Error objects, and custom error objects.
   * 
   * @param {any} error - The error to handle
   * @param {string} [customMessage] - Optional custom message to display instead of the error message
   * @returns {Object} Object containing the error message and original error
   */
  const handleError = useCallback((error: any, customMessage?: string) => {
    console.error('Error caught:', error);
    
    // Extract message from different error types
    let errorMessage = customMessage;
    
    if (!errorMessage) {
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = 'Um erro inesperado ocorreu';
      }
    }
    
    // Update error state
    setErrorState({
      hasError: true,
      message: errorMessage,
      details: error
    });
    
    // Show toast with error message
    toast({
      title: 'Erro',
      description: errorMessage,
      variant: 'destructive',
    });
    
    return { message: errorMessage, error };
  }, [toast]);

  /**
   * Resets the error state to its initial values.
   * Useful for clearing errors after they've been handled or when changing views.
   */
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      message: null,
      details: null
    });
  }, []);

  return {
    error: errorState,
    handleError,
    clearError
  };
}
