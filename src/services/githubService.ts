export async function fetchGitHubStats(repoPath: string) {
  try {
    // repoPath should be like "owner/repo"
    const response = await fetch(`https://api.github.com/repos/${repoPath}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language,
      lastUpdated: data.updated_at
    };
  } catch (error) {
    console.error("GitHub Fetch Error:", error);
    return null;
  }
}
