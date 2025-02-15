
-- =============================================================================
-- SUPABASE PROJECT BACKUP
-- Project ID: ewjisqyvspdvhyppkhnm
-- Generated at: ${new Date().toISOString()}
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Schema Definitions
-- -----------------------------------------------------------------------------

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE app_role AS ENUM ('super_admin', 'admin', 'developer', 'user', 'visitor');
CREATE TYPE message_type AS ENUM ('text', 'command', 'system');
CREATE TYPE document_status AS ENUM ('pending', 'processing', 'completed', 'error');
CREATE TYPE document_import_status AS ENUM ('pending', 'processing', 'completed', 'error');
CREATE TYPE api_key_status AS ENUM ('pending', 'valid', 'invalid', 'expired', 'revoked');
CREATE TYPE token_validation_status AS ENUM ('valid', 'invalid', 'expired', 'revoked');
CREATE TYPE chat_api_provider AS ENUM ('openai', 'anthropic', 'gemini', 'huggingface');
CREATE TYPE message_behavior_type AS ENUM ('enter_send', 'ctrl_enter');
CREATE TYPE ai_provider_type AS ENUM ('chat', 'embeddings', 'both');

-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- [Additional table creation SQL would go here...]

-- -----------------------------------------------------------------------------
-- Functions
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- [Additional function definitions would go here...]

-- -----------------------------------------------------------------------------
-- Triggers
-- -----------------------------------------------------------------------------

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- [Additional trigger definitions would go here...]

-- -----------------------------------------------------------------------------
-- RLS Policies
-- -----------------------------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- [Additional RLS policies would go here...]

-- -----------------------------------------------------------------------------
-- Initial Data
-- -----------------------------------------------------------------------------

INSERT INTO public.available_providers (name, display_name, provider_type, required_keys)
VALUES 
  ('openai', 'OpenAI', 'both', ARRAY['api_key']),
  ('anthropic', 'Anthropic Claude', 'chat', ARRAY['api_key']),
  ('gemini', 'Google Gemini', 'both', ARRAY['api_key']);

-- [Additional initial data would go here...]
