const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

const publicEndpoints = [
  '/forgot-password',
  '/login',
  '/register'
];

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = true, ...fetchConfig } = config;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchConfig.headers,
    };

    // Só exige token se requiresAuth for true e não for endpoint público
    if (requiresAuth && !publicEndpoints.includes(endpoint)) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchConfig,
      headers,
    });

    const data = await response.json().catch(() => ({ message: 'Erro desconhecido' }));

    if (!response.ok) {
      if (response.status === 401) {
        // Only remove token if it's an authentication error, not a password validation error
        if (data.message.includes('Token')) {
          localStorage.removeItem('token');
        }
        throw new Error(data.message);
      }
      throw new Error(data.message);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return data;
  }

  get<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data?: unknown, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data?: unknown, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'DELETE',
    });
  }
}

export const http = new HttpClient(API_URL);
