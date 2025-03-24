
import { create } from "zustand";
import { createInitializationActions } from "./core/initialization";
import { createFeatureActions } from "./features/actions";
import { additionalUIActions, createUIActions } from "./ui/actions";
import { ChatState } from "./types/chat-store-types";

// This file serves as a central export point for the store
export * from "./chatStore";
export * from "./types/chat-store-types";

// Create a combined store creator function for use in chatStore.ts
export const createCombinedStore = (set: any, get: any, store: any) => ({
  ...createInitializationActions(set, get, store),
  ...createFeatureActions(set, get, store),
  ...createUIActions(set, get, store),
  ...additionalUIActions(set, get),
});
