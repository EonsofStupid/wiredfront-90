
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UIStore } from '@/types/store/ui';

interface LayoutState {
  sidebarExpanded: boolean;
  rightSidebarVisible: boolean;
  adminIconOnly: boolean; // Added missing property
}

interface UIExtendedState extends UIStore {
  layout: LayoutState;
  toggleSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleAdminIconOnly: () => void; // Added missing method
  setActiveProject: (projectId: string) => void; // Added missing method for project management
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
          adminIconOnly: false, // Default value
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
        toggleAdminIconOnly: () => set((state) => ({
          layout: {
            ...state.layout,
            adminIconOnly: !state.layout.adminIconOnly
          }
        })),
        setActiveProject: (projectId) => set(() => ({
          activePanel: 'project',
          activeProjectId: projectId
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
