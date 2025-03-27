/**
 * Centralized logging service
 */

export class LoggingService {
  static error(message: string, error?: unknown): void {
    console.error(message, error);
  }

  static warn(message: string, error?: unknown): void {
    console.warn(message, error);
  }

  static info(message: string, error?: unknown): void {
    console.info(message, error);
  }

  static debug(message: string, error?: unknown): void {
    console.debug(message, error);
  }
}

export const logger = LoggingService;
