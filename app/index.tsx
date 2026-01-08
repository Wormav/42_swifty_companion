import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/useUser';
import { SearchBar } from '../components/SearchBar';
import { ErrorMessage } from '../components/ErrorMessage';
import { COLORS } from '../constants/config';

const SearchScreen = () => {
  const { colors } = useTheme();
  const { isAuthenticated, isLoading: authLoading, error: authError, login, logout } = useAuthContext();
  const { isLoading: searchLoading, error: searchError, searchUser, clearError } = useUser();
  const router = useRouter();

  const handleSearch = async (loginQuery: string) => {
    Keyboard.dismiss();
    clearError();

    const user = await searchUser(loginQuery);
    if (user) {
      router.push(`/profile/${user.login}`);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>
          Swifty Companion
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Connect with your 42 account to search students
        </Text>

        {authError && <ErrorMessage message={authError} />}

        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
          ]}
          onPress={login}
        >
          <Text style={styles.loginButtonText}>Login with 42</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Swifty Companion
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Search for a 42 student
      </Text>

      <SearchBar onSearch={handleSearch} isLoading={searchLoading} />

      {searchError && (
        <View style={styles.errorContainer}>
          <ErrorMessage message={searchError} onRetry={clearError} />
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
        onPress={logout}
      >
        <Text style={[styles.logoutText, { color: colors.textSecondary }]}>
          Logout
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonPressed: {
    opacity: 0.8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    marginTop: 20,
    width: '100%',
    maxWidth: 400,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 40,
    padding: 10,
  },
  logoutButtonPressed: {
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 14,
  },
});

export default SearchScreen;
