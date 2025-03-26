
import { z } from 'zod';
import { toast } from 'sonner';

interface ValidationOptions {
  logErrors?: boolean;
  showToast?: boolean;
  context?: string;
}

export function validateWithZod<T>(
  schema: z.ZodType<T>,
  data: unknown,
  options: ValidationOptions = {}
): T | null {
  const { logErrors = true, showToast = false, context = 'Data' } = options;
  
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(i => i.message).join(', ');
      
      if (logErrors) {
        console.error(`Validation error in ${context}:`, issues);
      }
      
      if (showToast) {
        toast.error(`Validation error: ${issues}`);
      }
    } else {
      if (logErrors) {
        console.error(`Unknown validation error in ${context}:`, error);
      }
      
      if (showToast) {
        toast.error('Unknown validation error occurred');
      }
    }
    
    return null;
  }
}
