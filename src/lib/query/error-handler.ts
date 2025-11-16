
import { useToast } from '@/hooks/use-toast';
import { DefaultError, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

/**
 * Get standardized error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    if ('error' in error && typeof error.error === 'object' && error.error && 'message' in error.error) {
      return String(error.error.message);
    }
  }
  
  return 'Um erro inesperado ocorreu';
}

/**
 * Hook for retrieving error handling utilities for React Query
 */
export function useQueryErrorHandler() {
  const { toast } = useToast();
  
  /**
   * Default error handler for queries
   */
  const defaultQueryErrorHandler = (error: unknown) => {
    const message = getErrorMessage(error);
    console.error('Query error:', error);
    
    toast({
      title: 'Erro',
      description: message,
      variant: 'destructive',
    });
  };
  
  /**
   * Default error handler for mutations
   */
  const defaultMutationErrorHandler = (error: unknown) => {
    const message = getErrorMessage(error);
    console.error('Mutation error:', error);
    
    toast({
      title: 'Erro',
      description: message,
      variant: 'destructive',
    });
  };
  
  /**
   * Add error handling to query options
   */
  function withQueryErrorHandling<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends Array<unknown> = unknown[]
  >(
    options: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey'> & { queryKey: TQueryKey },
    customErrorHandler?: (error: TError) => void
  ): UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
    return {
      ...options,
      meta: {
        ...options.meta,
        errorHandler: customErrorHandler || defaultQueryErrorHandler,
      },
    };
  }
  
  /**
   * Add error handling to mutation options
   */
  function withMutationErrorHandling<
    TData = unknown,
    TError = DefaultError,
    TVariables = void,
    TContext = unknown
  >(
    options: UseMutationOptions<TData, TError, TVariables, TContext>,
    customErrorHandler?: (error: TError) => void
  ): UseMutationOptions<TData, TError, TVariables, TContext> {
    return {
      ...options,
      onError: (error, variables, context) => {
        (customErrorHandler || defaultMutationErrorHandler)(error);
        options.onError?.(error, variables, context);
      },
    };
  }
  
  return {
    withQueryErrorHandling,
    withMutationErrorHandling,
    defaultQueryErrorHandler,
    defaultMutationErrorHandler,
    getErrorMessage
  };
}
