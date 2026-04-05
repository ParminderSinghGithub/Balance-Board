const DEFAULT_PRODUCTION_API_URL = 'https://backend-production-6d4c.up.railway.app';

export function getApiBaseUrl() {
  const configuredUrl = process.env.REACT_APP_API_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  if (typeof window !== 'undefined') {
    const isLocalDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocalDevelopment ? 'http://localhost:8000' : DEFAULT_PRODUCTION_API_URL;
  }

  return DEFAULT_PRODUCTION_API_URL;
}