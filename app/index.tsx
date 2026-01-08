import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import {useRouter} from 'expo-router';
import {useAuthContext} from '../contexts/AuthContext';
import {useTheme} from '../hooks/useTheme';
import {useUser} from '../hooks/useUser';
import {SearchBar} from '../components/SearchBar';
import {ErrorMessage} from '../components/ErrorMessage';
import {COLORS} from '../constants/config';
import type {User} from '../types/api';
import Logo42 from '../assets/42_Logo.png';

const SearchScreen = () => {
    const {colors, isDark} = useTheme();
    const {isAuthenticated, isLoading: authLoading, error: authError, login, logout} = useAuthContext();
    const {suggestions, isLoading: searchLoading, error: searchError, searchUsers, clearSuggestions, clearError} = useUser();
    const router = useRouter();

    const handleSearch = (query: string) => {
        clearError();
        searchUsers(query);
    };

    const handleSelectUser = (user: User) => {
        clearSuggestions();
        router.push(`/profile/${user.login}`);
    };

    if (authLoading) {
        return (
            <View style={[styles.container, {backgroundColor: colors.background}]}>
                <ActivityIndicator size="large" color={COLORS.primary}/>
                <Text style={[styles.loadingText, {color: colors.textSecondary}]}>
                    Loading...
                </Text>
            </View>
        );
    }

    if (!isAuthenticated) {
        return (
            <View style={[styles.container, {backgroundColor: colors.background}]}>
                <Image
                    source={Logo42}
                    style={[styles.logo, {tintColor: isDark ? '#FFFFFF' : '#000000'}]}
                />
                <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
                    Connect with your 42 account to search students
                </Text>

                {authError && <ErrorMessage message={authError}/>}

                <Pressable
                    style={({pressed}) => [
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
        <View style={[styles.containerTop, {backgroundColor: colors.background}]}>
            <Image
                source={Logo42}
                style={[styles.logoSmall, {tintColor: isDark ? '#FFFFFF' : '#000000'}]}
            />
            <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
                Search for a 42 student
            </Text>

            <SearchBar onSearch={handleSearch} isLoading={searchLoading}/>

            {suggestions.length > 0 && (
                <View style={[styles.suggestions, {backgroundColor: colors.card}]}>
                    {suggestions.map((user) => (
                        <Pressable
                            key={user.id}
                            style={({pressed}) => [
                                styles.suggestionItem,
                                pressed && {opacity: 0.7},
                            ]}
                            onPress={() => handleSelectUser(user)}
                        >
                            <Image
                                source={{uri: user.image.versions.small || user.image.link || undefined}}
                                style={styles.avatar}
                            />
                            <View style={styles.suggestionText}>
                                <Text style={[styles.suggestionLogin, {color: colors.text}]}>
                                    {user.login}
                                </Text>
                                <Text style={[styles.suggestionName, {color: colors.textSecondary}]}>
                                    {user.displayname}
                                </Text>
                            </View>
                        </Pressable>
                    ))}
                </View>
            )}

            {searchError && (
                <View style={styles.errorContainer}>
                    <ErrorMessage message={searchError} onRetry={clearError}/>
                </View>
            )}

            <Pressable
                style={({pressed}) => [
                    styles.logoutButton,
                    pressed && styles.logoutButtonPressed,
                ]}
                onPress={logout}
            >
                <Text style={styles.logoutText}>Logout</Text>
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
    containerTop: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        position: 'relative',
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    logoSmall: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 20,
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
    suggestions: {
        width: '100%',
        maxWidth: 400,
        marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(128, 128, 128, 0.3)',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc',
    },
    suggestionText: {
        marginLeft: 12,
        flex: 1,
    },
    suggestionLogin: {
        fontSize: 16,
        fontWeight: '600',
    },
    suggestionName: {
        fontSize: 14,
        marginTop: 2,
    },
    errorContainer: {
        marginTop: 20,
        width: '100%',
        maxWidth: 400,
    },
    logoutButton: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: '#E53935',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    logoutButtonPressed: {
        opacity: 0.7,
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SearchScreen;
