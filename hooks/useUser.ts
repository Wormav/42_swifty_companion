import { useState, useCallback, useRef } from 'react';
import api, { ApiException } from '../services/api';
import type { User } from '../types/api';

interface UseUserState {
  user: User | null;
  suggestions: User[];
  isLoading: boolean;
  error: string | null;
}

export const useUser = () => {
  const [state, setState] = useState<UseUserState>({
    user: null,
    suggestions: [],
    isLoading: false,
    error: null,
  });
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const currentQueryRef = useRef<string>('');

  const searchUsers = useCallback(async (query: string): Promise<void> => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    currentQueryRef.current = trimmed;

    // Clear suggestions if less than 3 chars
    if (trimmed.length < 3) {
      setState((prev) => ({ ...prev, suggestions: [], isLoading: false, error: null }));
      return;
    }

    // Debounce the search
    debounceRef.current = setTimeout(async () => {
      // Check if query is still current
      if (currentQueryRef.current !== trimmed) {
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const users = await api.searchUsers(trimmed, 3);
        // Check again after API call
        if (currentQueryRef.current !== trimmed) {
          return;
        }
        setState((prev) => ({ ...prev, suggestions: users, isLoading: false }));
      } catch (error) {
        // Check again in case query changed
        if (currentQueryRef.current !== trimmed) {
          return;
        }

        let errorMessage = 'Search failed';

        if (error instanceof ApiException) {
          switch (error.status) {
            case 401:
              errorMessage = 'Session expired, please login again';
              break;
            case 429:
              errorMessage = 'Too many requests, please wait';
              break;
            default:
              errorMessage = error.message;
          }
        }

        setState((prev) => ({ ...prev, suggestions: [], isLoading: false, error: errorMessage }));
      }
    }, 300);
  }, []);

  const searchUser = useCallback(async (login: string): Promise<User | null> => {
    setState((prev) => ({ ...prev, user: null, isLoading: true, error: null }));

    try {
      const user = await api.getUser(login);
      setState((prev) => ({ ...prev, user, isLoading: false }));
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

      setState((prev) => ({ ...prev, user: null, isLoading: false, error: errorMessage }));
      return null;
    }
  }, []);

  const clearUser = useCallback(() => {
    setState({ user: null, suggestions: [], isLoading: false, error: null });
  }, []);

  const clearSuggestions = useCallback(() => {
    setState((prev) => ({ ...prev, suggestions: [] }));
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    searchUsers,
    searchUser,
    clearUser,
    clearSuggestions,
    clearError,
  };
};
