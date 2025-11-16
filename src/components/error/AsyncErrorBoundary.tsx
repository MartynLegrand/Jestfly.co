
import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';
import { Loader2 } from 'lucide-react';

interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  onReset?: () => void;
}

/**
 * AsyncErrorBoundary combines ErrorBoundary with Suspense
 * to handle both synchronous errors and async loading states
 */
const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  fallback,
  errorFallback,
  onReset
}) => {
  const defaultLoadingFallback = (
    <div className="w-full flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );

  const defaultErrorFallback = (
    <ErrorFallback resetErrorBoundary={onReset} />
  );

  return (
    <ErrorBoundary fallback={errorFallback || defaultErrorFallback} onReset={onReset}>
      <Suspense fallback={fallback || defaultLoadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default AsyncErrorBoundary;
