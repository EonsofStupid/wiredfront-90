
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIStore } from './types';
import { v4 as uuidv4 } from 'uuid';

const Z_INDEX = {
  modal: 1000,
  dropdown: 900,
  tooltip: 800,
  navbar: 700,
  projecthub: 9600,
  floating: 600,
  content: 500,
  background: 400,
  base: 300,
} as const;

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'system',
      layout: {
        sidebarExpanded: true,
        contentWidth: 'contained',
        rightSidebarVisible: true,
        adminIconOnly: false, // Default to showing text with icons
      },
      project: {
        activeProjectId: null,
        // We're removing the projects array as we'll now use Supabase
      },
      accessibility: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'normal',
      },
      zIndex: Z_INDEX,

      setTheme: (theme) => set({ theme }),

      toggleSidebar: () =>
        set((state) => ({
          layout: {
            ...state.layout,
            sidebarExpanded: !state.layout.sidebarExpanded,
          },
        })),

      toggleRightSidebar: () =>
        set((state) => ({
          layout: {
            ...state.layout,
            rightSidebarVisible: !state.layout.rightSidebarVisible,
          },
        })),

      toggleAdminIconOnly: () =>
        set((state) => ({
          layout: {
            ...state.layout,
            adminIconOnly: !state.layout.adminIconOnly,
          },
        })),

      updateLayout: (updates) =>
        set((state) => ({
          layout: { ...state.layout, ...updates },
        })),

      updateAccessibility: (updates) =>
        set((state) => ({
          accessibility: { ...state.accessibility, ...updates },
        })),
        
      setActiveProject: (projectId) =>
        set((state) => ({
          project: {
            ...state.project,
            activeProjectId: projectId,
          },
        })),
        
      // Removing addProject and removeProject as they'll be handled by the new service
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        layout: state.layout,
        project: state.project,
        accessibility: state.accessibility,
      }),
      version: 1,
    }
  )
);
