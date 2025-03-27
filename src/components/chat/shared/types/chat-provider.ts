
export interface ChatProvider {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isEnabled: boolean;
  models?: string[];
  defaultModel?: string;
  baseUrl?: string;
  requiresAuth?: boolean;
  icon?: string;
  metadata?: Record<string, any>;
}

// Export the ChatProvider type
export type { ChatProvider };
