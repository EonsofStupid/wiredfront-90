
/**
 * WiredFront CSS Isolation Guidelines
 * 
 * This file defines the guidelines for CSS isolation, particularly
 * for the Chat component which requires strict isolation to prevent
 * style conflicts with the host application.
 */

export const cssIsolationGuidelines = {
  /**
   * Chat Component CSS Isolation
   * 
   * The Chat component uses nested CSS with specific rules to
   * ensure complete isolation from the host application styles.
   */
  chat: {
    /**
     * CSS Variables Approach
     * 
     * All styles use CSS variables that are scoped to the chat container
     */
    cssVariables: {
      scope: '.chat-container',
      prefix: '--chat-',
      required: [
        '--chat-bg-color',
        '--chat-text-color',
        '--chat-accent-color',
        '--chat-border-color',
        '--chat-input-bg-color'
      ],
      fallbacks: true
    },

    /**
     * CSS Selector Nesting
     * 
     * All selectors are nested under the chat container to prevent leakage
     */
    selectorNesting: {
      rootSelector: '.chat-container',
      pattern: 'always-nested',
      example: `
      .chat-container {
        /* Base styles */
        
        .chat-header {
          /* Header styles */
        }
        
        .chat-messages {
          /* Messages container styles */
          
          .chat-message {
            /* Individual message styles */
          }
        }
      }
      `
    },

    /**
     * CSS Files Organization
     * 
     * How CSS files should be organized and imported
     */
    fileOrganization: {
      root: '/src/components/chat/styles/',
      files: [
        'chat-variables.css',    // CSS variables definitions
        'container.css',         // Chat container styles
        'header.css',            // Chat header styles
        'messages.css',          // Chat messages styles
        'input.css',             // Chat input styles
        'theme.css',             // Theme-specific overrides
        'animations.css'         // Animations and transitions
      ],
      importPattern: `
      import './styles/chat-variables.css';
      import './styles/container.css';
      // Additional imports as needed
      `
    },

    /**
     * CSS Naming Conventions
     * 
     * Naming conventions for CSS classes
     */
    namingConventions: {
      prefix: 'chat-',
      pattern: 'chat-[component]-[element]',
      examples: [
        'chat-container',
        'chat-header',
        'chat-messages',
        'chat-message',
        'chat-message-user',
        'chat-message-assistant',
        'chat-input',
        'chat-button'
      ]
    },

    /**
     * Shadow DOM Usage
     * 
     * When to use Shadow DOM for more robust isolation
     */
    shadowDOM: {
      enabled: false,
      whenToUse: 'When target environment does not support CSS nesting or when complete isolation is critical',
      implementation: `
      class ChatComponent extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
          this.shadowRoot.innerHTML = \`
            <style>
              /* Completely isolated styles */
            </style>
            <div class="chat-container">
              <!-- Chat component HTML -->
            </div>
          \`;
        }
      }
      `
    }
  },

  /**
   * CSS Isolation Testing
   * 
   * Approaches to test CSS isolation
   */
  testing: {
    manualApproach: [
      'Embed the chat in different contexts',
      'Apply drastic styles to the parent application',
      'Verify chat styles remain consistent',
      'Test with different themes'
    ],
    automatedApproach: [
      'Use visual regression testing',
      'Compare screenshots with baselines',
      'Test with different parent application styles'
    ]
  }
};

/**
 * Database-Driven Theming
 * 
 * Guidelines for implementing database-driven theming
 */
export const databaseDrivenTheming = {
  /**
   * Theme Tokens Table Structure
   */
  themeTokensTable: {
    structure: `
    CREATE TABLE public.theme_tokens (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      theme_id UUID REFERENCES public.themes(id),
      category_id UUID REFERENCES public.theme_categories(id),
      token_name TEXT NOT NULL,
      token_value TEXT NOT NULL,
      is_css_var BOOLEAN NOT NULL DEFAULT true,
      description TEXT,
      tailwind_class TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `,
    tokenNaming: 'Must match CSS variable names without the "--" prefix',
    exampleTokens: [
      {
        name: 'chat-bg-color',
        value: '#1a1b26',
        is_css_var: true,
        description: 'Chat background color',
        tailwind_class: 'bg-dark'
      },
      {
        name: 'chat-text-color',
        value: '#c0caf5',
        is_css_var: true,
        description: 'Chat text color',
        tailwind_class: 'text-light'
      }
    ]
  },

  /**
   * Theme Categories Table Structure
   */
  themeCategoriesTable: {
    structure: `
    CREATE TABLE public.theme_categories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      parent_id UUID REFERENCES public.theme_categories(id),
      category_type THEME_CATEGORY_TYPE NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `,
    exampleCategories: [
      {
        name: 'Chat Colors',
        description: 'Color tokens for chat components',
        category_type: 'color'
      },
      {
        name: 'Chat Spacing',
        description: 'Spacing tokens for chat layout',
        category_type: 'spacing'
      }
    ]
  },

  /**
   * Themes Table Structure
   */
  themesTable: {
    structure: `
    CREATE TABLE public.themes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      type THEME_TYPE NOT NULL DEFAULT 'light',
      is_default BOOLEAN NOT NULL DEFAULT false,
      is_built_in BOOLEAN NOT NULL DEFAULT false,
      created_by UUID REFERENCES auth.users(id),
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `,
    exampleThemes: [
      {
        name: 'Tokyo Night',
        description: 'Dark cyberpunk-inspired theme',
        type: 'dark',
        is_default: true,
        is_built_in: true
      },
      {
        name: 'Light Mode',
        description: 'Standard light theme',
        type: 'light',
        is_default: false,
        is_built_in: true
      }
    ]
  },

  /**
   * Theme Loading Process
   */
  themeLoadingProcess: `
  // Example of loading theme from database
  import { supabase } from '@/lib/supabase';
  
  async function loadThemeTokens(themeId) {
    const { data, error } = await supabase
      .from('theme_tokens')
      .select('token_name, token_value, is_css_var')
      .eq('theme_id', themeId);
      
    if (error) {
      console.error('Error loading theme tokens:', error);
      return null;
    }
    
    return data;
  }
  
  function applyThemeTokens(tokens) {
    const root = document.documentElement;
    
    tokens.forEach(token => {
      if (token.is_css_var) {
        root.style.setProperty(\`--\${token.token_name}\`, token.token_value);
      }
    });
  }
  
  // Usage
  async function applyTheme(themeId) {
    const tokens = await loadThemeTokens(themeId);
    if (tokens) {
      applyThemeTokens(tokens);
    }
  }
  `
};
