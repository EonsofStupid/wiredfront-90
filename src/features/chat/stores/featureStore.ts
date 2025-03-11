
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatFeatures, ChatProviderInfo } from '../types';

interface ChatFeatureState {
  features: ChatFeatures;
  providers: {
    currentProvider: string;
    availableProviders: ChatProviderInfo[];
  };
}

interface ChatFeatureStore extends ChatFeatureState {
  toggleFeature: (feature: keyof ChatFeatures) => void;
  setCurrentProvider: (providerId: string) => void;
  toggleProviderEnabled: (providerId: string) => void;
}

export const useChatFeatureStore = create<ChatFeatureStore>()(
  persist(
    (set) => ({
      features: {
        codeAssistant: true,
        ragSupport: true,
        githubSync: true,
        notifications: true,
        voiceInput: true,
        voiceOutput: false
      },
      providers: {
        currentProvider: 'openai',
        availableProviders: [
          { id: '1', type: 'openai', name: 'OpenAI', isEnabled: true },
          { id: '2', type: 'anthropic', name: 'Claude', isEnabled: false },
          { id: '3', type: 'gemini', name: 'Gemini', isEnabled: false }
        ]
      },
      
      toggleFeature: (feature) => set((state) => ({
        features: {
          ...state.features,
          [feature]: !state.features[feature]
        }
      })),
      
      setCurrentProvider: (providerId) => set((state) => {
        const provider = state.providers.availableProviders.find(p => p.id === providerId);
        if (provider && provider.isEnabled) {
          return {
            providers: {
              ...state.providers,
              currentProvider: provider.id
            }
          };
        }
        return state;
      }),
      
      toggleProviderEnabled: (providerId) => set((state) => ({
        providers: {
          ...state.providers,
          availableProviders: state.providers.availableProviders.map(provider =>
            provider.id === providerId 
              ? { ...provider, isEnabled: !provider.isEnabled }
              : provider
          )
        }
      }))
    }),
    {
      name: 'chat-features-storage',
      partialize: (state) => ({
        features: state.features,
        providers: state.providers,
      }),
    }
  )
);
