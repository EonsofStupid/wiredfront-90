
import { injectZIndexVars } from '../theme/zIndex';

/**
 * Inject z-index CSS variables into the document root
 * Call this function early in the application lifecycle (e.g., in App.tsx)
 */
export function setupZIndexVars(): void {
  injectZIndexVars();
}
