const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function getGithubAuthUrl() {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  if (!clientId) return "";

  const redirectUri = `${API_BASE_URL}/auth/github/callback`;
  const url = new URL("https://github.com/login/oauth/authorize");

  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "read:user user:email");

  return url.toString();
}
