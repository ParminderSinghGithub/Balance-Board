import { AuthContext } from '../context/AuthContext';

export async function apiFetch(
  url: string,
  options: RequestInit = {},
  authContext: React.ContextType<typeof AuthContext>
) {
  const response = await fetch(url, options);

  // Only logout on authentication errors (401 Unauthorized)
  if (response.status === 401) {
    if (authContext && authContext.logout) {
      authContext.logout();
    }
    throw new Error('Session expired. Please log in again.');
  }

  return response;
}
