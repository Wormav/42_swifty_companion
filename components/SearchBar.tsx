import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/config';
import { useTheme } from '../hooks/useTheme';

interface SearchBarProps {
  onSearch: (login: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [login, setLogin] = useState('');
  const { colors } = useTheme();

  const handleSearch = () => {
    const trimmed = login.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.textSecondary,
          },
        ]}
        placeholder="Enter a 42 login..."
        placeholderTextColor={colors.textSecondary}
        value={login}
        onChangeText={setLogin}
        onSubmitEditing={handleSearch}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        editable={!isLoading}
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isLoading && styles.buttonDisabled,
        ]}
        onPress={handleSearch}
        disabled={isLoading || !login.trim()}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.buttonText}>Search</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    maxWidth: 400,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
