// Base GitHub Types
export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
  email?: string;
  bio?: string;
  type: 'User' | 'Organization';
  company?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: string;
  name: string;
  description?: string;
  html_url: string;
  clone_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language?: string;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  visibility: 'public' | 'private';
  owner: GitHubUser;
  is_fork: boolean;
  is_archived: boolean;
  is_disabled: boolean;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  has_discussions: boolean;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection?: {
    enabled: boolean;
    required_status_checks?: {
      enforcement_level: string;
      contexts: string[];
    };
  };
}

export interface GitHubCommit {
  sha: string;
  node_id: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
  };
  url: string;
  html_url: string;
  comments_url: string;
  author: GitHubUser;
  committer: GitHubUser;
  parents: Array<{
    sha: string;
    url: string;
    html_url: string;
  }>;
}

export interface GitHubIssue {
  id: string;
  node_id: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
  locked: boolean;
  user: GitHubUser;
  body?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  html_url: string;
  url: string;
  labels: Array<{
    id: string;
    node_id: string;
    url: string;
    name: string;
    description?: string;
    color: string;
    default: boolean;
  }>;
  assignees: GitHubUser[];
  milestone?: {
    id: string;
    node_id: string;
    number: number;
    title: string;
    description?: string;
    state: 'open' | 'closed';
    created_at: string;
    updated_at: string;
    closed_at?: string;
    due_on?: string;
  };
}

export interface GitHubPullRequest {
  id: string;
  node_id: string;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  locked: boolean;
  user: GitHubUser;
  body?: string;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  merged_at?: string;
  html_url: string;
  url: string;
  base: {
    label: string;
    ref: string;
    sha: string;
    user: GitHubUser;
    repo: GitHubRepository;
  };
  head: {
    label: string;
    ref: string;
    sha: string;
    user: GitHubUser;
    repo: GitHubRepository;
  };
  merged: boolean;
  mergeable: boolean;
  mergeable_state: 'clean' | 'dirty' | 'unknown' | 'blocked' | 'behind' | 'unstable';
  merged_by?: GitHubUser;
  comments: number;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

// Store State Types
export interface GitHubState {
  // Connection State
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  // User Data
  currentUser: GitHubUser | null;
  linkedAccounts: Array<{
    id: string;
    username: string;
    default: boolean;
  }>;

  // Repository Data
  repositories: GitHubRepository[];
  selectedRepository: GitHubRepository | null;
  branches: Record<string, GitHubBranch[]>;
  commits: Record<string, GitHubCommit[]>;
  issues: Record<string, GitHubIssue[]>;
  pullRequests: Record<string, GitHubPullRequest[]>;

  // Sync State
  syncStatus: Record<string, {
    status: 'idle' | 'syncing' | 'success' | 'error';
    lastSynced: string | null;
    error: string | null;
  }>;

  // UI State
  showImportModal: boolean;
  showProfileDialog: boolean;
  showConnectDialog: boolean;
  showDisconnectDialog: boolean;
  showAccountSwitcher: boolean;
}

// Store Actions
export interface GitHubActions {
  // Connection Actions
  connect: () => Promise<void>;
  disconnect: (accountId?: string) => Promise<void>;
  setDefaultAccount: (accountId: string) => Promise<void>;
  checkConnection: () => Promise<void>;

  // Repository Actions
  fetchRepositories: () => Promise<void>;
  selectRepository: (repoId: string) => void;
  syncRepository: (repoId: string) => Promise<void>;
  toggleAutoSync: (repoId: string, enabled: boolean) => Promise<void>;

  // Data Actions
  fetchBranches: (repoId: string) => Promise<void>;
  fetchCommits: (repoId: string, branch?: string) => Promise<void>;
  fetchIssues: (repoId: string) => Promise<void>;
  fetchPullRequests: (repoId: string) => Promise<void>;

  // UI Actions
  setShowImportModal: (show: boolean) => void;
  setShowProfileDialog: (show: boolean) => void;
  setShowConnectDialog: (show: boolean) => void;
  setShowDisconnectDialog: (show: boolean) => void;
  setShowAccountSwitcher: (show: boolean) => void;

  // Error Handling
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  reset: () => void;
}
