import { API_CONFIG } from '../constants/config';
import { auth } from './auth';
import type { User, ApiError } from '../types/api';

export class ApiException extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

const api = {
  /**
   * Make an authenticated request to the 42 API
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await auth.getValidToken();

    if (!token) {
      throw new ApiException(401, 'Not authenticated');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiException(401, 'Session expired');
      }
      if (response.status === 404) {
        throw new ApiException(404, 'User not found');
      }
      if (response.status === 429) {
        throw new ApiException(429, 'Too many requests, please wait');
      }

      const error: ApiError = await response.json().catch(() => ({
        error: 'Unknown error',
      }));
      throw new ApiException(
        response.status,
        error.error_description || error.error
      );
    }

    return response.json();
  },

  /**
   * Get user by login
   */
  async getUser(login: string): Promise<User> {
    const sanitizedLogin = login.trim().toLowerCase();

    if (!sanitizedLogin) {
      throw new ApiException(400, 'Login is required');
    }

    return this.request<User>(`/v2/users/${encodeURIComponent(sanitizedLogin)}`);
  },

  /**
   * Search users by login (autocomplete)
   */
  async searchUsers(query: string, limit: number = 3): Promise<User[]> {
    const sanitizedQuery = query.trim().toLowerCase();

    if (!sanitizedQuery || sanitizedQuery.length < 3) {
      return [];
    }

    return this.request<User[]>(
      `/v2/users?search[login]=${encodeURIComponent(sanitizedQuery)}&page[size]=${limit}`
    );
  },
};

export default api;
