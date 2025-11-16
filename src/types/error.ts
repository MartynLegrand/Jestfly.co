
// Error handling related types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorState {
  hasError: boolean;
  message: string | null;
  details?: any;
}

export interface ErrorDisplayProps {
  title?: string;
  message?: string;
  retry?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'inline' | 'small';
}
