
-- Create a table for system logs
CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  level TEXT NOT NULL,
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id)
);

-- Create index on timestamp for faster queries
CREATE INDEX IF NOT EXISTS system_logs_timestamp_idx ON public.system_logs (timestamp DESC);

-- Create index on level for filtering
CREATE INDEX IF NOT EXISTS system_logs_level_idx ON public.system_logs (level);

-- Create index on source for filtering
CREATE INDEX IF NOT EXISTS system_logs_source_idx ON public.system_logs (source);

-- Enable RLS
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Admin users can view all logs
CREATE POLICY "Admins can view all logs" 
ON public.system_logs
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = auth.users.id AND auth.users.is_super_admin = true
  )
);

-- Users can view their own logs
CREATE POLICY "Users can view their own logs" 
ON public.system_logs
FOR SELECT 
USING (
  user_id = auth.uid() OR user_id IS NULL
);

-- Comment explaining how to use this table
COMMENT ON TABLE public.system_logs IS 'System-wide logging table for tracking events, errors, and actions across the application';
