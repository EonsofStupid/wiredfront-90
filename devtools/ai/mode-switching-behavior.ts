
/**
 * WiredFront Mode Switching Behavior
 * 
 * This file defines the rules and behavior for switching between different
 * AI chat modes (chat, developer, image generation, training, etc.)
 */

import { ChatMode } from "@/integrations/supabase/types/enums";

/**
 * Mode Auto-Switching Rules
 * 
 * Define when the system should automatically switch between different modes
 * based on context, route, or user actions.
 */
export const modeAutoSwitchingRules = {
  /**
   * Route-based mode switching
   * 
   * When navigating to these routes, the chat should automatically
   * switch to the specified mode.
   */
  routeBased: {
    '/projects': 'dev' as ChatMode,
    '/editor': 'dev' as ChatMode,
    '/gallery': 'image' as ChatMode,
    '/training': 'training' as ChatMode,
    '/search': 'search' as ChatMode,
    '/docs': 'chat' as ChatMode,
    '/': 'chat' as ChatMode
  },

  /**
   * Context-based mode switching
   * 
   * When certain contexts are detected, the chat should switch to the 
   * appropriate mode regardless of the current route.
   */
  contextBased: {
    codeEditorFocused: 'dev' as ChatMode,
    imageGalleryOpen: 'image' as ChatMode,
    trainingModuleActive: 'training' as ChatMode
  },

  /**
   * Command-based mode switching
   * 
   * Chat commands that trigger mode switching
   */
  commandBased: {
    '/dev': 'dev' as ChatMode,
    '/code': 'dev' as ChatMode,
    '/image': 'image' as ChatMode,
    '/img': 'image' as ChatMode,
    '/draw': 'image' as ChatMode,
    '/train': 'training' as ChatMode,
    '/search': 'search' as ChatMode,
    '/chat': 'chat' as ChatMode
  }
};

/**
 * Mode Transition Rules
 * 
 * Define how transitions between modes should be handled
 */
export const modeTransitionRules = {
  /**
   * Preservation rules for mode transitions
   * 
   * What data should be preserved when switching between modes
   */
  preserveOnTransition: {
    'chat-to-dev': ['conversation_context', 'project_context'],
    'dev-to-chat': ['last_code_reference'],
    'chat-to-image': ['description_context'],
    'image-to-chat': ['generated_images'],
    'any-to-any': ['user_preferences', 'theme_settings']
  },

  /**
   * Required confirmations for mode switches
   * 
   * When these mode transitions occur, user confirmation
   * should be requested before proceeding.
   */
  requireConfirmation: [
    {
      from: 'dev' as ChatMode, 
      to: 'chat' as ChatMode, 
      when: 'unsaved_changes_exist',
      message: 'You have unsaved changes in developer mode. Switch to chat mode anyway?'
    },
    {
      from: 'image' as ChatMode, 
      to: 'chat' as ChatMode, 
      when: 'generation_in_progress',
      message: 'Image generation is still in progress. Switch to chat mode anyway?'
    }
  ]
};

/**
 * Session Archival Rules
 * 
 * Define when and how chat sessions should be archived
 */
export const sessionArchivalRules = {
  /**
   * Thresholds for automatic archival
   */
  archiveThresholds: {
    messageCount: 50,        // Archive when session has more than 50 messages
    inactivityPeriod: 7,     // Archive after 7 days of inactivity
    sessionAgeDays: 30       // Archive sessions older than 30 days
  },

  /**
   * What to preserve when archiving
   */
  archivePreservation: {
    preserveMetadata: true,
    preserveContext: true,
    preserveImages: true,
    preserveCodeChanges: true
  }
};

/**
 * Manual Override Settings
 * 
 * Configure how manual mode overrides work
 */
export const manualOverrideSettings = {
  /**
   * How long a manual override should persist
   */
  persistDuration: {
    navigations: 1,          // Reset after 1 navigation
    timeLimitMinutes: 30,    // Reset after 30 minutes
    sessionEnd: true         // Reset on session end
  },

  /**
   * UI indicators for manual override
   */
  uiIndicators: {
    showOverrideIndicator: true,
    indicatorPosition: 'chat-header',
    showResetOption: true
  }
};

/**
 * Mode-specific behavior configuration
 */
export const modeBehaviorConfig = {
  'chat': {
    allowVoiceInput: true,
    defaultModel: 'gpt-4',
    contextWindow: 'medium',
    autoCompletions: true
  },
  'dev': {
    allowVoiceInput: false,
    defaultModel: 'gpt-4',
    contextWindow: 'large',
    codeCompletion: true,
    livePreview: true,
    fileAccess: true,
    gitIntegration: true
  },
  'image': {
    allowVoiceInput: true,
    defaultModel: 'stability-xl',
    contextWindow: 'small',
    galleryIntegration: true,
    imageEditing: true
  },
  'training': {
    allowVoiceInput: false,
    defaultModel: 'gpt-4',
    contextWindow: 'medium',
    progressTracking: true,
    exerciseGeneration: true
  },
  'search': {
    allowVoiceInput: true,
    defaultModel: 'gpt-4',
    contextWindow: 'small',
    vectorSearch: true,
    documentContext: true
  }
};

/**
 * Example implementation of mode switching logic
 */
export const modeSwitchingExample = `
// Example of how to implement mode switching in a component
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useChatStore } from '@/stores/chat';
import { modeAutoSwitchingRules } from '@/devtools/ai/mode-switching-behavior';

export function useModeAutoSwitching() {
  const router = useRouter();
  const { setCurrentMode, currentMode } = useChatStore();
  
  useEffect(() => {
    // Get the current route path
    const path = router.pathname;
    
    // Check if we have a mode mapping for this route
    for (const [route, mode] of Object.entries(modeAutoSwitchingRules.routeBased)) {
      if (path.startsWith(route) && currentMode !== mode) {
        setCurrentMode(mode);
        break;
      }
    }
  }, [router.pathname, setCurrentMode, currentMode]);
  
  return { currentMode };
}
`;
