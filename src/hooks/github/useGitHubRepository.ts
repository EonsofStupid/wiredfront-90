import { useGitHubStore } from '@/stores/features/github';

export function useGitHubRepository(repoId: string) {
  const {
    repositories,
    branches,
    commits,
    issues,
    pullRequests,
    isLoading,
    error,
    fetchBranches,
    fetchCommits,
    fetchIssues,
    fetchPullRequests
  } = useGitHubStore();

  const repository = repositories.find(repo => repo.id === repoId);
  const repoBranches = branches[repoId] || [];
  const repoCommits = commits[repoId] || [];
  const repoIssues = issues[repoId] || [];
  const repoPullRequests = pullRequests[repoId] || [];

  return {
    repository,
    branches: repoBranches,
    commits: repoCommits,
    issues: repoIssues,
    pullRequests: repoPullRequests,
    isLoading,
    error,
    fetchBranches: () => fetchBranches(repoId),
    fetchCommits: (branch?: string) => fetchCommits(repoId, branch),
    fetchIssues: () => fetchIssues(repoId),
    fetchPullRequests: () => fetchPullRequests(repoId)
  };
}
