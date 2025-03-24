
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UIStore } from '@/types/store/ui';

interface LayoutState {
  sidebarExpanded: boolean;
  rightSidebarVisible: boolean;
}

interface UIExtendedState extends UIStore {
  layout: LayoutState;
  toggleSidebar: () => void;
  toggleRightSidebar: () => void;
}

export const useUIStore = create<UIExtendedState>()(
  devtools(
    persist(
      (set) => ({
        // Core UI state
        version: '1.0.0',
        theme: 'dark',
        sidebarOpen: true,
        activePanel: null,
        
        // Layout state
        layout: {
          sidebarExpanded: true,
          rightSidebarVisible: false,
        },
        
        // Actions
        setTheme: (theme) => set({ theme }),
        toggleSidebar: () => set((state) => ({
          sidebarOpen: !state.sidebarOpen,
          layout: {
            ...state.layout, 
            sidebarExpanded: !state.layout.sidebarExpanded
          }
        })),
        toggleRightSidebar: () => set((state) => ({
          layout: {
            ...state.layout,
            rightSidebarVisible: !state.layout.rightSidebarVisible
          }
        })),
        setActivePanel: (panelId) => set({ activePanel: panelId }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({
          theme: state.theme,
          layout: state.layout,
        }),
      }
    ),
    { name: 'UI Store' }
  )
);
