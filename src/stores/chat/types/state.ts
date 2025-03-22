import { CoreSlice } from "../slice/coreSlice";
import { FeatureSlice } from "../slice/featureSlice";
import { LayoutSlice } from "../slice/layoutSlice";
import { MessageSlice } from "../slice/messageSlice";
import { ModeSlice } from "../slice/modeSlice";
import { PreferencesSlice } from "../slice/preferencesSlice";
import { SessionSlice } from "../slice/sessionSlice";
import { UISlice } from "../slice/uiSlice";

/**
 * Complete chat state type definition combining all slices
 */
export type ChatState = CoreSlice &
  MessageSlice &
  SessionSlice &
  ModeSlice &
  PreferencesSlice &
  LayoutSlice &
  FeatureSlice &
  UISlice;
