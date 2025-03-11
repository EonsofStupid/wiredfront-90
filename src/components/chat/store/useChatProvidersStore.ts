
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatProviderType } from '@/types/admin/settings/chat-provider';

interface ChatProvidersState {
  currentProvider: ChatProviderType;
  availableProviders: {
    id: string;
    type: ChatProviderType;
    name: string;
    isEnabled: boolean;
  }[];
  isProviderConfigured: boolean;
}

interface ChatProvidersActions {
  setCurrentProvider: (providerId: string) => void;
  toggleProviderEnabled: (providerId: string) => void;
  setProviderConfigured: (isConfigured: boolean) => void;
  checkProviderStatus: () => Promise<boolean>;
}

export const useChatProvidersStore = create<ChatProvidersState & ChatProvidersActions>()(
  persist(
    (set, get) => ({
      currentProvider: 'openai',
      availableProviders: [
        { id: '1', type: 'openai', name: 'OpenAI', isEnabled: true },
        { id: '2', type: 'anthropic', name: 'Claude', isEnabled: false },
        { id: '3', type: 'gemini', name: 'Gemini', isEnabled: false }
      ],
      isProviderConfigured: false,
      
      setCurrentProvider: (providerId) => set((state) => {
        const provider = state.availableProviders.find(p => p.id === providerId);
        if (provider && provider.isEnabled) {
          return {
            currentProvider: provider.type
          };
        }
        return state;
      }),
      
      toggleProviderEnabled: (providerId) => set((state) => ({
        availableProviders: state.availableProviders.map(provider =>
          provider.id === providerId 
            ? { ...provider, isEnabled: !provider.isEnabled }
            : provider
        )
      })),
      
      setProviderConfigured: (isConfigured) => set({
        isProviderConfigured
      }),
      
      checkProviderStatus: async () => {
        try {
          // Check if any API providers are configured
          const { data, error } = await supabase
            .from('api_keys')
            .select('api_type')
            .in('api_type', ['openai', 'anthropic', 'gemini'])
            .limit(1);
            
          const isConfigured = !!data && data.length > 0;
          set({ isProviderConfigured: isConfigured });
          return isConfigured;
        } catch (error) {
          console.error('Error checking provider status:', error);
          set({ isProviderConfigured: false });
          return false;
        }
      }
    }),
    {
      name: 'chat-providers-storage',
      partialize: (state) => ({
        currentProvider: state.currentProvider,
        availableProviders: state.availableProviders,
        isProviderConfigured: state.isProviderConfigured,
      }),
      version: 1,
    }
  )
);
