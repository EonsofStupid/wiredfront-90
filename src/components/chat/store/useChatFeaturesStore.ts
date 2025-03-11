
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatFeaturesState {
  features: {
    codeAssistant: boolean;
    ragSupport: boolean;
    githubSync: boolean;
    notifications: boolean;
  };
}

interface ChatFeaturesActions {
  toggleFeature: (feature: keyof ChatFeaturesState['features']) => void;
  resetFeatures: () => void;
}

export const useChatFeaturesStore = create<ChatFeaturesState & ChatFeaturesActions>()(
  persist(
    (set) => ({
      features: {
        codeAssistant: true,
        ragSupport: true,
        githubSync: true,
        notifications: true,
      },
      
      toggleFeature: (feature) => set((state) => ({
        features: {
          ...state.features,
          [feature]: !state.features[feature]
        }
      })),
      
      resetFeatures: () => set({
        features: {
          codeAssistant: true,
          ragSupport: true,
          githubSync: true,
          notifications: true,
        }
      })
    }),
    {
      name: 'chat-features-storage',
      partialize: (state) => ({
        features: state.features,
      }),
      version: 1,
    }
  )
);
