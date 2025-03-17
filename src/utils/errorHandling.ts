
import { toast } from "@/components/ui/use-toast";

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public severity: 'error' | 'warning' = 'error',
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    public tableName?: string,
    public operation?: 'select' | 'insert' | 'update' | 'delete' | 'query',
    metadata?: Record<string, any>
  ) {
    super(message, 'DATABASE_ERROR', 'error', metadata);
    this.name = 'DatabaseError';
  }
}

export const handleError = (error: unknown) => {
  console.error('Error caught:', error);
  
  if (error instanceof AppError) {
    toast({
      title: error.severity === 'error' ? 'Error' : 'Warning',
      description: error.message,
      variant: error.severity === 'error' ? 'destructive' : 'default',
    });
    return;
  }

  if (error instanceof Error) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
    return;
  }

  toast({
    title: 'Error',
    description: 'An unexpected error occurred',
    variant: 'destructive',
  });
};

export const getDatabaseErrorMessage = (error: any): string => {
  // Handle Supabase-specific error formats
  if (error && error.code) {
    switch (error.code) {
      case '23505': return 'A record with this information already exists.';
      case '23503': return 'This operation failed because the data is referenced elsewhere.';
      case '23502': return 'Required information is missing.';
      case '42P01': return 'The requested table does not exist.';
      default: return error.message || 'Database operation failed.';
    }
  }
  
  return error?.message || 'An error occurred with the database operation.';
};
