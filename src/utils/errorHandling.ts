import { toast } from "@/components/ui/use-toast";

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public severity: 'error' | 'warning' = 'error'
  ) {
    super(message);
    this.name = 'AppError';
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