
/**
 * Utility functions for JSON manipulation with type safety
 */

/**
 * Convert a value to JSON string with proper error handling
 */
export function toJson<T>(value: T): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Failed to stringify value to JSON:', error);
    return '{}';
  }
}

/**
 * Parse a JSON string to an object with proper error handling
 */
export function fromJson<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON string:', error);
    return defaultValue;
  }
}

/**
 * Safely get a nested property from an object using a path string
 * Example: getNestedValue(obj, 'user.profile.name')
 */
export function getNestedValue<T = any>(
  obj: Record<string, any>,
  path: string,
  defaultValue: T
): T {
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === undefined || result === null) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return (result === undefined || result === null) ? defaultValue : result as T;
  } catch (error) {
    console.error('Failed to get nested value:', error);
    return defaultValue;
  }
}

/**
 * Safely set a nested property in an object using a path string
 * Example: setNestedValue(obj, 'user.profile.name', 'John')
 */
export function setNestedValue<T = any>(
  obj: Record<string, any>,
  path: string,
  value: T
): Record<string, any> {
  try {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    
    if (!lastKey) {
      return obj;
    }
    
    // Create path if it doesn't exist
    for (const key of keys) {
      if (current[key] === undefined || current[key] === null || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
    
    // Set the value
    current[lastKey] = value;
    return obj;
  } catch (error) {
    console.error('Failed to set nested value:', error);
    return obj;
  }
}

/**
 * Deep merge two objects with type safety
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) {
    return output;
  }
  
  Object.keys(source).forEach(key => {
    const sourceKey = key as keyof T;
    const targetValue = target[sourceKey];
    const sourceValue = source[sourceKey];
    
    if (
      typeof targetValue === 'object' && 
      targetValue !== null && 
      typeof sourceValue === 'object' && 
      sourceValue !== null &&
      !Array.isArray(targetValue) &&
      !Array.isArray(sourceValue)
    ) {
      output[sourceKey] = deepMerge(targetValue, sourceValue as any);
    } else if (sourceValue !== undefined) {
      output[sourceKey] = sourceValue as T[keyof T];
    }
  });
  
  return output;
}
