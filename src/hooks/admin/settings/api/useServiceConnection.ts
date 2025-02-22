import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useMessageStore } from '@/components/chat/messaging/MessageManager';
import { useSessionManager } from "@/hooks/useSessionManager";
import { toast } from "sonner";
import { MessageMetadata } from '@/components/settings/api/types';
