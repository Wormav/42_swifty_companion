import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const SearchScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Swifty Companion
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Search for a 42 student
      </Text>
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
  },
});

export default SearchScreen;
