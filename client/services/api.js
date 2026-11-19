const USER_TOKEN_STORAGE_KEY = 'facicuse_user_session_token';

let inMemoryIdToken = null;
let inMemoryUserToken = null;

function readStoredToken(key, currentMemoryValue) {
  if (currentMemoryValue) return currentMemoryValue;
  try {
    const stored = window.sessionStorage.getItem(key);
    if (stored) return stored;
  } catch {
    // Ignore storage restrictions
  }
  return null;
}

function writeStoredToken(key, token) {
  try {
    if (token) {
      window.sessionStorage.setItem(key, token);
    } else {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // Ignore storage restrictions
  }
}

export function setAuthToken(token) {
  inMemoryIdToken = token || null;
}

export function setUserSessionToken(token) {
  inMemoryUserToken = token || null;
  writeStoredToken(USER_TOKEN_STORAGE_KEY, token);
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (inMemoryIdToken) {
    headers.set('Authorization', `Bearer ${inMemoryIdToken}`);
  } else {
    const userToken = readStoredToken(USER_TOKEN_STORAGE_KEY, inMemoryUserToken);
    if (userToken) {
      inMemoryUserToken = userToken;
      headers.set('X-Session-Token', userToken);
    }
  }

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/csv')) {
    if (!response.ok) {
      throw new Error('Failed to export CSV report.');
    }
    return response.text();
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && !inMemoryIdToken) {
      setUserSessionToken(null);
    }
    if (
      response.status === 401 &&
      !path.startsWith('/auth/') &&
      typeof window !== 'undefined'
    ) {
      window.dispatchEvent(new CustomEvent('facicuse:session-expired'));
    }
    const error = new Error(data.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.code = data.code;
    throw error;
  }

  const method = String(options.method || 'GET').toUpperCase();
  if (
    method !== 'GET' &&
    method !== 'HEAD' &&
    !path.startsWith('/notifications') &&
    (path.startsWith('/reservations') ||
      path.startsWith('/issues') ||
      path.startsWith('/admin/'))
  ) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('facicuse:notifications-dirty'));
    }
  }

  return data;
}
