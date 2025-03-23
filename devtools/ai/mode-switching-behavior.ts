
/**
 * WiredFront Mode Switching Behavior
 * 
 * This file defines the rules and behavior for switching between different
 * application modes in the WiredFront application.
 */

import { ChatMode } from '../src/integrations/supabase/types/enums';

export const modeSwitchingBehavior = {
  /**
   * Available Chat Modes
   * 
   * Based on the ChatMode enum in the application
   */
  availableModes: {
    chat: 'Standard conversational mode',
    search: 'RAG-enabled search mode with project context',
    dev: 'Developer assistance mode with code context',
    training: 'Educational mode with guided learning',
    image: 'Image generation and editing mode',
    settings: 'Configuration mode for chat settings'
  } as Record<ChatMode, string>,
  
  /**
   * Auto-Switching Rules
   * 
   * Rules for automatically switching modes based on context
   */
  autoSwitchingRules: {
    routeBased: {
      '/': 'chat',                      // Home page
      '/editor': 'dev',                 // Editor page
      '/projects': 'search',            // Projects page
      '/training': 'training',          // Training page
      '/settings': 'settings',          // Settings page
      '/documents': 'search'            // Documents page
    },
    
    contentBased: {
      'codeContext': 'dev',             // When code is in context
      'imagePrompt': 'image',           // When image generation is needed
      'searchQuery': 'search',          // When search syntax is detected
      'configCommand': 'settings'       // When configuration commands are used
    }
  },
  
  /**
   * Manual Override Logic
   * 
   * How to handle manual mode switching by the user
   */
  manualOverride: {
    persistence: 'session',             // How long to persist manual selection
    overridePriority: 'user',           // User override takes precedence
    resetTriggers: [
      'page navigation',                // Reset on page change
      'session timeout',                // Reset after inactive period
      'explicit reset'                  // Reset on user-triggered reset
    ]
  },
  
  /**
   * Mode Switching Implementation
   * 
   * How mode switching is implemented in the codebase
   */
  implementation: {
    storeAction: 'setCurrentMode',       // Action name in the store
    
    example: `
      // In mode switching component
      import { useChatStore } from '@/components/chat/store';
      
      function ModeSwitcher() {
        const { currentMode, setCurrentMode } = useChatStore();
        
        const handleModeChange = (newMode: ChatMode) => {
          setCurrentMode(newMode);
          // Additional side effects on mode change
        };
        
        return (
          <div>
            {/* Mode selection UI */}
          </div>
        );
      }
    `
  },
  
  /**
   * Session Archival
   * 
   * Rules for archiving sessions during mode switches
   */
  sessionArchival: {
    thresholds: {
      messageCount: 20,               // Archive after 20 messages
      inactivityPeriod: 30 * 60 * 1000, // 30 minutes of inactivity
      modeSwitch: true                 // Archive on mode switch
    },
    
    archiveActions: [
      'Save to database',              // Persist to backend
      'Clear from active memory',      // Remove from active state
      'Make available in history'      // Show in session history
    ],
    
    implementation: `
      // Session archival implementation
      export async function archiveSession(sessionId: string) {
        try {
          // Update session status in database
          await supabase
            .from('chat_sessions')
            .update({ is_archived: true })
            .eq('id', sessionId);
          
          // Clear from active store
          useChatStore.getState().resetChatState();
          
          return true;
        } catch (error) {
          console.error('Failed to archive session:', error);
          return false;
        }
      }
    `
  },
  
  /**
   * Mode-Specific Features
   * 
   * Features enabled for each mode
   */
  modeFeatures: {
    chat: ['voice', 'notifications', 'rag'],
    search: ['rag', 'github', 'codeAssistant', 'ragSupport'],
    dev: ['github', 'codeAssistant', 'ragSupport', 'githubSync', 'tokenEnforcement'],
    training: ['voice', 'rag', 'modeSwitch', 'notifications'],
    image: ['voice', 'notifications'],
    settings: ['modeSwitch']
  },
  
  /**
   * Mode Switching Events
   * 
   * Events triggered during mode switching
   */
  events: {
    beforeModeSwitch: [
      'Save current session state',
      'Check for unsaved changes',
      'Confirm with user if necessary'
    ],
    
    afterModeSwitch: [
      'Initialize new mode resources',
      'Update UI components',
      'Adjust feature availability',
      'Log mode change analytics'
    ]
  }
};
