
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChatFeatureKey, ChatFeatureStore, ChatFeatureState, ChatFeatureActions } from '@/types/features';

/**
 * Default chat feature state
 */
const defaultChatFeatures: Record<ChatFeatureKey, boolean> = {
  voice: false,
  rag: true,
  modeSwitch: true,
  notifications: true,
  codeAssistant: true,
  ragSupport: true,
  knowledgeBase: false,
  standardChat: true,
  imageGeneration: true,
  training: false,
  multiFile: true
};

/**
 * Chat feature store implementation
 */
export const useChatFeatures = create<ChatFeatureStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        features: { ...defaultChatFeatures },
        config: {},
        isInitialized: false,

        // Actions
        toggleFeature: (key: ChatFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: !state.features[key]
            }
          }));
        },
        
        enableFeature: (key: ChatFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: true
            }
          }));
        },
        
        disableFeature: (key: ChatFeatureKey) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: false
            }
          }));
        },
        
        setFeatureState: (key: ChatFeatureKey, enabled: boolean) => {
          set((state) => ({
            features: {
              ...state.features,
              [key]: enabled
            }
          }));
        },
        
        setFeatureConfig: (key: ChatFeatureKey, config: any) => {
          set((state) => ({
            config: {
              ...state.config,
              [key]: config
            }
          }));
        },
        
        resetFeatures: () => {
          set({
            features: { ...defaultChatFeatures }
          });
        },
        
        initialize: async () => {
          try {
            // In a real app, we might fetch features from an API
            console.log('Initializing chat features');
            
            // For now just mark as initialized
            set({ isInitialized: true });
            return Promise.resolve();
          } catch (error) {
            console.error('Failed to initialize chat features:', error);
            return Promise.reject(error);
          }
        }
      }),
      {
        name: 'chat-features',
        partialize: (state) => ({ features: state.features, config: state.config })
      }
    )
  )
);

/**
 * Hook to access a single chat feature
 */
export const useChatFeature = (featureKey: ChatFeatureKey) => {
  const store = useChatFeatures();
  const enabled = store.features[featureKey];
  
  return {
    enabled,
    toggle: () => store.toggleFeature(featureKey),
    enable: () => store.enableFeature(featureKey),
    disable: () => store.disableFeature(featureKey)
  };
};
