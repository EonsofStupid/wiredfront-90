import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UIState, UIActions } from './types';

const initialState: UIState = {
  theme: 'dark',
  layout: {
    sidebarExpanded: true,
    contentWidth: 'contained',
    rightSidebarVisible: false,
    adminIconOnly: false
  },
  project: {
    activeProjectId: null
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'normal'
  },
  zIndex: {
    modal: 1000,
    dropdown: 900,
    tooltip: 800,
    navbar: 700,
    projecthub: 600,
    floating: 500,
    content: 400,
    background: 300,
    base: 100
  }
};

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    (set) => ({
      ...initialState,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({
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
      updateLayout: (updates) => set((state) => ({
        layout: {
          ...state.layout,
          ...updates
        }
      })),
      updateAccessibility: (updates) => set((state) => ({
        accessibility: {
          ...state.accessibility,
          ...updates
        }
      })),
      setActiveProject: (projectId) => set({
        project: {
          activeProjectId: projectId
        }
      })
    }),
    { name: 'UIStore' }
  )
);
