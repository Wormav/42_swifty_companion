import { useCallback, useEffect, useState } from 'react';
import { auth } from '../services/auth';
import { storage } from '../services/storage';
import type { AuthState } from '../types/api';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check if user is already authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await storage.getAccessToken();
      const isExpired = await storage.isTokenExpired();

      if (token && !isExpired) {
        setState({ isAuthenticated: true, isLoading: false, error: null });
      } else if (token && isExpired) {
        // Try to refresh token
        const refreshed = await auth.refreshAccessToken();
        setState({
          isAuthenticated: !!refreshed,
          isLoading: false,
          error: refreshed ? null : 'Session expired',
        });
      } else {
        setState({ isAuthenticated: false, isLoading: false, error: null });
      }
    } catch (error) {
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: 'Failed to check authentication status',
      });
    }
  };

  const login = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await auth.login();

      if (result) {
        setState({ isAuthenticated: true, isLoading: false, error: null });
        return true;
      } else {
        setState({
          isAuthenticated: false,
          isLoading: false,
          error: 'Login cancelled or failed',
        });
        return false;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      setState({
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await auth.logout();
      setState({ isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Logout failed',
      }));
    }
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    const token = await auth.getValidToken();

    if (!token) {
      setState({ isAuthenticated: false, isLoading: false, error: null });
    }

    return token;
  }, []);

  return {
    ...state,
    login,
    logout,
    getToken,
    checkAuthStatus,
  };
};
