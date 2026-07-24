const DEFAULT_API_BASE_URL = 'http://localhost:5000/v1';

function normaliseApiBaseUrl(value: string | undefined): string {
  const baseUrl = (value || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
  return baseUrl.endsWith('/v1') ? baseUrl : `${baseUrl}/v1`;
}

export const API_BASE_URL = normaliseApiBaseUrl(import.meta.env.VITE_API_URL);

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiRequest(path: string, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('auth_token');
  const headers = new Headers(init?.headers);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  let response = await fetch(apiUrl(path), { ...init, headers });
  
  if (response.status === 401 && !path.includes('/auth/login') && !path.includes('/auth/refresh') && !path.includes('/auth/forgot-password') && !path.includes('/auth/reset-password')) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(apiUrl('/auth/refresh'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken })
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
         
          localStorage.setItem('auth_token', data.token);
          if (data.refreshToken) {
            localStorage.setItem('refresh_token', data.refreshToken);
          }
          
          // Re-create headers with the new token and retry the original request
          const retryHeaders = new Headers(init?.headers);
          retryHeaders.set('Authorization', `Bearer ${data.token}`);
          response = await fetch(apiUrl(path), { ...init, headers: retryHeaders });
        } else {
          // If refresh fails, clear tokens
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
        }
      } catch (err) {
        console.error('Failed to refresh token silently', err);
      }
    }
  }
  
  return response;
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await apiRequest(path, init);

  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return typeof data.error === 'string' ? data.error : '';
  } catch {
    return '';
  }
}