import { ChatFeatureKey, FeatureState } from "@/types/chat/features";
import { StateCreator } from "zustand";
import { ChatState } from "../types";

const defaultFeatures: Record<ChatFeatureKey, boolean> = {
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
};

export const createFeatureSlice: StateCreator<
  ChatState,
  [],
  [],
  FeatureState
> = (set) => ({
  features: defaultFeatures,

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
