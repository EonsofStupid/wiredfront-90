
/**
 * WiredFront Database Integration
 * 
 * This file defines the database integration patterns, schema, and usage
 * guidelines for the WiredFront application.
 */

/**
 * Core Database Tables
 * 
 * The primary tables that form the foundation of the application
 */
export const coreDatabaseTables = {
  // User Management
  user: {
    profiles: `
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      username TEXT UNIQUE,
      full_name TEXT,
      avatar_url TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      onboarding_status JSONB DEFAULT '{"completed": false, "current_step": null, "steps_completed": []}'::jsonb,
      setup_completed_at TIMESTAMP WITH TIME ZONE
    );
    `,

    userRoles: `
    CREATE TABLE public.user_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      role app_role NOT NULL DEFAULT 'guest'::app_role,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `
  },

  // Chat System
  chat: {
    chatSessions: `
    CREATE TABLE public.chat_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      title TEXT,
      mode chat_mode_type DEFAULT 'chat'::chat_mode_type,
      provider_id UUID,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
      tokens_used INTEGER DEFAULT 0,
      project_id UUID,
      metadata JSONB DEFAULT '{}'::jsonb,
      context JSONB DEFAULT '{}'::jsonb
    );
    `,

    chatMessages: `
    CREATE TABLE public.chat_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES auth.users(id),
      role VARCHAR NOT NULL,
      content TEXT NOT NULL,
      status VARCHAR DEFAULT 'sent'::character varying,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      parent_message_id UUID,
      last_edited TIMESTAMP WITH TIME ZONE,
      position_order INTEGER DEFAULT 0,
      retry_count INTEGER DEFAULT 0,
      last_retry TIMESTAMP WITH TIME ZONE
    );
    `,

    userChatPreferences: `
    CREATE TABLE public.user_chat_preferences (
      user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      theme VARCHAR DEFAULT 'light'::character varying,
      theme_id UUID,
      custom_css TEXT,
      docked_icons JSONB DEFAULT '{}'::jsonb,
      docked_sections JSONB DEFAULT '{}'::jsonb,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `,

    chatUiLayout: `
    CREATE TABLE public.chat_ui_layout (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id),
      layout JSONB DEFAULT '{}'::jsonb,
      docked_items JSONB DEFAULT '{}'::jsonb,
      ui_preferences JSONB DEFAULT '{"theme": "dark", "fontSize": "medium", "notifications": true, "messageBehavior": "enter_send"}'::jsonb,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `
  },

  // Theming System
  theming: {
    themes: `
    CREATE TABLE public.themes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      type theme_type NOT NULL DEFAULT 'light'::theme_type,
      is_default BOOLEAN NOT NULL DEFAULT false,
      is_built_in BOOLEAN NOT NULL DEFAULT false,
      created_by UUID REFERENCES auth.users(id),
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `,

    themeCategories: `
    CREATE TABLE public.theme_categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      parent_id UUID REFERENCES public.theme_categories(id),
      category_type theme_category_type NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `,

    themeTokens: `
    CREATE TABLE public.theme_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      theme_id UUID NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
      category_id UUID REFERENCES public.theme_categories(id),
      token_name TEXT NOT NULL,
      token_value TEXT NOT NULL,
      description TEXT,
      is_css_var BOOLEAN NOT NULL DEFAULT true,
      tailwind_class TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `
  },

  // Projects and RAG
  projects: {
    projects: `
    CREATE TABLE public.projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      user_id UUID REFERENCES auth.users(id),
      status TEXT DEFAULT 'active'::text,
      github_repo TEXT,
      is_active BOOLEAN DEFAULT false,
      auto_index BOOLEAN DEFAULT true,
      sync_frequency TEXT DEFAULT 'on_change'::text,
      indexing_status TEXT,
      rag_provider rag_provider DEFAULT 'openai'::rag_provider,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `,

    projectVectors: `
    CREATE TABLE public.project_vectors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
      vector_data JSONB NOT NULL,
      embedding REAL[] NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `,

    ragChunks: `
    CREATE TABLE public.rag_chunks (
      id UUID PRIMARY KEY,
      project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      source_type TEXT NOT NULL,
      metadata JSONB,
      embedding vector,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `
  },

  // API Configuration
  api: {
    apiConfigurations: `
    CREATE TABLE public.api_configurations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id),
      api_type api_type NOT NULL,
      memorable_name TEXT NOT NULL,
      secret_key_name TEXT,
      is_enabled BOOLEAN DEFAULT true,
      is_active BOOLEAN DEFAULT true,
      provider_type api_provider_type,
      provider_category TEXT,
      supported_features TEXT[],
      category api_category,
      role_assignments JSONB DEFAULT '[]'::jsonb,
      feature_bindings JSONB DEFAULT '[]'::jsonb,
      usage_limits JSONB,
      runtime_settings JSONB DEFAULT '{}'::jsonb,
      provider_settings JSONB,
      usage_metrics JSONB DEFAULT '{}'::jsonb,
      last_validated TIMESTAMP WITH TIME ZONE,
      last_used TIMESTAMP WITH TIME ZONE DEFAULT now(),
      validation_status extended_validation_status DEFAULT 'pending'::extended_validation_status,
      last_error_message TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `
  },

  // Feature Flags
  features: {
    featureFlags: `
    CREATE TABLE public.feature_flags (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      key TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      enabled BOOLEAN DEFAULT false,
      category_id UUID REFERENCES public.feature_flag_categories(id),
      target_roles TEXT[] DEFAULT '{}'::text[],
      target_tiers TEXT[] DEFAULT '{standard,premium}'::text[],
      rollout_percentage INTEGER DEFAULT 100,
      config_schema JSONB DEFAULT '{}'::jsonb,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_by UUID REFERENCES auth.users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    `
  }
};

/**
 * Database Schema Enums
 * 
 * Custom enum types used throughout the database
 */
export const databaseEnums = {
  chatMode: `
  CREATE TYPE chat_mode_type AS ENUM (
    'chat',
    'dev',
    'image',
    'training',
    'search',
    'code'
  );
  `,

  messageRole: `
  CREATE TYPE message_role_type AS ENUM (
    'user',
    'assistant',
    'system',
    'function'
  );
  `,

  apiType: `
  CREATE TYPE api_type AS ENUM (
    'openai',
    'anthropic',
    'google',
    'mistral',
    'cohere',
    'stability',
    'replicate'
  );
  `,

  themeType: `
  CREATE TYPE theme_type AS ENUM (
    'light',
    'dark',
    'system'
  );
  `,

  userRole: `
  CREATE TYPE app_role AS ENUM (
    'super_admin',
    'admin',
    'developer',
    'subscriber',
    'guest'
  );
  `
};

/**
 * Database-Driven Feature Implementation
 * 
 * How to implement features that are driven by database configuration
 */
export const databaseDrivenFeatures = {
  /**
   * Feature Flags Implementation
   */
  featureFlags: {
    loadingPattern: `
    // Example of loading feature flags from database
    import { supabase } from '@/lib/supabase';
    
    export async function loadFeatureFlags(userId) {
      // First get user roles
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
        
      const userRole = roleData?.role || 'guest';
      
      // Then load applicable feature flags
      const { data: flags, error } = await supabase
        .from('feature_flags')
        .select('*')
        .contains('target_roles', [userRole])
        .eq('enabled', true);
        
      if (error) {
        console.error('Error loading feature flags:', error);
        return [];
      }
      
      return flags.reduce((acc, flag) => {
        acc[flag.key] = true;
        return acc;
      }, {});
    }
    `,

    useInCode: `
    // Example of using feature flags in components
    import { useFeatureFlags } from '@/hooks/useFeatureFlags';
    
    function MyComponent() {
      const { flags, isLoading } = useFeatureFlags();
      
      if (isLoading) {
        return <div>Loading...</div>;
      }
      
      return (
        <div>
          {flags.enableNewUI && <NewUIComponent />}
          {!flags.enableNewUI && <LegacyUIComponent />}
          
          {flags.enableVoiceInput && (
            <button>Enable Voice</button>
          )}
        </div>
      );
    }
    `
  },

  /**
   * Theming Implementation
   */
  theming: {
    loadingPattern: `
    // Example of loading theme from database
    import { supabase } from '@/lib/supabase';
    
    export async function loadUserTheme(userId) {
      // First check if user has a preferred theme
      const { data: preferences } = await supabase
        .from('user_chat_preferences')
        .select('theme_id')
        .eq('user_id', userId)
        .single();
        
      // If no preference, load default theme
      const themeId = preferences?.theme_id || null;
      
      const { data: theme } = await supabase
        .from('themes')
        .select('*')
        .eq(themeId ? 'id' : 'is_default', themeId || true)
        .single();
        
      if (!theme) {
        return null;
      }
      
      // Load theme tokens
      const { data: tokens } = await supabase
        .from('theme_tokens')
        .select('token_name, token_value, is_css_var')
        .eq('theme_id', theme.id);
        
      return {
        theme,
        tokens
      };
    }
    `,

    applyingTheme: `
    // Apply theme tokens to CSS variables
    function applyTheme(tokens) {
      const root = document.documentElement;
      
      tokens.forEach(token => {
        if (token.is_css_var) {
          root.style.setProperty(\`--\${token.token_name}\`, token.token_value);
        }
      });
    }
    `
  },

  /**
   * Chat UI Configuration
   */
  chatUiConfiguration: {
    loadingPattern: `
    // Example of loading chat UI configuration
    import { supabase } from '@/lib/supabase';
    
    export async function loadChatUIConfig(userId) {
      const { data, error } = await supabase
        .from('chat_ui_layout')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error loading chat UI config:', error);
        return null;
      }
      
      if (!data) {
        // Create default configuration
        const { data: newConfig, error: insertError } = await supabase
          .from('chat_ui_layout')
          .insert({
            user_id: userId,
            layout: DEFAULT_LAYOUT,
            docked_items: DEFAULT_DOCKED_ITEMS,
            ui_preferences: DEFAULT_UI_PREFERENCES
          })
          .select()
          .single();
          
        if (insertError) {
          console.error('Error creating chat UI config:', insertError);
          return null;
        }
        
        return newConfig;
      }
      
      return data;
    }
    `
  }
};

/**
 * Database Migration and Versioning
 * 
 * Guidelines for handling database migrations and versioning
 */
export const databaseMigration = {
  /**
   * Migration Approaches
   */
  approaches: {
    /**
     * Using Supabase Migrations
     */
    supabaseMigrations: {
      description: 'Using Supabase CLI to manage migrations',
      commands: [
        'supabase migration new add_themes_table',
        'supabase migration up',
        'supabase db diff --schema public'
      ],
      bestPractices: [
        'Keep migrations small and focused',
        'Always include both up and down migrations',
        'Test migrations in development before applying to production',
        'Include descriptive comments'
      ]
    },

    /**
     * Using Database Functions
     */
    databaseFunctions: {
      description: 'Using database functions for versioning and migrations',
      example: `
      -- Create a version table
      CREATE TABLE IF NOT EXISTS public.db_version (
        id SERIAL PRIMARY KEY,
        version TEXT NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        description TEXT
      );
      
      -- Create a migration function
      CREATE OR REPLACE FUNCTION public.migrate_to_version(target_version TEXT)
      RETURNS VOID AS $$
      DECLARE
        current_version TEXT;
      BEGIN
        -- Get current version
        SELECT version INTO current_version FROM public.db_version
        ORDER BY id DESC LIMIT 1;
        
        -- Apply migrations based on current and target versions
        IF current_version IS NULL THEN
          -- Initial setup
          -- ...
          
          INSERT INTO public.db_version (version, description)
          VALUES (target_version, 'Initial setup');
          
        ELSIF current_version = '1.0.0' AND target_version = '1.1.0' THEN
          -- Migrate from 1.0.0 to 1.1.0
          -- ...
          
          INSERT INTO public.db_version (version, description)
          VALUES (target_version, 'Added theme tables');
          
        ELSIF current_version = '1.1.0' AND target_version = '1.2.0' THEN
          -- Migrate from 1.1.0 to 1.2.0
          -- ...
          
          INSERT INTO public.db_version (version, description)
          VALUES (target_version, 'Added feature flag tables');
          
        END IF;
      END;
      $$ LANGUAGE plpgsql;
      `
    }
  }
};

/**
 * Row-Level Security (RLS) Policies
 * 
 * Guidelines and examples for RLS policies
 */
export const rowLevelSecurity = {
  /**
   * Common RLS Patterns
   */
  commonPatterns: {
    /**
     * User Ownership
     */
    userOwnership: {
      description: 'Restrict access to user\'s own data',
      example: `
      -- Enable RLS on the table
      ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
      
      -- Create policy for select operations
      CREATE POLICY projects_select_policy
        ON public.projects
        FOR SELECT
        USING (auth.uid() = user_id);
        
      -- Create policy for insert operations
      CREATE POLICY projects_insert_policy
        ON public.projects
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
        
      -- Create policy for update operations
      CREATE POLICY projects_update_policy
        ON public.projects
        FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
        
      -- Create policy for delete operations
      CREATE POLICY projects_delete_policy
        ON public.projects
        FOR DELETE
        USING (auth.uid() = user_id);
      `
    },

    /**
     * Role-Based Access
     */
    roleBasedAccess: {
      description: 'Restrict access based on user role',
      example: `
      -- Function to check if user has a specific role
      CREATE OR REPLACE FUNCTION public.has_role(role_name text)
      RETURNS BOOLEAN AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1
          FROM public.user_roles
          WHERE user_id = auth.uid()
          AND role = role_name::app_role
        );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      
      -- Policy for admin access
      CREATE POLICY admin_access_policy
        ON public.api_configurations
        FOR ALL
        USING (
          has_role('admin') OR has_role('super_admin')
        );
      
      -- Policy for regular users
      CREATE POLICY user_access_policy
        ON public.api_configurations
        FOR SELECT
        USING (
          auth.uid() = user_id
        );
      `
    },

    /**
     * Record-Level Permissions
     */
    recordLevelPermissions: {
      description: 'Permission checks based on record data',
      example: `
      -- Policy for shared items
      CREATE POLICY shared_access_policy
        ON public.shared_items
        FOR SELECT
        USING (
          auth.uid() = owner_id
          OR
          auth.uid() = ANY(shared_with)
          OR
          is_public = true
        );
      `
    }
  },

  /**
   * Database Functions for Permissions
   */
  permissionFunctions: {
    /**
     * Check if user has permission
     */
    hasPermission: {
      description: 'Check if user has a specific permission',
      implementation: `
      CREATE OR REPLACE FUNCTION public.user_has_permission(permission_key text)
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $function$
      BEGIN
        RETURN EXISTS (
          SELECT 1
          FROM public.user_roles ur
          JOIN public.role_permissions rp ON ur.role = rp.role
          JOIN public.permissions p ON rp.permission_id = p.id
          WHERE ur.user_id = auth.uid()
          AND p.key = permission_key
        );
      END;
      $function$;
      `
    },

    /**
     * Check if user is super admin
     */
    isSuperAdmin: {
      description: 'Check if user is a super admin',
      implementation: `
      CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid)
      RETURNS boolean
      LANGUAGE sql
      STABLE SECURITY DEFINER
      SET search_path TO 'public'
      AS $function$
        SELECT EXISTS (
          SELECT 1
          FROM user_roles
          WHERE user_roles.user_id = $1
          AND role = 'super_admin'::app_role
        );
      $function$;
      `
    }
  }
};
