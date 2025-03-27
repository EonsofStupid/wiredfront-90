
/**
 * Unified chat mode enumerations
 */

// Unified ChatMode type - this is the central definition
export type ChatMode = 
  | 'chat'      // Standard chat mode
  | 'dev'       // Development/code mode (equivalent to 'editor' in UI)
  | 'image'     // Image generation mode
  | 'training'  // Training mode
  | 'editor';   // Alias for 'dev' for backward compatibility

// Type guard for ChatMode
export function isChatMode(value: string): value is ChatMode {
  return ['chat', 'dev', 'image', 'training', 'editor'].includes(value);
}

// Mapping from UI modes to database modes
export const uiModeToDatabaseMode: Record<string, ChatMode> = {
  'standard': 'chat',
  'editor': 'dev',
  'image': 'image',
  'training': 'training',
};

// Mapping from database modes to UI modes
export const databaseModeToUiMode: Record<ChatMode, string> = {
  'chat': 'standard',
  'dev': 'editor',
  'image': 'image',
  'training': 'training',
  'editor': 'editor', // Alias
};

// Unified TokenEnforcementMode type
export type TokenEnforcementMode = 
  | 'always'      // Always enforce token limits
  | 'never'       // Never enforce token limits
  | 'role_based'  // Enforce based on user role
  | 'mode_based'  // Enforce based on chat mode
  | 'warn'        // Warn but don't enforce
  | 'strict';     // Strictly enforce

// Type guard for TokenEnforcementMode
export function isTokenEnforcementMode(value: string): value is TokenEnforcementMode {
  return ['always', 'never', 'role_based', 'mode_based', 'warn', 'strict'].includes(value);
}

// Mapping from UI enforcement modes to database enforcement modes
export const uiEnforcementToDatabaseEnforcement: Record<string, TokenEnforcementMode> = {
  'never': 'never',
  'warn': 'warn',
  'strict': 'always',
};

// Mapping from database enforcement modes to UI enforcement modes
export const databaseEnforcementToUiEnforcement: Record<string, string> = {
  'always': 'strict',
  'never': 'never',
  'role_based': 'warn',
  'mode_based': 'warn',
};

// Chat position type
export type ChatPosition = 'bottom-left' | 'bottom-right';

// Chat position coordinates type for when we need x/y positions
export interface ChatPositionCoordinates {
  x: number;
  y: number;
}

// Message role type
export type MessageRole = 'user' | 'assistant' | 'system';

// Message type
export type MessageType = 'text' | 'image' | 'code' | 'file' | 'command' | 'system' | 'training';

// Message status type
export type MessageStatus = 
  | 'pending'   // Message is being processed
  | 'sent'      // Message has been sent
  | 'received'  // Message has been received
  | 'failed'    // Message failed to send
  | 'error'     // Error occurred during processing
  | 'cached';   // Message was retrieved from cache
