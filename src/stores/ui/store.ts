
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIStore } from './types';
import { v4 as uuidv4 } from 'uuid';

const Z_INDEX = {
  modal: 1000,
  dropdown: 900,
  tooltip: 800,
  navbar: 700,
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
      },
      project: {
        activeProjectId: null,
        projects: [
          {
            id: '1',
            name: 'Demo Project',
            description: 'A sample project to get started',
            lastModified: new Date(),
          }
        ],
      },
      github: {
        isConnected: false,
        username: null,
        lastSynced: null,
        repositories: [],
        apiMetrics: undefined,
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
        
      addProject: (project) =>
        set((state) => ({
          project: {
            ...state.project,
            projects: [
              ...state.project.projects,
              {
                ...project,
                id: uuidv4(),
              },
            ],
          },
        })),
        
      removeProject: (projectId) =>
        set((state) => ({
          project: {
            ...state.project,
            projects: state.project.projects.filter(p => p.id !== projectId),
            activeProjectId: state.project.activeProjectId === projectId 
              ? (state.project.projects[0]?.id || null) 
              : state.project.activeProjectId,
          },
        })),
        
      updateProject: (projectId, updates) =>
        set((state) => ({
          project: {
            ...state.project,
            projects: state.project.projects.map(project => 
              project.id === projectId 
                ? { ...project, ...updates } 
                : project
            ),
          },
        })),
        
      setGithubStatus: (status) =>
        set((state) => ({
          github: {
            ...state.github,
            isConnected: status.isConnected,
            username: status.username,
            lastSynced: status.isConnected ? new Date() : state.github.lastSynced,
          },
        })),
        
      updateGithubLastSynced: () =>
        set((state) => ({
          github: {
            ...state.github,
            lastSynced: new Date(),
          },
        })),

      updateGithubRepositories: (repositories) =>
        set((state) => ({
          github: {
            ...state.github,
            repositories,
          },
        })),

      updateGithubApiMetrics: (metrics) =>
        set((state) => ({
          github: {
            ...state.github,
            apiMetrics: metrics,
          },
        })),

      linkProjectToGithub: (projectId, repoInfo) =>
        set((state) => ({
          project: {
            ...state.project,
            projects: state.project.projects.map(project => 
              project.id === projectId 
                ? { 
                    ...project, 
                    githubRepoUrl: repoInfo.url,
                    githubRepoOwner: repoInfo.owner,
                    githubRepoName: repoInfo.name
                  } 
                : project
            ),
          },
        })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        layout: state.layout,
        project: state.project,
        github: state.github,
        accessibility: state.accessibility,
      }),
      version: 1,
    }
  )
);
