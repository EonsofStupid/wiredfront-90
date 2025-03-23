import { StateCreator } from "zustand";
import { ChatState } from "../types/chat-store-types";

interface FeatureActions {
  toggleFeature: (feature: keyof ChatState["features"]) => void;
  enableFeature: (feature: keyof ChatState["features"]) => void;
  disableFeature: (feature: keyof ChatState["features"]) => void;
  setFeatureState: (
    feature: keyof ChatState["features"],
    state: boolean
  ) => void;
}

type FeatureStore = ChatState & FeatureActions;
type FeatureSlice = Pick<FeatureStore, keyof FeatureActions>;

export const createFeatureActions: StateCreator<
  FeatureStore,
  [],
  [],
  FeatureSlice
> = (set, get, store) => ({
  toggleFeature: (feature) => {
    set({
      features: {
        ...get().features,
        [feature]: !get().features[feature],
      },
    });
  },

  enableFeature: (feature) => {
    set({
      features: {
        ...get().features,
        [feature]: true,
      },
    });
  },

  disableFeature: (feature) => {
    set({
      features: {
        ...get().features,
        [feature]: false,
      },
    });
  },

  setFeatureState: (feature, state) => {
    set({
      features: {
        ...get().features,
        [feature]: state,
      },
    });
  },
});
