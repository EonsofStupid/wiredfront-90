
/**
 * WiredFront Type Sources
 * 
 * This file defines the source-of-truth for types in the WiredFront application.
 * These are the canonical locations for key type definitions that should be
 * imported rather than redefined.
 */

/**
 * Core Type Sources
 * 
 * These are the primary source files for key type definitions
 */
export const typeSources = {
  // User and Authentication
  user: '@/types/store/common/types.ts',
  auth: '@/types/store/auth.ts',
  
  // Chat and Messaging
  chat: '@/components/chat/types.ts',
  message: '@/types/chat.ts',
  
  // Project and Documents
  project: '@/types/store/data.ts',
  document: '@/types/documents.ts',
  
  // Settings and Preferences
  settings: '@/types/store/settings.ts',
  preferences: '@/types/store/common/types.ts',
  
  // UI and Theme
  theme: '@/types/store/ui.ts',
  layout: '@/types/store/ui.ts',
  
  // API and Integration
  api: '@/types/admin/settings/api-config.ts',
  github: '@/schemas/github.ts',
  
  // Feature Flags
  featureFlags: '@/types/admin/settings/feature-flags.ts',
  
  // RAG and Vector Search
  rag: '@/services/rag/types.ts',
  vector: '@/types/admin/vector-database.ts',
  
  // Store and State Management
  store: '@/types/store/core/types.ts',
  zustand: '@/types/store/core/types.ts',
  
  // Sessions
  session: '@/types/sessions.ts',
  
  // Common Types
  common: '@/types/store/common/types.ts',
  enums: '@/integrations/supabase/types/enums.ts'
};

/**
 * Key Type Exports
 * 
 * Important types that should be imported from their source files
 */
export const keyTypeExports = {
  // User and Authentication
  'User': '@/types/store/common/types.ts',
  'AuthState': '@/types/store/auth.ts',
  'LoginCredentials': '@/types/store/common/types.ts',
  
  // Chat and Messaging
  'ChatMessage': '@/components/chat/types.ts',
  'MessageRole': '@/components/chat/types.ts',
  'ChatMode': '@/integrations/supabase/types/enums.ts',
  'ChatState': '@/components/chat/store/types/chat-store-types.ts',
  
  // Project and Documents
  'Project': '@/types/store/data.ts',
  'Document': '@/types/documents.ts',
  
  // Settings and Preferences
  'UserPreferences': '@/types/store/common/types.ts',
  'SettingsState': '@/types/store/settings.ts',
  
  // Feature Flags
  'FeatureFlag': '@/types/admin/settings/feature-flags.ts',
  'KnownFeatureFlag': '@/types/admin/settings/feature-flags.ts',
  
  // Store Types
  'AsyncState': '@/types/store/core/types.ts',
  'BaseState': '@/types/store/core/types.ts',
  
  // API Types
  'APIConfiguration': '@/schemas/api.ts'
};

/**
 * Type Import Examples
 * 
 * Examples of correctly importing types from their source files
 */
export const typeImportExamples = {
  user: `import type { User } from '@/types/store/common/types';`,
  chat: `import type { ChatMessage, MessageRole } from '@/components/chat/types';`,
  chatMode: `import { ChatMode } from '@/integrations/supabase/types/enums';`,
  chatState: `import type { ChatState } from '@/components/chat/store/types/chat-store-types';`,
  settings: `import type { SettingsState } from '@/types/store/settings';`,
  featureFlag: `import type { FeatureFlag, KnownFeatureFlag } from '@/types/admin/settings/feature-flags';`
};

/**
 * Type Validation Rules
 * 
 * Rules for validating type usage
 */
export const typeValidationRules = {
  noRedefinition: 'Never redefine types that already exist in the source files',
  useImports: 'Always import types from their source files',
  extendInterface: 'Extend interfaces when adding new properties instead of redefining them',
  typeGuards: 'Create type guards for runtime type checking',
  
  example: `
    // INCORRECT - Redefining an existing type
    interface User {
      id: string;
      email: string;
    }
    
    // CORRECT - Importing the existing type
    import type { User } from '@/types/store/common/types';
    
    // CORRECT - Extending an existing type
    import type { User } from '@/types/store/common/types';
    
    interface EnhancedUser extends User {
      preferences: UserPreferences;
    }
  `
};

/**
 * Database Types
 * 
 * Sources for database-related types
 */
export const databaseTypesSources = {
  supabase: '@/integrations/supabase/types.ts',
  tables: '@/integrations/supabase/types/tables.ts',
  enums: '@/integrations/supabase/types/enums.ts',
  helpers: '@/integrations/supabase/types/helpers.ts'
};
