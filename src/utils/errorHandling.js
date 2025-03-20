import { toast } from "sonner";
export class AppError extends Error {
    constructor(message, code, severity = 'error', metadata) {
        super(message);
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: code
        });
        Object.defineProperty(this, "severity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: severity
        });
        Object.defineProperty(this, "metadata", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: metadata
        });
        this.name = 'AppError';
    }
}
export class DatabaseError extends AppError {
    constructor(message, tableName, operation, metadata) {
        super(message, 'DATABASE_ERROR', 'error', metadata);
        Object.defineProperty(this, "tableName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: tableName
        });
        Object.defineProperty(this, "operation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: operation
        });
        this.name = 'DatabaseError';
    }
}
export const handleError = (error) => {
    console.error('Error caught:', error);
    if (error instanceof AppError) {
        toast.error(error.severity === 'error' ? 'Error' : 'Warning', {
            description: error.message,
        });
        return;
    }
    if (error instanceof Error) {
        toast.error('Error', {
            description: error.message,
        });
        return;
    }
    toast.error('Error', {
        description: 'An unexpected error occurred',
    });
};
export const getDatabaseErrorMessage = (error) => {
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
