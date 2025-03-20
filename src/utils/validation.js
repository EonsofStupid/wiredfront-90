import { z } from 'zod';
import { toast } from 'sonner';
import { logger } from '@/services/chat/LoggingService';
/**
 * Validate data against a Zod schema
 *
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @param options Configuration options
 * @returns The validated data or null if validation fails
 */
export function validateWithZod(schema, data, options = {}) {
    const { logErrors = true, showToast = true, context = 'Data' } = options;
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('; ');
            const errorMessage = `${context} validation failed: ${formattedErrors}`;
            if (logErrors) {
                logger.error(errorMessage, { zodErrors: error.errors });
            }
            if (showToast) {
                toast.error(`Validation Error: ${formattedErrors}`);
            }
        }
        else if (logErrors) {
            logger.error(`Unexpected validation error for ${context}`, error);
            if (showToast) {
                toast.error('An unexpected validation error occurred');
            }
        }
        return null;
    }
}
/**
 * Safely validate data against a schema, returning a default value if validation fails
 *
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @param defaultValue The default value to return if validation fails
 * @param options Configuration options
 * @returns The validated data or the default value if validation fails
 */
export function safeValidate(schema, data, defaultValue, options = {}) {
    const result = validateWithZod(schema, data, options);
    return result !== null ? result : defaultValue;
}
/**
 * Create a form validation handler for React Hook Form
 *
 * @param schema The Zod schema to validate against
 * @returns A validation resolver for React Hook Form
 */
export function createZodResolver(schema) {
    return async (values) => {
        try {
            const validData = schema.parse(values);
            return { values: validData, errors: {} };
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.reduce((acc, curr) => {
                    const path = curr.path.join('.');
                    return {
                        ...acc,
                        [path]: {
                            type: 'validation',
                            message: curr.message
                        }
                    };
                }, {});
                return { values: {}, errors };
            }
            return {
                values: {},
                errors: {
                    root: {
                        type: 'validation',
                        message: 'Form validation failed'
                    }
                }
            };
        }
    };
}
