
/**
 * Base operation result interface for consistent error handling
 */
export interface OperationResult {
  success: boolean;
  error?: any;
}

/**
 * Operation result with count information
 */
export interface CountOperationResult extends OperationResult {
  count?: number;
}

/**
 * Generic operation result with an ID
 */
export interface IdOperationResult<T = string> extends OperationResult {
  id?: T;
}
