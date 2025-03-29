
-- Add domain column to feature_flags table
ALTER TABLE IF EXISTS public.feature_flags
ADD COLUMN IF NOT EXISTS domain VARCHAR DEFAULT 'app' NOT NULL;

-- Create an index on the domain column
CREATE INDEX IF NOT EXISTS idx_feature_flags_domain ON public.feature_flags(domain);

-- Update existing records to categorize them
-- Set all admin-related flags
UPDATE public.feature_flags
SET domain = 'admin'
WHERE key IN (
  'advancedMetrics',
  'userManagement',
  'apiKeyManagement',
  'systemSettings',
  'featureFlagsManagement',
  'tokenManagement',
  'ragConfiguration',
  'modelProviders',
  'billingManagement',
  'auditLogs'
);

-- Set all chat-related flags
UPDATE public.feature_flags
SET domain = 'chat'
WHERE key IN (
  'voice',
  'rag',
  'modeSwitch',
  'notifications',
  'codeAssistant',
  'ragSupport',
  'knowledgeBase',
  'standardChat',
  'imageGeneration',
  'training',
  'multiFile'
);

-- Set all beta-related flags
UPDATE public.feature_flags
SET domain = 'beta'
WHERE key IN (
  'experimentalModels',
  'performance',
  'debugMode',
  'experimentalUi',
  'betaRag',
  'localModelSupport',
  'experimentalTools',
  'testingMode'
);

-- Add domain column to feature_toggle_history table
ALTER TABLE IF EXISTS public.feature_toggle_history 
ADD COLUMN IF NOT EXISTS domain VARCHAR DEFAULT 'app' NOT NULL;

-- Create a database function to ensure domains are valid
CREATE OR REPLACE FUNCTION enforce_valid_feature_domain()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT (NEW.domain IN ('app', 'chat', 'admin', 'beta')) THEN
        RAISE EXCEPTION 'Invalid feature domain: %. Must be app, chat, admin, or beta', NEW.domain;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce valid domains
DROP TRIGGER IF EXISTS check_feature_domain ON public.feature_flags;
CREATE TRIGGER check_feature_domain
BEFORE INSERT OR UPDATE ON public.feature_flags
FOR EACH ROW EXECUTE FUNCTION enforce_valid_feature_domain();

-- Create trigger to enforce valid domains in history
DROP TRIGGER IF EXISTS check_feature_history_domain ON public.feature_toggle_history;
CREATE TRIGGER check_feature_history_domain
BEFORE INSERT OR UPDATE ON public.feature_toggle_history
FOR EACH ROW EXECUTE FUNCTION enforce_valid_feature_domain();
