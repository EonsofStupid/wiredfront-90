import { ChatFeatureKey, FeatureState } from "@/types/chat/features";
import { StateCreator } from "zustand";
import { ChatState } from "../types/state";

export type FeatureSlice = FeatureState;

export const createFeatureSlice: StateCreator<
  ChatState,
  [],
  [],
  FeatureState
> = (set) => ({
  // Default state
  features: {
    enableCodeCompletion: true,
    enableCodeExplanation: true,
    enableCodeGeneration: true,
    enableCodeReview: true,
    enableCodeSearch: true,
    enableDocumentation: true,
    enableErrorAnalysis: true,
    enableRefactoring: true,
    enableTesting: true,
    enableTranslation: true,
  },

  // Actions
  toggleFeature: (key: ChatFeatureKey) =>
    set((state) => ({
      features: {
        ...state.features,
        [key]: !state.features[key],
      },
    })),

  enableFeature: (key: ChatFeatureKey) =>
    set((state) => ({
      features: {
        ...state.features,
        [key]: true,
      },
    })),

  disableFeature: (key: ChatFeatureKey) =>
    set((state) => ({
      features: {
        ...state.features,
        [key]: false,
      },
    })),

  setFeatureState: (key: ChatFeatureKey, enabled: boolean) =>
    set((state) => ({
      features: {
        ...state.features,
        [key]: enabled,
      },
    })),
});
