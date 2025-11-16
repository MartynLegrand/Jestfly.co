
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Here you could send the error to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
    
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-6 rounded-lg border bg-card text-card-foreground shadow-sm space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold">Algo deu errado</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Ocorreu um erro inesperado. Nossa equipe foi notificada.
          </p>
          <div className="text-xs text-muted-foreground border p-2 rounded bg-muted/50 max-w-md overflow-auto">
            {this.state.error?.message || 'Erro desconhecido'}
          </div>
          <Button onClick={this.resetErrorBoundary}>
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
