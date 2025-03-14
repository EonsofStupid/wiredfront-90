
export interface GithubMetrics {
  remaining: number;
  limit: number;
  resetTime: string;
  lastChecked: string;
}

export interface GitHubSettingsProps {
  githubToken: string;
  onGithubTokenChange: (value: string) => void;
}
