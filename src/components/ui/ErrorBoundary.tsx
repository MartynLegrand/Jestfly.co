
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="flex items-center justify-center min-h-[200px] bg-background/80 rounded-lg border border-border p-6">
          <div className="text-center max-w-md">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
            <p className="text-sm text-muted-foreground mb-4">
              There was an error rendering this component
            </p>
            {this.state.error && (
              <div className="text-left bg-muted p-3 rounded text-xs overflow-auto max-h-[150px] mb-4">
                <p className="font-medium">Error: {this.state.error.toString()}</p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
