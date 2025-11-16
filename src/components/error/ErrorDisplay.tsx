
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  retry?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'inline' | 'small';
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  retry,
  icon,
  variant = 'default'
}) => {
  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2 text-destructive text-sm p-2 bg-destructive/10 rounded-md">
        {icon || <AlertTriangle className="h-4 w-4" />}
        <span>{message}</span>
        {retry && (
          <Button variant="ghost" size="sm" onClick={retry} className="h-6 px-2">
            <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'small') {
    return (
      <div className="flex flex-col items-center justify-center p-4 rounded-md border bg-background space-y-2">
        {icon || <AlertTriangle className="h-8 w-8 text-destructive" />}
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground text-center">{message}</p>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="mt-2">
            <RefreshCw className="h-3 w-3 mr-1" /> Tentar novamente
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon || <AlertTriangle className="h-6 w-6 text-destructive" />}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>
          Algo deu errado ao processar sua solicitação.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
      {retry && (
        <CardFooter>
          <Button variant="outline" onClick={retry}>
            <RefreshCw className="h-4 w-4 mr-2" /> Tentar novamente
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ErrorDisplay;
