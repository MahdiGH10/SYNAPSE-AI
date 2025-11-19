// API Configuration and Utilities
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Token management
export const tokenManager = {
  get: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};

// API fetch wrapper with auth
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenManager.get();

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Try to parse JSON safely
  let data: any = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // non-JSON response
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && data.message) ||
      response.statusText ||
      'Something went wrong';
    throw new Error(message);
  }

  // Only update token if backend returned a token
  if (data && typeof data === 'object' && data.token) {
    tokenManager.set(data.token);
  }

  return data as T;
}

// Auth API endpoints
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  verifyEmail: (token: string) =>
    apiFetch(`/auth/verify-email?token=${encodeURIComponent(token)}`),

  resendVerification: (email: string) =>
    apiFetch('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  getMe: () => apiFetch('/auth/me'),

  logout: async () => {
    tokenManager.remove();
    // If your backend requires a token to invalidate, remove AFTER call instead
    return apiFetch('/auth/logout', { method: 'POST' });
  },

  // Google OAuth
  getGoogleAuthUrl: () => {
    const base =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    return `${base}/auth/google`;
  },
};