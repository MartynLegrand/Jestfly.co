
/**
 * Types of known errors in the application
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Represents an application error with structured information
 */
export class AppError extends Error {
  type: ErrorType;
  statusCode?: number;
  details?: any;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }

  static isAppError(error: any): error is AppError {
    return error instanceof AppError;
  }
}

/**
 * Categorize an error from a Supabase or API request
 */
export function categorizeError(error: any): AppError {
  // Check if already an AppError
  if (AppError.isAppError(error)) {
    return error;
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new AppError(
      'Erro de conexão. Verifique sua conexão com a internet.',
      ErrorType.NETWORK
    );
  }

  // Supabase auth errors
  if (error?.status === 401 || error?.message?.includes('não autorizado')) {
    return new AppError(
      'Você não está autorizado. Por favor, faça login novamente.',
      ErrorType.AUTHENTICATION,
      401
    );
  }

  if (error?.status === 403 || error?.message?.includes('permissão')) {
    return new AppError(
      'Você não tem permissão para acessar este recurso.',
      ErrorType.AUTHORIZATION,
      403
    );
  }

  if (error?.status === 404 || error?.message?.includes('not found')) {
    return new AppError(
      'O recurso solicitado não foi encontrado.',
      ErrorType.NOT_FOUND,
      404
    );
  }

  if (error?.status === 422 || error?.message?.includes('validation')) {
    return new AppError(
      'Dados inválidos. Por favor, verifique suas informações.',
      ErrorType.VALIDATION,
      422,
      error.details
    );
  }

  if (error?.status && error.status >= 500) {
    return new AppError(
      'Erro no servidor. Por favor, tente novamente mais tarde.',
      ErrorType.SERVER,
      error.status
    );
  }

  // Generic error
  return new AppError(
    error?.message || 'Ocorreu um erro inesperado',
    ErrorType.UNKNOWN,
    error?.status
  );
}

/**
 * Attempts to safely execute a function, wrapping any errors
 */
export async function tryCatch<T>(fn: () => Promise<T>): Promise<[T | null, AppError | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    const appError = categorizeError(error);
    return [null, appError];
  }
}

/**
 * Safely stringify an error object for logging
 */
export function safeStringifyError(error: unknown): string {
  try {
    if (error instanceof Error) {
      return JSON.stringify({
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error as any)
      });
    }
    return JSON.stringify(error);
  } catch (e) {
    return `[Error could not be stringified: ${e}]`;
  }
}
