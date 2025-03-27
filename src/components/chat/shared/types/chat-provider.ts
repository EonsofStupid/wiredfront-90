
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
  category?: string; // 'chat', 'image', etc.
  metadata?: Record<string, any>;
}

// Export the ChatProvider type
export type { ChatProvider };
