
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ChatState } from './types';
import { createLayoutSlice } from './slice/layoutSlice';
import { createMessagesSlice } from './slice/messagesSlice';
import { createSessionSlice } from './slice/sessionSlice';
import { createModeSlice } from './slice/modeSlice';
import { createPreferencesSlice } from './slice/preferencesSlice';

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (...a) => ({
        ...createLayoutSlice(...a),
        ...createMessagesSlice(...a),
        ...createSessionSlice(...a),
        ...createModeSlice(...a),
        ...createPreferencesSlice(...a),
      }),
      {
        name: 'chat-storage',
        partialize: (state) => ({
          messages: state.messages,
          uiPreferences: state.uiPreferences,
          theme: state.theme,
          position: state.position,
          scale: state.scale,
          isMinimized: state.isMinimized,
          docked: state.docked,
          showSidebar: state.showSidebar,
          sessions: state.sessions,
          currentSession: state.currentSession
        })
      }
    )
  )
);
