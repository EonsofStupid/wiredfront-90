
import { TokenEnforcementMode } from "@/integrations/supabase/types/enums";
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
  // Token management actions
  addTokens: (amount: number) => void;
  spendTokens: (amount: number) => void;
  setTokenBalance: (balance: number) => void;
  setTokenEnforcementMode: (mode: TokenEnforcementMode) => void;
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

  // Token management actions
  addTokens: (amount) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        balance: state.tokenControl.balance + amount,
      },
    }));
  },

  spendTokens: (amount) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        balance: Math.max(0, state.tokenControl.balance - amount),
        queriesUsed: state.tokenControl.queriesUsed + 1,
      },
    }));
  },

  setTokenBalance: (balance) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        balance,
      },
    }));
  },

  setTokenEnforcementMode: (mode) => {
    set((state) => ({
      tokenControl: {
        ...state.tokenControl,
        enforcementMode: mode,
      },
    }));
  },
});
