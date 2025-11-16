
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error | null;
  resetErrorBoundary?: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  actionLabel?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  isLoading = false,
  title = 'Algo deu errado',
  description = 'Ocorreu um erro inesperado.',
  actionLabel = 'Tentar novamente'
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-4 p-6 bg-card border rounded-lg shadow-sm">
        <AlertCircle className="h-12 w-12 text-destructive" />
        
        <h3 className="text-xl font-semibold">{title}</h3>
        
        <p className="text-muted-foreground">{description}</p>
        
        {error && (
          <div className="w-full p-3 bg-muted/50 border rounded text-xs text-left overflow-auto max-h-32">
            <pre className="whitespace-pre-wrap">{error.message}</pre>
          </div>
        )}
        
        {resetErrorBoundary && (
          <Button
            onClick={resetErrorBoundary}
            className="mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {actionLabel}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
