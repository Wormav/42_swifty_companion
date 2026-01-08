import { useState, useCallback } from 'react';
import api, { ApiException } from '../services/api';
import type { User } from '../types/api';

interface UseUserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const useUser = () => {
  const [state, setState] = useState<UseUserState>({
    user: null,
    isLoading: false,
    error: null,
  });

  const searchUser = useCallback(async (login: string): Promise<User | null> => {
    setState({ user: null, isLoading: true, error: null });

    try {
      const user = await api.getUser(login);
      setState({ user, isLoading: false, error: null });
      return user;
    } catch (error) {
      let errorMessage = 'An error occurred';

      if (error instanceof ApiException) {
        switch (error.status) {
          case 404:
            errorMessage = `User "${login}" not found`;
            break;
          case 401:
            errorMessage = 'Session expired, please login again';
            break;
          case 429:
            errorMessage = 'Too many requests, please wait a moment';
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        if (error.message.includes('Network')) {
          errorMessage = 'Network error, check your connection';
        } else {
          errorMessage = error.message;
        }
      }

      setState({ user: null, isLoading: false, error: errorMessage });
      return null;
    }
  }, []);

  const clearUser = useCallback(() => {
    setState({ user: null, isLoading: false, error: null });
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    searchUser,
    clearUser,
    clearError,
  };
};
