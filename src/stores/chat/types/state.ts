import { FeatureState } from "@/types/chat/features";
import { LayoutSlice } from "../slice/layoutSlice";
import { MessageSlice } from "../slice/messageSlice";
import { ModeSlice } from "../slice/modeSlice";
import { PreferencesSlice } from "../slice/preferencesSlice";
import { SessionSlice } from "../slice/sessionSlice";
import { UISlice } from "../slice/uiSlice";

/**
 * Complete chat state type definition combining all slices
 */
export interface ChatState
  extends FeatureState,
    LayoutSlice,
    MessageSlice,
    ModeSlice,
    PreferencesSlice,
    SessionSlice,
    UISlice {
  // Additional state properties can be added here if needed
}
