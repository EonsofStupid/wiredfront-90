
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Generate a unique ID with an optional prefix
 */
export function uniqueId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Truncate a string to a maximum length and add an ellipsis if needed
 */
export function truncate(str: string, length: number): string {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}

/**
 * Deep merge two objects
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key as keyof typeof source])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key as keyof typeof source] });
        } else {
          output[key as keyof typeof output] = deepMerge(
            target[key as keyof typeof target],
            source[key as keyof typeof source] as any
          );
        }
      } else {
        Object.assign(output, { [key]: source[key as keyof typeof source] });
      }
    });
  }
  
  return output;
}

/**
 * Check if a value is an object
 */
export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}
