
import React from 'react';
import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, Home, ArrowLeft } from 'lucide-react';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'Ocorreu um erro inesperado';
  let statusCode = 500;
  let errorTitle = 'Erro do Servidor';
  let ErrorIcon = AlertTriangle;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    errorMessage = error.data?.message || error.statusText;
    
    if (statusCode === 404) {
      errorTitle = 'Página Não Encontrada';
      ErrorIcon = AlertCircle;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md p-8 rounded-lg border bg-card text-card-foreground shadow-sm space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <ErrorIcon className="h-16 w-16 text-destructive" />
          <h1 className="text-3xl font-bold">{errorTitle}</h1>
          <p className="text-lg text-muted-foreground text-center">{statusCode}</p>
          <p className="text-muted-foreground text-center">{errorMessage}</p>
        </div>

        <div className="flex flex-col space-y-3">
          <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Button onClick={() => navigate('/')} className="w-full">
            <Home className="mr-2 h-4 w-4" /> Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
