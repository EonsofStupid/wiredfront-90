
export interface UIState {
  theme: 'light' | 'dark' | 'system';
  layout: {
    sidebarExpanded: boolean;
    contentWidth: 'full' | 'contained';
    rightSidebarVisible: boolean;
  };
  project: {
    activeProjectId: string | null;
    projects: Array<{
      id: string;
      name: string;
      description?: string;
      lastModified: Date;
      githubRepoUrl?: string;
      githubRepoOwner?: string;
      githubRepoName?: string;
    }>;
  };
  github: {
    isConnected: boolean;
    username: string | null;
    lastSynced: Date | null;
    repositories?: Array<{
      id: string;
      name: string;
      fullName: string;
      url: string;
      isPrivate: boolean;
    }>;
    apiMetrics?: {
      rateLimit: number;
      remaining: number;
      resetTime: Date;
    };
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'normal' | 'large' | 'xl';
  };
  zIndex: {
    modal: number;
    dropdown: number;
    tooltip: number;
    navbar: number;
    floating: number;
    content: number;
    background: number;
    base: number;
  };
}

export interface UIActions {
  setTheme: (theme: UIState['theme']) => void;
  toggleSidebar: () => void;
  toggleRightSidebar: () => void;
  updateLayout: (updates: Partial<UIState['layout']>) => void;
  updateAccessibility: (updates: Partial<UIState['accessibility']>) => void;
  setActiveProject: (projectId: string) => void;
  addProject: (project: Omit<UIState['project']['projects'][0], 'id'>) => void;
  removeProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Omit<UIState['project']['projects'][0], 'id'>>) => void;
  setGithubStatus: (status: { isConnected: boolean; username: string | null }) => void;
  updateGithubLastSynced: () => void;
  updateGithubRepositories: (repositories: UIState['github']['repositories']) => void;
  updateGithubApiMetrics: (metrics: UIState['github']['apiMetrics']) => void;
  linkProjectToGithub: (projectId: string, repoInfo: { url: string; owner: string; name: string }) => void;
}

export type UIStore = UIState & UIActions;
