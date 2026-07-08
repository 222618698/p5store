import axios from 'axios';

// Backend runs with server.servlet.context-path=/store (see application.properties)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080/store';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TOKEN_KEY = 'p5store_customer_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a request was authenticated but the backend rejects it (expired/invalid
// token, or a user that no longer exists — e.g. the dev H2 database was
// reset), clear the stale session so the UI stops silently failing and
// instead prompts the user to sign in again.
// Note: this backend's Spring Security setup returns 403 (not 401) for a
// request bearing an invalid/unrecognized token, since AnonymousAuthenticationFilter
// already populated an "anonymous" principal by the time authorization runs —
// so both statuses need to be treated as "not really authenticated" here.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if ((status === 401 || status === 403) && getToken()) {
      clearToken();
      localStorage.removeItem('p5store_customer_user');
      window.dispatchEvent(new Event('auth-invalidated'));
    }
    return Promise.reject(error);
  }
);
